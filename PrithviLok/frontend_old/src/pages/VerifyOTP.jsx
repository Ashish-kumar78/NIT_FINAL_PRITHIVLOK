import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background3D from '../components/Background3D';
import { Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const n = [...pasted.split(''), ...Array(6).fill('')].slice(0, 6);
    setOtp(n);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try { await verifyOTP(email, code); navigate('/dashboard', { replace: true }); }
    catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try { await resendOTP(email); setCountdown(60); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setResending(false); }
  };

  if (!email) { navigate('/signup'); return null; }

  return (
    <div>
      {/* Layered Background: dark gradient → 3D canvas → ambient orbs */}
      <div className="app-background" />
      <Background3D />
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <div className="auth-page-root">
        <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Mail size={24} style={{ color: 'var(--brand-solid)' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>Verify your email</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: 4 }}>We sent a 6-digit code to</p>
        <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px', marginBottom: 32 }}>{email}</p>

        {/* OTP Inputs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="input-field"
              style={{
                width: 44, height: 56, textAlign: 'center', fontSize: '20px', fontWeight: 600,
                padding: 0, caretColor: 'var(--brand-solid)'
              }}
            />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading || otp.join('').length < 6} className="btn-primary" style={{ width: '100%', padding: '12px 0', height: '44px', marginBottom: 24 }}>
          {loading ? <div className="spinner" /> : 'Verify Code'}
        </button>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Didn't receive it?{' '}
          {countdown > 0 ? (
            <span style={{ color: 'var(--text-tertiary)' }}>Resend in {countdown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={12} className={resending ? 'animate-spin' : ''} /> Resend code
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
