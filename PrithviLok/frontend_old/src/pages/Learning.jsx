import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, Star, X, Play, Target, ArrowRight, Globe, Sprout, Zap, Factory, Sun, Wind, Car, Flame, Home, Bike, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AIQuizEngine from '../components/AIQuizEngine';

const diffColors = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };

const SDGs = [
  { id: 1, title: 'No Poverty', color: '#E5243B', detail: 'End poverty in all its forms everywhere.' },
  { id: 2, title: 'Zero Hunger', color: '#DDA63A', detail: 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.' },
  { id: 3, title: 'Good Health', color: '#4C9F38', detail: 'Ensure healthy lives and promote well-being for all at all ages.' },
  { id: 4, title: 'Quality Education', color: '#C5192D', detail: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.' },
  { id: 5, title: 'Gender Equality', color: '#FF3A21', detail: 'Achieve gender equality and empower all women and girls.' },
  { id: 6, title: 'Clean Water', color: '#26BDE2', detail: 'Ensure availability and sustainable management of water and sanitation for all.' },
  { id: 7, title: 'Clean Energy', color: '#FCC30B', detail: 'Ensure access to affordable, reliable, sustainable and modern energy for all.' },
  { id: 8, title: 'Economic Growth', color: '#A21942', detail: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.' },
  { id: 9, title: 'Innovation', color: '#FD6925', detail: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.' },
  { id: 10, title: 'Reduced Inequality', color: '#DD1367', detail: 'Reduce inequality within and among countries.' },
  { id: 11, title: 'Sustainable Cities', color: '#FD9D24', detail: 'Make cities and human settlements inclusive, safe, resilient and sustainable.' },
  { id: 12, title: 'Resp. Consumption', color: '#BF8B2E', detail: 'Ensure sustainable consumption and production patterns.' },
  { id: 13, title: 'Climate Action', color: '#3F7E44', detail: 'Take urgent action to combat climate change and its impacts.' },
  { id: 14, title: 'Life Below Water', color: '#0A97D9', detail: 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.' },
  { id: 15, title: 'Life on Land', color: '#56C02B', detail: 'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.' },
  { id: 16, title: 'Peace & Justice', color: '#00689D', detail: 'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.' },
  { id: 17, title: 'Partnerships', color: '#19486A', detail: 'Strengthen the means of implementation and revitalize the global partnership for sustainable development.' }
];

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
    borderRadius: '16px', border: active ? '1px solid var(--brand-solid)' : '1px solid rgba(255,255,255,0.05)',
    background: active ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.4)',
    color: active ? '#fff' : '#94A3B8', fontWeight: active ? 800 : 600,
    transition: 'all 0.3s ease', cursor: 'pointer', flexShrink: 0
  }}>
    <Icon size={18} color={active ? '#10B981' : '#64748B'} />
    {label}
  </button>
);



const EnergySimulator = () => {
  const [solar, setSolar] = useState(30);
  const [coal, setCoal] = useState(40);
  const [wind, setWind] = useState(30);
  
  const total = solar + coal + wind || 1;
  const s = Math.round((solar/total)*100);
  const c = Math.round((coal/total)*100);
  const w = Math.round((wind/total)*100);
  
  const emissions = Math.round(c * 1.5 + s * 0.1 + w * 0.1);
  const cost = Math.round(c * 0.8 + s * 1.2 + w * 1.1);
  const score = Math.max(0, 100 - emissions + 20);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass" style={{ padding: '48px', background: 'linear-gradient(145deg, rgba(15,23,42,0.8), rgba(10,20,35,0.95))' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Build Your Energy Future</h2>
      <p style={{ color: '#94A3B8', marginBottom: '40px', fontSize: '16px' }}>Design your energy mix for the future and instantly observe real-world consequences on carbon levels and cost.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
        <div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 800, marginBottom: '12px', fontSize: '15px' }}><span style={{display: 'flex', alignItems: 'center', gap:'8px'}}><Sun size={20}/> Solar Capacity</span><span>{s}%</span></div>
            <input type="range" min="0" max="100" value={solar} onChange={(e)=>setSolar(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer', height: '6px' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 800, marginBottom: '12px', fontSize: '15px' }}><span style={{display: 'flex', alignItems: 'center', gap:'8px'}}><Factory size={20}/> Coal & Fossil</span><span>{c}%</span></div>
            <input type="range" min="0" max="100" value={coal} onChange={(e)=>setCoal(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer', height: '6px' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', fontWeight: 800, marginBottom: '12px', fontSize: '15px' }}><span style={{display: 'flex', alignItems: 'center', gap:'8px'}}><Wind size={20}/> Wind Turbines</span><span>{w}%</span></div>
            <input type="range" min="0" max="100" value={wind} onChange={(e)=>setWind(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer', height: '6px' }} />
          </div>

          <div style={{ background: 'rgba(15,23,42,0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#10B981" /> Insights: {c > 50 ? 'High coal dependence exponentially spikes urban emission output.' : (s + w) > 70 ? 'Superior renewable combination. Zero-marginal costs projected mid-term.' : 'Mixed grids suffer from fossil inertia. Push renewables higher.'}
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', marginBottom: '8px' }}>Climate Rating Score</p>
            <h1 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1, color: score > 70 ? '#10B981' : score > 40 ? '#f59e0b' : '#ef4444', textShadow: `0 0 40px ${score > 70 ? '#10B981' : score > 40 ? '#f59e0b' : '#ef4444'}60`, transition: 'color 0.5s ease' }}>{score}/100</h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '20px 24px', borderRadius: '16px', marginBottom: '16px' }}>
            <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: '15px' }}>Total Carbon Output</span>
            <span style={{ color: emissions > 80 ? '#ef4444' : '#10B981', fontWeight: 800, fontSize: '16px', transition: 'color 0.5s ease' }}>{emissions} Mt CO₂</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '20px 24px', borderRadius: '16px' }}>
            <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: '15px' }}>Infrastructure Cost</span>
            <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '16px' }}>${cost} Billion</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
};

