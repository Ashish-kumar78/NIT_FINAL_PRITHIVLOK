import { useState, useEffect, useRef } from 'react';
import { Camera, Map, Wind, EyeOff, AlertTriangle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

// AQI Mapping according to OpenWeather scale
const AQI_MAPPING = {
  1: { level: 'Good', color: 'rgba(34, 197, 94, 0.2)', blur: '0px', textColor: '#22c55e' }, // Soft green
  2: { level: 'Fair', color: 'rgba(163, 230, 53, 0.3)', blur: '2px', textColor: '#a3e635' }, // Light green-yellow
  3: { level: 'Moderate', color: 'rgba(250, 204, 21, 0.4)', blur: '4px', textColor: '#facc15' }, // Yellow
  4: { level: 'Poor', color: 'rgba(239, 68, 68, 0.5)', blur: '8px', textColor: '#ef4444' }, // Red haze
  5: { level: 'Very Poor', color: 'rgba(153, 27, 27, 0.7)', blur: '12px', textColor: '#991b1b' }, // Dark red + high blur
};

const ARVisualizer = () => {
  const [mode, setMode] = useState('camera'); // 'camera' or 'map'
  const [aqiData, setAqiData] = useState(null);
  const [dominantPollutant, setDominantPollutant] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENWEATHER_API_KEY || '');
  const [isApiKeySet, setIsApiKeySet] = useState(!!import.meta.env.VITE_OPENWEATHER_API_KEY);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize Camera
  useEffect(() => {
    if (mode === 'camera' && isApiKeySet) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, isApiKeySet]);

  // Initial Data Fetch
  useEffect(() => {
    if (isApiKeySet) {
      fetchLocationAndPollution();
      const interval = setInterval(fetchLocationAndPollution, 60000); // 60 seconds
      return () => clearInterval(interval);
    }
  }, [isApiKeySet]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error('Camera access denied:', err);
      toast.error('Camera access denied. Switching to Map Mode.');
      setMode('map');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const fetchLocationAndPollution = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
          const data = await res.json();
          
          if (data.list && data.list.length > 0) {
            const pollution = data.list[0];
            setAqiData({
              aqi: pollution.main.aqi,
              components: pollution.components
            });
            
            // Calculate Dominant Pollutant
            let maxVal = 0;
            let dominant = 'None';
            for (const [key, value] of Object.entries(pollution.components)) {
              if (value > maxVal) {
                maxVal = value;
                dominant = key.toUpperCase();
              }
            }
            setDominantPollutant({ name: dominant, value: maxVal });
          } else {
            toast.error('Invalid API Key or data unavailable.');
            setIsApiKeySet(false);
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to fetch pollution data');
        }
      },
      (err) => {
        toast.error('Failed to get location: ' + err.message);
      }
    );
  };

  // Render API Key input if missing
  if (!isApiKeySet) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 20 }}>
        <EyeOff size={64} color="#64748b" />
        <h2 style={{ color: '#fff', margin: 0 }}>Invisible Pollution Visualizer</h2>
        <p style={{ color: '#94A3B8', textAlign: 'center', maxWidth: 400 }}>
          Enter your OpenWeather API Key to activate the AR Scanner. This allows us to map real-time atmospheric data onto your camera feed.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            type="text" 
            placeholder="OpenWeather API Key..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', width: 250 }}
          />
          <button 
            onClick={() => { if(apiKey) setIsApiKeySet(true); }}
            style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--brand-solid)', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            Activate Sensor
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = aqiData ? AQI_MAPPING[aqiData.aqi] : AQI_MAPPING[1];

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden', borderRadius: '24px', background: '#000' }}>
      
      {/* Background Layer: Camera or Map */}
      {mode === 'camera' ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
        />
      ) : (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: 'pattern', backgroundColor: '#0f172a' }}>
           {/* Simulate a radar/map grid for pure dark futuristic UI */}
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)', animation: 'spin 10s linear infinite' }} />
        </div>
      )}

      {/* AR Pollution Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: currentStatus.color,
        backdropFilter: `blur(${currentStatus.blur})`,
        WebkitBackdropFilter: `blur(${currentStatus.blur})`,
        transition: 'all 2s ease-in-out',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Futuristic UI HUD Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
        
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '16px', border: `1px solid ${currentStatus.textColor}50`, boxShadow: `0 0 20px ${currentStatus.textColor}30` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldAlert size={28} color={currentStatus.textColor} />
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Atmosphere Status</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: currentStatus.textColor }}>
                    AQI {aqiData?.aqi || '--'}
                  </h1>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: currentStatus.textColor }}>({currentStatus.level})</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setMode(mode === 'camera' ? 'map' : 'camera')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
          >
            {mode === 'camera' ? <><Map size={18} /> Map Mode</> : <><Camera size={18} /> AR Camera</>}
          </button>
        </div>

        {/* Bottom Bar: Pollutant Details */}
        {dominantPollutant && (
          <div style={{ alignSelf: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '20px 40px', borderRadius: '24px', border: `1px solid ${currentStatus.textColor}40`, display: 'flex', alignItems: 'center', gap: 32, boxShadow: `0 10px 40px ${currentStatus.textColor}20` }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <Wind size={32} color={currentStatus.textColor} style={{ marginBottom: 8 }} />
               <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Dominant Toxin</span>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>{dominantPollutant.name.replace('_', '.')}</span>
              <span style={{ fontSize: '14px', color: currentStatus.textColor, fontWeight: 700 }}>{dominantPollutant.value.toFixed(2)} μg/m³</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Overlay for AR effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 5 }} />

    </div>
  );
};

export default ARVisualizer;
