const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// -------------------------------
// 🧠 FAKE CLASSIFIER (replace later)
function classifyImage() {
    return "plastic";
}

// -------------------------------
// ⚖️ Simple weight estimation
function estimateWeight() {
    return 0.5; // default (hackathon demo)
}

// -------------------------------
// 🌐 API
app.post("/predict", upload.single("image"), (req, res) => {
    try {
        const material = classifyImage();

        const weight = req.body.weight
            ? parseFloat(req.body.weight)
            : estimateWeight();

        // Call Python ML
        const scriptPath = path.join(__dirname, "model", "predict.py");
        exec(
            `python "${scriptPath}" ${material} ${weight}`,
            (error, stdout, stderr) => {
                if (error) {
                    return res.status(500).json({ error: "ML error" });
                }

                const [energy, cost] = stdout.trim().split(",");

                res.json({
                    material,
                    weight,
                    energy_kwh: Number(energy),
                    cost_rs: Number(cost),
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
// -------------------------------
// 🛠️ Simple test route
app.get("/test", (req, res) => {
    res.json({
        material: "plastic",
        weight: 0.5,
        energy_kwh: 2.9,
        cost_rs: 10
    });
});

// -------------------------------
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});