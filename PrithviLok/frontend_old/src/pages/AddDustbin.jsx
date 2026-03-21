// ============================================================
// Add New Dustbin Page — Map-First with Google-Maps-style Controls
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, CircleMarker, useMap } from 'react-leaflet';
import api from '../api/axios';
import { Upload, MapPin, CheckCircle, LocateFixed, X, Plus, Minus, Maximize, Minimize, Layers, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIconUrl, shadowUrl: markerShadowUrl });

// Custom green dustbin marker
const dustbinIcon = L.divIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50% 50% 50% 4px;background:linear-gradient(135deg,#10B981,#059669);box-shadow:0 4px 14px rgba(16,185,129,0.5);transform:rotate(-45deg)"><span style="transform:rotate(45deg);font-size:20px">🗑️</span></div>`,
  className: '',
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

// ── Tile layer presets ──────────────────────────────────────
const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    label: '🗺️ Street',
    attr: '&copy; OSM',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    label: '🛰️ Satellite',
    attr: '&copy; Esri',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    label: '⛰️ Terrain',
    attr: '&copy; OpenTopoMap',
  },
};

// ── Map sub-components ──────────────────────────────────────
const LocationPicker = ({ onSelect }) => {
  useMapEvents({ click(e) { onSelect([e.latlng.lat, e.latlng.lng]); } });
  return null;
};

const MapFlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 17, { animate: true, duration: 1.2 });
  }, [coords, map]);
  return null;
};

