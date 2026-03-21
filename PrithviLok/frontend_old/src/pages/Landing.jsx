import { motion, useMotionValue, useTransform, animate, useAnimation, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Globe2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Earth3D from '../components/Earth3D';
import FeaturesSection from '../components/FeaturesSection';

// ---------------------------------------------------------
// Advanced Physics Timeline Slider (Drop-in Replacement)
// ---------------------------------------------------------
const timelineData = [
  { year: 1980, energy: 20, carbon: 335, climate: 4.2 },
  { year: 2000, energy: 35, carbon: 370, climate: 5.1 },
  { year: 2024, energy: 72, carbon: 410, climate: 6.8 },
  { year: 2047, energy: 90, carbon: 350, climate: 8.5 }
];

const getInterpolatedData = (currentYear) => {
  if (currentYear <= 1980) return timelineData[0];
  if (currentYear >= 2047) return timelineData[3];
  
  for (let i = 0; i < timelineData.length - 1; i++) {
    const start = timelineData[i];
    const end = timelineData[i + 1];
    if (currentYear >= start.year && currentYear <= end.year) {
      const progress = (currentYear - start.year) / (end.year - start.year);
      return {
        year: currentYear,
        energy: start.energy + (end.energy - start.energy) * progress,
        carbon: start.carbon + (end.carbon - start.carbon) * progress,
        climate: start.climate + (end.climate - start.climate) * progress,
      };
    }
  }
  return timelineData[2];
};

// ---------------------------------------------------------
// Premium Glassmorphism Year Dropdown
// ---------------------------------------------------------
const YearDropdown = ({ yearMotion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // To display the currently active/animating year smoothly in the button
  const [displayYear, setDisplayYear] = useState(2024);
  useMotionValueEvent(yearMotion, "change", (latest) => {
    setDisplayYear(Math.round(latest));
  });

  const years = Array.from({ length: 2047 - 1980 + 1 }, (_, i) => 1980 + i);

  // Close on outside click for intuitive UX
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 flex flex-col items-center" ref={dropdownRef}>
      {/* Sleek Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/50 border border-green-500/40 backdrop-blur-xl shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] group outline-none"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-white font-bold tracking-widest text-lg font-['Outfit'] tabular-nums group-hover:text-green-300 transition-colors">
          {displayYear}
        </span>
        <svg className={`w-4 h-4 text-green-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Futuristic Menu with Framer Motion Exit/Enter Animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 10 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-10 mt-2 w-48 max-h-[250px] overflow-y-auto rounded-xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-2
                       [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-green-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-green-400 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <div className="text-center text-[10px] text-green-500/80 font-bold uppercase tracking-[0.2em] py-2 border-b border-white/5 mb-1">
               Select Year
            </div>
            {years.map(yr => {
               const isActive = Math.round(yearMotion.get()) === yr;
               return (
                 <button
                   key={yr}
                   onClick={() => {
                      // Interpolate data smoothly traversing time instead of jumping instantly
                      animate(yearMotion, yr, { type: 'spring', stiffness: 60, damping: 20, mass: 1 });
                      setIsOpen(false);
                   }}
                   className={`w-full px-6 py-2.5 text-left text-sm font-bold tracking-widest font-['Outfit'] transition-all duration-200 outline-none
                               ${isActive ? 'text-green-400 bg-green-500/10 border-l-2 border-green-400 pl-[22px]' : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent hover:border-white/20'}`}
                 >
                   {yr}
                 </button>
               );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const yearMotion = useMotionValue(2024);
  const [currentData, setCurrentData] = useState(getInterpolatedData(2024));

  // Sync numerical state to trigger smooth React re-renders for the HUD numbers
  useEffect(() => {
    return yearMotion.on("change", (latest) => {
      setCurrentData(getInterpolatedData(latest));
    });
  }, [yearMotion]);

  return (
    <div style={{ background: '#010206' }}>
      {/* ───── HERO — DO NOT MODIFY ───── */}
      <div className="min-h-screen w-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a1128] via-[#050814] to-[#010206]">
        {/* Immersive 3D Earth Environment with Rings - Continuous Year Mode */}
        <Earth3D currentYear={currentData.year} energy={currentData.energy} carbon={currentData.carbon} />

        {/* Floating HUD Navbar */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 flex items-center justify-between bg-black/40 backdrop-blur-xl shadow-2xl rounded-full w-[95%] max-w-7xl border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              <Globe2 className="text-white relative z-10" size={24} />
            </div>
            <span className="font-['Outfit'] font-bold text-xl text-white tracking-widest uppercase hidden sm:block">
              PrithviLok<span className="text-green-400">.OS</span>
            </span>
          </div>
          
          {/* Deep Interactive Year Selection */}
          <YearDropdown yearMotion={yearMotion} />

          <div className="flex items-center gap-3 relative z-[60]">
            {/* Improved Premium "ENTER SYSTEM" Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
              className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300
                         border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.05)]
                         hover:bg-green-500 hover:border-green-400 hover:text-white hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)]
                         cursor-pointer"
            >
              Enter System
            </button>
          </div>
        </motion.nav>

        {/* Left Card: GREEN ENERGY */}
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          className="absolute left-[4%] top-1/2 -translate-y-1/2 z-40 hidden md:block cursor-default"
        >
          <div style={{
            width: '220px',
            padding: '20px 20px 18px',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(10,30,14,0.65) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34,197,94,0.6)',
            borderRadius: '14px',
            boxShadow: '0 0 24px rgba(34,197,94,0.18), inset 0 0 40px rgba(34,197,94,0.04)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease'
          }}>
            {/* Top gradient line */}
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'2px', background:'linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent)', borderRadius:'1px' }} />
            {/* Corner accents */}
            <div style={{ position:'absolute', top:0, left:0, width:10, height:10, borderTop:'2px solid #4ade80', borderLeft:'2px solid #4ade80', borderRadius:'2px 0 0 0' }} />
            <div style={{ position:'absolute', top:0, right:0, width:10, height:10, borderTop:'2px solid #4ade80', borderRight:'2px solid #4ade80', borderRadius:'0 2px 0 0' }} />
            <div style={{ position:'absolute', bottom:0, left:0, width:10, height:10, borderBottom:'2px solid #4ade80', borderLeft:'2px solid #4ade80', borderRadius:'0 0 0 2px' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderBottom:'2px solid #4ade80', borderRight:'2px solid #4ade80', borderRadius:'0 0 2px 0' }} />

            {/* Label */}
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px rgba(74,222,128,0.9)' }} />
              <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.18em', color:'#4ade80', textTransform:'uppercase' }}>Green Energy</span>
            </div>

            {/* Value */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'52px', fontWeight:300, color:'#ffffff', lineHeight:1, letterSpacing:'-2px' }}>
                {Math.round(currentData.energy)}<span style={{ fontSize:'22px', color:'#4ade80', marginLeft:2 }}>%</span>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:3, paddingBottom:4 }}>
                {[1,2,3,4,5].map(i => {
                  const isActive = (currentData.energy / 100) >= (i / 5);
                  return <div key={i} style={{ width:4, borderRadius:2, height:`${i*5}px`, background: isActive ? '#4ade80' : 'rgba(74,222,128,0.15)', boxShadow: isActive ? '0 0 6px rgba(74,222,128,0.7)' : 'none', transition:'all 0.3s' }} />;
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:3, borderRadius:4, background:'rgba(34,197,94,0.15)', overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', width:`${currentData.energy}%`, background:'linear-gradient(90deg, #16a34a, #4ade80)', borderRadius:4, transition:'width 0.5s ease', boxShadow:'0 0 8px rgba(74,222,128,0.6)' }} />
            </div>
            <span style={{ fontSize:'9px', color:'rgba(74,222,128,0.55)', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600 }}>Renewable Output</span>
          </div>
        </motion.div>

        {/* Right Card: CARBON LEVEL */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          className="absolute right-[4%] top-[40%] -translate-y-1/2 z-40 hidden md:block cursor-default"
        >
          <div style={{
            width: '220px',
            padding: '20px 20px 18px',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(30,8,8,0.65) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239,68,68,0.6)',
            borderRadius: '14px',
            boxShadow: '0 0 24px rgba(239,68,68,0.18), inset 0 0 40px rgba(239,68,68,0.04)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease'
          }}>
            {/* Top gradient line */}
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'2px', background:'linear-gradient(90deg, transparent, rgba(239,68,68,0.9), transparent)', borderRadius:'1px' }} />
            {/* Corner accents */}
            <div style={{ position:'absolute', top:0, left:0, width:10, height:10, borderTop:'2px solid #f87171', borderLeft:'2px solid #f87171', borderRadius:'2px 0 0 0' }} />
            <div style={{ position:'absolute', top:0, right:0, width:10, height:10, borderTop:'2px solid #f87171', borderRight:'2px solid #f87171', borderRadius:'0 2px 0 0' }} />
            <div style={{ position:'absolute', bottom:0, left:0, width:10, height:10, borderBottom:'2px solid #f87171', borderLeft:'2px solid #f87171', borderRadius:'0 0 0 2px' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderBottom:'2px solid #f87171', borderRight:'2px solid #f87171', borderRadius:'0 0 2px 0' }} />

            {/* Label */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 8px rgba(248,113,113,0.9)' }} />
                <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.18em', color:'#f87171', textTransform:'uppercase' }}>Carbon Level</span>
              </div>
              <div style={{ width:18, height:18, borderRadius:4, border:'1.5px solid rgba(239,68,68,0.7)', background:'rgba(239,68,68,0.12)', display:'flex', alignItems:'center', justifyContent:'center', opacity: currentData.carbon > 380 ? 1 : 0.25 }}>
                <span style={{ fontSize:'10px', fontWeight:900, color:'#f87171' }}>!</span>
              </div>
            </div>

            {/* Value */}
            <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginBottom:12 }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'52px', fontWeight:300, color:'#ffffff', lineHeight:1, letterSpacing:'-2px' }}>
                {Math.round(currentData.carbon)}
              </div>
              <span style={{ fontSize:'14px', fontWeight:700, color:'#f87171', letterSpacing:'0.12em', marginBottom:8 }}>PPM</span>
            </div>

            {/* Progress bar — higher carbon = more filled = danger */}
            <div style={{ height:3, borderRadius:4, background:'rgba(239,68,68,0.15)', overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', width:`${Math.min(100, ((currentData.carbon - 280) / 150) * 100)}%`, background:'linear-gradient(90deg, #dc2626, #f87171)', borderRadius:4, transition:'width 0.5s ease', boxShadow:'0 0 8px rgba(248,113,113,0.6)' }} />
            </div>
            <span style={{ fontSize:'9px', color:'rgba(248,113,113,0.55)', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600 }}>Atmospheric CO₂</span>
          </div>
        </motion.div>

        {/* Bottom Center Card: CLIMATE INDEX */}
        <motion.div 
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          className="absolute left-1/2 bottom-8 -translate-x-1/2 z-40 hidden md:block cursor-default"
        >
          <div style={{
            width: '260px',
            padding: '20px 20px 18px',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(4,18,30,0.65) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(6,182,212,0.6)',
            borderRadius: '14px',
            boxShadow: '0 0 24px rgba(6,182,212,0.18), inset 0 0 40px rgba(6,182,212,0.04)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease'
          }}>
            {/* Top gradient line */}
            <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:'2px', background:'linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)', borderRadius:'1px' }} />
            {/* Corner accents */}
            <div style={{ position:'absolute', top:0, left:0, width:10, height:10, borderTop:'2px solid #22d3ee', borderLeft:'2px solid #22d3ee', borderRadius:'2px 0 0 0' }} />
            <div style={{ position:'absolute', top:0, right:0, width:10, height:10, borderTop:'2px solid #22d3ee', borderRight:'2px solid #22d3ee', borderRadius:'0 2px 0 0' }} />
            <div style={{ position:'absolute', bottom:0, left:0, width:10, height:10, borderBottom:'2px solid #22d3ee', borderLeft:'2px solid #22d3ee', borderRadius:'0 0 0 2px' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderBottom:'2px solid #22d3ee', borderRight:'2px solid #22d3ee', borderRadius:'0 0 2px 0' }} />

            {/* Label */}
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#22d3ee', boxShadow:'0 0 8px rgba(34,211,238,0.9)' }} />
              <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.18em', color:'#22d3ee', textTransform:'uppercase' }}>Climate Index</span>
            </div>

            {/* Value + bars side by side */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'52px', fontWeight:300, color:'#ffffff', lineHeight:1, letterSpacing:'-2px' }}>
                {currentData.climate.toFixed(1)}
                <span style={{ fontSize:'16px', color:'rgba(34,211,238,0.6)', marginLeft:4 }}>/10</span>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:3, paddingBottom:4 }}>
                {[1,2,3,4,5].map(i => {
                  const isActive = (currentData.climate / 10) >= (i / 5);
                  const col = currentData.climate > 7.0 ? '#22d3ee' : currentData.climate > 5.0 ? '#fb923c' : '#f87171';
                  const glow = currentData.climate > 7.0 ? 'rgba(34,211,238,0.7)' : currentData.climate > 5.0 ? 'rgba(251,146,60,0.7)' : 'rgba(248,113,113,0.7)';
                  return <div key={i} style={{ width:4, borderRadius:2, height:`${i*5}px`, background: isActive ? col : 'rgba(100,116,139,0.2)', boxShadow: isActive ? `0 0 6px ${glow}` : 'none', transition:'all 0.3s' }} />;
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:3, borderRadius:4, background:'rgba(6,182,212,0.15)', overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', width:`${(currentData.climate / 10) * 100}%`, background: currentData.climate > 7 ? 'linear-gradient(90deg, #0891b2, #22d3ee)' : currentData.climate > 5 ? 'linear-gradient(90deg, #ea580c, #fb923c)' : 'linear-gradient(90deg, #dc2626, #f87171)', borderRadius:4, transition:'width 0.5s ease', boxShadow:'0 0 8px rgba(34,211,238,0.5)' }} />
            </div>
            <span style={{ fontSize:'9px', color:'rgba(34,211,238,0.55)', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600 }}>Global Stability Score</span>
          </div>
        </motion.div>
      </div>
      {/* ───── END HERO ───── */}

      {/* Features Section — scrollable below hero */}
      <FeaturesSection />

    </div>
  );
};

export default Landing;
