// ============================================================
// FeaturesSection — Premium Glassmorphism Cards
// ============================================================
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind, Droplets, Leaf, ScanLine, Users, Zap,
  Activity, Globe2, ShieldCheck, TreePine, BarChart3, Cpu
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-Time AQI Monitor',
    desc: 'Live air quality index tracking with pollutant breakdown and health advisories.',
    accent: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
  },
  {
    icon: Droplets,
    title: 'Water Quality Index',
    desc: 'Comprehensive WQI analysis including pH, turbidity and safety classification.',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    icon: BarChart3,
    title: 'Carbon Tracker',
    desc: 'Quantify and visualize your carbon footprint against regional and global baselines.',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.20)',
  },
  {
    icon: ScanLine,
    title: 'Waste Intelligence',
    desc: 'AI-powered waste classification system with smart recycling recommendations.',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.22)',
  },
  {
    icon: Users,
    title: 'Community Eco Hub',
    desc: 'Connect, share, and collaborate on sustainability initiatives with your community.',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.22)',
  },
  {
    icon: Zap,
    title: 'Blockchain Rewards',
    desc: 'Earn verifiable eco-credits for every green action — backed by transparent ledgers.',
    accent: '#facc15',
    glow: 'rgba(250,204,21,0.22)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FeatureCard = ({ feature }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '28px 24px',
        background: hovered
          ? 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? feature.accent + '55' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered
          ? `0 8px 40px ${feature.glow}, 0 0 0 1px ${feature.accent}18`
          : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Background glow blob */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: feature.glow,
        filter: 'blur(35px)',
        opacity: hovered ? 0.6 : 0.15,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        border: `1.5px solid ${feature.accent}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        background: `${feature.accent}10`,
        boxShadow: hovered ? `0 0 18px ${feature.glow}` : 'none',
        transition: 'all 0.35s ease',
        transform: hovered ? 'rotate(8deg) scale(1.1)' : 'rotate(0deg) scale(1)',
      }}>
        <Icon
          size={22}
          style={{
            color: feature.accent,
            strokeWidth: 1.5,
            filter: hovered ? `drop-shadow(0 0 6px ${feature.accent})` : 'none',
            transition: 'filter 0.35s ease',
          }}
        />
      </div>

      {/* Text */}
      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1rem',
        fontWeight: 700,
        color: '#f1f5f9',
        marginBottom: 8,
        lineHeight: 1.3,
        letterSpacing: '0.01em',
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontSize: '0.82rem',
        color: '#64748b',
        lineHeight: 1.65,
        fontWeight: 400,
      }}>
        {feature.desc}
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: 1,
        background: `linear-gradient(90deg, transparent, ${feature.accent}66, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }} />
    </motion.div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '100px 5% 120px',
        background: 'linear-gradient(180deg, #010206 0%, #050a14 40%, #010206 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 700,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: 400,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 64, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            padding: '5px 16px',
            borderRadius: 100,
            background: 'rgba(34,197,94,0.06)',
            marginBottom: 20,
          }}>
            Platform Features
          </span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Intelligence Built for{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Our Planet
            </span>
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#475569',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            A unified suite of environmental monitoring tools, powered by real-time data and community action.
          </p>
        </motion.div>
      </div>

      {/* Cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
