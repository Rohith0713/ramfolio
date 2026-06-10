import { useRef, useEffect } from 'react';
import { gsap } from '../../hooks/useGSAP';

interface TrackerProps {
  pathRef: React.RefObject<SVGPathElement | null>;
  progress: number; // 0–1
}

/**
 * Scroll-driven progress dot that follows the primary SVG path.
 * Simplified version — cursor interaction is handled by CursorTracker.
 */
export default function Tracker({ pathRef, progress }: TrackerProps) {
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const glowOuterRef = useRef<SVGCircleElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    const glowOuter = glowOuterRef.current;

    if (!path || !dot || !glow || !glowOuter) return;

    const totalLength = path.getTotalLength();
    const point = path.getPointAtLength(progress * totalLength);

    // Smooth GSAP-tweened position update
    gsap.to(posRef.current, {
      x: point.x,
      y: point.y,
      duration: 0.15,
      ease: 'power2.out',
      onUpdate: () => {
        const { x, y } = posRef.current;
        dot.setAttribute('cx', `${x}`);
        dot.setAttribute('cy', `${y}`);
        glow.setAttribute('cx', `${x}`);
        glow.setAttribute('cy', `${y}`);
        glowOuter.setAttribute('cx', `${x}`);
        glowOuter.setAttribute('cy', `${y}`);
      },
    });
  }, [progress, pathRef]);

  // Pulse animation
  useEffect(() => {
    if (!glowRef.current) return;

    const tween = gsap.to(glowRef.current, {
      attr: { r: 22 },
      opacity: 0.15,
      duration: 1.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  return (
    <g className="tracker" style={{ pointerEvents: 'none' }}>
      {/* Outer soft glow */}
      <circle
        ref={glowOuterRef}
        cx="0"
        cy="0"
        r="30"
        fill="rgba(139, 92, 246, 0.08)"
        opacity="0.5"
      />
      {/* Glow ring */}
      <circle
        ref={glowRef}
        cx="0"
        cy="0"
        r="15"
        fill="rgba(139, 92, 246, 0.25)"
        opacity="0.3"
      />
      {/* Main dot */}
      <circle
        ref={dotRef}
        cx="0"
        cy="0"
        r="5"
        fill="white"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.7)) drop-shadow(0 0 14px rgba(139, 92, 246, 0.3))',
        }}
      />
    </g>
  );
}
