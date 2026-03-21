import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Background3D from '../components/Background3D';
import { Leaf, Eye, EyeOff, Wallet, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, login, web3Login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [web3Loading, setWeb3Loading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const { data } = err.response || {};
      if (data?.needsVerification) {
        toast.error('Verify your email first!');
        navigate('/verify-otp', { state: { email: form.email } });
      } else {
        toast.error(data?.message || 'Login failed');
      }
    } finally { setLoading(false); }
  };

  const handleWeb3Login = async () => {
    if (!window.ethereum) { toast.error('MetaMask not detected!'); return; }
    setWeb3Loading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await web3Login(accounts[0]);
      navigate(from, { replace: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Web3 login failed'); }
    finally { setWeb3Loading(false); }
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
            <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Welcome to PrithviLok</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 4 }}>Sign in to continue to your dashboard</p>
          </div>

          <div className="card-glass" style={{ padding: '40px 32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@placeholder.com" className="input-field" required />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Forgot?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field" style={{ paddingRight: 44 }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                {loading ? <div className="spinner" /> : 'Log in'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', background: 'var(--bg-surface)', padding: '0 8px' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      await googleLogin(credentialResponse.credential);
                      navigate(from, { replace: true });
                    } catch (err) {
                      toast.error('Google login failed');
                    }
                  }}
                  onError={() => {
                    toast.error('Google login failed');
                  }}
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                  text="continue_with"
                  width="316"
                />
              </div>

              <button onClick={handleWeb3Login} disabled={web3Loading} className="btn-secondary" style={{ width: '100%' }}>
                <Wallet size={16} />
                {web3Loading ? 'Connecting...' : 'Continue with MetaMask'}
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
          </p>

          {/* Admin Login */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: '13px', fontWeight: 600, color: '#a78bfa',
                textDecoration: 'none', padding: '10px 20px',
                borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)',
                background: 'rgba(139,92,246,0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
            >
              <ShieldCheck size={15} />
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
