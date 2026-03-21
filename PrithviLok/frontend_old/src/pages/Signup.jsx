import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background3D from '../components/Background3D';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Min 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Check email for OTP.');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) { toast.error(err.response?.data?.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Layered Background: dark gradient → 3D canvas → ambient orbs */}
      <div className="app-background" />
      <Background3D />
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <div className="auth-page-root">
        <div style={{ width: '100%', maxWidth: '380px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Leaf size={24} style={{ color: 'var(--brand-solid)' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Create an account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 4 }}>Get started with PrithviLok</p>
        </div>

        <div className="card-glass" style={{ padding: '40px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-field" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@placeholder.com" className="input-field" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="input-field" style={{ paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat password" className="input-field" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              {loading ? <div className="spinner" /> : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>Log in</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
