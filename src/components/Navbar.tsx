import { useState } from 'react';

interface NavbarProps {
  onOpenContact: () => void;
}

// ─────────────────────────────────────────────────────────────────────────
// 📱 MOBILE MENU LAYOUT MANUAL CONFIGURATION
// You can adjust these settings to fine-tune the mobile navigation menu.
// ─────────────────────────────────────────────────────────────────────────
const MOBILE_NAV_SETTINGS = {
  // 1. POSITIONING
  top: '16px',                         // Distance from top of the screen on mobile
  right: '16px',                       // Distance from right of the screen on mobile

  // 2. CLOSED STATE (The circular menu button)
  closedWidth: '52px',                 // Width of the closed menu button
  closedHeight: '52px',                // Height of the closed menu button
  closedBorderRadius: '50px',          // Rounded corner radius when closed
  closedBgColor: 'rgba(255, 255, 255, 0.005)', // Background color of the closed menu
  closedBorderColor: 'rgba(255, 255, 255, 0.08)', // Border color when closed

  // 3. OPENED STATE (The expanded menu card)
  openWidth: '190px',                  // Width of the expanded menu
  openMaxHeight: '600px',              // Maximum height of the expanded menu
  openBorderRadius: '24px',            // Rounded corner radius of the open card
  openBgColor: 'rgba(255, 255, 255, 0.005)', // Background color when open
  openBorderColor: 'rgba(255, 255, 255, 0.08)', // Border color when open

  // 4. ICON
  iconStrokeColor: '#ffffff',          // Color of the hamburger/close menu icon lines
};

