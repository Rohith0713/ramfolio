import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from '../../hooks/useGSAP';
import type { Milestone } from '../../types';

interface CursorTrackerProps {
  pathRef: React.RefObject<SVGPathElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  milestones: Milestone[];
  onMilestoneHover: (index: number | null, position: { x: number; y: number }) => void;
}

/**
 * Magnetic cursor tracker that snaps to the purple SVG path.
 * Uses binary search on getPointAtLength for nearest-point detection.
 * Renders a glowing node with motion trail on the curve.
 */
export default function CursorTracker({
  pathRef,
  containerRef,
  milestones,
  onMilestoneHover,
}: CursorTrackerProps) {
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const glowOuterRef = useRef<SVGCircleElement>(null);
  const crosshairVRef = useRef<SVGLineElement>(null);
  const crosshairHRef = useRef<SVGLineElement>(null);
  const trailGroupRef = useRef<SVGGElement>(null);

  const posRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const isActiveRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const trailDotsRef = useRef<{ x: number; y: number; opacity: number }[]>([]);
  const lastFractionRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Find nearest point on path using sampling
  const findNearestPoint = useCallback(
    (mouseX: number, mouseY: number) => {
      const path = pathRef.current;
      if (!path) return null;

      const totalLength = path.getTotalLength();
      const samples = 200;
      let bestDist = Infinity;
      let bestLength = 0;
      let bestPoint = { x: 0, y: 0 };

      // Coarse search
      for (let i = 0; i <= samples; i++) {
        const len = (i / samples) * totalLength;
        const pt = path.getPointAtLength(len);
        const dx = pt.x - mouseX;
        const dy = pt.y - mouseY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestLength = len;
          bestPoint = { x: pt.x, y: pt.y };
        }
      }

      // Fine search around best
      const searchRadius = totalLength / samples;
      const fineSteps = 30;
      for (let i = 0; i <= fineSteps; i++) {
        const len = bestLength - searchRadius + (2 * searchRadius / fineSteps) * i;
        if (len < 0 || len > totalLength) continue;
        const pt = path.getPointAtLength(len);
        const dx = pt.x - mouseX;
        const dy = pt.y - mouseY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestLength = len;
          bestPoint = { x: pt.x, y: pt.y };
        }
      }

      return {
        point: bestPoint,
        distance: Math.sqrt(bestDist),
        fraction: bestLength / totalLength,
      };
    },
    [pathRef]
  );

  // Check if near a milestone
  const checkMilestoneProximity = useCallback(
    (fraction: number) => {
      const path = pathRef.current;
      if (!path) return;

      const totalLength = path.getTotalLength();
      let closestIdx: number | null = null;
      let closestDist = Infinity;

      milestones.forEach((ms, i) => {
        const msPt = path.getPointAtLength(ms.percentage * totalLength);
        const curPt = path.getPointAtLength(fraction * totalLength);
        const dx = msPt.x - curPt.x;
        const dy = msPt.y - curPt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40 && dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      if (closestIdx !== null) {
        const msPt = path.getPointAtLength(milestones[closestIdx].percentage * totalLength);
        onMilestoneHover(closestIdx, { x: msPt.x, y: msPt.y });
      } else {
        onMilestoneHover(null, { x: 0, y: 0 });
      }
    },
    [pathRef, milestones, onMilestoneHover]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const result = findNearestPoint(mouseX, mouseY);
      if (!result) return;

      const ACTIVATION_DISTANCE = 120;

      if (result.distance < ACTIVATION_DISTANCE) {
        if (!isActiveRef.current) {
          isActiveRef.current = true;
          setIsHovering(true);
          // Glow burst on entry
          if (glowOuterRef.current) {
            gsap.fromTo(
              glowOuterRef.current,
              { attr: { r: 10 }, opacity: 0.8 },
              { attr: { r: 50 }, opacity: 0, duration: 0.6, ease: 'power2.out' }
            );
          }
        }

        targetPosRef.current = result.point;
        lastFractionRef.current = result.fraction;

        // Add trail dot
        trailDotsRef.current.push({
          x: result.point.x,
          y: result.point.y,
          opacity: 0.5,
        });
        if (trailDotsRef.current.length > 12) {
          trailDotsRef.current.shift();
        }

        checkMilestoneProximity(result.fraction);
      } else {
        if (isActiveRef.current) {
          isActiveRef.current = false;
          setIsHovering(false);
          onMilestoneHover(null, { x: 0, y: 0 });
          trailDotsRef.current = [];
        }
      }
    };

    const handleMouseLeave = () => {
      isActiveRef.current = false;
      setIsHovering(false);
      onMilestoneHover(null, { x: 0, y: 0 });
      trailDotsRef.current = [];
    };

    container.addEventListener('mousemove', handleMouseMove as any);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleMouseMove as any, { passive: true });
    container.addEventListener('touchstart', handleMouseMove as any, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    // Smooth animation loop for position interpolation
    const tick = () => {
      if (isActiveRef.current) {
        // Magnetic interpolation (increased strength)
        posRef.current.x += (targetPosRef.current.x - posRef.current.x) * 0.45;
        posRef.current.y += (targetPosRef.current.y - posRef.current.y) * 0.45;
      }

      const { x, y } = posRef.current;

      if (dotRef.current) {
        dotRef.current.setAttribute('cx', `${x}`);
        dotRef.current.setAttribute('cy', `${y}`);
      }
      if (glowRef.current) {
        glowRef.current.setAttribute('cx', `${x}`);
        glowRef.current.setAttribute('cy', `${y}`);
      }
      if (crosshairVRef.current) {
        crosshairVRef.current.setAttribute('x1', `${x}`);
        crosshairVRef.current.setAttribute('x2', `${x}`);
      }
      if (crosshairHRef.current) {
        crosshairHRef.current.setAttribute('y1', `${y}`);
        crosshairHRef.current.setAttribute('y2', `${y}`);
      }

      // Update trail dots
      if (trailGroupRef.current) {
        const trailDots = trailGroupRef.current.children;
        for (let i = 0; i < trailDotsRef.current.length; i++) {
          const td = trailDotsRef.current[i];
          td.opacity *= 0.92;
          if (trailDots[i]) {
            (trailDots[i] as SVGCircleElement).setAttribute('cx', `${td.x}`);
            (trailDots[i] as SVGCircleElement).setAttribute('cy', `${td.y}`);
            (trailDots[i] as SVGCircleElement).setAttribute('opacity', `${td.opacity}`);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove as any);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleMouseMove as any);
      container.removeEventListener('touchstart', handleMouseMove as any);
      container.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, findNearestPoint, checkMilestoneProximity, onMilestoneHover]);

  // Pulse animation on glow
  useEffect(() => {
    if (!glowRef.current) return;
    const tween = gsap.to(glowRef.current, {
      attr: { r: 28 },
      opacity: 0.12,
      duration: 1.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <g
      className="cursor-tracker"
      style={{
        opacity: isHovering ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      {/* Crosshair lines */}
      <line
        ref={crosshairVRef}
        x1="0" y1="0" x2="0" y2="100%"
        stroke="#8b5cf6"
        strokeWidth="0.5"
        strokeDasharray="4 6"
        opacity="0.15"
      />
      <line
        ref={crosshairHRef}
        x1="0" y1="0" x2="100%" y2="0"
        stroke="#8b5cf6"
        strokeWidth="0.5"
        strokeDasharray="4 6"
        opacity="0.15"
      />

      {/* Motion trail dots */}
      <g ref={trailGroupRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={`trail-${i}`}
            cx="-100"
            cy="-100"
            r={1.5}
            fill="#8b5cf6"
            opacity="0"
          />
        ))}
      </g>

      {/* Glow burst (entry animation) */}
      <circle
        ref={glowOuterRef}
        cx="-100"
        cy="-100"
        r="10"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        opacity="0"
      />

      {/* Pulsing glow */}
      <circle
        ref={glowRef}
        cx="-100"
        cy="-100"
        r="20"
        fill="rgba(139, 92, 246, 0.2)"
        opacity="0.25"
      />

      {/* Main dot */}
      <circle
        ref={dotRef}
        cx="-100"
        cy="-100"
        r="5"
        fill="white"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))',
        }}
      />
    </g>
  );
}
