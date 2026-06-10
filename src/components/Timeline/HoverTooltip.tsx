import { useRef, useEffect } from 'react';
import { gsap } from '../../hooks/useGSAP';
import type { Milestone } from '../../types';

interface HoverTooltipProps {
  milestone: Milestone | null;
  position: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  visible: boolean;
}

/**
 * Glassmorphism tooltip card that appears near milestone points on the curve.
 * Features fade + slide-up animation and premium product storytelling UI.
 */
export default function HoverTooltip({
  milestone,
  position,
  containerWidth,
  containerHeight,
  visible,
}: HoverTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (!tooltipRef.current) return;

    if (visible && !prevVisible.current) {
      // Enter animation
      gsap.fromTo(
        tooltipRef.current,
        { opacity: 0, y: 16, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    } else if (!visible && prevVisible.current) {
      // Exit animation
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 8,
        scale: 0.97,
        duration: 0.2,
        ease: 'power2.in',
      });
    }

    prevVisible.current = visible;
  }, [visible]);

  if (!milestone) return null;

  // Position calculation — avoid edges
  const tooltipWidth = 280;
  const tooltipHeight = 180;
  let left = position.x - tooltipWidth / 2;
  let top = position.y - tooltipHeight - 24;

  // Clamp horizontal
  if (left < 12) left = 12;
  if (left + tooltipWidth > containerWidth - 12) left = containerWidth - tooltipWidth - 12;

  // If too close to top, show below
  if (top < 12) {
    top = position.y + 24;
  }

  // Clamp vertical
  if (top + tooltipHeight > containerHeight - 12) {
    top = containerHeight - tooltipHeight - 12;
  }

  return (
    <div
      ref={tooltipRef}
      className="absolute pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${tooltipWidth}px`,
        zIndex: 30,
        opacity: 0,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10, 10, 18, 0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: `
            0 0 40px rgba(139, 92, 246, 0.08),
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
          `,
        }}
      >
        {/* Header gradient strip */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 30%, #22d3ee 70%, transparent 100%)',
            opacity: 0.6,
          }}
        />

        <div className="p-5">
          {/* Stage badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{milestone.icon}</span>
            <span
              className="text-[10px] font-mono font-semibold tracking-[0.18em] uppercase"
              style={{ color: 'rgba(139, 92, 246, 0.8)' }}
            >
              Stage {milestone.id + 1}
            </span>
            <span
              className="ml-auto text-[9px] font-mono"
              style={{ color: 'rgba(148, 163, 184, 0.4)' }}
            >
              {Math.round(milestone.percentage * 100)}%
            </span>
          </div>

          {/* Title */}
          <h4
            className="text-sm font-semibold leading-tight mb-2"
            style={{
              color: '#e2e8f0',
              letterSpacing: '-0.01em',
            }}
          >
            {milestone.label}
          </h4>

          {/* Description */}
          <p
            className="text-[11px] leading-relaxed mb-3"
            style={{
              color: 'rgba(148, 163, 184, 0.7)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {milestone.description}
          </p>

          {/* Tech tags */}
          {milestone.tech && (
            <div className="flex flex-wrap gap-1.5">
              {milestone.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md"
                  style={{
                    color: 'rgba(167, 139, 250, 0.85)',
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
