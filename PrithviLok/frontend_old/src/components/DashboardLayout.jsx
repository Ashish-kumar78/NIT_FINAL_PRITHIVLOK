import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, Bell, Check, X, LogOut } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

const PAGE_TITLE_KEYS = {
  '/dashboard': 'dashboard',
  '/dustbins': 'locator',
  '/dustbins/add': 'add_dustbin',
  '/waste': 'classifier',
  '/community': 'community',
  '/learning': 'learning',
  '/leaderboard': 'leaderboard',
  '/profile': 'profile',
  '/carbon-tracker': 'carbon_tracker',
  '/exchange': 'web3_exchange',
  '/impact': 'impact_scanner',
};

const DashboardLayout = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'welcome', type: 'system', title: t('welcome_notification'), message: t('welcome_notification_msg'), read: false, time: new Date() }
  ]);
  const location = useLocation();
  const titleKey = PAGE_TITLE_KEYS[location.pathname];
  const currentTitle = titleKey ? t(titleKey) : 'PrithviLok';

  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!socket) return;

    // ── Sound Functions ───────────────────────────────────
    const playVerifiedSound = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Cheerful rising tone
        [440, 554, 659, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.3);
        });
      } catch {}
    };

    const playRejectedSound = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Low descending tone
        [300, 220].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.4);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.4);
        });
      } catch {}
    };

    // ── Existing handlers ─────────────────────────────────
    const handleNewDustbin = (data) => {
      setNotifications(prev => [{
        id: Date.now().toString() + Math.random(),
        type: 'map',
        title: 'New Dustbin Added',
        message: `${data.addedBy} just spotted a new dustbin!`,
        read: false,
        time: new Date()
      }, ...prev]);
    };

    const handleNewPost = (data) => {
      if (data.authorId !== user?._id) {
        setNotifications(prev => [{
          id: Date.now().toString() + Math.random(),
          type: 'social',
          title: 'Community Update',
          message: `${data.authorName} posted a new update.`,
          read: false,
          time: new Date()
        }, ...prev]);
      }
    };

    // ── Admin verified your report ────────────────────────
    const handleReportVerified = (data) => {
      if (data.userId !== user?._id) return;
      playVerifiedSound();
      setNotifications(prev => [{
        id: 'verified-' + Date.now(),
        type: 'verified',
        title: '✅ Report Approved! +25 Points',
        message: `Your ${data.type} bin report has been verified! ${data.address?.substring(0, 50)}...`,
        read: false,
        time: new Date()
      }, ...prev]);
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('✅ Dustbin Verified!', {
          body: `Your report was approved! +${data.pointsAwarded || 25} eco points earned.`,
        });
      }
    };

    // ── Admin rejected your report ────────────────────────
    const handleReportRejected = (data) => {
      if (data.userId !== user?._id) return;
      playRejectedSound();
      setNotifications(prev => [{
        id: 'rejected-' + Date.now(),
        type: 'rejected',
        title: '❌ Report Rejected',
        message: `Your ${data.type} bin report was rejected. ${data.adminRemark ? `Reason: "${data.adminRemark}"` : ''}`,
        read: false,
        time: new Date()
      }, ...prev]);
      if (Notification.permission === 'granted') {
        new Notification('❌ Dustbin Report Rejected', {
          body: data.adminRemark || 'Your report did not pass verification.',
        });
      }
    };

    socket.on('dustbin:new', handleNewDustbin);
    socket.on('community:post', handleNewPost);
    socket.on('user:reportVerified', handleReportVerified);
    socket.on('user:reportRejected', handleReportRejected);

    // Request notification permission
    if (Notification.permission === 'default') Notification.requestPermission();

    return () => {
      socket.off('dustbin:new', handleNewDustbin);
      socket.off('community:post', handleNewPost);
      socket.off('user:reportVerified', handleReportVerified);
      socket.off('user:reportRejected', handleReportRejected);
    };
  }, [socket, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  return (
    <div className="layout-container">
      {/* Dynamic Background */}
      <div className="app-background" />
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                width: '40px', height: '40px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="md-hidden-btn"
            >
              <Menu size={20} />
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              color: 'var(--text-secondary)', fontSize: '15px'
            }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontStyle: 'italic', fontSize: '20px', letterSpacing: '0.02em' }}>{currentTitle}</span>
              <span style={{ color: 'var(--border-glass-strong)' }}>/</span>
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{t('overview')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  background: 'none', border: 'none', color: notificationsOpen ? 'var(--brand-solid)' : 'var(--text-secondary)',
                  cursor: 'pointer', padding: '8px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s', position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 6,
                    background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700,
                    width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-surface)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} onClick={() => setNotificationsOpen(false)} />
                  <div className="card-glass" style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                    width: '320px', padding: '0', zIndex: 100,
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                    border: '1px solid var(--border-strong)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{t('notifications')}</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--brand-solid)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={14} /> {t('mark_all_read')}
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                          <Bell size={24} style={{ opacity: 0.5, margin: '0 auto 8px' }} />
                          {t('no_new_notifications')}
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{
                            padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                            background: n.type === 'verified' && !n.read ? 'rgba(16,185,129,0.1)'
                                      : n.type === 'rejected' && !n.read ? 'rgba(239,68,68,0.08)'
                                      : n.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                            display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
                            transition: 'background 0.2s',
                            borderLeft: n.type === 'verified' ? '3px solid #10B981'
                                      : n.type === 'rejected' ? '3px solid #ef4444' : '3px solid transparent',
                          }}
                            onClick={() => {
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                            }}
                            onMouseOver={(e) => { if (n.read) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                            onMouseOut={(e) => { if (n.read) e.currentTarget.style.background = 'transparent'; }}
                          >
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6,
                              background: n.read ? 'transparent' : 'var(--brand-solid)'
                            }} />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</h4>
                              <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <button onClick={(e) => removeNotification(n.id, e)} style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }}>
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Avatar Pill + Logout */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => navigate('/profile')}
                  title="My Profile"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 100, padding: '5px 14px 5px 5px',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'var(--brand-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', fontWeight: 800, fontSize: '13px', flexShrink: 0
                  }}>
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--brand-solid)', fontWeight: 600 }}>{t('level')}: {user.ecoLevel || 'Seed'}</p>
                  </div>
                </button>

                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  title="Logout"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-secondary)',
                    borderRadius: '50%', width: 36, height: 36,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', flexShrink: 0
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .md-hidden-btn { display: flex !important; }
        }
      `}</style>

      {/* Global AI Chatbot Widget */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;