const PersonalImpact = () => {
   const [commute, setCommute] = useState(20);
   const [mode, setMode] = useState('car');
   const carbon = Math.round(commute * (mode === 'car' ? 0.4 : mode === 'ev' ? 0.1 : mode === 'bike' ? 0 : 0.05) * 365);
   
   return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass" style={{ padding: '48px', background: 'linear-gradient(145deg, rgba(15,23,42,0.8), rgba(10,20,35,0.95))' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Your Impact on Earth</h2>
      <p style={{ color: '#94A3B8', marginBottom: '40px', fontSize: '16px' }}>Discover how your daily lifestyle routines dictate carbon emissions and affect global boundaries.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Daily Travel Habits</h4>
          
          <div style={{ marginBottom: '32px' }}>
             <p style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontWeight: 700, marginBottom: '12px' }}><span>Distance to Work/School</span><span style={{color: '#fff'}}>{commute} km</span></p>
             <input type="range" min="0" max="100" value={commute} onChange={e=>setCommute(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer', height: '6px' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             {[
               { id: 'car', icon: Car, label: 'Petrol Car', color: '#ef4444' },
               { id: 'ev', icon: Zap, label: 'Electric EV', color: '#10B981' },
               { id: 'bike', icon: Bike, label: 'Cycle / Walk', color: '#3b82f6' }
             ].map(m => (
               <button key={m.id} onClick={() => setMode(m.id)} style={{ flex: '1 1 auto', padding: '16px', borderRadius: '16px', background: mode === m.id ? `${m.color}20` : 'rgba(255,255,255,0.03)', border: mode === m.id ? `1px solid ${m.color}` : '1px solid rgba(255,255,255,0.1)', color: mode === m.id ? m.color : '#94A3B8', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                 <m.icon size={24} />
                 <span style={{ fontWeight: 700, fontSize: '13px' }}>{m.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: carbon > 2000 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', filter: 'blur(50px)', transition: 'background 0.5s ease' }} />
           
           <p style={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', marginBottom: '16px', zIndex: 2 }}>Annual Carbon Footprint</p>
           <h1 style={{ fontSize: '64px', fontWeight: 900, color: carbon > 2000 ? '#ef4444' : '#10B981', zIndex: 2, marginBottom: '8px', transition: 'color 0.5s ease' }}>{carbon} <span style={{fontSize:'20px'}}>kg CO₂</span></h1>
           <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, zIndex: 2 }}>{carbon > 2000 ? 'You emit more than the sustainable planetary boundary.' : carbon === 0 ? 'Absolute Zero Emission Hero! 🌍' : 'You are keeping emissions remarkably low! 🌱'}</p>
        </div>
      </div>
    </motion.div>
  )
};


const Learning = () => {
  const { user, updateUser } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  const [activeTab, setActiveTab] = useState('modules');
  const [activeSDG, setActiveSDG] = useState(null);
  const [activeQuizSDG, setActiveQuizSDG] = useState(null);
  const [showLessonQuiz, setShowLessonQuiz] = useState(false);

  useEffect(() => { fetchLessons(); }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try { const { data } = await api.get('/learning'); setLessons(data); }
    catch { toast.error('Failed to load lessons'); }
    finally { setLoading(false); }
  };

  const openLesson = async (lesson) => {
    setSelected(lesson);
    setShowLessonQuiz(false);
    try { const { data } = await api.get(`/learning/${lesson.slug}`); setLessonContent(data); }
    catch { toast.error('Failed to load lesson'); }
  };

  const completeLesson = async () => {
    if (!user || !selected) return;
    setCompleting(true);
    try {
      const { data } = await api.post(`/learning/${selected._id}/complete`);
      toast.success(`Completed! +${data.ecoPoints?.pointsEarned} pts 🌿`);
      if (data.ecoPoints?.leveledUp) toast.success(`🎉 Level Up! ${data.ecoPoints.level}`);
      updateUser({ ecoScore: data.ecoPoints?.totalScore, ecoLevel: data.ecoPoints?.level });
      fetchLessons();
      setSelected(null);
      setLessonContent(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCompleting(false); }
  };

  const isCompleted = (id) => user?.lessonsCompleted?.some((l) => l === id || l?._id === id || l?.toString() === id);
  const completedCount = lessons.filter((l) => isCompleted(l._id)).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const resumeLearning = async () => {
    if (loading || lessons.length === 0) {
      toast('Lessons are still loading...');
      return;
    }

    setActiveTab('modules');

    const sorted = [...lessons].sort((a, b) => (a.chapter || 0) - (b.chapter || 0));
    const nextLesson = sorted.find((lesson) => !isCompleted(lesson._id)) || sorted[0];

    if (!nextLesson) {
      toast('No lesson found to resume.');
      return;
    }

    await openLesson(nextLesson);

    const lessonCard = document.getElementById(`lesson-card-${nextLesson._id}`);
    if (lessonCard) {
      setTimeout(() => {
        lessonCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return;
    }

    const modulesList = document.getElementById('core-modules-list');
    if (modulesList) {
      setTimeout(() => {
        modulesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10, paddingBottom: '40px' }}>
      
      {/* Universal Tab Navigation */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        <TabButton active={activeTab==='modules'} onClick={()=>setActiveTab('modules')} icon={BookOpen} label="Core Modules" />
        <TabButton active={activeTab==='visuals'} onClick={()=>setActiveTab('visuals')} icon={Globe} label="SDG Explorer" />
        <TabButton active={activeTab==='simulator'} onClick={()=>setActiveTab('simulator')} icon={Factory} label="Mix Simulator" />
        <TabButton active={activeTab==='impact'} onClick={()=>setActiveTab('impact')} icon={Activity} label="My Impact" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'modules' && (
          <motion.div key="modules" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <Sprout size={18} color="#10B981" />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fff' }}>Core Modules</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{completedCount} of {lessons.length} chapters completed</p>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '0 20px', height: '42px', fontSize: '14px' }} onClick={resumeLearning}>
                  <Play size={16} fill="currentColor" /> Resume Learning
                </button>
              </div>

              {user && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                      <span>Progress</span>
                      <span style={{ color: '#10B981' }}>{progress}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: 'var(--brand-gradient)', borderRadius: 100, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 130 }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Rank</p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 800 }}>{user.ecoLevel || 'Sapling'} • {user.ecoScore || 0} XP</p>
                  </div>
                </div>
              )}
            </div>

            <div id="core-modules-list">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}><div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  {[...new Set(lessons.map(l => l.sdgNumber || 0))].sort((a,b)=>a-b).map(sdgNum => {
                    const sdgDetails = SDGs.find(s => s.id === sdgNum) || { title: 'General Learning', color: '#10B981', id: 0 };
                    const sdgLessons = lessons.filter(l => (l.sdgNumber || 0) === sdgNum).sort((a,b) => a.chapter - b.chapter);
                    if (sdgLessons.length === 0) return null;
                    
                    return (
                      <div key={sdgNum} style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: `1px solid ${sdgDetails.color}30` }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#fff' }}>
                          <span style={{ background: sdgDetails.color, color: '#fff', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, boxShadow: `0 4px 12px ${sdgDetails.color}40` }}>{sdgDetails.id || '★'}</span>
                          {sdgDetails.title} Learning Paths
                        </h2>
                        <div className="dashboard-glass-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                          {sdgLessons.map((lesson) => {
                    const done = isCompleted(lesson._id);
                    return (
                      <button id={`lesson-card-${lesson._id}`} key={lesson._id} onClick={() => openLesson(lesson)}
                        className="dashboard-card"
                        style={{
                          textAlign: 'left', minHeight: '220px', padding: '28px',
                          border: done ? '1px solid rgba(16, 185, 129, 0.3)' : selected?._id === lesson._id ? '1px solid rgba(16, 185, 129, 0.6)' : undefined,
                          background: done ? 'rgba(16, 185, 129, 0.05)' : undefined,
                          boxShadow: selected?._id === lesson._id ? '0 12px 40px rgba(16, 185, 129, 0.3)' : undefined,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 2 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 14, background: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: done ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)' }}>
                             {done ? <CheckCircle size={24} color="#10B981" /> : <BookOpen size={24} color="#94A3B8" />}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 100 }}>CH {lesson.chapter}</div>
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: 8, lineHeight: 1.3, position: 'relative', zIndex: 2 }}>{lesson.title}</h3>
                        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
                          {lesson.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10, marginRight: 16, overflow: 'hidden' }}>
                             <div style={{ width: done ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}><Star size={14} fill="currentColor" /> {lesson.points} XP</span>
                        </div>
                      </button>
                    );
                          })}
                        </div>
                        
                        <AnimatePresence mode="wait">
                          {selected && lessonContent && (selected.sdgNumber || 0) === sdgNum && (
                            <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.4 }} className="card-glass" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98))', border: '1px solid var(--brand-solid)', boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.15)', position: 'relative', overflow: 'hidden', marginTop: '32px' }}>
                              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'var(--brand-gradient)' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                                <div>
                                  <p style={{ fontSize: '13px', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Chapter {lessonContent.chapter}</p>
                                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>{lessonContent.title}</h2>
                                  <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '800px', lineHeight: 1.6 }}>{lessonContent.description}</p>
                                </div>
                                <button onClick={() => { setSelected(null); setLessonContent(null); }}
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', cursor: 'pointer', padding: 10, borderRadius: '12px', transition: 'all 0.2s', display: 'flex' }}
                                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                  <X size={24} />
                                </button>
                              </div>
                              <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                                <span className="badge" style={{ background: `var(--badge-${diffColors[lessonContent.difficulty]}-bg, rgba(255,255,255,0.1))`, color: `var(--badge-${diffColors[lessonContent.difficulty]}-text, #fff)`, border: `1px solid var(--badge-${diffColors[lessonContent.difficulty]}-border, rgba(255,255,255,0.2))`, textTransform: 'capitalize', padding: '8px 16px', fontSize: '13px' }}>{lessonContent.difficulty}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', fontWeight: 600, color: '#94A3B8', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 100 }}><Clock size={16} /> {lessonContent.duration} min read</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', fontWeight: 800, color: '#FBBF24', padding: '8px 16px', background: 'rgba(245,158,11,0.1)', borderRadius: 100, border: '1px solid rgba(245,158,11,0.2)' }}><Star size={16} fill="currentColor" /> +{lessonContent.points} XP Reward</span>
                              </div>
                              <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', padding: '40px', marginBottom: 32, fontSize: '17px', lineHeight: 1.9, color: '#E2E8F0', whiteSpace: 'pre-line', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)' }}>
                                {lessonContent.content}
                              </div>
                              {isCompleted(selected._id) ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: '#10B981', fontWeight: 800, fontSize: '18px', padding: '16px 32px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', boxShadow: '0 8px 24px rgba(16,185,129,0.15)' }}><CheckCircle size={24} /> Module Mastered</div>
                              ) : showLessonQuiz ? (
                                <div style={{ marginTop: '16px', width: '100%' }}>
                                  <AIQuizEngine 
                                    lessonId={selected._id} 
                                    topicName={lessonContent.title}
                                    onClose={() => {
                                      setShowLessonQuiz(false);
                                      completeLesson(); 
                                    }} 
                                  />
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                  <button onClick={() => setShowLessonQuiz(true)} className="btn-primary" style={{ padding: '0 40px', height: '56px', fontSize: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    🧠 Take AI Assessment to Complete
                                  </button>
                                  <button onClick={completeLesson} disabled={completing} style={{ padding: '0 24px', height: '56px', fontSize: '14px', borderRadius: '16px', background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)';}} onMouseOut={e=>{e.currentTarget.style.color='#94A3B8'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';}}>
                                    {completing ? 'Concluding Analysis...' : 'Skip Assessment & Claim Basic XP'}
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Modular Visual Interactivity Layers */}
        {activeTab === 'visuals' && (
          <motion.div key="visuals" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>SDG Global Explorer</h2>
            <p style={{ color: '#94A3B8', marginBottom: '32px', fontSize: '16px' }}>Explore the 17 Sustainable Development Goals and understand how they shape a sustainable world. Tap any card!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
              {SDGs.map(sdg => (
                <motion.div
                  layout
                  key={sdg.id}
                  onClick={() => {
                    setActiveQuizSDG(null);
                    setActiveSDG(activeSDG === sdg.id ? null : sdg.id);
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  className="card-glass trend-card" 
                  style={{
                    gridColumn: activeSDG === sdg.id ? '1 / -1' : 'auto',
                    minHeight: 180,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                    borderTop: `4px solid ${sdg.color}`,
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(10, 20, 35, 0.9))',
                    cursor: 'pointer'
                  }}>
                  <div style={{ fontSize: '64px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', position: 'absolute', right: -10, bottom: -20, pointerEvents: 'none' }}>{sdg.id}</div>
                  <div style={{ flexShrink: 0, background: sdg.color, width: activeSDG === sdg.id ? 80 : 40, height: activeSDG === sdg.id ? 80 : 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: activeSDG === sdg.id ? '32px' : '18px', boxShadow: `0 8px 24px ${sdg.color}60`, transition: 'all 0.25s ease' }}>{sdg.id}</div>
                  <div>
                    <h4 style={{ fontSize: activeSDG === sdg.id ? '28px' : '16px', fontWeight: 800, color: '#fff', lineHeight: 1.3, zIndex: 2, transition: 'font-size 0.25s ease' }}>{sdg.title}</h4>
                    <AnimatePresence>
                      {activeSDG === sdg.id && (
                        <motion.div initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                          <p style={{ color: '#94A3B8', fontSize: '15px', marginTop: '12px', lineHeight: 1.6, maxWidth: '600px' }}>{sdg.detail}</p>
                          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${sdg.color}40`, color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                            <Zap size={16} color={sdg.color} /> Actions like conserving energy directly drive this goal forward!
                          </div>
                          
                          {/* AI Quiz Integration */}
                          <div style={{ marginTop: '24px', width: '100%' }}>
                            {activeQuizSDG === sdg.id ? (
                              <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'auto', width: '100%' }}>
                                <AIQuizEngine 
                                  lessonId={`sdg_${sdg.id}`} 
                                  topicName={sdg.title}
                                  color={sdg.color}
                                  onClose={() => setActiveQuizSDG(null)} 
                                />
                              </div>
                            ) : (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setActiveQuizSDG(sdg.id); }}
                                 className="btn-primary" 
                                 style={{ background: sdg.color, border: 'none', boxShadow: `0 4px 16px ${sdg.color}40`, borderRadius: '12px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800 }}
                                 onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                                 onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                               >
                                 🧠 Start AI Dynamic Quiz
                               </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'simulator' && <motion.div key="simulator" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}><EnergySimulator /></motion.div>}
        {activeTab === 'impact' && <motion.div key="impact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}><PersonalImpact /></motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default Learning;
