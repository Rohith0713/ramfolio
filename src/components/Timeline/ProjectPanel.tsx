import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../hooks/useGSAP';
import type { Milestone } from '../../types';

interface ProjectPanelProps {
  milestone: Milestone;
  milestoneIndex: number;
  totalMilestones: number;
}

/**
 * Glassmorphic side panel showing the active milestone's details.
 * Content transitions with GSAP animations on milestone change.
 */
export default function ProjectPanel({
  milestone,
  milestoneIndex,
  totalMilestones,
}: ProjectPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayMilestone, setDisplayMilestone] = useState(milestone);
  const prevIdRef = useRef(milestone.id);

  // Animate content transition when milestone changes
  useEffect(() => {
    if (!contentRef.current) return;
    if (prevIdRef.current === milestone.id) return;
    prevIdRef.current = milestone.id;

    const tl = gsap.timeline();

    tl.to(contentRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayMilestone(milestone);
      },
    }).to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
    };
  }, [milestone]);

  // Panel entrance animation
  useEffect(() => {
    if (!panelRef.current) return;

    gsap.from(panelRef.current, {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.5,
    });
  }, []);

  return (
    <div
      ref={panelRef}
      className="hidden lg:flex flex-col lg:col-span-1 lg:row-span-1 rounded-2xl p-6
        self-center max-h-[540px] min-w-0"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-accent-violet">
          Stage {milestoneIndex + 1} of {totalMilestones}
        </span>
        <span className="text-[10px] font-mono text-text-muted/60">
          {Math.round(milestone.percentage * 100)}%
        </span>
      </div>

      {/* Visual area with icon */}
      <div
        className="relative aspect-video rounded-xl overflow-hidden mb-5"
        style={{
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.12)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(139, 92, 246, ${0.12 + milestoneIndex * 0.04}) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(6, 182, 212, ${0.06 + milestoneIndex * 0.02}) 0%, transparent 50%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))
            `,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        {/* Stage icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="text-5xl drop-shadow-lg">{displayMilestone.icon}</span>
            <div className="absolute -inset-4 rounded-full border border-accent-violet/10 animate-ping opacity-20" />
          </div>
        </div>
        {/* Stage number overlay */}
        <div className="absolute bottom-2 right-3">
          <span className="text-[64px] font-extrabold text-white/[0.04] leading-none">
            {String(milestoneIndex + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef}>
        <h3 className="text-lg font-bold text-text-primary leading-tight">
          {displayMilestone.label}
        </h3>
        <p className="text-[13px] text-text-secondary leading-relaxed mt-2">
          {displayMilestone.description}
        </p>

        {/* Tech tags */}
        {displayMilestone.tech && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {displayMilestone.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md"
                style={{
                  color: 'rgba(167, 139, 250, 0.9)',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-auto pt-5">
        {Array.from({ length: totalMilestones }).map((_, i) => (
          <div key={i} className="relative">
            <span
              className="block w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i <= milestoneIndex ? '#8b5cf6' : '#475569',
                boxShadow: i <= milestoneIndex ? '0 0 8px rgba(139, 92, 246, 0.5)' : 'none',
              }}
            />
          </div>
        ))}
        <span className="ml-auto text-[10px] font-mono text-text-muted">
          {milestoneIndex + 1}/{totalMilestones}
        </span>
      </div>
    </div>
  );
}
