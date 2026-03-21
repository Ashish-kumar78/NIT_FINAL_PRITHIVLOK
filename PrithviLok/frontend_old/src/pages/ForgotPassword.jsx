import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Background3D from '../components/Background3D';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success(data.message || 'Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Layered Background */}
      <div className="app-background" />
      <Background3D />
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <div className="auth-page-root">
        <div style={{ width: '100%', maxWidth: '380px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Mail size={24} style={{ color: 'var(--brand-solid)' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Forgot Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 4 }}>
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="card-glass" style={{ padding: '40px 32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', margin: '0 auto 20px' }}>
                  <Mail size={32} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Check your email</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 24 }}>
                  We've sent a password reset link to <br/><strong>{email}</strong>
                </p>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@placeholder.com" 
                    className="input-field" 
                    required 
                  />
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                  {loading ? <div className="spinner" /> : 'Send Reset Link'}
                </button>
              </form>
            )}
            
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 24, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
