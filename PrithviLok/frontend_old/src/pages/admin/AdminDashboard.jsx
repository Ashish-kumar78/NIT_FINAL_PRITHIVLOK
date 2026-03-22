// ============================================================
// Admin Dashboard — Real-Time Dustbin Verification Panel
// Socket.io powered live notifications
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io as socketIO } from 'socket.io-client';
import {
  ShieldCheck, CheckCircle, XCircle, Clock, Trash2,
  MapPin, User, Calendar, LogOut, RefreshCw, Eye,
  BarChart3, Users, Filter, Bell, AlertTriangle, Volume2, VolumeX
} from 'lucide-react';

const ADMIN_API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('adminToken');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

// ── Notification Sound ──────────────────────────────────────
const playNotifSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1100;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) { /* Audio not available */ }
};

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending:  { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b', border: 'rgba(245,158,11,0.3)',  icon: '⏳', label: 'Pending' },
    verified: { bg: 'rgba(16,185,129,0.15)',  color: '#10B981', border: 'rgba(16,185,129,0.3)',  icon: '✅', label: 'Verified' },
    rejected: { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', border: 'rgba(239,68,68,0.3)',   icon: '❌', label: 'Rejected' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '12px', fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 100, padding: '4px 12px'
    }}>
      {s.icon} {s.label}
    </span>
  );
};

// ── NEW Badge ────────────────────────────────────────────────
const NewBadge = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '10px', fontWeight: 800,
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#000',
    borderRadius: 6, padding: '3px 8px', textTransform: 'uppercase',
    animation: 'newPulse 1.5s ease-in-out infinite', letterSpacing: '0.05em'
  }}>
    🔔 NEW
  </span>
);

