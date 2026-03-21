import { useState } from 'react';
import { Upload, ScanLine, X, Zap, IndianRupee, Leaf, Globe, Smartphone, Lightbulb } from 'lucide-react';

const ImpactScanner = () => {
  const [preview, setPreview] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [weightKg, setWeightKg] = useState('0.5');
  const [materialHint, setMaterialHint] = useState('auto');
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    setFileObj(f);
    setResult(null);
    setError(null);
  };

  const handleClassify = async () => {
    if (!fileObj) return;
    setClassifying(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('image', fileObj);
    formData.append('weight', weightKg);
    if (materialHint !== 'auto') {
      formData.append('material', materialHint);
    }

    try {
      const response = await fetch('/api/impact/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errStr = 'Failed to analyze impact.';
        try {
          const errData = await response.json();
          errStr = errData.error || errData.message || errStr;
        } catch(e) { /* ignore parse error */ }
        throw new Error(errStr);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please ensure your Backend server is restarted to load the new API routes!');
    } finally {
      setClassifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
      {/* Header */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, padding: '32px 40px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Impact AI Scanner</h1>
          <p style={{ fontSize: '15px', color: '#94A3B8' }}>Snap a photo to instantly calculate its recycling value and ecological impact.</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
          <ScanLine size={24} color="#000" strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {/* Upload Area */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '40px' }}>
          
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 14, padding: 32, cursor: 'pointer', minHeight: 200, transition: 'border-color 0.2s' }}>
            {preview ? (
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <img src={preview} alt="Uploaded item" style={{ maxHeight: 200, objectFit: 'contain', borderRadius: 14 }} />
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreview(null); setFileObj(null); setResult(null); setError(null); }}
                  style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={48} style={{ color: '#10B981', marginBottom: 16 }} />
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '18px', marginBottom: 8 }}>Click to Take Photo</p>
                <p style={{ fontSize: '14px', color: '#64748B' }}>Identify materials with ResNet-50 pipeline.</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>

          <button onClick={handleClassify} disabled={!preview || classifying} className="btn-primary" style={{ width: '100%', height: '54px', fontSize: '16px' }}>
            {classifying ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing Material...</>
            ) : (
              <><ScanLine size={18} /> Run ML Analysis</>
            )}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700 }}>Weight (kg)</span>
              <input
                type="number"
                min="0.05"
                max="5"
                step="0.05"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 12px', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700 }}>Material Hint</span>
              <select
                value={materialHint}
                onChange={(e) => setMaterialHint(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 12px', color: '#fff' }}
              >
                <option value="auto">Auto detect</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="glass">Glass</option>
              </select>
            </label>
          </div>

          {/* Results Output */}
          {error && (
            <div className="card-glass" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '24px', color: '#ef4444' }}>
               <p style={{ fontWeight: 700, margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          {result && (
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16,185,129,0.3)', padding: '32px' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 8px 0', textTransform: 'capitalize' }}>
                  ♻️ Item: {result.label || result.material}
                </h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '6px 14px', borderRadius: '100px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ✅ Recyclable
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700, margin: '0 0 4px 0' }}>Energy Saved</p>
                    <p style={{ fontSize: '18px', color: '#fff', fontWeight: 900, margin: 0 }}>{result.energy_kwh} kWh</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700, margin: '0 0 4px 0' }}>CO₂ Reduced</p>
                    <p style={{ fontSize: '18px', color: '#fff', fontWeight: 900, margin: 0 }}>{result.co2_reduced} kg</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700, margin: '0 0 4px 0' }}>Value</p>
                    <p style={{ fontSize: '18px', color: '#fff', fontWeight: 900, margin: 0 }}>₹{result.cost_rs}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <p style={{ fontSize: '14px', color: '#10B981', fontWeight: 800, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Leaf size={16} /> Equivalent Impact:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '15px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                     <span style={{ color: '#94A3B8' }}>=</span> <Smartphone size={16} color="#94A3B8"/> {result.equivalent[0]}
                  </p>
                  <p style={{ fontSize: '15px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                     <span style={{ color: '#94A3B8' }}>=</span> <Lightbulb size={16} color="#94A3B8"/> {result.equivalent[1]}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ImpactScanner;