export default function Navbar({ onOpenContact }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        /* ── Wrapper ── */
        .nav-wrapper {
          position: fixed;
          top: 30px;
          right: 30px;
          width: 260px;
          z-index: 9999; /* Keeps it above other website content */
        }

        /* ── The pill / card container ── */
        .nav-pill {
          background-color: rgba(255, 255, 255, 0.005);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 2px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04);
          border-radius: 50px;
          overflow: hidden;
          width: 260px;

          /* animate height */
          max-height: 68px;
          transition:
            max-height 0.4s cubic-bezier(0.77, 0, 0.175, 1) 0.25s,
            border-radius 0.4s cubic-bezier(0.77, 0, 0.175, 1) 0.25s;
        }

        .nav-pill.open {
          max-height: 600px;
          border-radius: 28px;
          transition:
            max-height 0.55s cubic-bezier(0.77, 0, 0.175, 1) 0s,
            border-radius 0.45s cubic-bezier(0.77, 0, 0.175, 1) 0s;
        }

        /* ── Top bar (always visible) ── */
        .nav-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 10px 10px 20px; /* Aligned left padding to 20px grid */
          height: 68px;
          flex-shrink: 0;
        }

        .nav-brand {
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.3px;
          user-select: none;
          display: inline-flex;
          align-items: center;
          height: 48px; /* Matches toggle button height for perfect vertical centering */
          line-height: 1;
        }

        .nav-pill.open .nav-brand {
          /* Just let it be naturally centered in its box */
        }

        /* ── Toggle button ── */
        .nav-toggle {
          position: relative;
          width: 48px;
          height: 48px;
          background-color: rgba(255, 255, 255, 0.005);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04);
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease-in-out;
        }

        .nav-toggle:active { 
          transform: translateY(0.5px);
          box-shadow: inset 5px 5px 12px rgba(0, 0, 0, 0.6), inset -5px -5px 12px rgba(255, 255, 255, 0.05);
        }
        .nav-toggle:hover { 
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.04), 2px 2px 5px rgba(0, 0, 0, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.02);
        }

        /* Seamless menu icon animation */
        .icon-menu-toggle {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 24px;
          height: 24px;
          stroke: var(--nav-mobile-icon-stroke, #fff);
        }

        .menu-line-top, .menu-line-mid, .menu-line-bot {
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.77,0,0.175,1), opacity 0.3s ease;
        }

        .nav-pill.open .menu-line-top {
          transform: translateY(5px) rotate(45deg);
        }

        .nav-pill.open .menu-line-mid {
          opacity: 0;
          transform: scaleX(0);
        }

        .nav-pill.open .menu-line-bot {
          transform: translateY(-5px) rotate(-45deg);
        }

        /* ── Links section ── */
        .nav-links {
          padding: 6px 0 10px 20px; /* Aligned padding-left to 20px grid */
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        .nav-links a {
          display: block;
          color: #fff;
          text-decoration: none;
          font-size: 22px;
          font-weight: 700;
          padding: 12px 0;
          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }

        /* closing staggered hide */
        .nav-links a:nth-child(1) { transition-delay: 0.15s; }
        .nav-links a:nth-child(2) { transition-delay: 0.12s; }
        .nav-links a:nth-child(3) { transition-delay: 0.09s; }
        .nav-links a:nth-child(4) { transition-delay: 0.06s; }
        .nav-links a:nth-child(5) { transition-delay: 0.03s; }
        .nav-links a:nth-child(6) { transition-delay: 0.0s; }

        /* opening staggered reveal */
        .nav-pill.open .nav-links a:nth-child(1) { opacity:1; transform:translateY(0); transition-delay: 0.08s; }
        .nav-pill.open .nav-links a:nth-child(2) { opacity:1; transform:translateY(0); transition-delay: 0.13s; }
        .nav-pill.open .nav-links a:nth-child(3) { opacity:1; transform:translateY(0); transition-delay: 0.18s; }
        .nav-pill.open .nav-links a:nth-child(4) { opacity:1; transform:translateY(0); transition-delay: 0.23s; }
        .nav-pill.open .nav-links a:nth-child(5) { opacity:1; transform:translateY(0); transition-delay: 0.28s; }
        .nav-pill.open .nav-links a:nth-child(6) { opacity:1; transform:translateY(0); transition-delay: 0.33s; }

        .nav-links a:hover { opacity: 0.75 !important; }

        /* ── CTA button ── */
        .nav-cta {
          margin: 10px 20px 20px 20px; /* Symmetrical margins (20px left and right) */
          background-color: rgba(255, 255, 255, 0.005);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04);
          color: #ffffff;
          border-radius: 50px;
          padding: 16px 28px;
          font-size: 20px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          width: calc(100% - 40px); /* 40px subtraction for exact symmetry */
          text-align: center;

          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 0.25s ease 0s,
            transform 0.25s ease 0s,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease;
        }

        .nav-pill.open .nav-cta {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.35s ease 0.35s, transform 0.35s ease 0.35s;
        }

        .nav-cta:hover { 
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.04), 2px 2px 5px rgba(0, 0, 0, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.02);
        }
        .nav-cta:active { 
          transform: scale(0.97) translateY(0);
          box-shadow: inset 5px 5px 12px rgba(0, 0, 0, 0.6), inset -5px -5px 12px rgba(255, 255, 255, 0.05);
        }

        /* ── Mobile: icon-only when closed (≤768px) ── */
        @media (max-width: 768px) {
          .nav-wrapper {
            top: var(--nav-mobile-top) !important;
            right: var(--nav-mobile-right) !important;
            left: auto !important;
            width: auto !important;
            display: flex !important;
            justify-content: flex-end !important;
          }

          /* Collapsed: glass style */
          .nav-pill {
            width: var(--nav-mobile-closed-width) !important;
            max-height: var(--nav-mobile-closed-height) !important;
            border-radius: var(--nav-mobile-closed-radius) !important;
            background-color: var(--nav-mobile-closed-bg) !important;
            border: 2px solid var(--nav-mobile-closed-border) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            transition:
              width 0.4s cubic-bezier(0.77, 0, 0.175, 1) 0.25s,
              max-height 0.4s cubic-bezier(0.77, 0, 0.175, 1) 0.25s,
              border-radius 0.4s cubic-bezier(0.77, 0, 0.175, 1) 0.25s,
              background-color 0.3s ease,
              border 0.3s ease,
              box-shadow 0.3s ease;
          }

          /* Remove default browser tap highlight circle/box and any active tap blinking animations */
          .nav-pill,
          .nav-toggle,
          .nav-toggle * {
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
          }

          /* Remove inner toggle styling when collapsed so we don't have double borders */
          .nav-pill:not(.open) .nav-toggle {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }

          /* Prevent active/hover shadow/transform blinking on mobile */
          .nav-toggle:active,
          .nav-toggle:hover,
          .nav-pill:not(.open) .nav-toggle:active,
          .nav-pill:not(.open) .nav-toggle:hover {
            transform: none !important;
            box-shadow: none !important;
            border-color: transparent !important;
            background: transparent !important;
          }

          /* Open: expand to full width and revert to normal pill style */
          .nav-pill.open {
            width: var(--nav-mobile-open-width) !important;
            max-height: var(--nav-mobile-open-max-height) !important;
            border-radius: var(--nav-mobile-open-radius) !important;
            background-color: var(--nav-mobile-open-bg) !important;
            border: 2px solid var(--nav-mobile-open-border) !important;
            box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04) !important;
          }

          /* Top bar: only shows toggle when closed */
          .nav-top {
            padding: 0 !important;
            height: 48px !important;
            width: 100% !important;
            justify-content: space-between !important;
            align-items: center !important;
            transition: none !important; /* No layout transitions! This prevents jumping */
          }

          .nav-pill.open {
            transition:
              width 0.45s cubic-bezier(0.77, 0, 0.175, 1) 0s,
              max-height 0.55s cubic-bezier(0.77, 0, 0.175, 1) 0s,
              border-radius 0.45s cubic-bezier(0.77, 0, 0.175, 1) 0s;
          }

          .nav-pill.open .nav-top {
            padding: 0 0 0 16px !important; /* Only left padding to position the 'menu' text */
            height: 48px !important;
            transition: none !important;
          }

          /* Hide "menu" text when closed */
          .nav-brand {
            opacity: 0;
            width: 0;
            overflow: hidden;
            font-size: 24px !important; /* Increased font size */
            align-self: center; /* Default vertical alignment */
            transition: opacity 0.3s ease 0s, width 0.3s ease 0s, align-self 0.3s ease, padding-top 0.3s ease;
          }

          /* Show "menu" text when open */
          .nav-pill.open .nav-brand {
            opacity: 1;
            width: auto;
            transition: opacity 0.3s ease 0.15s, width 0.3s ease 0s, align-self 0.3s ease, padding-top 0.3s ease;
            padding-left: 0 !important; /* Relying on nav-top padding instead */
            align-self: flex-start; /* Move to top */
            padding-top: 14px; /* Space from top edge */
          }

          /* Toggle button sizing */
          .nav-toggle {
            width: 48px !important;
            height: 48px !important;
          }

          .nav-links a {
            font-size: 18px !important;
            padding: 8px 0 !important;
          }

          .nav-links {
            padding-left: 16px !important; /* Symmetrical links alignment */
          }

          .nav-cta {
            font-size: 15px !important;
            padding: 12px 16px !important;
            margin: 10px 16px 20px 16px !important; /* Compact margins */
            width: calc(100% - 32px) !important; /* Aligned width */
          }
        }
      `}</style>

      <div 
        className="nav-wrapper"
        style={{
          // Expose settings as CSS variables for mobile layout
          ['--nav-mobile-top' as any]: MOBILE_NAV_SETTINGS.top,
          ['--nav-mobile-right' as any]: MOBILE_NAV_SETTINGS.right,
          ['--nav-mobile-closed-width' as any]: MOBILE_NAV_SETTINGS.closedWidth,
          ['--nav-mobile-closed-height' as any]: MOBILE_NAV_SETTINGS.closedHeight,
          ['--nav-mobile-closed-radius' as any]: MOBILE_NAV_SETTINGS.closedBorderRadius,
          ['--nav-mobile-closed-bg' as any]: MOBILE_NAV_SETTINGS.closedBgColor,
          ['--nav-mobile-closed-border' as any]: MOBILE_NAV_SETTINGS.closedBorderColor,
          ['--nav-mobile-open-width' as any]: MOBILE_NAV_SETTINGS.openWidth,
          ['--nav-mobile-open-max-height' as any]: MOBILE_NAV_SETTINGS.openMaxHeight,
          ['--nav-mobile-open-radius' as any]: MOBILE_NAV_SETTINGS.openBorderRadius,
          ['--nav-mobile-open-bg' as any]: MOBILE_NAV_SETTINGS.openBgColor,
          ['--nav-mobile-open-border' as any]: MOBILE_NAV_SETTINGS.openBorderColor,
          ['--nav-mobile-icon-stroke' as any]: MOBILE_NAV_SETTINGS.iconStrokeColor,
        }}
      >
        <div className={`nav-pill ${isOpen ? 'open' : ''}`} id="navPill">
          {/* Top bar */}
          <div className="nav-top">
            <span className="nav-brand">menu</span>
            <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <svg className="icon-menu-toggle" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round">
                <line className="menu-line-top" x1="4" y1="7" x2="20" y2="7"/>
                <line className="menu-line-mid" x1="4" y1="12" x2="20" y2="12"/>
                <line className="menu-line-bot" x1="4" y1="17" x2="20" y2="17"/>
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="nav-links">
            <a href="#hero" onClick={() => setIsOpen(false)}>home</a>
            <a href="#about" onClick={() => setIsOpen(false)}>about</a>
            <a href="#timeline" onClick={() => setIsOpen(false)}>my works</a>
            <a href="#services" onClick={() => setIsOpen(false)}>my services</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>contact</a>
          </nav>

          {/* CTA */}
          <button className="nav-cta" onClick={() => { setIsOpen(false); onOpenContact(); }}>hire me</button>
        </div>
      </div>
    </>
  );
}
