// ============================================================
// User Profile Page
// ============================================================
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Zap, Leaf, Trash2, BookOpen, Users, Wallet, CheckCircle } from 'lucide-react';
import EcoLevelBadge from '../components/EcoLevelBadge';
import toast from 'react-hot-toast';

const NFT_IMAGES = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🌲' };
const LEVEL_THRESHOLD = { Seed: 0, Sapling: 50, Tree: 200, 'Forest Guardian': 500 };
const NEXT_THRESHOLD = { Seed: 50, Sapling: 200, Tree: 500, 'Forest Guardian': 600 };

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStats(); setName(user?.name || ''); }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try { const { data } = await api.get('/users/eco-stats'); setStats(data); }
    catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { name });
      updateUser({ name: data.user.name });
      setEditing(false);
      toast.success('Updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) { toast.error('MetaMask not found!'); return; }
    try {
      const accts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await api.put('/users/wallet', { walletAddress: accts[0] });
      updateUser({ walletAddress: accts[0] });
      toast.success('Wallet linked!');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  const nftLevel = stats?.nftLevel || 1;
  const score = stats?.ecoScore || 0;
  const level = stats?.ecoLevel || 'Seed';
  const nextThresh = NEXT_THRESHOLD[level] || 600;
  const currThresh = LEVEL_THRESHOLD[level] || 0;
  const progressPct = Math.min(((score - currThresh) / (nextThresh - currThresh)) * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
      {/* Header */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, padding: '32px 40px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.05))', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '8px', backgroundImage: 'linear-gradient(135deg, #C084FC, #818CF8)' }}>My Eco Profile</h1>
          <p style={{ fontSize: '15px', color: '#94A3B8' }}>Track your sustainability journey, wallet, and dynamic EcoNFT.</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #C084FC, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)' }}>
          <Leaf size={24} color="#000" strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 360px) 1fr', gap: '32px' }}>
        {/* Left — User Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-glass" style={{ textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '32px', fontWeight: 800, margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" style={{ textAlign: 'center', fontSize: '15px', padding: '12px', background: 'rgba(15, 23, 42, 0.8)' }} placeholder="Your Name" />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, fontSize: '14px', height: '40px' }}>{saving ? '...' : 'Save'}</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary" style={{ flex: 1, fontSize: '14px', height: '40px' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{user?.name}</h2>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#10B981', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(16, 185, 129, 0.1)', transition: 'all 0.2s' }}>Edit Name</button>
              </div>
            )}
            <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: 16 }}>{user?.email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              {user?.isEmailVerified ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#10B981', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 16px', borderRadius: '100px' }}><CheckCircle size={14} /> Verified Account</span>
              ) : (
                <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '6px 16px', borderRadius: '100px' }}>Not Verified</span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EcoLevelBadge level={level} />
            </div>
          </div>

          {/* Wallet */}
          <div className="card-glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}><Wallet size={16} /></div>
              Blockchain Wallet
            </h3>
            {user?.walletAddress ? (
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '13px', color: '#10B981', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>{user.walletAddress}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: 12, fontWeight: 600 }}>🦊 MetaMask Linked</p>
              </div>
            ) : (
              <button onClick={handleConnectWallet} className="btn-secondary" style={{ width: '100%', fontSize: '14px', height: '48px', borderColor: 'rgba(249,115,22,0.4)', color: '#fb923c', background: 'linear-gradient(90deg, rgba(249,115,22,0.1), rgba(249,115,22,0.02))' }}>
                <Wallet size={16} style={{ marginRight: 8 }} /> Connect MetaMask
              </button>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* NFT Card */}
          <div className="card-glass" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.05))', border: '1px solid rgba(168,85,247,0.25)', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ fontSize: '80px', filter: 'drop-shadow(0 16px 32px rgba(168, 85, 247, 0.3))', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>{NFT_IMAGES[nftLevel]}</div>
              <div style={{ flex: 1, minWidth: 250 }}>
                <p style={{ fontSize: '14px', color: '#C084FC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Your Dynamic EcoNFT</p>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: 12 }}>{stats?.nftMetadata?.name || 'PrithviLok Genesis NFT'}</h3>
                <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: 24, lineHeight: 1.6 }}>{stats?.nftMetadata?.description || 'Earn points to evolve your dynamic NFT on the blockchain.'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {stats?.nftMetadata?.attributes?.map((attr) => (
                    <span key={attr.trait_type} style={{ fontSize: '13px', background: 'rgba(168,85,247,0.1)', color: '#E9D5FF', border: '1px solid rgba(168,85,247,0.2)', padding: '6px 16px', borderRadius: '100px', fontWeight: 600 }}>
                      <span style={{ color: '#C084FC' }}>{attr.trait_type}:</span> <strong>{attr.value}</strong>
                    </span>
                  ))}
                  {(!stats?.nftMetadata?.attributes || stats?.nftMetadata?.attributes.length === 0) && (
                    <span style={{ fontSize: '13px', background: 'rgba(168,85,247,0.1)', color: '#E9D5FF', border: '1px solid rgba(168,85,247,0.2)', padding: '6px 16px', borderRadius: '100px', fontWeight: 600 }}>Leveling up soon...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Eco Score Progress */}
          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: 4 }}>Eco Impact Score</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>Your progression towards the next tier</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-gradient" style={{ fontSize: '36px', fontWeight: 900 }}>{score}</div>
                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600, marginTop: 4 }}>/ {nextThresh} pts target</div>
              </div>
            </div>
            <div style={{ height: 16, borderRadius: 100, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--brand-gradient)', borderRadius: 100, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }} />
            </div>
            <p style={{ fontSize: '14px', color: '#10B981', fontWeight: 600 }}>⚡ {Math.max(0, nextThresh - score)} points remaining to unearth the next evolution</p>
          </div>

          {/* Activity Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
            {[
              { icon: Trash2, label: 'Dustbins', value: stats?.dustbinsReported || 0, color: '#10B981', glow: 'rgba(16, 185, 129, 0.2)' },
              { icon: BookOpen, label: 'Lessons', value: stats?.lessonsCompleted || 0, color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.2)' },
              { icon: Users, label: 'Community', value: stats?.communityPosts || 0, color: '#C084FC', glow: 'rgba(192, 132, 252, 0.2)' },
              { icon: Zap, label: 'Log Streak', value: `${stats?.dailyLoginStreak || 0}d`, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' },
            ].map(({ icon: Icon, label, value, color, glow }) => (
              <div key={label} className="card-glass" style={{ textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '16px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 8px 16px ${glow}`, border: `1px solid ${color}30` }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
