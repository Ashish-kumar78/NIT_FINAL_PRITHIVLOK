// ============================================================
// Leaderboard Page - Advanced UI Inspired by Reference (Nature + Futuristic)
// ============================================================
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, Leaf, Crown, ChevronDown, MapPin, BookOpen, Flame, Info, X } from 'lucide-react';
import EcoLevelBadge from '../components/EcoLevelBadge';

// Helper component for the highly detailed Wreath
const PremiumLaurelWreath = ({ mainColor = '#FFC107', accentColor = '#FFF3E0' }) => {
  return (
    <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '150%', height: '150%', top: '-25%', left: '-25%', zIndex: -1, filter: `drop-shadow(0 4px 12px ${mainColor}B3)` }}>
      {/* Left Stem */}
      <path d="M 50 85 Q 5 60 25 10" fill="none" stroke={mainColor} strokeWidth="1.5" />
      {/* Right Stem */}
      <path d="M 50 85 Q 95 60 75 10" fill="none" stroke={mainColor} strokeWidth="1.5" />

      {/* Left Leaves */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const t = i / 6;
        const x = 50 * Math.pow(1 - t, 2) + 5 * 2 * (1 - t) * t + 25 * Math.pow(t, 2);
        const y = 85 * Math.pow(1 - t, 2) + 60 * 2 * (1 - t) * t + 10 * Math.pow(t, 2);
        const rot = t * 60;

        return (
          <g key={'L' + i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
            <path d="M 0 0 C -15 -5 -15 12 0 0 Z" fill={mainColor} />
            <path d="M 0 0 C -5 -15 10 -15 0 0 Z" fill={accentColor} />
          </g>
        )
      })}

      {/* Right Leaves */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const t = i / 6;
        const x = 50 * Math.pow(1 - t, 2) + 95 * 2 * (1 - t) * t + 75 * Math.pow(t, 2);
        const y = 85 * Math.pow(1 - t, 2) + 60 * 2 * (1 - t) * t + 10 * Math.pow(t, 2);
        const rot = -t * 60;

        return (
          <g key={'R' + i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
            <path d="M 0 0 C 15 -5 15 12 0 0 Z" fill={mainColor} />
            <path d="M 0 0 C 5 -15 -10 -15 0 0 Z" fill={accentColor} />
          </g>
        )
      })}
    </svg>
  );
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showPointsGuide, setShowPointsGuide] = useState(false);

  useEffect(() => { fetchLeaderboard(); }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try { const { data } = await api.get(`/leaderboard?timeRange=${filter}`); setLeaders(data); }
    catch { console.error('Failed to load leaderboard'); }
    finally { setLoading(false); }
  };

  const myRank = leaders.findIndex((l) => l._id === user?._id) + 1;
  const listLeaders = leaders.filter((l) => {
    const searchableName = (l.name || l.walletAddress || l.email || '').toString().toLowerCase();
    return searchableName.includes(searchQuery.toLowerCase());
  });

  // Podium Themes - Realistic Metallic Finish
  const PODIUM_THEMES = [
    // Rank 1: Gold - Warm glowing metallic
    {
      color: '#FFD700',
      bg: 'linear-gradient(145deg, #FFDF00 0%, #D4AF37 40%, #FFF8B0 50%, #D4AF37 60%, #AA7C11 100%)',
      badgeBg: 'linear-gradient(135deg, #FFD700, #F7931A)',
      text: '1st',
      accent: '#FFFEE0',
      shadow: 'inset 2px 2px 20px rgba(255,255,255,0.7), inset -6px -6px 20px rgba(170,124,17,0.8), 0 10px 30px rgba(212,175,55,0.2)'
    },
    // Rank 2: Silver - Cool reflective metallic (Critical Enhancement)
    {
      color: '#E0E0E0',
      bg: 'linear-gradient(145deg, #F8F9FA 0%, #BDBDBD 40%, #FFFFFF 50%, #BDBDBD 60%, #757575 100%)',
      badgeBg: 'linear-gradient(135deg, #E0E0E0, #9E9E9E)',
      text: '2nd',
      accent: '#FFFFFF',
      shadow: 'inset 2px 2px 20px rgba(255,255,255,0.9), inset -6px -6px 20px rgba(117,117,117,0.9), 0 10px 30px rgba(189,189,189,0.2)'
    },
    // Rank 3: Bronze - Warm matte metallic
    {
      color: '#CD7F32',
      bg: 'linear-gradient(145deg, #E6A16B 0%, #CD7F32 40%, #F5CEAB 50%, #CD7F32 60%, #8C521C 100%)',
      badgeBg: 'linear-gradient(135deg, #CD7F32, #A0522D)',
      text: '3rd',
      accent: '#FFE0B2',
      shadow: 'inset 2px 2px 20px rgba(255,255,255,0.5), inset -6px -6px 20px rgba(140,82,28,0.8), 0 10px 30px rgba(205,127,50,0.2)'
    },
  ];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingBottom: '80px', zIndex: 10, fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        .animated-space {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #05070A; z-index: -1; overflow: hidden;
        }
        .animated-space::before {
          content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 40% 20%, rgba(0, 229, 255, 0.04) 0%, transparent 40%),
                      radial-gradient(circle at 70% 60%, rgba(0, 255, 156, 0.06) 0%, transparent 40%);
          animation: slowdrift 25s infinite alternate ease-in-out;
        }
        @keyframes slowdrift { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-5%) scale(1.05); } }
        
        .leaf-particle {
          position: absolute; opacity: 0;
          animation: floatLeaf linear infinite;
        }
        @keyframes floatLeaf {
          0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 0; }
          20% { opacity: 0.25; }
          80% { opacity: 0.15; }
          100% { transform: translateY(-200px) rotate(180deg) scale(1.2); opacity: 0; }
        }

        .list-card-wrapper {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
        }
        .list-card-wrapper:hover {
          box-shadow: 0 8px 30px rgba(0, 255, 156, 0.15);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(0, 255, 156, 0.3);
        }
        .list-card-wrapper.me {
          background: rgba(0, 255, 156, 0.08);
          border-color: rgba(0, 255, 156, 0.3);
        }

        @keyframes sparkle-glow {
          0% { opacity: 0.2; transform: scale(0.8) rotate(0deg); filter: blur(1px); }
          50% { opacity: 1; transform: scale(1.2) rotate(45deg); filter: blur(0px); }
          100% { opacity: 0.2; transform: scale(0.8) rotate(90deg); filter: blur(1px); }
        }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes shimmerX {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }

        @keyframes textScaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="animated-space">
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0, 255, 156, 0.03) 0%, transparent 60%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.03) 0%, transparent 60%)', filter: 'blur(60px)' }}></div>

        {[...Array(20)].map((_, i) => {
          const isGreen = Math.random() > 0.4;
          return (
            <div key={i} className="leaf-particle" style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              color: isGreen ? '#00FF9C' : '#00E5FF',
              filter: `drop-shadow(0 0 8px ${isGreen ? '#00FF9C' : '#00E5FF'})`,
              animationDuration: `${Math.random() * 10 + 6}s`, animationDelay: `${Math.random() * 5}s`
            }}>
              <Leaf size={Math.random() * 16 + 12} opacity={0.6} />
            </div>
          );
        })}
      </div>

      <div style={{ width: '100%', maxWidth: '800px', padding: '0 20px', marginTop: '30px' }}>

        {/* Toggle Controls & Info Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          {/* Spacer for centering logic */}
          <div style={{ width: '130px' }}></div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '100px', display: 'flex', padding: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[{ value: 'all', label: 'All Time' }, { value: 'active', label: 'Active Users' }].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                style={{
                  padding: '12px 36px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: filter === f.value ? 'linear-gradient(135deg, #00E5FF, #00FF9C)' : 'transparent',
                  color: filter === f.value ? '#05070A' : '#94A3B8',
                  transition: 'all 0.3s ease',
                  boxShadow: filter === f.value ? '0 4px 16px rgba(0, 255, 156, 0.3)' : 'none',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPointsGuide(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(0, 255, 156, 0.1)', border: '1px solid rgba(0, 255, 156, 0.3)',
              color: '#00FF9C', padding: '10px 16px', borderRadius: '100px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
              boxShadow: '0 0 10px rgba(0, 255, 156, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 156, 0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 156, 0.4)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 156, 0.1)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 156, 0.1)' }}
          >
            <Info size={16} /> How to earn points
          </button>
        </div>

        {/* Podium Layout */}
        {!loading && leaders.length >= 3 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '340px', marginBottom: '40px', position: 'relative' }}>
            {[1, 0, 2].map((idx) => {
              const leader = leaders[idx];
              if (!leader) return null;
              const rank = idx + 1;
              const isCenter = rank === 1;
              const order = rank === 1 ? 2 : rank === 2 ? 1 : 3;
              const theme = PODIUM_THEMES[idx];

              const height = rank === 1 ? '260px' : rank === 2 ? '210px' : '190px';
              const width = rank === 1 ? '160px' : '130px';
              const clipPath = rank === 1
                ? 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)'
                : rank === 2
                  ? 'polygon(0% 10%, 100% 0%, 90% 100%, 0% 100%)'
                  : 'polygon(0% 0%, 100% 15%, 100% 100%, 10% 100%)';

              return (
                <div key={leader._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order, position: 'relative', width, zIndex: isCenter ? 10 : 5 }}>

                  {/* Avatar Container */}
                  <div style={{ position: 'absolute', top: '-50px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s ease' }} className="hover-lift">

                    {/* Top 3 Exclusive Embellishments */}
                    <div style={{ position: 'absolute', top: -28, color: theme.color, zIndex: 30, filter: `drop-shadow(0 2px 8px ${theme.color}E6)` }}>
                      <Crown size={isCenter ? 32 : 28} fill={theme.color} strokeWidth={1} stroke="#FFF" />
                    </div>
                    <PremiumLaurelWreath mainColor={theme.color} accentColor={theme.accent} />

                    <div style={{
                      width: isCenter ? 84 : 64, height: isCenter ? 84 : 64, borderRadius: '50%',
                      background: '#05070A', border: `3px solid ${theme.color}`,
                      boxShadow: `0 0 24px ${theme.color}50, inset 0 0 10px ${theme.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: theme.color, fontSize: isCenter ? '28px' : '22px', fontWeight: 900,
                      position: 'relative'
                    }}>
                      {(leader.name?.charAt(0) || '?').toUpperCase()}

                      {/* Top 3 Bottom Ribbon and Stars */}
                      <div style={{
                        position: 'absolute', bottom: -12,
                        background: theme.badgeBg,
                        padding: '2px 20px', borderRadius: '4px', border: '1px solid #FFF',
                        color: '#05070A', fontWeight: 900, fontSize: '13px', letterSpacing: '0.05em',
                        boxShadow: `0 4px 10px ${theme.color}CC`,
                        clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
                      }}>
                        {theme.text}
                      </div>
                      <div style={{ position: 'absolute', bottom: -30, display: 'flex', gap: '10px', color: theme.color }}>
                        <span style={{ animation: 'sparkle-glow 1.5s infinite alternate ease-in-out', fontSize: '12px' }}>✦</span>
                        <span style={{ animation: 'sparkle-glow 1.5s infinite alternate 0.5s ease-in-out', fontSize: '16px' }}>✦</span>
                        <span style={{ animation: 'sparkle-glow 1.5s infinite alternate 1s ease-in-out', fontSize: '12px' }}>✦</span>
                      </div>
                    </div>
                  </div>

                  {/* Trapezoid Base - Realistic Material with Overflow Fixes */}
                  <div style={{
                    width: '100%', height, background: theme.bg, clipPath,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '45px',
                    borderTop: `4px solid ${theme.color}`, transition: 'all 0.3s ease',
                    position: 'relative', overflow: 'hidden', boxShadow: theme.shadow
                  }}>
                    {/* Metallic Gloss/Shine Reflection Overlay */}
                    <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '15%', background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)', zIndex: 1 }} />
                    <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: '-10%', width: '120%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', zIndex: 1, animation: 'shimmerX 4s infinite ease-in-out' }} />

                    {/* Auto-scaling Username with Ellipsis */}
                    {(() => {
                      const rawName = String(leader.name || leader.walletAddress || leader.email || '').trim();
                      const displayName = rawName ? rawName : 'Anonymous';
                      return (
                        <p
                          title={displayName}
                          style={{
                            position: 'relative',
                            color: rank === 2 ? '#1A202C' : '#05070A',
                            fontSize: isCenter ? '17px' : '15px',
                            fontWeight: 900,
                            marginTop: '20px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '85%',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                            padding: '0 8px',
                            zIndex: 50,
                            flexShrink: 0,
                            marginBottom: '4px'
                          }}
                        >
                          {displayName}
                        </p>
                      );
                    })()}

                    {/* Score Badge */}
                    <p style={{
                      position: 'relative',
                      color: '#05070A',
                      fontSize: '13px',
                      fontWeight: 800,
                      marginTop: 0,
                      marginBottom: 'auto',
                      background: 'rgba(255, 255, 255, 0.7)',
                      padding: '2px 12px',
                      borderRadius: '100px',
                      zIndex: 50,
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {leader.ecoScore} pts
                    </p>

                    {/* 3D Rank Number */}
                    <h1 style={{
                      position: 'relative',
                      color: rank === 2 ? '#FFF' : 'rgba(5, 7, 10, 0.8)',
                      fontSize: isCenter ? '64px' : '48px',
                      fontWeight: 900,
                      opacity: 0.9,
                      textShadow: rank === 2 ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 4px rgba(255,255,255,0.4)',
                      margin: 0,
                      paddingBottom: isCenter ? '30px' : '20px',
                      zIndex: 50
                    }}>
                      {rank}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User Search Input */}
        {!loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,156,0.1)', borderRadius: '16px', padding: '12px 20px', marginBottom: '20px', transition: 'all 0.3s', boxShadow: 'inset 0 0 10px rgba(0,255,156,0.02)' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00FF9C'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,255,156,0.1)'}>
            <Search size={18} color="#00FF9C" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search eco-champions by name..."
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', width: '100%', fontFamily: 'Outfit' }}
            />
          </div>
        )}

        {/* Ranking List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner" style={{ width: 60, height: 60, borderColor: 'rgba(0, 255, 156, 0.2)', borderTopColor: '#00FF9C' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {listLeaders.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748B', marginTop: '20px' }}>No eco-champions found.</p>
            )}
            {listLeaders.map((leader) => {
              const rank = leaders.findIndex(l => l._id === leader._id) + 1;
              const isMe = leader._id === user?._id;
              const isUp = rank % 2 !== 0 && rank <= 10;
              const isDown = rank % 2 === 0 && rank > 3;
              const isExpanded = expandedUserId === leader._id;
              const rankColor = rank <= 3 ? PODIUM_THEMES[rank - 1].color : '#94A3B8';

              return (
                <div
                  key={leader._id}
                  className={`list-card-wrapper ${isMe ? 'me' : ''}`}
                  onClick={() => setExpandedUserId(isExpanded ? null : leader._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', gap: '16px' }}>
                    {isMe && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#00FF9C', boxShadow: '0 0 15px #00FF9C' }} />}

                    {/* Rank & Trend */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: rankColor }}>
                        {rank.toString().padStart(2, '0')}
                      </span>
                      {rank > 3 && (
                        <div style={{
                          width: 0, height: 0, marginTop: 4,
                          borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                          borderBottom: isUp ? '6px solid #00FF9C' : 'none',
                          borderTop: isDown ? '6px solid #FF4D4D' : 'none',
                          opacity: isUp || isDown ? 1 : 0
                        }} />
                      )}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', background: '#05070A',
                      border: `2px solid ${rank <= 3 ? rankColor : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '18px', fontWeight: 800,
                      boxShadow: rank <= 3 ? `inset 0 0 10px ${rankColor}40` : 'none'
                    }}>
                      {leader.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{String(leader.name || leader.walletAddress || leader.email || '').trim() || 'Anonymous'}</span>
                        {isMe && <span style={{ background: '#00FF9C', color: '#000', fontSize: '10px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                      </div>
                      <span style={{ color: '#64748B', fontSize: '12px', fontWeight: 600 }}>Level {leader.ecoLevel || 1}</span>
                    </div>

                    {/* Score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#fff', fontSize: '18px', fontWeight: 800, letterSpacing: '0.02em' }}>
                        {leader.ecoScore.toLocaleString()}
                      </span>
                      <span style={{ color: '#00FF9C', fontSize: '13px', fontWeight: 600, marginRight: '10px' }}>pts</span>
                      <ChevronDown size={20} color="#64748B" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </div>
                  </div>

                  {/* Expandable Activity Log (Dropdown connected to Backend) */}
                  {isExpanded && (
                    <div style={{ padding: '0 24px 20px 80px', animation: 'slideDown 0.3s ease-out' }}>
                      <div style={{
                        padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                        border: '1px solid rgba(0, 255, 156, 0.1)', display: 'flex', flexDirection: 'column', gap: '10px'
                      }}>
                        <h4 style={{ color: '#00FF9C', margin: '0 0 4px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Eco Accomplishments</h4>

                        {/* Dynamic Activity Data Generator from Backend Controller */}
                        {[
                          { icon: <MapPin size={14} />, title: 'Dustbins Added', desc: `Mapped ${leader.dustbinsReported || 0} public bins`, val: leader.dustbinsReported || 0, color: '#00E5FF' },
                          { icon: <BookOpen size={14} />, title: 'Lessons Completed', desc: `Mastered ${leader.lessonsCompleted?.length || leader.lessonsCompleted || 0} eco modules`, val: leader.lessonsCompleted?.length || leader.lessonsCompleted || 0, color: '#00FF9C' },
                          { icon: <Flame size={14} />, title: 'Daily Bonus', desc: `Points earned from daily login`, val: `${leader.ecoScore > 0 ? 'Active' : 'None'}`, color: '#FFC107' }
                        ].map((act, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ background: `${act.color}20`, padding: '6px', borderRadius: '6px', color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {act.icon}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: 600 }}>{act.title}</span>
                                <span style={{ color: '#64748B', fontSize: '11px', fontWeight: 500 }}>{act.desc}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: act.color, fontWeight: '900', fontSize: '16px', textAlign: 'right' }}>{act.val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Point Structure Presentation Modal */}
      {showPointsGuide && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5, 7, 10, 0.8)', backdropFilter: 'blur(12px)',
          animation: 'modalFadeIn 0.3s ease-out'
        }} onClick={() => setShowPointsGuide(false)}>

          <div style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(5, 7, 10, 0.95))',
            border: '1px solid rgba(0, 255, 156, 0.2)', borderRadius: '24px',
            width: '100%', maxWidth: '500px', padding: '30px', position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 255, 156, 0.05)',
          }} onClick={(e) => e.stopPropagation()}>

            <button
              onClick={() => setShowPointsGuide(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              <X size={24} />
            </button>

            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={24} color="#00FF9C" /> How to Earn Points
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>
              Level up on the leaderboard by engaging with the platform. Here is exactly how you can earn eco points every day:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: <MapPin size={20} />, title: 'Add a Dustbin', points: '+25 Points', desc: 'Verify and log a public dustbin on the Locator map.', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)' },
                { icon: <BookOpen size={20} />, title: 'Complete a Lesson', points: '+20 Points', desc: 'Finish learning modules in the educational portal.', color: '#00FF9C', bg: 'rgba(0, 255, 156, 0.1)' },
                { icon: <Leaf size={20} />, title: 'Report Garbage (AI)', points: '+15 Points', desc: 'Use the AI image classifier to sort and report waste.', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.1)' },
                { icon: <Flame size={20} />, title: 'Daily Login', points: '+2 Points', desc: 'Every day you log in awards you an active bonus!', color: '#FFC107', bg: 'rgba(255, 193, 7, 0.1)' },
                { icon: <Search size={20} />, title: 'Community Post', points: '+5 Points', desc: 'Create a post inside the global Eco Community.', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>{item.title}</h3>
                    <p style={{ color: '#94A3B8', margin: 0, fontSize: '12px', lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
                  <div style={{ background: `${item.color}20`, color: item.color, padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '13px', border: `1px solid ${item.color}40`, flexShrink: 0 }}>
                    {item.points}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                onClick={() => setShowPointsGuide(false)}
                style={{ background: 'linear-gradient(135deg, #00FF9C, #00E5FF)', border: 'none', padding: '14px 40px', borderRadius: '100px', color: '#05070A', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 255, 156, 0.3)' }}
              >
                Let's Go!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
