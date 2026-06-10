import { useEffect, useRef, useState } from 'react';

interface HeroProps {
  onOpenContact: () => void;
}

// ─────────────────────────────────────────────────────────────────────────
// 🎨 HERO ANIMATION & EFFECT SETTINGS
// ─────────────────────────────────────────────────────────────────────────
const HERO_SETTINGS = {
  enableScrollZoom: true,              // Set to false to disable the zoom-in effect on scroll
  zoomSpeed: 0.00015,                  // How fast the image zooms in
  maxZoom: 1.08,                       // Maximum zoom level
  parallaxSpeed: 0.12,                 // Parallax movement speed (default: 0.12)
};

// ─────────────────────────────────────────────────────────────────────────
// 📱 MOBILE HERO LAYOUT MANUAL CONFIGURATION
// You can adjust these settings to fine-tune the mobile layout.
// ─────────────────────────────────────────────────────────────────────────
const MOBILE_SETTINGS = {
  // 1. COLORS
  backgroundColor: '#0d0d0d',          // Background color of the hero section below the card

  // 2. IMAGE CARD SIZE
  cardWidth: 'calc(100% - 32px)',      // Width of the image card container (margin is automatic)
  cardHeight: '60vh',                  // Height of the image card container

  // 3. ROUNDED CORNERS
  borderRadius: '32px',                // Rounded corner radius of the image card

  // 4. IMAGE POSITIONING / ZOOM ALIGNMENT
  imageObjectPosition: '30% center',   // Object position of the image within the card (horizontal vertical)

  // 5. LAYOUT PADDING
  paddingTop: '14px',                  // Spacing at the top of the mobile hero
  paddingBottom: '10px',               // Spacing at the bottom of the mobile hero
  paddingLeft: '12px',               // Spacing at the bottom of the mobile hero
  paddingRight: '12px',               // Spacing at the bottom of the mobile hero

};

