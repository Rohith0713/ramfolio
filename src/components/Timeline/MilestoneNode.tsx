import { useRef, useEffect } from 'react';
import { gsap } from '../../hooks/useGSAP';

interface MilestoneNodeProps {
  x: number;
  y: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isVisible: boolean;
}

/**
 * Individual milestone node on the SVG timeline path.
 * Renders a dot with label that changes appearance based on state.
 */
export default function MilestoneNode({
  x,
  y,
  label,
  isActive,
  isCompleted,
  isVisible,
}: MilestoneNodeProps) {
  const groupRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  // Active state animation
  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;

    if (isActive) {
      gsap.to(dotRef.current, {
        attr: { r: 8 },
        fill: '#8b5cf6',
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
      // Pulse ring
      gsap.fromTo(
        ringRef.current,
        { attr: { r: 10 }, opacity: 0.6 },
        {
          attr: { r: 24 },
          opacity: 0,
          duration: 1.8,
          ease: 'power1.out',
          repeat: -1,
        }
      );
    } else if (isCompleted) {
      gsap.to(dotRef.current, {
        attr: { r: 5 },
        fill: '#8b5cf6',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.killTweensOf(ringRef.current);
      gsap.set(ringRef.current, { opacity: 0 });
    } else {
      gsap.to(dotRef.current, {
        attr: { r: 4 },
        fill: '#475569',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.killTweensOf(ringRef.current);
      gsap.set(ringRef.current, { opacity: 0 });
    }
  }, [isActive, isCompleted]);

  return (
    <g
      ref={groupRef}
      transform={`translate(${x}, ${y})`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Pulse ring (only visible when active) */}
      <circle
        ref={ringRef}
        cx="0"
        cy="0"
        r="10"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        opacity="0"
      />

      {/* Glow behind active dot */}
      {isActive && (
        <circle
          cx="0"
          cy="0"
          r="16"
          fill="rgba(139, 92, 246, 0.15)"
        />
      )}

      {/* Main dot */}
      <circle
        ref={dotRef}
        cx="0"
        cy="0"
        r="4"
        fill="#475569"
      />

      {/* Label */}
      <g transform="translate(0, -24)">
        <rect
          x={-label.length * 3.5 - 10}
          y="-12"
          width={label.length * 7 + 20}
          height="24"
          rx="6"
          fill="rgba(15, 23, 42, 0.85)"
          stroke={
            isActive
              ? 'rgba(139, 92, 246, 0.3)'
              : isCompleted
              ? 'rgba(148, 163, 184, 0.1)'
              : 'transparent'
          }
          strokeWidth="1"
        />
        <text
          textAnchor="middle"
          dy="4"
          fill={
            isActive
              ? '#a78bfa'
              : isCompleted
              ? '#94a3b8'
              : '#475569'
          }
          fontSize="11"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.05em"
        >
          {label}
        </text>
      </g>
    </g>
  );
}