// ── Stat Card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg, pulse }) => (
  <div style={{
    flex: 1, minWidth: 160,
    background: 'rgba(15,23,42,0.7)', border: `1px solid ${bg}30`,
    borderRadius: 18, padding: '24px 28px',
    backdropFilter: 'blur(10px)',
    animation: pulse ? 'statPulse 0.6s ease' : undefined,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{label}</span>
    </div>
    <p style={{ fontSize: '36px', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{value}</p>
  </div>
);

// ── Report Card ──────────────────────────────────────────────
const ReportCard = ({ dustbin, onVerify, onReject, onDelete, isNew }) => {
  const [remark, setRemark] = useState('');
  const [open, setOpen] = useState(isNew); // auto-expand new reports
  const [imgOpen, setImgOpen] = useState(false);
  const coords = dustbin.location?.coordinates;

  return (
    <div style={{
      background: isNew ? 'rgba(245,158,11,0.04)' : 'rgba(15,23,42,0.8)',
      border: isNew ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: isNew ? '0 0 24px rgba(245,158,11,0.08)' : undefined,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>🗑️</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '15px' }}>{dustbin.type?.toUpperCase()} Bin</p>
              {isNew && <NewBadge />}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>ID: {dustbin._id?.slice(-8)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={dustbin.verificationStatus || 'pending'} />
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>
            {open ? 'Collapse' : 'Details'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: open ? 18 : 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <User size={14} color="#64748B" style={{ marginTop: 3, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Reported By</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 600 }}>{dustbin.reportedBy?.name || 'Unknown'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#10B981' }}>{dustbin.reportedBy?.ecoPoints || 0} eco pts</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <MapPin size={14} color="#64748B" style={{ marginTop: 3, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Address</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.4 }}>{dustbin.address?.substring(0, 80)}...</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Calendar size={14} color="#64748B" style={{ marginTop: 3, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Submitted</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{new Date(dustbin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} {new Date(dustbin.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {open && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {dustbin.photo ? (
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setImgOpen(true)}>
                  <img src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${dustbin.photo}`} alt="Dustbin" style={{ width: 140, height: 100, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 8px', fontSize: '11px', color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={10} /> View
                  </div>
                </div>
              ) : (
                <div style={{ width: 140, height: 100, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '24px' }}>📷</span>
                  <span style={{ fontSize: '11px', color: '#475569' }}>No photo</span>
                </div>
              )}

              {coords && (
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Coordinates</p>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#CBD5E1', fontFamily: 'monospace' }}>{coords[1]?.toFixed(6)}, {coords[0]?.toFixed(6)}</p>
                  <a href={`https://maps.google.com/?q=${coords[1]},${coords[0]}`} target="_blank" rel="noreferrer"
                    style={{ fontSize: '12px', color: '#10B981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <MapPin size={12} /> Open in Google Maps
                  </a>
                </div>
              )}

              {dustbin.adminRemark && (
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Admin Remark</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>"{dustbin.adminRemark}"</p>
                </div>
              )}
            </div>

            {dustbin.verificationStatus === 'pending' && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Admin Remark (optional)</label>
                  <input value={remark} onChange={e => setRemark(e.target.value)} placeholder="e.g. Verified on-site..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => onVerify(dustbin._id, remark)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#000', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={16} /> Verify ✅
                </button>
                <button onClick={() => onReject(dustbin._id, remark)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  <XCircle size={16} /> Reject ❌
                </button>
              </div>
            )}

            <button onClick={() => onDelete(dustbin._id)}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'none', color: '#64748B', fontSize: '12px', cursor: 'pointer' }}>
              <Trash2 size={13} /> Delete permanently
            </button>
          </div>
        )}
      </div>

      {imgOpen && dustbin.photo && (
        <div onClick={() => setImgOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${dustbin.photo}`} alt="Proof" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
};

// ── Live Notification Banner ─────────────────────────────────
const LiveNotifBanner = ({ report, onDismiss }) => (
  <div style={{
    position: 'fixed', top: 80, right: 24, zIndex: 9998, maxWidth: 420,
    background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(245,158,11,0.3)', borderRadius: 18,
    padding: '20px 24px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    animation: 'slideIn 0.4s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.15))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Bell size={24} color="#f59e0b" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#f59e0b' }}>📩 New Dustbin Report!</p>
          <NewBadge />
        </div>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#CBD5E1' }}>
          <strong>{report.reportedBy?.name || 'User'}</strong> submitted a {report.type || 'general'} bin report
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
          📍 {report.address?.substring(0, 60)}...
        </p>

        {report.photo && (
          <img src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${report.photo}`} alt="" style={{ marginTop: 10, width: '100%', height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }} />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onDismiss} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: '#94A3B8', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          }}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
);


// ════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [toast, setToast] = useState(null);
  const [newIds, setNewIds] = useState(new Set());        // IDs of reports received via socket
  const [liveNotif, setLiveNotif] = useState(null);       // Current live notification
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statPulse, setStatPulse] = useState(false);
  const socketRef = useRef(null);
  const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch data from API ────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch(`${ADMIN_API}/stats`, { headers: authHeaders() }),
        fetch(`${ADMIN_API}/reports?verificationStatus=${filter}&limit=50`, { headers: authHeaders() }),
      ]);
      if (statsRes.status === 401 || reportsRes.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      const [s, r] = await Promise.all([statsRes.json(), reportsRes.json()]);
      setStats(s);
      setReports(r.dustbins || []);
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, navigate]);

  // ── Socket.io connection ───────────────────────────────────
  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return; }

    const socket = socketIO(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🛡️ Admin socket connected:', socket.id);
      socket.emit('admin:join');
    });

    // ── Listen for new reports ─────────────────────────────
    socket.on('admin:newReport', (report) => {
      console.log('📩 New report received:', report);

      // Play notification sound
      if (soundEnabled) playNotifSound();

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('🗑️ New Dustbin Report', {
          body: `${report.reportedBy?.name || 'User'} reported a ${report.type} bin`,
          icon: '🗑️',
        });
      }

      // Show live banner
      setLiveNotif(report);
      setTimeout(() => setLiveNotif(null), 8000);

      // Add to new IDs set
      setNewIds(prev => new Set([...prev, report._id]));

      // Increment unread
      setUnreadCount(prev => prev + 1);

      // Pulse stats
      setStatPulse(true);
      setTimeout(() => setStatPulse(false), 800);

      // If viewing pending, add to list
      setReports(prev => [report, ...prev]);

      // Update stats
      setStats(prev => prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev);
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => { socket.disconnect(); };
  }, [navigate, soundEnabled]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Actions ────────────────────────────────────────────────
  const handleVerify = async (id, remark) => {
    const res = await fetch(`${ADMIN_API}/reports/${id}/verify`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ adminRemark: remark }),
    });
    if (res.ok) {
      showToast('✅ Report verified! Eco points awarded.');
      setNewIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      fetchData();
    } else { const d = await res.json(); showToast(d.message, 'error'); }
  };

  const handleReject = async (id, remark) => {
    const res = await fetch(`${ADMIN_API}/reports/${id}/reject`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ adminRemark: remark || 'Rejected: Invalid report' }),
    });
    if (res.ok) {
      showToast('❌ Report rejected.');
      setNewIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      fetchData();
    } else { const d = await res.json(); showToast(d.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this report?')) return;
    const res = await fetch(`${ADMIN_API}/reports/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { showToast('🗑️ Deleted.'); fetchData(); }
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', fontFamily: 'Outfit, Inter, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)',
          color: '#fff', borderRadius: 14, padding: '14px 22px', fontWeight: 700, fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', maxWidth: 400,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Live Notification Banner */}
      {liveNotif && <LiveNotifBanner report={liveNotif} onDismiss={() => setLiveNotif(null)} />}

      {/* ── Topbar ────────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 32px', height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#fff' }}>PrithviLok Admin</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#10B981' }}>
              🟢 Live — Welcome, {admin.name}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Unread Counter */}
          {unreadCount > 0 && (
            <button
              onClick={() => { setFilter('pending'); setUnreadCount(0); }}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
              }}
            >
              <Bell size={14} />
              {unreadCount} New
              <span style={{
                position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%',
                background: '#ef4444', animation: 'liveDot 1.5s ease-in-out infinite',
              }} />
            </button>
          )}

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: soundEnabled ? '#10B981' : '#64748B', borderRadius: 10, padding: '8px', cursor: 'pointer', display: 'flex' }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          <button onClick={fetchData} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 600 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Stats ─────────────────────────────────────────── */}
        {stats && (
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatCard icon={BarChart3}   label="Total Reports"  value={stats.total}      color="#6366f1" bg="#6366f1" pulse={statPulse} />
            <StatCard icon={Clock}       label="Pending"        value={stats.pending}    color="#f59e0b" bg="#f59e0b" pulse={statPulse} />
            <StatCard icon={CheckCircle} label="Verified"       value={stats.verified}   color="#10B981" bg="#10B981" />
            <StatCard icon={XCircle}     label="Rejected"       value={stats.rejected}   color="#ef4444" bg="#ef4444" />
            <StatCard icon={Users}       label="Total Users"    value={stats.totalUsers} color="#06b6d4" bg="#06b6d4" />
          </div>
        )}

        {/* ── Fraud Alert ────────────────────────────────────── */}
        {stats && stats.pending > 10 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 14, padding: '14px 20px'
          }}>
            <AlertTriangle size={18} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
              ⚠️ High volume of pending reports ({stats.pending}). Watch for potential spam or fraudulent submissions.
            </span>
          </div>
        )}

        {/* ── Filter Tabs ────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(15,23,42,0.6)', borderRadius: 14, padding: 6, border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
          {['pending', 'verified', 'rejected'].map(f => (
            <button key={f} onClick={() => { setFilter(f); if (f === 'pending') setUnreadCount(0); }} style={{
              padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '13px', textTransform: 'capitalize', transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: filter === f ? '#000' : '#64748B', position: 'relative',
            }}>
              {f === 'pending' ? '⏳' : f === 'verified' ? '✅' : '❌'} {f}
              {f === 'pending' && unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18,
                  borderRadius: 100, background: '#ef4444', color: '#fff',
                  fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 5px',
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Report Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Filter size={16} color="#64748B" />
          <span style={{ color: '#64748B', fontSize: '14px' }}>Showing <strong style={{ color: '#fff' }}>{reports.length}</strong> {filter} reports</span>
        </div>

        {/* ── Reports List ────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            <p style={{ fontSize: '48px', marginBottom: 16 }}>🎉</p>
            <p style={{ fontWeight: 600, fontSize: '16px', color: '#64748B' }}>No {filter} reports found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reports.map(d => (
              <ReportCard
                key={d._id}
                dustbin={d}
                onVerify={handleVerify}
                onReject={handleReject}
                onDelete={handleDelete}
                isNew={newIds.has(d._id)}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes newPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes statPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes liveDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
