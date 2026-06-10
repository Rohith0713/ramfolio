import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { ScrollTrigger, gsap } from '../../hooks/useGSAP';
import { useResizeObserver } from '../../hooks/useGSAP';
// Left panel removed
import HoverTooltip from './HoverTooltip';
import MilestoneNode from './MilestoneNode';
import { milestones } from '../../data/milestones';
import {
  generateCurvePath,
  GRAPH_CURVES,
  GRAPH_PADDING,
  Y_LABELS,
  X_LABELS,
  Y_MIN,
  Y_MAX,
  valueToY,
  timeToX,
  type CurveConfig,
} from '../../utils/animations';

/* ── Spline Editor Grid (SVG) ─────────────────────── */
interface SplineGridProps {
  width: number;
  height: number;
  activeMsIdx: number;
  hoveredMsIdx: number | null;
}

const SplineGrid = memo(function SplineGrid({ width, height, activeMsIdx, hoveredMsIdx }: SplineGridProps) {
  const pad = GRAPH_PADDING;
  const msYValues = [3.0, 2.6, 2.2];
  const msXIndices = [1, 5, 9]; // columns corresponding to '0:10', '1:00', '1:20'

  return (
    <g className="spline-grid">
      {/* Horizontal grid lines + Y-axis labels */}
      {Y_LABELS.map((val) => {
        const y = valueToY(val, height);
        const isHighlighted = 
          (activeMsIdx !== -1 && Math.abs(msYValues[activeMsIdx] - val) < 0.01) ||
          (hoveredMsIdx !== null && Math.abs(msYValues[hoveredMsIdx] - val) < 0.01);

        return (
          <g key={`y-${val}`}>
            <line
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              stroke={isHighlighted ? "rgba(255, 0, 255, 0.15)" : "rgba(255, 255, 255, 0.03)"}
              strokeWidth={isHighlighted ? "0.8" : "0.5"}
              style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
            />
            <text
              x={pad.left - 6}
              y={y + 3.5}
              textAnchor="end"
              fill={isHighlighted ? "#ff80ff" : "rgba(255, 255, 255, 0.15)"}
              fontSize="10"
              fontFamily="'Inter', 'Segoe UI', monospace"
              fontWeight={isHighlighted ? "600" : "400"}
            >
              {val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Vertical grid lines + X-axis labels */}
      {X_LABELS.map((label, i) => {
        const x = timeToX((i + 1) / (X_LABELS.length + 1), width);
        const isHighlighted = 
          (activeMsIdx !== -1 && msXIndices[activeMsIdx] === i) ||
          (hoveredMsIdx !== null && msXIndices[hoveredMsIdx] === i);

        return (
          <g key={`x-${label}`}>
            <line
              x1={x}
              y1={pad.top}
              x2={x}
              y2={height - pad.bottom}
              stroke={isHighlighted ? "rgba(255, 0, 255, 0.15)" : "rgba(255, 255, 255, 0.03)"}
              strokeWidth={isHighlighted ? "0.8" : "0.5"}
              style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
            />
            <text
              x={x}
              y={pad.top - 8}
              textAnchor="middle"
              fill={isHighlighted ? "#ff80ff" : "rgba(255, 255, 255, 0.15)"}
              fontSize="10"
              fontFamily="'Inter', 'Segoe UI', monospace"
              fontWeight={isHighlighted ? "600" : "400"}
            >
              {label}
            </text>
          </g>
        );
      })}

    </g>
  );
});




/* ════════════════════════════════════════════════════
   MAIN TIMELINE (SPLINE EDITOR)
   ════════════════════════════════════════════════════ */

const journeyPoints = [
  { t: 0.00, v: 3.2 },
  { t: 2 / 13, v: 3.0 },
  { t: 6 / 13, v: 2.6 },
  { t: 10 / 13, v: 2.2 },
  { t: 1.00, v: 2.0 }
];

function generateJourneySpline(width: number, height: number) {
  const pad = GRAPH_PADDING;
  const usableW = width - pad.left - pad.right;
  const usableH = height - pad.top - pad.bottom;

  const controlPoints = journeyPoints.map((p) => ({
    x: pad.left + p.t * usableW,
    y: pad.top + usableH * (1 - (p.v - Y_MIN) / (Y_MAX - Y_MIN)),
  }));

  if (controlPoints.length < 2) return { d: '', controlPoints: [] };
  let d = `M ${controlPoints[0].x.toFixed(1)} ${controlPoints[0].y.toFixed(1)}`;
  const tension = 0.4;

  for (let i = 1; i < controlPoints.length; i++) {
    const prev = controlPoints[i - 1];
    const curr = controlPoints[i];
    const dx = curr.x - prev.x;

    const cpx1 = prev.x + dx * tension;
    const cpy1 = prev.y;
    const cpx2 = prev.x + dx * (1 - tension);
    const cpy2 = curr.y;

    d += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }

  return { d, controlPoints };
}

function VideoCard({ vid, vidIdx, isActive, p, onFullScreen: _onFullScreen }: { vid: any; vidIdx: number; isActive: boolean; p: number; onFullScreen?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Detect YouTube embed URL
  const isYouTube = vid.src?.includes('youtube.com/embed');

  // Toggle audio based on isMuted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const isLandscape = vid.orientation === 'landscape';

  return (
    <div
      className={`timeline-item ${isLandscape ? 'timeline-item--landscape' : 'timeline-item--portrait'}`}
      data-ismuted={String(isMuted)}
      style={{
        width: isLandscape
          ? 'min(600px, 80vw, 46vh * 16 / 9)'
          : 'min(320px, 75vw, 55vh * 9 / 16)',
        height: 'auto',
        aspectRatio: isLandscape ? '16/9' : '9/16',
        maxHeight: '70vh',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        boxShadow: isHovered
          ? `0 24px 48px rgba(0,0,0,0.7), 0 0 20px rgba(255, 0, 255, 0.3)`
          : `0 12px 30px rgba(0,0,0,0.6), 0 0 ${10 * p}px rgba(255, 0, 255, ${0.1 * p})`,
        border: isHovered
          ? `1px solid rgba(255, 255, 255, 0.25)`
          : `1px solid rgba(255, 255, 255, 0.1)`,
        flexShrink: 0,
        transform: isHovered
          ? 'translateY(-16px) scale(1.12)'
          : `translateY(${isActive ? '0' : '20px'})`,
        transition: isHovered
          ? 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
          : `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${vidIdx * 0.05}s`,
        zIndex: isHovered ? 50 : 1,
        cursor: 'pointer',
      }}
      onMouseEnter={() => {
        if (!window.matchMedia("(hover: none)").matches) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isYouTube ? (
        <iframe
          src={`${vid.src}?rel=0&modestbranding=1`}
          title={vid.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
            onError={(e) => console.error("Video failed to load:", vid.src, e)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={vid.src} type={vid.src?.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
            Your browser does not support this video format.
          </video>

          {/* Mute Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.9)',
              zIndex: 60,
              opacity: isHovered || window.matchMedia("(hover: none)").matches ? 1 : 0,
              transform: `scale(${isHovered || window.matchMedia("(hover: none)").matches ? 1 : 0.8})`,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              pointerEvents: isHovered || window.matchMedia("(hover: none)").matches ? 'auto' : 'none',
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/* ── Smooth Horizontal Scroll Gallery with Arrow Navigation ─────────────── */
function HorizontalScrollGallery({ 
  children, 
  maxWidth, 
  isActive = false, 
  initialScrollIndex = 0 
}: { 
  children: React.ReactNode; 
  maxWidth?: string; 
  isActive?: boolean; 
  initialScrollIndex?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const [paddingX, setPaddingX] = useState(0);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2);

    // Coverflow dynamic calculations
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const cards = el.querySelectorAll('.slider-card-wrapper');
    cards.forEach((card) => {
      const cardEl = card as HTMLElement;
      // Calculate distance from this card's center to the container's center
      const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      
      const maxDist = cardEl.clientWidth + 28; // width + gap
      const progress = Math.min(distance / maxDist, 1);
      
      // Interpolate values based on progress (0 = center, 1 = far)
      const scale = 1 - progress * 0.15;
      const blur = progress * 6;
      const brightness = 1 - progress * 0.4;
      
      cardEl.style.transform = `scale(${scale})`;
      cardEl.style.filter = `blur(${blur}px) brightness(${brightness})`;
      cardEl.style.zIndex = progress < 0.2 ? '10' : '1';
      
      // Control Video Playback: Only play if perfectly centered AND the milestone section is active
      const video = cardEl.querySelector('video');
      if (video) {
        if (progress < 0.1 && isActive) {
          if (video.paused) {
            if (cardEl.getAttribute('data-ismuted') !== 'false') {
              video.muted = true; // Auto-play safely
            }
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
            video.currentTime = 0;
          }
        }
      }

      // Control YouTube iframe autoplay: swap src to include/remove autoplay=1&mute=1
      const iframe = cardEl.querySelector('iframe');
      if (iframe) {
        const currentSrc = iframe.src;
        const baseUrl = currentSrc.split('?')[0];
        const isCentered = progress < 0.1 && isActive;
        const hasAutoplay = currentSrc.includes('autoplay=1');

        if (isCentered && !hasAutoplay) {
          // Add autoplay — muted to satisfy browser policy
          iframe.src = `${baseUrl}?rel=0&modestbranding=1&autoplay=1&mute=1`;
        } else if (!isCentered && hasAutoplay) {
          // Remove autoplay to pause the video
          iframe.src = `${baseUrl}?rel=0&modestbranding=1`;
        }
      }
    });
  }, [isActive]);

  // Force an update when vertical scroll changes the active milestone section
  useEffect(() => {
    updateScrollButtons();
  }, [isActive, updateScrollButtons]);

  // Center the initial index on mount / activation
  useEffect(() => {
    if (isActive && scrollRef.current) {
      const el = scrollRef.current;
      const timer = setTimeout(() => {
        const childrenArr = el.children;
        if (childrenArr && childrenArr[initialScrollIndex]) {
          const targetChild = childrenArr[initialScrollIndex] as HTMLElement;
          const targetScroll = targetChild.offsetLeft - el.offsetLeft - (el.clientWidth - targetChild.clientWidth) / 2;
          el.scrollLeft = Math.max(0, targetScroll);
          targetScrollRef.current = Math.max(0, targetScroll);
          updateScrollButtons();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, initialScrollIndex, updateScrollButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Delay initial check to allow layout — use multiple retries for lazy-loaded content
    const initTimer1 = setTimeout(() => updateScrollButtons(), 100);
    const initTimer2 = setTimeout(() => updateScrollButtons(), 500);
    const initTimer3 = setTimeout(() => updateScrollButtons(), 1500);

    const handleScroll = () => updateScrollButtons();
    el.addEventListener('scroll', handleScroll, { passive: true });

    // Observe resize to update arrows and padding
    const ro = new ResizeObserver(() => {
      const firstCard = el.querySelector('.slider-card-wrapper') as HTMLElement;
      if (firstCard) {
        setPaddingX(Math.max(0, (el.clientWidth - firstCard.clientWidth) / 2));
      }
      updateScrollButtons();
    });
    ro.observe(el);

    return () => {
      clearTimeout(initTimer1);
      clearTimeout(initTimer2);
      clearTimeout(initTimer3);
      el.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updateScrollButtons]);

  // Use manual animation for scrolling instead of browser smooth scroll (more reliable)
  const scrollByAmount = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -388 : 388;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, el.scrollLeft + scrollAmount));

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    targetScrollRef.current = target;

    // Temporarily disable scroll snap so it doesn't fight the animation
    el.style.scrollSnapType = 'none';

    const animate = () => {
      if (!el) return;
      const current = el.scrollLeft;
      const diff = targetScrollRef.current - current;

      if (Math.abs(diff) < 1) {
        el.scrollLeft = targetScrollRef.current;
        // Re-enable scroll snap after animation completes
        setTimeout(() => {
          if (el) el.style.scrollSnapType = 'x proximity';
        }, 50);
        updateScrollButtons();
        return;
      }

      el.scrollLeft = current + diff * 0.18;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [updateScrollButtons]);

  const handleButtonClick = useCallback((direction: 'left' | 'right') => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      scrollByAmount(direction);
    };
  }, [scrollByAmount]);

  return (
    <div 
      style={{ position: 'relative', width: '100%', maxWidth: maxWidth || '92vw', margin: '0 auto' }}
      onMouseEnter={() => {
        if (!window.matchMedia("(hover: none)").matches) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Arrow — desktop only */}
      {!isTouchDevice && (
      <button
        onClick={handleButtonClick('left')}
        style={{
          position: 'absolute',
          left: '-92px',
          top: '50%',
          transform: `translateY(-50%) scale(${canScrollLeft ? 1 : 0})`,
          width: 'clamp(36px, 8vw, 56px)',
          height: 'clamp(36px, 8vw, 56px)',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 60,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          opacity: canScrollLeft ? (isHovered ? 1 : 0.8) : 0,
          pointerEvents: canScrollLeft ? 'auto' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
        aria-label="Scroll left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%' }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      )}

      {/* Right Arrow — desktop only */}
      {!isTouchDevice && (
      <button
        onClick={handleButtonClick('right')}
        style={{
          position: 'absolute',
          right: '-92px',
          top: '50%',
          transform: `translateY(-50%) scale(${canScrollRight ? 1 : 0})`,
          width: 'clamp(36px, 8vw, 56px)',
          height: 'clamp(36px, 8vw, 56px)',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 60,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          opacity: canScrollRight ? (isHovered ? 1 : 0.8) : 0,
          pointerEvents: canScrollRight ? 'auto' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
        aria-label="Scroll right"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      )}

      <div
        ref={scrollRef}
        className="no-scrollbar timeline-gallery-scroll"
        style={{
          display: 'flex',
          gap: '28px',
          width: '100%',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingTop: 'clamp(40px, 8vw, 64px)',
          paddingBottom: 'clamp(20px, 4vw, 32px)',
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
          justifyContent: 'flex-start',
          scrollBehavior: 'auto',
          alignItems: 'center',
        }}
      >
        {children}
      </div>

    </div>
  );
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(-1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [curvesData, setCurvesData] = useState<
    { config: CurveConfig; d: string; controlPoints: { x: number; y: number }[] }[]
  >([]);

  // Hover tooltip state
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Title transitions
  const [displayedTitle, setDisplayedTitle] = useState("MY WORKS");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Journey Path States
  const [journeyPathData, setJourneyPathData] = useState<{
    d: string;
    controlPoints: { x: number; y: number }[];
  }>({ d: '', controlPoints: [] });
  const [checkpointPositions, setCheckpointPositions] = useState<{ x: number; y: number }[]>([]);
  const journeyPathRef = useRef<SVGPathElement>(null);
  const [fullScreenVideo, setFullScreenVideo] = useState<any | null>(null);

  // High performance scrolling references (no React re-renders on scroll)
  const activeMilestoneIdxRef = useRef(-1);
  const isTransitioningRef = useRef(false);
  const journeyTotalLengthRef = useRef(0);
  const triggerRef = useRef<any>(null);
  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const galleryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blurRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Snapping and Observer references removed for natural browser scrolling

  // High performance style cache to avoid DOM reads/writes thrashing
  const styleCacheRef = useRef<{
    opacity?: number[];
    transform?: string[];
    pointerEvents?: string[];
    visibility?: string[];
    blurOpacity?: number[];
    blurPointerEvents?: string[];
    blurVisibility?: string[];
    headerOpacity?: number;
  }>({});

  // Initialize style caches on mount
  useEffect(() => {
    styleCacheRef.current = {
      opacity: milestones.map(() => -1),
      transform: milestones.map(() => ''),
      pointerEvents: milestones.map(() => ''),
      visibility: milestones.map(() => ''),
      blurOpacity: milestones.map(() => -1),
      blurPointerEvents: milestones.map(() => ''),
      blurVisibility: milestones.map(() => ''),
      headerOpacity: -1,
    };
  }, []);

  // Cached paths and sampled points to prevent layout thrashing on scroll
  const journeyPathsRef = useRef<SVGPathElement[]>([]);
  const pathPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Update static checkpoint positions along the journey path + cache total length
  useEffect(() => {
    const path = journeyPathRef.current;
    if (!path) return;
    try {
      const length = path.getTotalLength();
      journeyTotalLengthRef.current = length;

      // Update path element dash attributes directly in DOM and cache path elements
      if (sectionRef.current) {
        const paths = sectionRef.current.querySelectorAll('.journey-path') as NodeListOf<SVGPathElement>;
        journeyPathsRef.current = Array.from(paths);
        paths.forEach((pathEl) => {
          pathEl.style.strokeDasharray = `${length}`;
          pathEl.style.strokeDashoffset = `${length}`;
        });
      }

      // Pre-sample points along the path for high-performance scroll tracking (eliminates getPointAtLength reflows on scroll)
      if (length > 0) {
        const samples = 200;
        const sampledPts: { x: number; y: number }[] = [];
        for (let i = 0; i <= samples; i++) {
          const pt = path.getPointAtLength((i / samples) * length);
          sampledPts.push({ x: pt.x, y: pt.y });
        }
        pathPointsRef.current = sampledPts;

        const positions = milestones.map((ms) => {
          const pt = path.getPointAtLength(ms.percentage * length);
          return { x: pt.x, y: pt.y };
        });
        setCheckpointPositions(positions);
      }
    } catch (e) {
      console.warn("Failed to calculate checkpoint positions:", e);
    }
  }, [journeyPathData]);

  // Track dimensions and regenerate curves
  useResizeObserver(graphRef, (entry) => {
    const { width, height } = entry.contentRect;
    setDimensions({ width, height });

    const curves = GRAPH_CURVES.map((config) => {
      const { d, controlPoints } = generateCurvePath(config.id, width, height);
      return { config, d, controlPoints };
    });
    setCurvesData(curves);

    // Calculate journey path
    const jp = generateJourneySpline(width, height);
    setJourneyPathData(jp);
  });

  // Apple-style Storytelling Scroll Logic (Refactored to support natural scrolling and transition-state animations)
  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;

    const STOPS = [0, 2 / 13, 6 / 13, 10 / 13, 1];
    const isTouch = window.matchMedia("(hover: none)").matches || ('ontouchstart' in window);

    // Transition galleries using clean, non-continuous GSAP tweens (prevents style thrashing on every frame)
    const transitionGalleries = (prevIdx: number, nextIdx: number) => {
      // 1. Fade out the previous active milestone
      if (prevIdx !== -1) {
        const prevGallery = galleryRefs.current[prevIdx];
        const prevBlur = blurRefs.current[prevIdx];
        
        if (prevGallery) {
          gsap.killTweensOf(prevGallery);
          prevGallery.style.pointerEvents = 'none';
          gsap.to(prevGallery, {
            opacity: 0,
            scale: 0.95,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              prevGallery.style.visibility = 'hidden';
            }
          });
        }
        if (prevBlur) {
          gsap.killTweensOf(prevBlur);
          gsap.to(prevBlur, {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              prevBlur.style.visibility = 'hidden';
            }
          });
        }
      }

      // 2. Fade in the next active milestone
      if (nextIdx !== -1) {
        const nextGallery = galleryRefs.current[nextIdx];
        const nextBlur = blurRefs.current[nextIdx];
        
        if (nextGallery) {
          gsap.killTweensOf(nextGallery);
          nextGallery.style.visibility = 'visible';
          nextGallery.style.pointerEvents = 'auto';
          gsap.to(nextGallery, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
        if (nextBlur) {
          gsap.killTweensOf(nextBlur);
          nextBlur.style.visibility = 'visible';
          gsap.to(nextBlur, {
            opacity: 0.8,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      }
    };

    // Create a native ScrollTrigger instance for scroll tracking and optional soft snapping
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      // Soft snapping: snaps to milestone points only when scrolling halts
      snap: isTouch ? undefined : {
        snapTo: STOPS,
        delay: 0.15, // 150ms delay after scroll stops to snap
        duration: { min: 0.25, max: 0.5 },
        ease: 'power2.out',
      },
      onEnter: () => {
        document.body.classList.add('timeline-active');
      },
      onEnterBack: () => {
        document.body.classList.add('timeline-active');
      },
      onLeave: () => {
        document.body.classList.remove('timeline-active');
      },
      onLeaveBack: () => {
        document.body.classList.remove('timeline-active');
      },
      onUpdate: (self) => {
        const progress = self.progress;

        // 1. Calculate active milestone index
        let newActiveIdx = -1;
        if (progress > 0.02 && progress < 0.98) {
          if (progress < 4 / 13) {
            newActiveIdx = 0;
          } else if (progress < 8 / 13) {
            newActiveIdx = 1;
          } else {
            newActiveIdx = 2;
          }
        }

        if (newActiveIdx !== activeMilestoneIdxRef.current) {
          const prevIdx = activeMilestoneIdxRef.current;
          activeMilestoneIdxRef.current = newActiveIdx;
          setActiveMilestoneIdx(newActiveIdx);
          
          // Transition galleries cleanly only on boundary change
          transitionGalleries(prevIdx, newActiveIdx);
        }

        // 2. Animate journey paths directly (guarantees correct offset even on window resize/lag)
        const drawFraction = Math.max(0, Math.min(1, progress));
        const len = journeyTotalLengthRef.current;
        const dashOffset = len * (1 - drawFraction);
        
        journeyPathsRef.current.forEach((pathEl) => {
          if (pathEl) {
            pathEl.style.strokeDashoffset = `${dashOffset}`;
          }
        });

        // 3. Animate tip particle directly (using pre-sampled points)
        const pts = pathPointsRef.current;
        if (pts.length > 0 && tipRef.current) {
          const idx = Math.max(0, Math.min(pts.length - 1, Math.round(progress * (pts.length - 1))));
          const tipPt = pts[idx];
          if (tipPt) {
            tipRef.current.setAttribute('transform', `translate(${tipPt.x}, ${tipPt.y})`);
            if (tipRef.current.style.display !== 'block') {
              tipRef.current.style.display = 'block';
            }
          }
        }

        // 4. Animate header title opacity based on progress
        if (headerTitleRef.current) {
          const fadeOutFactor = progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1;
          const targetOpacity = (isTransitioningRef.current ? 0 : 1) * fadeOutFactor;
          const cache = styleCacheRef.current;
          if (cache.headerOpacity !== targetOpacity) {
            cache.headerOpacity = targetOpacity;
            headerTitleRef.current.style.opacity = `${targetOpacity}`;
          }
        }
      }
    });

    // Populate ScrollTrigger ref for header synchronization
    triggerRef.current = trigger;

    return () => {
      trigger.kill();
      document.body.classList.remove('timeline-active');
      
      // Kill any active gallery transitions
      milestones.forEach((_, idx) => {
        const gallery = galleryRefs.current[idx];
        const blur = blurRefs.current[idx];
        if (gallery) gsap.killTweensOf(gallery);
        if (blur) gsap.killTweensOf(blur);
      });
    };
  }, [journeyPathData]);

  // Mobile timeline: no scroll pause — let users scroll naturally


  // Check milestone proximity for hover
  const handleGraphMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!graphRef.current || checkpointPositions.length === 0) return;
      const rect = graphRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Find closest milestone
      let closest: number | null = null;
      let closestDist = Infinity;

      checkpointPositions.forEach((pos, i) => {
        if (!pos) return;
        const dx = pos.x - mx;
        const dy = pos.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40 && dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      if (closest !== null) {
        const pos = checkpointPositions[closest];
        setHoveredMilestone(closest);
        setTooltipPos({ x: pos.x, y: pos.y });
      } else {
        setHoveredMilestone(null);
      }

      // Track hover point along the journey path
      if (journeyPathRef.current) {
        const path = journeyPathRef.current;
        const totalLen = path.getTotalLength();
        if (totalLen > 0) {
          let low = 0, high = totalLen;
          let bestPt = path.getPointAtLength(0);
          for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;
            const pt = path.getPointAtLength(mid);
            if (pt.x < mx) {
              low = mid;
            } else {
              high = mid;
            }
            bestPt = pt;
          }

          const dy = Math.abs(bestPt.y - my);
          if (dy < 120) {
            // setHoverCursorPos({ x: bestPt.x, y: bestPt.y });
          } else {
            // setHoverCursorPos(null);
          }
        }
      }
    },
    [checkpointPositions]
  );

  const handleGraphMouseLeave = useCallback(() => {
    setHoveredMilestone(null);
    // setHoverCursorPos(null);
  }, []);

  // Calculate target title based on proximity to milestones
  const targetTitle = activeMilestoneIdx !== -1 ? milestones[activeMilestoneIdx].label : "MY WORKS";

  // Handle title transition timing
  useEffect(() => {
    if (targetTitle !== displayedTitle) {
      setIsTransitioning(true);
      isTransitioningRef.current = true;
      const timer = setTimeout(() => {
        setDisplayedTitle(targetTitle);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
        
        // Immediately enforce correct opacity in DOM
        if (headerTitleRef.current && triggerRef.current) {
          const prog = triggerRef.current.progress;
          const fadeOutFactor = prog > 0.9 ? Math.max(0, 1 - (prog - 0.9) / 0.1) : 1;
          const targetOpacity = fadeOutFactor;
          if (styleCacheRef.current) {
            styleCacheRef.current.headerOpacity = targetOpacity;
          }
          headerTitleRef.current.style.opacity = `${targetOpacity}`;
        }
      }, 250); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [targetTitle, displayedTitle]);

  // Find currently active milestone index
  const activeMsIdx = activeMilestoneIdx;

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative"
      style={{
        height: '400vh',
        background: '#07070a',
      }}
    >
      <div
        ref={stickyRef}
        className="flex flex-col overflow-hidden"
        style={{ 
          background: '#07070a',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        {/* ── Unified Floating Header ── */}
        <div
          className="timeline-sticky-header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: '#07070a',
            padding: 'clamp(20px, 5vw, 32px) clamp(16px, 4vw, 32px) clamp(20px, 4vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h2
              ref={headerTitleRef}
              style={{
                fontFamily: 'Andreas, sans-serif',
                fontSize: 'clamp(22px, 2.5vw, 40px)',
                fontWeight: 300,
                color: 'rgba(248, 250, 252, 0.95)',
                letterSpacing: '-0.02em',
                margin: 0,
                transform: `translate3d(0, ${isTransitioning ? -8 : 0}px, 0)`,
                transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
              }}
            >
              {displayedTitle}
            </h2>
          </div>
        </div>

        {/* ── Spline Editor Container ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            margin: '0 clamp(16px, 4vw, 24px) 0',
            borderRadius: '8px 8px 0 0',
            overflow: 'clip',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: 'none',
            minHeight: 0,
          }}
        >


          {/* ── Main Editor Area (Graph) ── */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

            {/* ── Graph Area ── */}
            <div
              ref={graphRef}
              style={{
                flex: 1,
                position: 'relative',
                backgroundColor: '#07070a',
                overflow: 'visible',
                minHeight: 'auto',
              }}
              onMouseMove={handleGraphMouseMove}
              onMouseLeave={handleGraphMouseLeave}
            >
              <div 
                className="mobile-tracker"
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
              {dimensions.width > 0 && curvesData.length > 0 && (
                <svg
                  width={dimensions.width}
                  height={dimensions.height}
                  viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  }}
                >
                  {/* Grid + axes */}
                  <SplineGrid
                    width={dimensions.width}
                    height={dimensions.height}
                    activeMsIdx={activeMsIdx}
                    hoveredMsIdx={hoveredMilestone}
                  />

                  {/* ── Render secondary curves ── */}
                  {curvesData.map(({ config, d }) => (
                    <g key={config.id}>
                      <path
                        d={d}
                        fill="none"
                        stroke={config.color}
                        strokeWidth={config.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.06}
                      />
                    </g>
                  ))}

                  {/* ── Highlighted Glowing Purple Journey Path (progressive draw - Optimized without CPU-heavy filters) ── */}
                  {journeyPathData.d && (
                    <>
                      {/* 1. Glowing background path (wider stroke, opacity glow with no filters) */}
                      <path
                        className="journey-path"
                        d={journeyPathData.d}
                        fill="none"
                        stroke="#ff00ff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.12"
                      />
                      {/* 2. Bright core path */}
                      <path
                        ref={journeyPathRef}
                        className="journey-path"
                        d={journeyPathData.d}
                        fill="none"
                        stroke="#ff4dff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.65"
                      />
                      {/* 3. White highlight center sheen */}
                      <path
                        className="journey-path"
                        d={journeyPathData.d}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.15"
                      />
                      {/* 4. Glowing tip particle at the drawing front (Optimized without heavy filters) */}
                      <g ref={tipRef} style={{ pointerEvents: 'none', display: 'none' }}>
                        {/* Concentric circles of decreasing opacity to simulate glow at zero rasterization cost */}
                        <circle cx={0} cy={0} r="12" fill="rgba(255, 0, 255, 0.08)" />
                        <circle cx={0} cy={0} r="6" fill="rgba(255, 77, 255, 0.22)" />
                        <circle cx={0} cy={0} r="2.5" fill="#ffffff" />
                      </g>
                    </>
                  )}

                  {/* Milestone nodes */}
                  {checkpointPositions.length > 0 &&
                    milestones.map((ms, idx) => {
                      const pos = checkpointPositions[idx];
                      if (!pos) return null;
                      return (
                        <MilestoneNode
                          key={ms.id}
                          x={pos.x}
                          y={pos.y}
                          label={ms.label}
                          isActive={activeMilestoneIdx === idx}
                          isCompleted={activeMilestoneIdx > idx}
                          isVisible={activeMilestoneIdx !== idx}
                        />
                      );
                    })}

                  {/* Glowing cursor nodes removed */}


                </svg>
              )}

              {/* Hover tooltip */}
              <HoverTooltip
                milestone={hoveredMilestone !== null ? milestones[hoveredMilestone] : null}
                position={tooltipPos}
                containerWidth={dimensions.width}
                containerHeight={dimensions.height}
                visible={hoveredMilestone !== null}
              />

              </div> {/* End mobile-tracker wrapper */}

            </div>
          </div>

        </div>

        {/* ── Media Reveal Cards (Video Gallery) ── rendered outside overflow:clip editor */}
        {checkpointPositions.length > 0 &&
          milestones.map((ms, idx) => {
            const pos = checkpointPositions[idx];
            if (!pos || !ms.videos || ms.videos.length === 0) return null;

            const isActive = activeMilestoneIdx === idx;

            return (
              <div key={`gallery-wrapper-${ms.id}`}>
                {/* Background Blur Overlay */}
                <div 
                  ref={el => { blurRefs.current[idx] = el; }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    zIndex: 35,
                    opacity: 0,
                    pointerEvents: 'none',
                    display: 'block',
                    visibility: 'hidden',
                  }}
                />

                {/* Card Container — fixed to viewport center, offset below sticky header */}
                <div
                  ref={el => { galleryRefs.current[idx] = el; }}
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: 'calc(50% + 30px)',
                    transform: 'translate3d(-50%, -50%, 0) scale(0.95)',
                    width: '100vw',
                    maxHeight: '85vh',
                    display: 'flex',
                    visibility: 'hidden',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 40,
                    pointerEvents: 'none',
                    opacity: 0,
                    willChange: 'transform, opacity',
                    overflow: 'visible',
                  }}
                >
                  <HorizontalScrollGallery 
                    
                    maxWidth={
                      ms.videos[0]?.orientation === 'landscape'
                        ? `calc(2 * min(600px, 80vw, 46vh * 16 / 9) + 28px + 76px)`
                        : `calc(4 * min(320px, 75vw, 55vh * 9 / 16) + 3 * 28px + 76px)`
                    }
                    isActive={isActive}
                    initialScrollIndex={0}
                  >
                    {ms.videos.map((vid, vidIdx) => (
                      <div 
                        key={`vid-${ms.id}-${vidIdx}`} 
                        className="slider-card-wrapper"
                        style={{ 
                          scrollSnapAlign: 'center', 
                          flexShrink: 0,
                          willChange: 'transform, filter',
                          transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
                          position: 'relative'
                        }}
                        onClick={(e) => {
                          const cardEl = e.currentTarget;
                          const container = cardEl.parentElement;
                          if (!container) return;
                          
                          const containerCenter = container.scrollLeft + container.clientWidth / 2;
                          const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
                          const distance = Math.abs(containerCenter - cardCenter);
                          
                          // If not centered, intercept the click to scroll it to center
                          if (distance > 20) {
                            e.preventDefault();
                            e.stopPropagation();
                            container.scrollTo({ 
                              left: cardEl.offsetLeft - (container.clientWidth - cardEl.clientWidth) / 2, 
                              behavior: 'smooth' 
                            });
                          }
                        }}
                      >
                        <VideoCard
                          vid={vid}
                          vidIdx={vidIdx}
                          isActive={isActive}
                          p={isActive ? 1 : 0}
                          onFullScreen={ms.id === 1 ? () => setFullScreenVideo(vid) : undefined}
                        />
                      </div>
                    ))}
                  </HorizontalScrollGallery>
                </div>
              </div>
            );
          })}

      </div>

      {/* Full Screen Video Overlay for Long Form Content */}
      {fullScreenVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setFullScreenVideo(null)}
            style={{
              position: 'absolute',
              top: '32px',
              right: '32px',
              width: '56px',
              height: '56px',
              borderRadius: '28px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>

          <video
            src={fullScreenVideo.src}
            autoPlay
            controls
            style={{
              width: '90vw',
              height: '90vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(255,0,255,0.2)',
            }}
          />
        </div>
      )}
    </section>
  );
}
