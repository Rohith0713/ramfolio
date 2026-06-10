import { useRef, useEffect } from 'react';
import { gsap } from '../../hooks/useGSAP';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/rameshmaroju',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rameshmaroju',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:rmaroju0@gmail.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
  },
];

interface ContactProps {
  onOpenContact?: () => void;
}

export default function Contact({ onOpenContact }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });

      if (cardsRef.current) {
        // Direct animation — section is near bottom of page so ScrollTrigger
        // may not fire reliably; delay ensures smooth entrance when scrolled into view
        gsap.from(cardsRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 100%',
            toggleActions: 'play none none none',
            onEnter: () => {
              gsap.to(cardsRef.current!.children, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
              });
            },
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-bg-secondary py-20 lg:py-28 overflow-hidden"
    >
      {/* Top blend */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-8 text-center">
        <div ref={headingRef}>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-accent-violet">
            Get in Touch
          </span>
          <h2 className="text-[clamp(32px,4vw,48px)] font-bold text-text-primary mt-2" style={{ fontFamily: 'Andreas, sans-serif' }}>
            Let's Connect
          </h2>
          <p className="text-text-secondary mt-4 max-w-[500px] mx-auto leading-relaxed">
            I'm always open to new opportunities, collaborations, or just a friendly conversation
            about technology and security.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl px-7 py-5 flex items-center gap-4
                hover:-translate-y-1 cursor-pointer transition-all duration-300"
              style={{
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <span className="text-text-muted group-hover:text-accent-violet-light transition-colors duration-300">
                {link.icon}
              </span>
              <div className="text-left">
                <span className="text-sm font-semibold text-text-primary block">
                  {link.label}
                </span>
                <span className="text-xs text-text-muted">
                  {link.label === 'Email' ? 'Send a message' : `View ${link.label}`}
                </span>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-auto text-text-muted group-hover:text-accent-violet-light
                  group-hover:translate-x-1 transition-all duration-300"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button
            onClick={() => {
              if (onOpenContact) {
                onOpenContact();
              } else {
                window.location.href = 'mailto:rmaroju0@gmail.com';
              }
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-[15px]
              text-white gradient-violet cursor-pointer
              shadow-[0_4px_24px_rgba(139,92,246,0.35)]
              hover:shadow-[0_8px_40px_rgba(139,92,246,0.5)]
              hover:-translate-y-0.5
              transition-all duration-300 border-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
            Say Hello
          </button>
        </div>
      </div>
    </section>
  );
}
