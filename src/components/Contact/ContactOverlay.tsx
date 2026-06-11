import { useState, useEffect, useRef } from 'react';
import { gsap } from '../../hooks/useGSAP';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  "Instagram Reels",
  "YouTube Shorts / TikTok",
  "YouTube Video (Long Form)",
  "Documentary / Vlog",
  "Motion Graphics / VFX",
  "Promo / Commercial Video",
  "Other"
];

export default function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Instagram Reels',
    budget: '',
    message: '',
    _honey: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'needs_activation' | 'error'>('idle');

  // Custom Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Spotlight & Parallax states
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle body scroll locking (Bulletproof for iOS/Mobile)
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock the body physically in place
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Store the scroll position on the body dataset so we can retrieve it
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      // Retrieve scroll position
      const scrollY = document.body.dataset.scrollY;

      // Remove locks
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0'));
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // GSAP animations for entrance and exit of container content
  useEffect(() => {
    if (!containerRef.current) return;

    if (isOpen) {
      // Scale and fade in container content
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'power4.out', delay: 0.1 }
      );

      // Stagger animate left and right column children
      const leftItems = containerRef.current.querySelectorAll('.animate-left');
      const rightItems = containerRef.current.querySelectorAll('.animate-right');
      const titleWords = containerRef.current.querySelectorAll('.animate-title-word');

      gsap.fromTo(
        leftItems,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(
        titleWords,
        { y: 25, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power4.out', delay: 0.15 }
      );

      gsap.fromTo(
        rightItems,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formStatus === 'loading') return;
    if (formData._honey) {
      setFormStatus('success');
      return;
    }

    setFormStatus('loading');

    try {
      const response = await fetch('https://formsubmit.co/ajax/rmaroju0@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          'Project Type': formData.projectType,
          Budget: formData.budget,
          'Project Details': formData.message,
          _subject: `New Project Inquiry from ${formData.name}`,
        }),
      });

      const data = await response.json();

      if (data.success === 'true' || data.success === true) {
        // Genuine success — email delivered
        setFormStatus('success');
        setFormData({ name: '', email: '', projectType: 'Instagram Reels', budget: '', message: '', _honey: '' });
        setTimeout(() => {
          onClose();
          setTimeout(() => setFormStatus('idle'), 500);
        }, 3000);
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        // FormSubmit sent activation email to rmaroju0@gmail.com
        setFormStatus('needs_activation');
        setTimeout(() => setFormStatus('idle'), 8000);
      } else {
        // Some other error
        console.error('FormSubmit error:', data);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="block md:flex md:items-center md:justify-center"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(11, 11, 12, 0.96)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Background Soft Orbs with Mouse Parallax */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          left: '10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '10%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close contact section"
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          zIndex: 10,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'rotate(90deg) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main Content Card Container */}
      <div
        ref={containerRef}
        className="w-full max-w-[1200px] mx-auto mt-0 md:my-auto pt-28 pb-12 px-6 md:px-10 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">

          {/* Left Column - Contact Details */}
          <div className="flex flex-col gap-8 text-left">

            {/* Tagline */}
            <div className="animate-left flex items-center gap-2">
              <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em' }}>
                // Get In Touch
              </span>
            </div>

            {/* Main Title with word-by-word reveal */}
            <h2
              className="font-extrabold text-white leading-tight"
              style={{
                fontSize: 'clamp(36px, 4.5vw, 56px)',
                letterSpacing: '-0.03em',
                overflow: 'hidden',
              }}
            >
              {"LET’S CONNECT & COLLABORATE".split(" ").map((word, idx) => (
                <span
                  key={idx}
                  className="animate-title-word"
                  style={{
                    display: 'inline-block',
                    marginRight: '0.25em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>

            {/* Description */}
            <p
              className="animate-left leading-relaxed"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: 'clamp(15px, 1.2vw, 17px)',
                maxWidth: '480px',
              }}
            >
              Have a project in mind? Let’s make it happen! Drop us a message, and we’ll connect with you soon.
            </p>

            {/* Social Links Row */}
            <div className="animate-left flex flex-wrap gap-x-6 gap-y-3 items-center mt-2">
              {[
                { name: 'Twitter (X)', url: 'https://twitter.com' },
                { name: 'LinkedIn', url: 'https://linkedin.com/in/ram-maroju' },
                { name: 'GitHub', url: 'https://github.com/rameshmaroju' },
                { name: 'CodePen', url: 'https://codepen.io' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-medium transition-colors duration-300"
                  style={{ color: 'rgba(255, 255, 255, 0.55)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)'}
                >
                  <span style={{ color: '#a78bfa', marginRight: '4px', fontWeight: 'bold' }}>/</span>
                  {social.name}
                </a>
              ))}
            </div>

            {/* Contact Actions */}
            <div className="animate-left flex flex-col gap-4 mt-6 border-t border-white/5 pt-8">
              {/* Book a Meeting */}
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors duration-300 w-fit"
                style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                Book a Meeting
              </a>

              {/* Directly Email */}
              <a
                href="mailto:rmaroju0@gmail.com"
                className="flex items-center gap-3 transition-colors duration-300 w-fit"
                style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                rmaroju0@gmail.com
              </a>
            </div>

          </div>

          {/* Right Column - Contact Form */}
          <div className="animate-right">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: '#0a0a0c',
                background: isHovered
                  ? `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.09), transparent 80%), #0a0a0c`
                  : '#0a0a0c',
                border: isHovered
                  ? '1px solid rgba(139, 92, 246, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: 'clamp(16px, 4vw, 40px)',
                width: '100%',
                transition: 'border-color 0.4s ease, background 0.1s ease, box-shadow 0.4s ease',
                boxShadow: isHovered
                  ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(139, 92, 246, 0.04)'
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full text-left">
                {/* Spam Honeypot */}
                <input
                  type="text"
                  name="_honey"
                  value={formData._honey}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />

                {/* Name Input */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="name" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                    style={{
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(139, 92, 246, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="email" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                    style={{
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(139, 92, 246, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Project Type Dropdown */}
                <div className="flex flex-col gap-2.5" ref={dropdownRef} style={{ position: 'relative', zIndex: isDropdownOpen ? 30 : 1 }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                    Project Type
                  </label>
                  <div style={{ position: 'relative', width: '100%', zIndex: isDropdownOpen ? 30 : 1 }}>
                    {/* Trigger Button */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (formStatus !== 'loading') {
                          setIsDropdownOpen(!isDropdownOpen);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (formStatus !== 'loading' && (e.key === 'Enter' || e.key === ' ')) {
                          setIsDropdownOpen(!isDropdownOpen);
                        }
                      }}
                      style={{
                        backgroundColor: '#050507',
                        border: isDropdownOpen
                          ? '1px solid rgba(139, 92, 246, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isDropdownOpen
                          ? '0 0 16px rgba(139, 92, 246, 0.06)'
                          : 'none',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        color: '#ffffff',
                        fontSize: '15px',
                        cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        userSelect: 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span>{formData.projectType}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {/* Dropdown Options List */}
                    {isDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          left: 0,
                          right: 0,
                          backgroundColor: '#121215',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.85), 0 0 16px rgba(139, 92, 246, 0.04)',
                          zIndex: 50,
                          maxHeight: '280px',
                          overflowY: 'auto',
                          padding: '6px',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          animation: 'slideDownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        }}
                      >
                        {PROJECT_TYPES.map((type) => {
                          const isSelected = formData.projectType === type;
                          return (
                            <div
                              key={type}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, projectType: type }));
                                setIsDropdownOpen(false);
                              }}
                              style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                                fontSize: '14.5px',
                                fontWeight: isSelected ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                                border: isSelected ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid transparent',
                                margin: '2px 0',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                                  e.currentTarget.style.color = '#ffffff';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                                }
                              }}
                            >
                              {type}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget Input */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="budget" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                    Budget
                  </label>
                  <input
                    id="budget"
                    type="text"
                    name="budget"
                    required
                    placeholder="Example: $100 - $300"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                    style={{
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(139, 92, 246, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Project Details Input */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="message" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                    style={{
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(139, 92, 246, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="liquid-glass-button"
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                    gap: '10px',
                  }}
                >
                  {formStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" style={{ width: '20px', height: '20px' }}>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Project Inquiry'
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Status Notification toasts */}
      {formStatus === 'success' && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(25, 25, 27, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            zIndex: 100,
            animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          Message sent successfully
        </div>
      )}

      {formStatus === 'needs_activation' && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(25, 25, 27, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '12px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            zIndex: 100,
            animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          Activation email sent! Check your inbox to activate the form.
        </div>
      )}

      {formStatus === 'error' && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(25, 25, 27, 0.85)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            zIndex: 100,
            animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          Failed to send message. Please try again.
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
