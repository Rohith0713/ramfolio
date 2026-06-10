import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useGSAP';
import SkillCard from './SkillCard';
import { skills } from '../../data/skills';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoElRef.current) {
      videoElRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // GSAP scroll-triggered animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(descRef.current, {
        x: -35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (skillsRef.current) {
        gsap.from(skillsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      gsap.from(videoWrapperRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Handle video based on section visibility
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          if (videoElRef.current) {
            videoElRef.current.play().catch(() => {});
            setIsVideoPlaying(true);
          }
        },
        onLeave: () => {
          if (videoElRef.current) {
            videoElRef.current.pause();
            setIsVideoPlaying(false);
          }
        },
        onEnterBack: () => {
          if (videoElRef.current) {
            videoElRef.current.play().catch(() => {});
            setIsVideoPlaying(true);
          }
        },
        onLeaveBack: () => {
          if (videoElRef.current) {
            videoElRef.current.pause();
            setIsVideoPlaying(false);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Video play/pause toggle
  const toggleVideo = useCallback(() => {
    const vid = videoElRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsVideoPlaying(true);
    } else {
      vid.pause();
      setIsVideoPlaying(false);
    }
  }, []);
  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative overflow-hidden z-10"
    >


      <div className="about-container">
        {/* ─── Left Column: Content ─── */}
        <div className="about-content">
          <div ref={headingRef}>
            <h2 className="about-heading" style={{ fontFamily: 'Andreas, sans-serif' }}>About Me</h2>
            <div className="about-underline" />
          </div>

          <p ref={descRef} className="about-description">
            I don't just edit videos — I shape stories. Every cut, transition, and
            frame is a deliberate choice made to keep your audience engaged and your
            message clear. From high-energy social reels to polished brand films, I
            bring raw footage to life with a sharp eye for pacing, rhythm, and visual
            flow. I work with creators, brands, and businesses who care about quality
            — and want content that actually connects.
          </p>

          <div ref={skillsRef} className="about-features">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>

        {/* ─── Right Column: Video ─── */}
        <div ref={videoWrapperRef} className="about-video-wrapper">
          <div className="about-video-card">
            <div className="about-video-glow" />

            <div className="about-video-inner">
              <video
                ref={videoElRef}
                className="about-video"
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                src="/videos/1000080727.mp4"
              >
                Your browser does not support the video tag.
              </video>

              {/* Edge fade overlay */}
              <div className="about-video-overlay" />

              {/* Mute/Unmute control */}
              <button
                className="about-video-control"
                style={{ right: '60px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 010 14.14" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                  </svg>
                )}
              </button>

              {/* Play/Pause control */}
              <button
                id="about-video-toggle"
                className="about-video-control"
                onClick={toggleVideo}
                aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
              >
                {isVideoPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
