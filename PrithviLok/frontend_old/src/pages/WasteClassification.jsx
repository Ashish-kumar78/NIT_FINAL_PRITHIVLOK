// ============================================================
// Waste Classification Page (UI Only)
// ============================================================
import { useState } from 'react';
import { Upload, ScanLine, Info, X } from 'lucide-react';

const categories = [
  { name: 'Plastic', emoji: '🧴', desc: 'Bottles, bags, packaging', color: '#3b82f6' },
  { name: 'Paper', emoji: '📄', desc: 'Newspapers, cardboard, boxes', color: '#facc15' },
  { name: 'Organic', emoji: '🍎', desc: 'Food scraps, garden waste', color: '#22c55e' },
  { name: 'Metal', emoji: '🥫', desc: 'Cans, foil, metal parts', color: '#94a3b8' },
  { name: 'Glass', emoji: '🫙', desc: 'Bottles, jars, glass products', color: '#14b8a6' },
  { name: 'E-Waste', emoji: '💻', desc: 'Electronics, batteries, cables', color: '#a855f7' },
  { name: 'Hazardous', emoji: '⚠️', desc: 'Chemicals, paint, medical', color: '#ef4444' },
  { name: 'Textile', emoji: '👕', desc: 'Clothes, fabric, shoes', color: '#ec4899' },
];

const WasteClassification = () => {
  const [preview, setPreview] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => { const f = e.target.files?.[0]; if (!f) return; setPreview(URL.createObjectURL(f)); setFileObj(f); setResult(null); setError(null); };
  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (!f) return; setPreview(URL.createObjectURL(f)); setFileObj(f); setResult(null); setError(null); };

  const handleClassify = async () => {
    if (!fileObj) return;
    setClassifying(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', fileObj);

    try {
      const response = await fetch('https://wasteclassificationan.onrender.com/classify-waste', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Live classification model failed to respond.');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during network classification.');
    } finally {
      setClassifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
      {/* Header */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, padding: '32px 40px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Waste Classifier</h1>
          <p style={{ fontSize: '15px', color: '#94A3B8' }}>Upload a photo to let AI instantly classify your waste type and provide recycling instructions.</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--brand-glow)' }}>
          <ScanLine size={24} color="#000" strokeWidth={2.5} />
        </div>
      </div>



      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        {/* Upload Area */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '40px' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Upload Waste Image</h2>
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--color-border)', borderRadius: 14, padding: 32, cursor: 'pointer',
              minHeight: 200, transition: 'border-color 0.2s'
            }}
          >
            {preview ? (
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <img src={preview} alt="Uploaded waste" style={{ maxHeight: 180, objectFit: 'contain', borderRadius: 14 }} />
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreview(null); setFileObj(null); setResult(null); setError(null); }}
                  style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={48} style={{ color: 'var(--brand-solid)', marginBottom: 16 }} />
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: 4 }}>Drag & Drop your image here</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>Supports PNG, JPG, WebP up to 5MB</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>

          <button onClick={handleClassify} disabled={!preview || classifying} className="btn-primary" style={{ width: '100%' }}>
            {classifying ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Classifying...</>
            ) : (
              <><ScanLine size={16} /> Classify Waste</>
            )}
          </button>

          {/* Result */}
          {error && (
            <div className="card-glass" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '24px', color: '#ef4444' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          {result && (
            <div className="card-glass" style={{ background: result.is_waste ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.05))' : 'rgba(245,158,11,0.1)', border: result.is_waste ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(245,158,11,0.3)', padding: '24px' }}>
              {!result.is_waste ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '32px' }}>🤔</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#facc15', marginBottom: 8, marginTop: 4 }}>Item Not Recognized</h3>
                    <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.5 }}>{result.message}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <span style={{ fontSize: '40px' }}>♻️</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 6px 0' }}>{result.waste_type}</h3>
                      <p style={{ fontSize: '14px', color: '#10B981', fontWeight: 800, margin: 0, display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.3)' }}>✅ Bin Required: {result.recommended_bin}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Disposal Instructions</p>
                      <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6 }}>{result.disposal_instruction}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Decomposition Science</p>
                      <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6 }}>{result.decomposition_method}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteClassification;
