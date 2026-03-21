// ============================================================
// NatureTransition — Cinematic Tree Growth Canvas Animation
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Tree branch recursion ── */
function drawBranch(ctx, x, y, angle, length, depth, progress, maxDepth) {
  if (depth > maxDepth || length < 2) return;

  const endX = x + Math.cos(angle) * length * progress;
  const endY = y + Math.sin(angle) * length * progress;

  const alpha = Math.min(1, progress * 1.5);
  const green = Math.floor(100 + depth * 12);
  ctx.save();
  ctx.strokeStyle = `rgba(34, ${green + 80}, 60, ${alpha * (depth === 0 ? 1 : 0.85)})`;
  ctx.lineWidth = Math.max(0.5, (maxDepth - depth) * 1.4 - 0.5);
  ctx.shadowBlur = depth < 3 ? 14 : 6;
  ctx.shadowColor = `rgba(34, 197, 94, ${alpha * 0.7})`;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();

  if (progress < 0.3) return;
  const childProgress = (progress - 0.3) / 0.7;

  const spread = (0.35 + depth * 0.04);
  drawBranch(ctx, endX, endY, angle - spread, length * 0.68, depth + 1, childProgress, maxDepth);
  drawBranch(ctx, endX, endY, angle + spread, length * 0.65, depth + 1, childProgress, maxDepth);

  if (depth < 2) {
    drawBranch(ctx, endX, endY, angle - spread * 0.4, length * 0.5, depth + 1, childProgress * 0.8, maxDepth);
  }
}

/* ── Particle class ── */
class Particle {
  constructor(canvasW, canvasH) {
    this.reset(canvasW, canvasH);
  }
  reset(w, h) {
    this.x = Math.random() * w;
    this.y = h + 10;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1.8 + 0.8;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.7 + 0.3;
    this.fadeIn = true;
    this.life = 0;
    this.maxLife = Math.random() * 180 + 120;
    this.color = Math.random() > 0.5
      ? `rgba(34, 197, 94,`
      : `rgba(52, 211, 153,`;
  }
  update(w, h) {
    this.life++;
    this.x += this.speedX;
    this.y -= this.speedY;
    if (this.fadeIn && this.alpha < this.maxAlpha) this.alpha += 0.02;
    if (this.life > this.maxLife * 0.7) this.alpha -= 0.015;
    if (this.life > this.maxLife || this.y < -10) this.reset(w, h);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = `${this.color} 1)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `${this.color} 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ── Light rays ── */
function drawLightRays(ctx, w, h, alpha) {
  const cx = w / 2;
  const topY = h * 0.15;
  const rayCount = 8;
  for (let i = 0; i < rayCount; i++) {
    const angle = (Math.PI / (rayCount + 1)) * (i + 1);
    const len = h * 0.55;
    const x2 = cx + Math.cos(Math.PI - angle) * len;
    const y2 = topY + Math.sin(Math.PI - angle) * len;
    const grad = ctx.createLinearGradient(cx, topY, x2, y2);
    grad.addColorStop(0, `rgba(34, 197, 94, ${alpha * 0.25})`);
    grad.addColorStop(1, `rgba(34, 197, 94, 0)`);
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 18 + i * 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}

const TREE_CONFIGS = [
  { xRatio: 0.5,  size: 1.0, maxDepth: 9 },
  { xRatio: 0.25, size: 0.72, maxDepth: 7 },
  { xRatio: 0.75, size: 0.72, maxDepth: 7 },
  { xRatio: 0.12, size: 0.48, maxDepth: 6 },
  { xRatio: 0.88, size: 0.48, maxDepth: 6 },
];

const NatureTransition = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const navigate  = useNavigate();
  const [fadeAlpha, setFadeAlpha] = useState(0); // for white flash fade out
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () =>
      new Particle(canvas.width, canvas.height)
    );

    let startTime = null;
    const ANIM_DURATION = 2600; // ms for trees to fully grow

    const render = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const rawProgress = Math.min(elapsed / ANIM_DURATION, 1);
      // ease out cubic
      const progress = 1 - Math.pow(1 - rawProgress, 3);

      const w = canvas.width;
      const h = canvas.height;

      /* Clear */
      ctx.clearRect(0, 0, w, h);

      /* Deep dark background */
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, 0, w, h);

      /* Ground glow */
      const groundGrad = ctx.createRadialGradient(w/2, h, 0, w/2, h, w*0.6);
      groundGrad.addColorStop(0, `rgba(34,197,94,${0.1 * progress})`);
      groundGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 0, w, h);

      /* Light rays — appear after 50% progress */
      if (progress > 0.5) {
        drawLightRays(ctx, w, h, (progress - 0.5) * 2);
      }

      /* Trees */
      TREE_CONFIGS.forEach(({ xRatio, size, maxDepth }) => {
        const baseX  = w * xRatio;
        const baseY  = h;
        const trunk  = h * 0.28 * size;
        const delay  = xRatio === 0.5 ? 0 : 0.15;
        const tp     = Math.max(0, (progress - delay) / (1 - delay));
        drawBranch(ctx, baseX, baseY, -Math.PI / 2, trunk, 0, tp, maxDepth);
      });

      /* Particles — appear after 30% progress */
      if (progress > 0.3) {
        particles.forEach(p => {
          p.update(w, h);
          p.draw(ctx);
        });
      }

      /* Ambient top glow */
      if (progress > 0.6) {
        const topGlow = ctx.createRadialGradient(w/2, h * 0.2, 0, w/2, h * 0.2, w * 0.4);
        topGlow.addColorStop(0, `rgba(34,197,94,${(progress - 0.6) * 0.15})`);
        topGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = topGlow;
        ctx.fillRect(0, 0, w, h);
      }

      if (rawProgress < 1) {
        animRef.current = requestAnimationFrame(render);
      } else {
        /* Trigger white flash fade-out */
        setShowFlash(true);
        let alpha = 0;
        const flash = setInterval(() => {
          alpha += 0.045;
          setFadeAlpha(Math.min(alpha, 1));
          if (alpha >= 1) {
            clearInterval(flash);
            setTimeout(() => {
              onComplete?.();
              navigate('/dashboard');
            }, 120);
          }
        }, 16);
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Cinematic flash overlay */}
      {showFlash && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(6, 30, 12, ${fadeAlpha})`,
          pointerEvents: 'none',
          transition: 'none',
        }} />
      )}

      {/* Central message */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(34,197,94,0.7)',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          Initializing System
        </p>
      </div>
    </div>
  );
};

export default NatureTransition;
