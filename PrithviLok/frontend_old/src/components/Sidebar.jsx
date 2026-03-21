import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MapPin, PlusCircle, ScanLine, MessageCircle,
  BookOpen, Trophy, LogOut, LogIn, Leaf, Wallet, Camera, Activity
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/carbon-tracker', icon: Activity, label: 'Carbon Tracker' },
  { path: '/exchange', icon: Wallet, label: 'Web3 Exchange' },

  { section: 'Sustainability' },
  { path: '/dustbins', icon: MapPin, label: 'Locator' },
  { path: '/dustbins/add', icon: PlusCircle, label: 'Add Dustbin', auth: true },
  { path: '/waste', icon: ScanLine, label: 'Classifier' },
  { path: '/impact', icon: Camera, label: 'Impact Scanner' },

  { section: 'Community' },
  { path: '/community', icon: MessageCircle, label: 'Community' },
  { path: '/learning', icon: BookOpen, label: 'Learning' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        style={{
          display: isOpen ? 'block' : 'none',
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 35
        }}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
        transform: isOpen || window.innerWidth > 1024 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        width: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '32px 24px', marginBottom: '8px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'var(--brand-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#000',
            boxShadow: '0 8px 24px var(--brand-glow)'
          }}>
            <Leaf size={24} strokeWidth={3} />
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em', color: '#fff' }}>
            PrithviLok<span style={{ color: 'var(--brand-solid)' }}>.</span>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ padding: '0 12px' }}>
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <div key={`section-${idx}`} className="sidebar-section-title" style={{ padding: '24px 16px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>
                  {item.section}
                </div>
              );
            }

            if (item.auth && !user) return null;

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth <= 1024) onClose(); }}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
