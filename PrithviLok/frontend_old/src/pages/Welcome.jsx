// ============================================================
// Welcome — Cinematic Full-Screen Intro Page
// Floating text, particle stars, and immersive deep-space feel.
// Click anywhere → navigates to /login
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Particle Star Field ──
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    for (let i = 0; i < 350; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();

        // subtle glow
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120,200,255,${0.04 * twinkle})`;
          ctx.fill();
        }

        // Slow drift
        s.y -= s.speed;
        if (s.y < -5) {
          s.y = canvas.height + 5;
          s.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

// ── Floating Particles (green orbs) ──
const FloatingOrbs = () => {
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 300 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 15,
    delay: Math.random() * 5,
    color: i % 3 === 0
      ? 'rgba(16, 185, 129, 0.06)'
      : i % 3 === 1
      ? 'rgba(6, 182, 212, 0.05)'
      : 'rgba(139, 92, 246, 0.04)',
  }));

  return (
    <>
      {orbs.map((o) => (
        <motion.div
          key={o.id}
          style={{
            position: 'fixed',
            width: o.size,
            height: o.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            filter: 'blur(60px)',
            zIndex: 2,
            pointerEvents: 'none',
            left: `${o.x}%`,
            top: `${o.y}%`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: o.duration,
            delay: o.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
};

// ── Cinematic Text Lines ──
const cinematicLines = [
  { text: 'THE PLANET IS CHANGING', delay: 1.2 },
  { text: 'ARE YOU READY TO MAKE A DIFFERENCE?', delay: 3.0 },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('entrance'); // entrance → reveal → ready
  const [exiting, setExiting] = useState(false);

  // Progress through cinematic phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 2000);
    const t2 = setTimeout(() => setPhase('ready'), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClick = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate('/landing'), 1200);
  }, [exiting, navigate]);

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      id="welcome-page"
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #030a14 50%, #000000 100%)',
        zIndex: 9999,
      }}
    >
      {/* Star field */}
      <StarField />

      {/* Floating ambient orbs */}
      <FloatingOrbs />

      {/* ── Central Radial Glow Pulse ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Rotating Ring ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: 420,
          height: 420,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0.15)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {/* Orbiting dot */}
        <div
          style={{
            position: 'absolute',
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 12px rgba(16,185,129,0.8), 0 0 40px rgba(16,185,129,0.4)',
          }}
        />
      </motion.div>

      {/* Second ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: 550,
          height: 550,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '1px solid rgba(6,182,212,0.08)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#06b6d4',
            boxShadow: '0 0 10px rgba(6,182,212,0.8), 0 0 30px rgba(6,182,212,0.3)',
          }}
        />
      </motion.div>

      {/* ── Main Content ── */}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              pointerEvents: 'none',
            }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            {/* Logo / Brand Mark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 50px rgba(16,185,129,0.35), 0 0 100px rgba(16,185,129,0.15)',
                marginBottom: 40,
              }}
            >
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </motion.div>

            {/* PRITHVILOK title */}
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(42px, 8vw, 80px)',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #ffffff 0%, #10B981 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              PRITHVILOK
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 1, ease: 'easeOut' }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(14px, 2vw, 20px)',
                fontWeight: 500,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(148, 163, 184, 0.8)',
                textAlign: 'center',
                marginBottom: 50,
              }}
            >
              Sustainability Operating System
            </motion.p>

            {/* Cinematic floating messages */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              {cinematicLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                  animate={
                    phase === 'entrance'
                      ? {}
                      : { y: 0, opacity: 1, filter: 'blur(0px)' }
                  }
                  transition={{
                    delay: line.delay - 1.5,
                    duration: 1.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: i === 0 ? 'clamp(13px, 1.8vw, 18px)' : 'clamp(11px, 1.4vw, 15px)',
                    fontWeight: 600,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: i === 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255,255,255,0.45)',
                    textAlign: 'center',
                  }}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>

            {/* Floating "Click to Enter" prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase === 'ready' ? { opacity: 1 } : {}}
              transition={{ duration: 1.5 }}
              style={{ marginTop: 60 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Glowing ring pulse */}
                <div style={{ position: 'relative' }}>
                  <motion.div
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(16,185,129,0.5)',
                    }}
                  />
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(16,185,129,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(16,185,129,0.05)',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(16,185,129,0.5)',
                  }}
                >
                  CLICK ANYWHERE TO ENTER
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exit Transition: White flash → fade ── */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeIn' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, #000000 70%)',
            }}
          >
            {/* Center flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.5), transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom scanlines for cinematic feel ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Top vignette */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* ── Version badge / bottom-right ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 3, duration: 1 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 32,
          zIndex: 20,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        v2.0 · Sustainability OS
      </motion.div>

      {/* ── Bottom-left credits ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 3.5, duration: 1 }}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 32,
          zIndex: 20,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        Powered by PrithviLok
      </motion.div>
    </div>
  );
};

export default Welcome;