// ── Google-Maps-Style Controls ────────────────────────────────
const MapControls = ({ onLocate, tileKey, setTileKey, isFullscreen, toggleFullscreen }) => {
  const map = useMap();
  const [layersOpen, setLayersOpen] = useState(false);

  const btnStyle = {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#CBD5E1', fontSize: '16px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  };

  const handleHover = (e, enter) => {
    e.currentTarget.style.background = enter ? 'rgba(16,185,129,0.2)' : 'rgba(15,23,42,0.9)';
    e.currentTarget.style.color = enter ? '#10B981' : '#CBD5E1';
    e.currentTarget.style.borderColor = enter ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)';
  };

  return (
    <>
      {/* ── Right side: Location + Zoom + Fullscreen ── */}
      <div style={{ position: 'absolute', right: 14, top: 14, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Live Location Button (Google Maps style crosshair) */}
        <button
          onClick={onLocate}
          title="Go to live location"
          style={{ ...btnStyle, width: 44, height: 44, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          onMouseOver={e => handleHover(e, true)}
          onMouseOut={e => handleHover(e, false)}
        >
          <Navigation size={20} />
        </button>

        {/* Zoom + */}
        <button
          onClick={() => map.zoomIn()}
          title="Zoom in"
          style={{ ...btnStyle, borderRadius: '10px 10px 2px 2px', marginTop: 8 }}
          onMouseOver={e => handleHover(e, true)}
          onMouseOut={e => handleHover(e, false)}
        >
          <Plus size={18} />
        </button>

        {/* Zoom − */}
        <button
          onClick={() => map.zoomOut()}
          title="Zoom out"
          style={{ ...btnStyle, borderRadius: '2px 2px 10px 10px', marginTop: -6 }}
          onMouseOver={e => handleHover(e, true)}
          onMouseOut={e => handleHover(e, false)}
        >
          <Minus size={18} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          style={{ ...btnStyle, marginTop: 8 }}
          onMouseOver={e => handleHover(e, true)}
          onMouseOut={e => handleHover(e, false)}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      {/* ── Bottom-left: Layer Switcher ── */}
      <div style={{ position: 'absolute', left: 14, bottom: 14, zIndex: 1000 }}>
        {layersOpen && (
          <div style={{
            background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
            padding: 8, marginBottom: 8, display: 'flex', gap: 6,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {Object.entries(TILE_LAYERS).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => { setTileKey(key); setLayersOpen(false); }}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none',
                  background: tileKey === key ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(255,255,255,0.06)',
                  color: tileKey === key ? '#000' : '#94A3B8',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {layer.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          title="Change map type"
          style={{
            ...btnStyle, width: 44, height: 44, borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            background: layersOpen ? 'rgba(16,185,129,0.2)' : 'rgba(15,23,42,0.9)',
            borderColor: layersOpen ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)',
          }}
          onMouseOver={e => handleHover(e, true)}
          onMouseOut={e => handleHover(e, false)}
        >
          <Layers size={20} />
        </button>
      </div>
    </>
  );
};


// ── Main Component ──────────────────────────────────────────
const AddDustbin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', type: 'general', isRecyclingCenter: false });
  const [coords, setCoords] = useState(null);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPos, setUserPos] = useState([21.1458, 79.0882]);
  const [tileKey, setTileKey] = useState('street');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapWrapRef = useRef(null);

  // Watch live GPS
  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // ── When user clicks map — instantly save coords ──────────
  const handleMapClick = async (latlng) => {
    setCoords(latlng);
    setGeocoding(true);
    setResolvedAddress('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.display_name || `${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`;
      setResolvedAddress(addr);
      setForm(f => ({ ...f, address: addr }));
    } catch {
      const fallback = `${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`;
      setResolvedAddress(fallback);
      setForm(f => ({ ...f, address: fallback }));
    } finally {
      setGeocoding(false);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Finding live location...', { id: 'gps' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        handleMapClick(p);
        toast.success('Live location captured!', { id: 'gps' });
      },
      () => toast.error('Unable to get GPS. Enable location access.', { id: 'gps' }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const toggleFullscreen = () => {
    const el = mapWrapRef.current;
    if (!el) return;
    if (!isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Sync fullscreen state on escape
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhoto(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) { toast.error('Pin a location on the map first!'); return; }
    if (!photo) { toast.error('⚠️ A GPS Locator Photo is strictly required for verification!'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('latitude', coords[0]);
      fd.append('longitude', coords[1]);
      fd.append('address', form.address);
      fd.append('type', form.type);
      fd.append('isRecyclingCenter', form.isRecyclingCenter);
      if (photo) fd.append('photo', photo);
      await api.post('/dustbins', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('📩 Report submitted! Pending admin verification. Points will be awarded after approval. ⏳');
      navigate('/dustbins');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add dustbin');
    } finally {
      setLoading(false);
    }
  };

  const tile = TILE_LAYERS[tileKey];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ────────────────────────────────────── */}
      <div className="card-glass" style={{ padding: '28px 36px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.05))', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Add New Dustbin</h1>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>📍 Click anywhere on the map to pin location. <strong style={{ color: '#f59e0b' }}>Points awarded after admin verification ✅</strong></p>
        </div>
        <button type="button" onClick={handleGPS} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LocateFixed size={16} /> Use My GPS
        </button>
      </div>

      {/* ── Full-Width Map with Google Maps Controls ───── */}
      <div
        ref={mapWrapRef}
        className="card-glass"
        style={{
          padding: 0, overflow: 'hidden', borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
          background: isFullscreen ? '#020617' : undefined,
        }}
      >
        {/* Map instruction bar */}
        <div style={{ padding: '14px 24px', background: 'rgba(2,6,23,0.8)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPin size={16} color="#10B981" />
          <span style={{ fontSize: '14px', color: '#94A3B8' }}>
            {coords
              ? geocoding ? '⏳ Detecting address...' : '✅ Location pinned! Fill in details below.'
              : '👆 Click anywhere on the map to instantly pin a dustbin location'}
          </span>

          {/* Coord display chip */}
          {coords && !geocoding && (
            <span style={{
              marginLeft: 'auto', fontSize: '11px', fontFamily: 'monospace',
              background: 'rgba(16,185,129,0.12)', color: '#10B981',
              padding: '4px 10px', borderRadius: 6, fontWeight: 600,
              border: '1px solid rgba(16,185,129,0.2)'
            }}>
              {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
            </span>
          )}
        </div>

        {/* Map */}
        <div style={{ height: isFullscreen ? 'calc(100vh - 50px)' : '460px', position: 'relative' }}>
          <MapContainer center={userPos} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer key={tileKey} attribution={tile.attr} url={tile.url} />
            <LocationPicker onSelect={handleMapClick} />
            <MapFlyTo coords={coords} />

            {/* Google Maps style controls */}
            <MapControls
              onLocate={handleGPS}
              tileKey={tileKey}
              setTileKey={setTileKey}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />

            {/* User live location — pulsing blue dot */}
            {userPos && (
              <>
                <Circle center={userPos} radius={80} pathOptions={{ color: '#3b82f6', stroke: false, fillColor: '#3b82f6', fillOpacity: 0.1 }} />
                <CircleMarker center={userPos} radius={8} pathOptions={{ color: 'white', weight: 3, fillColor: '#3b82f6', fillOpacity: 1 }} />
              </>
            )}
            {/* Pinned dustbin location — custom green marker */}
            {coords && <Marker position={coords} icon={dustbinIcon} />}
          </MapContainer>
        </div>

        {/* ── Location Saved Banner ──────────────────── */}
        {coords && (
          <div style={{
            padding: '18px 28px',
            background: 'linear-gradient(90deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))',
            borderTop: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
          }}>
            <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              {geocoding ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94A3B8', fontSize: '14px' }}>
                  <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Fetching address...
                </div>
              ) : (
                <>
                  <p style={{ color: '#10B981', fontWeight: 700, fontSize: '14px', margin: '0 0 2px' }}>📍 Location Pinned</p>
                  <p style={{ color: '#fff', fontSize: '14px', margin: 0, lineHeight: 1.4 }}>{resolvedAddress}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', margin: '4px 0 0' }}>{coords[0].toFixed(6)}, {coords[1].toFixed(6)}</p>
                </>
              )}
            </div>

            {/* Google Maps link */}
            <a
              href={`https://maps.google.com/?q=${coords[0]},${coords[1]}`}
              target="_blank" rel="noreferrer"
              style={{
                fontSize: '12px', color: '#06b6d4', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
                background: 'rgba(6,182,212,0.1)', padding: '6px 12px', borderRadius: 8,
                border: '1px solid rgba(6,182,212,0.2)'
              }}
            >
              <MapPin size={12} /> Open in Maps
            </a>

            <button
              onClick={() => { setCoords(null); setResolvedAddress(''); setForm(f => ({ ...f, address: '' })); }}
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Change Pin
            </button>
          </div>
        )}
      </div>

      {/* ── Details Form ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

        {/* Dustbin Details */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Dustbin Details</h2>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address / Description</label>
            <input
              name="address" value={form.address} onChange={handleChange} required
              placeholder="Auto-filled from map or type manually..."
              className="input-field"
              style={{ fontSize: '14px', padding: '14px 16px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bin Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field" style={{ fontSize: '14px', padding: '12px 14px' }}>
              <option value="general">🗑️ General Waste</option>
              <option value="recyclable">♻️ Recyclable</option>
              <option value="organic">🌿 Organic</option>
              <option value="hazardous">⚠️ Hazardous</option>
              <option value="e-waste">💻 E-Waste</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
            <input type="checkbox" name="isRecyclingCenter" checked={form.isRecyclingCenter} onChange={handleChange} style={{ accentColor: '#22c55e', width: 18, height: 18 }} />
            <span style={{ fontSize: '15px', color: '#d1d5db', fontWeight: 600 }}>♻️ This is a Recycling Center</span>
          </label>

          <button
            type="submit" onClick={handleSubmit}
            disabled={loading || !coords}
            className="btn-primary" style={{ width: '100%', opacity: !coords ? 0.5 : 1 }}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Submitting...</>
              : '📩 Submit for Admin Review'}
          </button>
        </div>

        {/* Dustbin Photo Upload */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Dustbin Photo <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '14px' }}>(REQUIRED)</span></h2>
          <div>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Upload a photo of the dustbin to help others identify it on the map.</p>
            <p style={{ fontSize: '15px', color: '#EF4444', fontWeight: 900, margin: '8px 0 0', letterSpacing: '0.05em' }}>⚠️ YOU MUST UPLOAD A GPS LOCATOR PHOTO FOR VERIFICATION</p>
          </div>

          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, cursor: 'pointer',
            transition: 'all 0.3s ease', minHeight: 220, position: 'relative',
            background: 'rgba(255,255,255,0.02)'
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Dustbin preview" style={{ maxHeight: 180, borderRadius: 12, objectFit: 'cover', width: '100%' }} />
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setPhoto(null); setPhotoPreview(null); }}
                  style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.8)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Upload size={28} color="#10B981" />
                </div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: 6 }}>Click to Upload Photo</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>JPG, PNG, WebP — Max 5MB</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Pulsing animation for blue dot */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AddDustbin;
