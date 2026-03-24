// ============================================================
// Dustbin Locator Page — Leaflet Map
// ============================================================
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Star, LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMapEvents } from 'react-leaflet';
import { MEDIA_BASE_URL } from '../config/network';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const createIcon = (color, isPending) => L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;background:${isPending ? '#f59e0b' : color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid ${isPending ? '#fbbf24' : 'white'};box-shadow:0 2px 8px rgba(0,0,0,0.4);${isPending ? 'opacity:0.7;' : ''}" />`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
});

const LocateControl = ({ userPos }) => {
  const map = useMapEvents({});
  return (
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (userPos && userPos[0] && userPos[1]) {
            map.flyTo(userPos, 15, { animate: true });
          }
        }}
        style={{
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
          width: '34px',
          height: '34px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#444'
        }}
        title="Show my location"
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
};

const typeColors = { general: '#6b7280', recyclable: '#22c55e', organic: '#84cc16', hazardous: '#ef4444', 'e-waste': '#a855f7' };
const statusColors = { functional: '#22c55e', overflow: '#f97316', damaged: '#ef4444', removed: '#6b7280' };

const DustbinLocator = () => {
  const [dustbins, setDustbins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showRecyclingOnly, setShowRecyclingOnly] = useState(false);
  const [userPos, setUserPos] = useState([21.1458, 79.0882]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      fetchDustbins();
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      fetchDustbins();
    }
  }, []);

  const fetchDustbins = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);
      if (showRecyclingOnly) params.append('isRecyclingCenter', 'true');
      const { data } = await api.get(`/dustbins?${params.toString()}`);
      setDustbins(data);
    } catch {
      toast.error('Failed to fetch dustbins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDustbins(); }, [filterType, filterStatus, showRecyclingOnly]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
      {/* Header & Controls */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, padding: '32px 40px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05))', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Dustbin Locator</h1>
          <p style={{ fontSize: '15px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981' }} />
            {dustbins.filter(d => d.verificationStatus === 'verified').length} verified dustbin{dustbins.filter(d => d.verificationStatus === 'verified').length !== 1 ? 's' : ''} ·
            <span style={{ color: '#f59e0b' }}>{dustbins.filter(d => d.verificationStatus === 'pending').length} pending review</span>
          </p>
        </div>
        <Link to="/dustbins/add" className="btn-primary" style={{ padding: '0 24px', height: '48px', fontSize: '15px' }}>
          <Plus size={18} strokeWidth={2.5} /> Add Dustbin
        </Link>
      </div>

      {/* Filters & Map */}
      <div className="card-glass" style={{ padding: '32px', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, flexWrap: 'wrap' }}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field" style={{ width: 'auto', background: 'rgba(15, 23, 42, 0.4)' }}>
              <option value="">All Types</option>
              <option value="general">General</option>
              <option value="recyclable">Recyclable</option>
              <option value="organic">Organic</option>
              <option value="hazardous">Hazardous</option>
              <option value="e-waste">E-Waste</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field" style={{ width: 'auto', background: 'rgba(15, 23, 42, 0.4)' }}>
              <option value="">All Statuses</option>
              <option value="functional">Functional</option>
              <option value="overflow">Overflow</option>
              <option value="damaged">Damaged</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '0 16px', height: '48px', fontSize: '14px', color: '#94a3b8', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = '#94a3b8'; }}>
              <input type="checkbox" checked={showRecyclingOnly} onChange={(e) => setShowRecyclingOnly(e.target.checked)} style={{ accentColor: '#10B981', width: 16, height: 16 }} />
              <span style={{ fontSize: '16px' }}>♻️</span> Recycling Only
            </label>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'capitalize' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 10px ${color}80` }} />
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: '600px', background: '#020617', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--color-surface)' }}>
            <div className="spinner" />
          </div>
        ) : (
          <MapContainer center={userPos} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocateControl userPos={userPos} />
            {userPos && (
              <>
                <CircleMarker center={userPos} radius={7} pathOptions={{ color: 'white', weight: 2, fillColor: '#3b82f6', fillOpacity: 1 }} />
                <Circle center={userPos} radius={200} pathOptions={{ color: '#3b82f6', stroke: false, fillColor: '#3b82f6', fillOpacity: 0.15 }} />
              </>
            )}
            {dustbins.map((d) => {
              const [lng, lat] = d.location.coordinates;
              return (
                <Marker key={d._id} position={[lat, lng]} icon={createIcon(typeColors[d.type] || '#6b7280', d.verificationStatus === 'pending')}>
                  <Popup>
                    <div style={{ minWidth: 180, maxWidth: 220 }}>
                      {/* Verification Banner */}
                      {d.verificationStatus === 'pending' && (
                        <div style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6, marginBottom: 8, textAlign: 'center' }}>
                          ⏳ Pending Admin Verification
                        </div>
                      )}
                      {d.verificationStatus === 'verified' && (
                        <div style={{ background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6, marginBottom: 8, textAlign: 'center' }}>
                          ✅ Verified by Admin
                        </div>
                      )}
                      {d.verificationStatus === 'rejected' && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6, marginBottom: 8, textAlign: 'center' }}>
                          ❌ Rejected
                        </div>
                      )}
                      {d.photo && (
                        <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
                          <img 
                            src={`${MEDIA_BASE_URL}${d.photo}`} 
                            alt={`${d.type} bin`} 
                            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} 
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                      <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>{d.type} Bin</div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>{d.address}</p>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: statusColors[d.status] + '18', color: statusColors[d.status], fontWeight: 600 }}>
                          {d.status}
                        </span>
                        {d.isRecyclingCenter && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: '#dbeafe', color: '#2563eb', fontWeight: 600 }}>♻️ Center</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#6b7280' }}>
                        <Star size={12} style={{ color: '#facc15' }} />
                        {d.cleanlinessRating}/5 ({d.totalRatings} ratings)
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  </div>
  );
};

export default DustbinLocator;
