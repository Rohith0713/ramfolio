
const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://youtube.com/@ram_maroju',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    )
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ram_maroju',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ram-maroju',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  },
  {
    name: 'Fiverr',
    url: 'https://www.fiverr.com/s/5rYB5B4',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 6h-2c-1.5 0-2.5 1-2.5 2.5V21" />
        <path d="M6 11h9.5" />
        <path d="M16 11.5V21" />
        <circle cx="16" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer id="contact" style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#07070a',
      borderTop: 'none',
      overflow: 'hidden',
      padding: '120px 0 40px',
      zIndex: 10,
    }}>
      {/* ── Cyberpunk Scrolling Waves & Transition Zone ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        {/* Layered Shadow Overlay 1: Dark slots/vignettes at the top and bottom edges of the transition zone */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #07070a 0%, rgba(7,7,10,0) 30%, rgba(7,7,10,0) 70%, #07070a 100%)',
          zIndex: 4,
        }} />

        {/* Layered Shadow Overlay 2: Soft vignette around the center area */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(7, 7, 10, 0.85) 100%)',
          zIndex: 3,
        }} />

        {/* Low Saturated Ambient Lighting Glows */}
        <div
          className="animate-neon-pulse"
          style={{
            position: 'absolute',
            top: '50%',
            left: '25%',
            width: '600px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(103, 157, 172, 0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 1,
          }}
        />
        <div
          className="animate-neon-pulse-reverse"
          style={{
            position: 'absolute',
            top: '50%',
            left: '75%',
            width: '600px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(195, 130, 150, 0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 1,
          }}
        />
        <div
          className="animate-neon-pulse"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '500px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(148, 140, 185, 0.07) 0%, transparent 70%)',
            filter: 'blur(45px)',
            zIndex: 2,
          }}
        />

        {/* Wave Layer 1 (Left Scrolling) - Muted colors */}
        <div className="animate-scroll-left" style={{ position: 'absolute', inset: 0, height: '100%', zIndex: 3 }}>
          <svg width="50%" height="100%" viewBox="0 0 1440 240" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="cyberGradMuted1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(103, 157, 172, 0)" />
                <stop offset="30%" stopColor="rgba(103, 157, 172, 0.15)" />
                <stop offset="70%" stopColor="rgba(148, 140, 185, 0.15)" />
                <stop offset="100%" stopColor="rgba(148, 140, 185, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0,120 Q 360,70 720,120 T 1440,120 L 1440,240 L 0,240 Z"
              fill="url(#cyberGradMuted1)"
              opacity="0.12"
            />
            <path
              d="M 0,120 Q 360,70 720,120 T 1440,120"
              fill="none"
              stroke="url(#cyberGradMuted1)"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 4px rgba(103, 157, 172, 0.3))' }}
            />
          </svg>
          <svg width="50%" height="100%" viewBox="0 0 1440 240" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
            <path
              d="M 0,120 Q 360,70 720,120 T 1440,120 L 1440,240 L 0,240 Z"
              fill="url(#cyberGradMuted1)"
              opacity="0.12"
            />
            <path
              d="M 0,120 Q 360,70 720,120 T 1440,120"
              fill="none"
              stroke="url(#cyberGradMuted1)"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 4px rgba(103, 157, 172, 0.3))' }}
            />
          </svg>
        </div>

        {/* Wave Layer 2 (Right Scrolling) - Muted colors */}
        <div className="animate-scroll-right" style={{ position: 'absolute', inset: 0, height: '100%', zIndex: 3 }}>
          <svg width="50%" height="100%" viewBox="0 0 1440 240" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="cyberGradMuted2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(195, 130, 150, 0)" />
                <stop offset="35%" stopColor="rgba(195, 130, 150, 0.1)" />
                <stop offset="65%" stopColor="rgba(103, 157, 172, 0.1)" />
                <stop offset="100%" stopColor="rgba(103, 157, 172, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0,120 Q 360,170 720,120 T 1440,120 L 1440,240 L 0,240 Z"
              fill="url(#cyberGradMuted2)"
              opacity="0.1"
            />
            <path
              d="M 0,120 Q 360,170 720,120 T 1440,120"
              fill="none"
              stroke="url(#cyberGradMuted2)"
              strokeWidth="1.2"
              style={{ filter: 'drop-shadow(0 0 3px rgba(195, 130, 150, 0.25))' }}
            />
          </svg>
          <svg width="50%" height="100%" viewBox="0 0 1440 240" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
            <path
              d="M 0,120 Q 360,170 720,120 T 1440,120 L 1440,240 L 0,240 Z"
              fill="url(#cyberGradMuted2)"
              opacity="0.1"
            />
            <path
              d="M 0,120 Q 360,170 720,120 T 1440,120"
              fill="none"
              stroke="url(#cyberGradMuted2)"
              strokeWidth="1.2"
              style={{ filter: 'drop-shadow(0 0 3px rgba(195, 130, 150, 0.25))' }}
            />
          </svg>
        </div>
      </div>

      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(255,0,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 32px)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '60px',
      }}>

        {/* Let's Connect Glassmorphic Card */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          padding: 'clamp(32px, 8vw, 60px) clamp(20px, 5vw, 40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 50px rgba(255, 0, 255, 0.03), inset 0 0 20px rgba(255, 255, 255, 0.01)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle neon gradient top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 0, 255, 0.4), rgba(0, 242, 254, 0.4), transparent)',
          }} />

          {/* Top Text / Logo Area */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Andreas, sans-serif',
              fontSize: '44px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Let's Connect
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '16px',
              maxWidth: '460px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}>
              I'm always open to new opportunities, collaborations, or just a friendly conversation about video editing, post-production, and storytelling.
            </p>
          </div>

          {/* Social Links Grid */}
          <div style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 20px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-button"
                style={{
                  gap: '12px',
                  padding: 'clamp(12px, 3vw, 14px) clamp(20px, 5vw, 32px)',
                  fontSize: 'clamp(13px, 3vw, 15px)',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        }} />

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-1px'
          }}>
            <span style={{ color: 'rgba(255, 0, 255, 0.8)' }}></span>
          </span>
          <span style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            © {new Date().getFullYear()} Ram Maroju. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
