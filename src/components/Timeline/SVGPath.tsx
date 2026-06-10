import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';

interface SVGPathProps {
  d: string;
  color: string;
  width: number;
  opacity: number;
  glowColor?: string;
  glowSize?: number;
  revealProgress?: number;
  animated?: boolean;
  isPrimary?: boolean;
}

/**
 * Ultra-premium SVG path with triple-layer neon glow, animated pulse,
 * and progressive reveal via stroke-dashoffset.
 */
const SVGPath = forwardRef<SVGPathElement, SVGPathProps>(
  (
    {
      d,
      color,
      width,
      opacity,
      glowColor,
      glowSize = 0,
      revealProgress,
      animated = false,
      isPrimary = false,
    },
    ref
  ) => {
    const pathRef = useRef<SVGPathElement>(null);
    const pulseRef = useRef<SVGPathElement>(null);
    const filterId = useRef(`glow-${Math.random().toString(36).slice(2, 8)}`);
    const filterMidId = useRef(`glow-mid-${Math.random().toString(36).slice(2, 8)}`);
    const filterOuterId = useRef(`glow-outer-${Math.random().toString(36).slice(2, 8)}`);
    const shimmerGradId = useRef(`shimmer-${Math.random().toString(36).slice(2, 8)}`);

    // Forward the ref
    useImperativeHandle(ref, () => pathRef.current!, []);

    // Handle progressive reveal
    useEffect(() => {
      const path = pathRef.current;
      if (!path || revealProgress === undefined) return;

      const totalLength = path.getTotalLength();
      path.style.strokeDasharray = `${totalLength}`;
      path.style.strokeDashoffset = `${totalLength * (1 - revealProgress)}`;
    }, [revealProgress, d]);

    // Animated pulse — bright dot traveling along path
    useEffect(() => {
      if (!isPrimary || !pulseRef.current || !pathRef.current) return;

      const path = pathRef.current;
      const pulse = pulseRef.current;
      const totalLength = path.getTotalLength();

      pulse.style.strokeDasharray = `20 ${totalLength}`;
      pulse.style.strokeDashoffset = `${totalLength}`;

      // CSS animation for smooth travel
      pulse.style.animation = `pulse-travel 4s linear infinite`;
    }, [isPrimary, d]);

    const totalLen = pathRef.current?.getTotalLength() ?? 0;

    return (
      <>
        {/* ── Glow filters ── */}
        {isPrimary && (
          <defs>
            {/* Inner sharp glow */}
            <filter id={filterId.current} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            {/* Mid bloom */}
            <filter id={filterMidId.current} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
            {/* Outer wide glow */}
            <filter id={filterOuterId.current} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
            </filter>
            {/* Shimmer gradient */}
            <linearGradient id={shimmerGradId.current} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="40%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="60%" stopColor={color} stopOpacity="0" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-500 0;1500 0"
                dur="5s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
        )}

        {glowSize > 0 && !isPrimary && (
          <defs>
            <filter id={filterId.current} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={glowSize / 2} />
            </filter>
          </defs>
        )}

        {/* ── Triple glow layers (primary only) ── */}
        {isPrimary && revealProgress !== undefined && (
          <>
            {/* Outer wide glow */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={width + 16}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.06}
              filter={`url(#${filterOuterId.current})`}
              style={{
                strokeDasharray: totalLen > 0 ? `${totalLen}` : '0',
                strokeDashoffset: totalLen > 0 ? `${totalLen * (1 - revealProgress)}` : '0',
              }}
            />

            {/* Mid bloom */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={width + 8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.12}
              filter={`url(#${filterMidId.current})`}
              style={{
                strokeDasharray: totalLen > 0 ? `${totalLen}` : '0',
                strokeDashoffset: totalLen > 0 ? `${totalLen * (1 - revealProgress)}` : '0',
              }}
            />

            {/* Inner sharp glow */}
            <path
              d={d}
              fill="none"
              stroke={glowColor || color}
              strokeWidth={width + 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={opacity * 0.35}
              filter={`url(#${filterId.current})`}
              style={{
                strokeDasharray: totalLen > 0 ? `${totalLen}` : '0',
                strokeDashoffset: totalLen > 0 ? `${totalLen * (1 - revealProgress)}` : '0',
              }}
            />
          </>
        )}

        {/* Single glow for non-primary */}
        {!isPrimary && glowSize > 0 && revealProgress !== undefined && (
          <path
            d={d}
            fill="none"
            stroke={glowColor || color}
            strokeWidth={width + 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={opacity * 0.3}
            filter={`url(#${filterId.current})`}
            style={
              revealProgress !== undefined
                ? {
                    strokeDasharray:
                      pathRef.current
                        ? `${pathRef.current.getTotalLength()}`
                        : '0',
                    strokeDashoffset:
                      pathRef.current
                        ? `${pathRef.current.getTotalLength() * (1 - revealProgress)}`
                        : '0',
                  }
                : undefined
            }
          />
        )}

        {/* ── Main path ── */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
          className={animated ? 'transition-none' : ''}
        />

        {/* ── Shimmer overlay (primary only) ── */}
        {isPrimary && revealProgress !== undefined && (
          <path
            d={d}
            fill="none"
            stroke={`url(#${shimmerGradId.current})`}
            strokeWidth={width + 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
            style={{
              strokeDasharray: totalLen > 0 ? `${totalLen}` : '0',
              strokeDashoffset: totalLen > 0 ? `${totalLen * (1 - revealProgress)}` : '0',
            }}
          />
        )}

        {/* ── Animated pulse dot (primary only) ── */}
        {isPrimary && (
          <path
            ref={pulseRef}
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={width - 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
            style={{
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </>
    );
  }
);

SVGPath.displayName = 'SVGPath';

export default SVGPath;
