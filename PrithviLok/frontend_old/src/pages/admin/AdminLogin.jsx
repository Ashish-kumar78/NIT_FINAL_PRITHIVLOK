// ============================================================
// Admin Login Page
// ============================================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Leaf, ArrowLeft } from 'lucide-react';

const ADMIN_API = `${import.meta.env.VITE_API_URL || '/api'}/admin`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: 'Ashish', password: 'Ashish@123' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${ADMIN_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #020617 0%, #0a1628 50%, #020617 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            boxShadow: '0 12px 40px rgba(16,185,129,0.35)'
          }}>
            <ShieldCheck size={32} color="#000" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Outfit, sans-serif' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px' }}>PrithviLok Verification Dashboard</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
              <input
                type="text" value={form.username} required
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} required
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 44px 14px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: '#000', fontWeight: 800, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)', marginTop: 4,
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Signing in...' : '🔐 Sign In to Admin Panel'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 28, color: '#334155', fontSize: '12px' }}>
            <Leaf size={12} color="#10B981" />
            <span style={{ color: '#475569' }}>PrithviLok Admin — Authorized Personnel Only</span>
          </div>
        </div>

        {/* Back to user login */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: '13px', fontWeight: 600, color: '#94A3B8',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
          >
            <ArrowLeft size={14} />
            Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
