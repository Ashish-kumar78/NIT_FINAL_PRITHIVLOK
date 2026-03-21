import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `impact-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
const SUPPORTED_MATERIALS = ['plastic', 'metal', 'paper', 'glass'];

const inferMaterialFromLabel = (label = '') => {
  const topLabel = String(label).toLowerCase();

  if (['can', 'metal', 'steel', 'aluminum', 'aluminium', 'iron', 'tin', 'foil'].some(m => topLabel.includes(m))) {
    return 'metal';
  }
  if (['paper', 'envelope', 'cardboard', 'carton', 'newspaper', 'book', 'magazine', 'notebook'].some(p => topLabel.includes(p))) {
    return 'paper';
  }
  if (['glass', 'jar', 'goblet', 'wine', 'vase', 'bottle glass'].some(g => topLabel.includes(g))) {
    return 'glass';
  }
  if (['plastic', 'bottle', 'bag', 'container', 'packaging', 'wrapper'].some(pl => topLabel.includes(pl))) {
    return 'plastic';
  }
  return null;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

router.post('/scan', upload.single('image'), async (req, res) => {
  let imagePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    imagePath = req.file.path;
    const rawWeight = Number.parseFloat(req.body.weight);
    const hasValidWeight = Number.isFinite(rawWeight) && rawWeight > 0;
    const estimatedWeight = clamp(req.file.size / 350000, 0.05, 2.5);
    const weight = hasValidWeight ? clamp(rawWeight, 0.05, 5) : estimatedWeight;
    const weightSource = hasValidWeight ? 'user' : 'estimated_from_image_size';
    const manualMaterial = SUPPORTED_MATERIALS.includes(String(req.body.material || '').toLowerCase())
      ? String(req.body.material).toLowerCase()
      : null;

    // 1. FAST NODE.JS HUGGING FACE INFERENCE
    let top_label = "unknown object";
    let material_guess = manualMaterial || "plastic"; // Safe default
    
    try {
      const imageData = fs.readFileSync(imagePath);
      const hfToken = process.env.HF_TOKEN;
      const hfUrl = process.env.HF_INFERENCE_URL || "https://router.huggingface.co/hf-inference/models/microsoft/resnet-50";

      if (!hfToken) {
        console.error("HF_TOKEN is missing. Skipping remote inference.");
      } else {
        const hfResponse = await fetch(hfUrl, {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": req.file.mimetype || "application/octet-stream"
          },
          method: "POST",
          body: imageData
        });

        if (!hfResponse.ok) {
          const errorText = await hfResponse.text();
          // Fallback gracefully instead of crashing the UI block
          console.error("HF Inference API Error:", hfResponse.status, errorText);
          top_label = "unidentified item";
        } else {
          const jsonResponse = await hfResponse.json();
          if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0]?.label) {
            top_label = String(jsonResponse[0].label).toLowerCase();
            const inferredMaterial = inferMaterialFromLabel(top_label);
            if (inferredMaterial) {
              material_guess = inferredMaterial;
            } else if (manualMaterial) {
              material_guess = manualMaterial;
            }
          } else {
            console.error("HF Inference API returned an unexpected payload:", jsonResponse);
          }
        }
      }
    } catch (apiErr) {
      console.error("HF Fetch Net Error:", apiErr);
      top_label = "unidentified item";
    }

    // 2. NOW CALL PYTHON ML SCRIPT WITH MATERIAL STRING ONLY (Lightning Fast Exec)
    const scriptPath = path.join(__dirname, '../ml_models/predict.py');
    
    exec(`python "${scriptPath}" "${material_guess}" "${weight}"`, (error, stdout, stderr) => {
      // Clean up the uploaded image
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      if (error) {
        console.error('ML Python Exec Error:', stderr);
        return res.status(500).json({ error: 'ML Predictor logic failed locally.' });
      }

      try {
        const [energyStr, costStr] = stdout.trim().split(",");
        const rawEnergy = parseFloat(energyStr);
        const rawCost = parseFloat(costStr);
        const e = Number.isFinite(rawEnergy) ? Math.max(0, rawEnergy) : 0.3;
        const c = Number.isFinite(rawCost) ? Math.max(0, rawCost) : 2.5;

        // Generate equivalents matching the UI requested
        const co2 = e * 0.5;
        const mobile_charges = Math.floor(e * 10);
        const led_hours = (e * 1.5).toFixed(1);

        res.json({
            material: material_guess,
            label: top_label,
            weight_used_kg: parseFloat(weight.toFixed(3)),
            weight_source: weightSource,
            is_recyclable: true,
            recycle_instructions: `Clean the ${material_guess} item natively and place it carefully to save space before bin drops.`,
            energy_kwh: parseFloat(e.toFixed(3)),
            cost_rs: parseFloat(c.toFixed(2)),
            co2_reduced: parseFloat(co2.toFixed(2)),
            equivalent: [
                `${mobile_charges} mobile charge${mobile_charges !== 1 ? 's' : ''}`,
                `${led_hours} hours LED bulb`
            ]
        });

      } catch (parseError) {
        console.error('Failed to parse Python raw data:', stdout);
        res.status(500).json({ error: 'Invalid config payload generated by ML script.' });
      }
    });

  } catch (err) {
    if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    res.status(500).json({ error: 'Server prediction timeout error.' });
  }
});

export default router;