export default function Hero({ onOpenContact }: HeroProps) {
  const bgRef = useRef<HTMLImageElement>(null);
  const [isBadgeFixed, setIsBadgeFixed] = useState(false);

  useEffect(() => {
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let rAFId: number;

    const updateTransform = () => {
      // Smoothly interpolate current scroll position towards the target scroll position
      const diff = targetScrollY - currentScrollY;
      if (Math.abs(diff) > 0.05) {
        currentScrollY += diff * 0.15; // interpolation factor: 0.15 for smooth lag-free catchup
        rAFId = requestAnimationFrame(updateTransform);
      } else {
        currentScrollY = targetScrollY;
      }

      if (!bgRef.current) return;

      // Clamp scroll to >= 0 to prevent black space on top bounce / pull-to-refresh overscroll
      const clampedScrollY = Math.max(0, currentScrollY);
      
      const zoomValue = HERO_SETTINGS.enableScrollZoom ? 1 + clampedScrollY * HERO_SETTINGS.zoomSpeed : 1;
      const clampedZoom = HERO_SETTINGS.enableScrollZoom ? Math.min(zoomValue, HERO_SETTINGS.maxZoom) : 1;
      const parallaxValue = clampedScrollY * HERO_SETTINGS.parallaxSpeed;

      // Smooth zoom and parallax update without CSS transition conflicts
      bgRef.current.style.transform = `translateY(${parallaxValue}px) scale(${clampedZoom})`;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      
      // Update badge sticky state instantly on scroll event for better responsiveness
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const triggerPoint = isMobile ? (window.innerHeight * 0.6 - 66) : (window.innerHeight - 80);
      
      if (targetScrollY > triggerPoint) {
        setIsBadgeFixed(true);
      } else {
        setIsBadgeFixed(false);
      }

      // Start loop if not already running
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(updateTransform);
    };

    // Run once on mount to set initial values
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <>
      <section
        id="hero"
      className="relative w-full h-screen min-h-[600px] overflow-hidden rounded-b-[40px]"
      style={{
        // Expose settings as CSS variables for mobile layout
        ['--mobile-bg-color' as any]: MOBILE_SETTINGS.backgroundColor,
        ['--mobile-card-width' as any]: MOBILE_SETTINGS.cardWidth,
        ['--mobile-card-height' as any]: MOBILE_SETTINGS.cardHeight,
        ['--mobile-card-radius' as any]: MOBILE_SETTINGS.borderRadius,
        ['--mobile-img-pos' as any]: MOBILE_SETTINGS.imageObjectPosition,
        ['--mobile-pad-top' as any]: MOBILE_SETTINGS.paddingTop,
        ['--mobile-pad-bottom' as any]: MOBILE_SETTINGS.paddingBottom,
      }}
    >
      <style>{`
        @keyframes liquidShimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes liquidPulse {
          0%, 100% { box-shadow: inset 0 1px 2px rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0); }
          50% { box-shadow: inset 0 1px 2px rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.3), 0 0 24px 2px rgba(255,255,255,0.12); }
        }

        /* ── Desktop: hide mobile-only layers ── */
        .hero-mobile-gradient,
        .hero-mobile-bottom {
          display: none;
        }

        /* ── Mobile-only hero styles ── */
        @media (max-width: 768px) {
          #hero {
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            background: linear-gradient(to bottom, var(--mobile-bg-color) 0%, var(--mobile-bg-color) 80%, #050505 100%) !important;
            padding-top: var(--mobile-pad-top) !important;
            padding-bottom: var(--mobile-pad-bottom) !important;
            border-radius: 0 !important;
          }

          /* Make background image a rounded card with margin on mobile */
          .hero-bg-div {
            position: relative !important;
            inset: auto !important;
            width: var(--mobile-card-width) !important;
            height: var(--mobile-card-height) !important;
            margin: 0 auto !important;
            border-radius: var(--mobile-card-radius) !important;
            overflow: hidden;
            flex-shrink: 0;
          }

          .hero-bg-img {
            object-fit: cover !important;
            object-position: var(--mobile-img-pos) !important;
          }

          /* Hide gradient since text is no longer overlaying the image */
          .hero-mobile-gradient {
            display: none !important;
          }

          /* Mobile bottom bar: flows naturally below the image card */
          .hero-mobile-bottom {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 40px 16px 0 !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
          }

          /* Hide desktop-only elements on mobile */
          .hero-hire-btn,
          .hero-badge-wrapper {
            display: none !important;
          }
        }
      `}</style>

      {/* Background Image */}
      <div className="absolute inset-0 z-0 hero-bg-div overflow-hidden">
        <img
          ref={bgRef}
          src="/hero-bg-new.webp"
          alt=""
          className="hero-bg-img w-full object-cover"
          style={{ 
            height: '112%', 
            top: '-12%', 
            left: 0,
            position: 'absolute',
            willChange: 'transform' 
          }}
        />
      </div>

      {/* ── MOBILE ONLY: Status Badge matching the screenshot style ── */}
      <div 
        className={`md:hidden ${
            isBadgeFixed
              ? 'fixed top-4 left-4 z-[9999] translate-x-0 flex items-center justify-center pointer-events-none transition-all duration-500'
              : 'absolute left-1/2 -translate-x-1/2 z-[15] flex items-center justify-center pointer-events-none transition-all duration-500'
        }`}
        style={
          isBadgeFixed 
            ? {} 
            : { top: `calc(${MOBILE_SETTINGS.paddingTop} + ${MOBILE_SETTINGS.cardHeight} - 64px)` }
        }
      >
        <div 
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
          <span className="text-white font-medium text-sm tracking-wide whitespace-nowrap">I'm Ram Maroju</span>
        </div>
      </div>

      {/* ── MOBILE ONLY: Deep bottom gradient for text contrast ── */}
      <div
        className="hero-mobile-gradient absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 25%, transparent 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)',
        }}
      />



      {/* ── MOBILE ONLY: Tagline + Hire Me at bottom ── */}
      <div
        className="hero-mobile-bottom flex-col px-6 pb-6 pt-6 items-center justify-center text-center w-full z-[2]"
      >
        {/* The main attractive text */}
        <h2 
          className="text-white text-xl font-bold tracking-tight mb-6 leading-relaxed max-w-[300px] mx-auto"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Professional <span className="liquid-text-flow bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-extrabold">editing</span> for creators, brands, and businesses.
        </h2>

        {/* Hire Me CTA */}
        <button
          className="border border-white/20 rounded-full text-white hover:bg-white/10 transition-all active:scale-95 duration-300"
          onClick={onOpenContact}
          style={{
            fontSize: '16px',
            padding: '16px 48px',
            fontWeight: 600,
            backgroundColor: '#1a1a1a',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6), 0 0 10px rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.8), 0 0 15px rgba(168, 85, 247, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6), 0 0 10px rgba(168, 85, 247, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          Hire Me
        </button>
      </div>

      {/* ── DESKTOP ONLY: Hire Me button ── */}
      <div
        className="absolute z-[4] hero-hire-btn"
        style={{ left: '48px', bottom: '56px' }}
      >
        <button
          className="liquid-glass-button relative z-10"
          onClick={onOpenContact}
        >
          Hire Me
        </button>
      </div>

      {/* ── DESKTOP ONLY: Status Badge ── */}
      <div
        className={
          `hero-badge-wrapper ` + (
            isBadgeFixed
              ? 'fixed z-[9999] top-[30px] left-[30px] translate-x-0 flex items-center justify-center pointer-events-none transition-all duration-500'
              : 'absolute z-[4] left-1/2 -translate-x-1/2 bottom-[56px] flex items-center justify-center pointer-events-none transition-all duration-500'
          )
        }
      >
        <div
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.005)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '2px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="relative flex items-center justify-center w-2.5 h-2.5 ml-0.5">
            <div className="absolute w-full h-full bg-green-500 rounded-full opacity-50 animate-ping hero-badge-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-2.5 h-2.5 bg-[#4ade80] rounded-full" style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }} />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-wide pr-1" style={{ letterSpacing: '0.01em' }}>
            I'm Ram Maroju
          </span>
        </div>
      </div>

      </section>

      {/* ── DESKTOP ONLY: Tagline full line below hero ── */}
      <div className="hidden md:flex w-full justify-center items-center pt-24 pb-8 px-8 z-10 relative">
        <h2 
          className="text-white text-3xl lg:text-4xl font-bold tracking-tight text-center w-full"
          style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)', lineHeight: '1.4' }}
        >
          Professional <span className="liquid-text-flow bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-extrabold">editing</span> for creators, brands, and businesses.
        </h2>
      </div>
    </>
  );
}
