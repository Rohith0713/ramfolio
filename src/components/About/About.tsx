import { useRef, useEffect } from 'react';
import { gsap } from '../../hooks/useGSAP';
import SkillCard from './SkillCard';
import { skills } from '../../data/skills';


export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

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

    }, sectionRef);

    return () => ctx.revert();
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
              <iframe
                src="https://www.youtube.com/embed/bhP-_oKE3P0?rel=0&modestbranding=1"
                title="About Me Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
