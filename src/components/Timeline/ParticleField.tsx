import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  phase: number;
}

const COLORS = [
  'rgba(139, 92, 246, 0.6)',   // purple
  'rgba(34, 211, 238, 0.5)',   // cyan
  'rgba(212, 160, 23, 0.4)',   // yellow
  'rgba(255, 255, 255, 0.3)',  // white
  'rgba(139, 92, 246, 0.3)',   // purple dim
];

/**
 * Canvas-based floating particle field for ambient depth.
 * Renders behind the SVG curves with slow drift and mouse parallax.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.min(55, Math.floor((w * h) / 20000));
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        size: 0.8 + Math.random() * 2,
        opacity: 0.04 + Math.random() * 0.12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { width: rect.width, height: rect.height };
      initParticles(rect.width, rect.height);
    };

    resize();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', handleMouse);

    const observer = new ResizeObserver(resize);
    if (parent) observer.observe(parent);

    let time = 0;
    const animate = () => {
      const { width: w, height: h } = dimensionsRef.current;
      ctx.clearRect(0, 0, w, h);
      time += 0.008;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // Slow drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse parallax (very subtle)
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.03;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Breathing opacity
        const breathe = Math.sin(time * 2 + p.phase) * 0.3 + 0.7;
        const alpha = p.opacity * breathe;

        // Draw particle with glow
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      parent?.removeEventListener('mousemove', handleMouse);
      observer.disconnect();
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
