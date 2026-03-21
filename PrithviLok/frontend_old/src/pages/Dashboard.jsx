import { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Droplets, Thermometer, Activity, Users, Leaf, Trash2, MapPin, Zap } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AQI_COLORS = {
  Good: '#10B981', Moderate: '#F59E0B',
  'Unhealthy for Sensitive Groups': '#EA580C', Unhealthy: '#E11D48',
  'Very Unhealthy': '#9333EA', Hazardous: '#7F1D1D'
};

const Dashboard = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [wqi, setWqi] = useState(null);
  const [trends, setTrends] = useState(null);
  const [location, setLocation] = useState({ lat: 21.1458, lon: 79.0882 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => { fetchEnvData(); }, [location]);

  const fetchEnvData = async () => {
    setLoading(true);
    try {
      const [weatherRes, aqiRes, wqiRes, trendsRes] = await Promise.all([
        api.get(`/environment/weather?lat=${location.lat}&lon=${location.lon}`),
        api.get(`/environment/aqi?lat=${location.lat}&lon=${location.lon}`),
        api.get(`/environment/wqi?lat=${location.lat}&lon=${location.lon}`),
        api.get('/environment/dashboard-stats'),
      ]);
      setWeather(weatherRes.data);
      setAqi(aqiRes.data);
      setWqi(wqiRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: 4, fontWeight: 600 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block', boxShadow: `0 0 10px ${p.color}` }} />
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
        <p className="text-gradient" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em' }}>Loading intelligence...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section" style={{ position: 'relative', zIndex: 10, gap: '40px' }}>
      {/* ── Welcome Banner VIP ── */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        overflow: 'hidden', position: 'relative', padding: '42px 32px'
      }}>
        {/* Glow orb inside banner */}
        <div style={{ position: 'absolute', top: -100, left: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1 }}>
          <div>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>Dashboard Overview</span>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
              Welcome back, <span className="text-gradient">{user?.name || 'Warrior'}</span> 🌍
            </h1>
            <p style={{ fontSize: '15px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#10B981" /> Environmental intelligence for <strong style={{ color: '#fff' }}>{weather?.location || 'your area'}</strong>
            </p>
          </div>

          {user && (
            <div style={{ display: 'flex', gap: '32px', background: 'rgba(2, 6, 23, 0.5)', padding: '20px 32px', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eco Score</p>
                <p className="text-gradient-gold" style={{ fontSize: '32px', fontWeight: 900, marginTop: 4 }}>{user.ecoScore || 0}</p>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Impact Level</p>
                <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', borderColor: 'rgba(16,185,129,0.3)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
                  {user.ecoLevel || 'Seed'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Vital Grid ── */}
      <div className="dashboard-glass-grid">
        
        {/* Weather */}
        <div className="card-glass dashboard-card dashboard-card-sm" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(59,130,246,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
          <div className="dashboard-card-header">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Thermometer size={20} color="#60A5FA" /></div>
            <span className="patch-badge" style={{ color: '#60A5FA', borderColor: 'rgba(59,130,246,0.3)' }}>Weather</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="dashboard-card-value" style={{ color: '#fff' }}>{weather?.temp ?? '--'}<span style={{ fontSize: '20px', color: '#60A5FA' }}>°C</span></div>
            <p className="dashboard-card-label" style={{ marginTop: 8, textTransform: 'capitalize' }}>{weather?.description || 'N/A'}</p>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
            <div className="stat-row">
              <span>Humidity</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{weather?.humidity}%</span>
            </div>
          </div>
        </div>

        {/* AQI */}
        <div className="card-glass dashboard-card dashboard-card-sm" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(245,158,11,0.1)', filter: 'blur(40px)', borderRadius: '50%' }} />
          <div className="dashboard-card-header">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wind size={20} color="#FBBF24" /></div>
            <span className="patch-badge" style={{ color: '#FBBF24', borderColor: 'rgba(245,158,11,0.3)' }}>Air Quality</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="dashboard-card-value" style={{ color: AQI_COLORS[aqi?.status] || '#fff', textShadow: `0 0 20px ${AQI_COLORS[aqi?.status] || '#fff'}60` }}>{aqi?.aqi ?? '--'}</div>
            <p className="dashboard-card-label" style={{ color: AQI_COLORS[aqi?.status] || '#fff', marginTop: 8 }}>{aqi?.status || 'N/A'}</p>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
            <div className="stat-row">
              <span>Dominant Pollutant</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{aqi?.dominantPollutant || '--'}</span>
            </div>
          </div>
        </div>

        {/* WQI */}
        <div className="card-glass dashboard-card dashboard-card-sm" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(34,211,238,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
          <div className="dashboard-card-header">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={20} color="#22D3EE" /></div>
            <span className="patch-badge" style={{ color: '#22D3EE', borderColor: 'rgba(34,211,238,0.3)' }}>Water Quality</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="dashboard-card-value" style={{ color: '#22D3EE', textShadow: '0 0 20px rgba(34,211,238,0.4)' }}>{wqi?.wqi ?? '--'}</div>
            <p className="dashboard-card-label" style={{ marginTop: 8, color: '#fff' }}>{wqi?.status || 'N/A'}</p>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
            <div className="stat-row">
              <span>pH Level</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{wqi?.ph || '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      {trends && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Live Environmental Status Indicator */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)', border: `1px solid ${aqi?.aqi > 150 ? '#EF4444' : aqi?.aqi > 100 ? '#F59E0B' : '#10B981'}40`,
            borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backdropFilter: 'blur(12px)', boxShadow: `0 4px 20px ${aqi?.aqi > 150 ? '#EF4444' : aqi?.aqi > 100 ? '#F59E0B' : '#10B981'}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 16, height: 16 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: aqi?.aqi > 150 ? '#EF4444' : aqi?.aqi > 100 ? '#F59E0B' : '#10B981', animation: aqi?.aqi > 100 ? 'pulse 1.5s infinite' : 'none' }}></div>
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: aqi?.aqi > 150 ? '#EF4444' : aqi?.aqi > 100 ? '#F59E0B' : '#10B981', opacity: 0.4, animation: aqi?.aqi > 100 ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none' }}></div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#E2E8F0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Environmental Status Core</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>System Assessment:</span>
              <span style={{ fontSize: '14px', fontWeight: 900, color: aqi?.aqi > 150 ? '#EF4444' : aqi?.aqi > 100 ? '#F59E0B' : '#10B981', letterSpacing: '0.05em' }}>
                {aqi?.aqi > 150 ? 'CRITICAL RISK DETECTED⚠️' : aqi?.aqi > 100 ? 'ELEVATED RISK⚠️' : 'OPTIMAL CONDITIONS✅'}
              </span>
            </div>
          </div>

          <div className="dashboard-glass-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {/* AQI Futuristic Graph */}
            <div className="card-glass trend-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', border: '1px solid rgba(2, 138, 15, 0.3)' }}>
              <div style={{ position: 'absolute', top: -100, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(2, 138, 15, 0.2), transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
              <div style={{ padding: '24px 24px 0 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(2, 138, 15, 0.15)', border: '1px solid rgba(2, 138, 15, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(2, 138, 15, 0.4)' }}><Wind size={20} color="#028A0F" /></div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>AQI Index Array</h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>Atmospheric density & particle mapping</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trends.aqiTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                  <defs>
                    <linearGradient id="aqiNeon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#028A0F" stopOpacity={1} />
                      <stop offset="100%" stopColor="#234F1E" stopOpacity={0.8} />
                    </linearGradient>
                    <filter id="glowAQI" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} wrapperStyle={{ transition: 'none' }} />
                  {/* Dynamic Glowing Candles */}
                  <Bar dataKey="value" name="AQI" fill="url(#aqiNeon)" filter="url(#glowAQI)" radius={[6, 6, 6, 6]} animationDuration={1500} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* WQI Futuristic Wave Graph */}
            <div className="card-glass trend-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', border: '1px solid rgba(8, 81, 156, 0.3)' }}>
              <div style={{ position: 'absolute', top: -100, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(8, 81, 156, 0.2), transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
              <div style={{ padding: '24px 24px 0 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(8, 81, 156, 0.15)', border: '1px solid rgba(8, 81, 156, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(8, 81, 156, 0.4)' }}><Droplets size={20} color="#3182BD" /></div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>WQI Hydrology Wave</h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>Chemical structural analysis over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trends.wqiTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                  <defs>
                    <linearGradient id="wqiNeon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9ECAE1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#08519C" stopOpacity={0.8} />
                    </linearGradient>
                    <filter id="glowWQI" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} wrapperStyle={{ transition: 'none' }} />
                  {/* Fluid Glowing Candles */}
                  <Bar dataKey="value" name="WQI" fill="url(#wqiNeon)" filter="url(#glowWQI)" radius={[6, 6, 6, 6]} animationDuration={1800} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Gamified Action Center ── */}
      <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 24, background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.4) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}><Leaf size={24} color="#000" /></div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Earn Eco Points</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>Complete tasks to upgrade your dynamic NFT avatar</p>
          </div>
        </div>
        <div className="action-grid">
          {[
            { label: 'Add Dustbin', pts: 25, icon: Trash2 },
            { label: 'Report Issue', pts: 15, icon: Activity },
            { label: 'Post to Community', pts: 5, icon: Users },
            { label: 'Daily Sign In', pts: 2, icon: Zap }
          ].map((item) => (
            <div key={item.label} className="action-card" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15, 23, 42, 0.6)', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <item.icon size={18} color="#10B981" />
                <span style={{ fontSize: '14px', color: '#E2E8F0', fontWeight: 600 }}>{item.label}</span>
              </div>
              <span style={{ color: '#000', fontSize: '12px', fontWeight: 800, background: '#10B981', padding: '4px 10px', borderRadius: 100 }}>+{item.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
