import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Background3D from '../components/Background3D';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(data.message || 'Password reset successfully!');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="app-background" />
      <Background3D />
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <div className="auth-page-root">
        <div style={{ width: '100%', maxWidth: '380px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Lock size={24} style={{ color: 'var(--brand-solid)' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Create New Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 4 }}>
              Your new password must be different from previous used passwords
            </p>
          </div>

          <div className="card-glass" style={{ padding: '40px 32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-field" style={{ paddingRight: 44 }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Confirm Password</label>
                <input type={showPass ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="input-field" required />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                {loading ? <div className="spinner" /> : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 24, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
