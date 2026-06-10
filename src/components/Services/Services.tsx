import { useState } from 'react';

const servicesList = [
  {
    id: 1,
    title: 'Video Editing',
    description: 'Crafting engaging narratives through precise cuts, pacing, and dynamic storytelling techniques to keep audiences hooked.',
    icon: <img src="/images/edit icon.jpg" alt="Video Editing" className="service-img" />,
    color: 'rgba(139, 92, 246, 0.5)', // Violet
    bgImage: '/images/edit.jpeg'
  },
  {
    id: 2,
    title: 'Motion Graphics',
    description: 'Elevating production value with custom animations, kinetic typography, and seamless visual effects that pop.',
    icon: <img src="/images/motion graphic icon.jpg" alt="Motion Graphics" className="service-img" />,
    color: 'rgba(6, 182, 212, 0.5)', // Cyan
    bgImage: '/images/motion graphic.jpeg'
  },
  {
    id: 3,
    title: 'Color Grading',
    description: 'Enhancing the mood and aesthetic with professional color correction, creating a cinematic look and feel.',
    icon: <img src="/images/color icon.jpg" alt="Color Grading" className="service-img" />,
    color: 'rgba(234, 179, 8, 0.5)', // Yellow
    bgImage: '/images/color.jpeg'
  },
  {
    id: 4,
    title: 'Sound Design',
    description: 'Comprehensive audio mixing, sound design, and final delivery preparation for a polished, professional result.',
    icon: <img src="/images/sound icon.jpg" alt="Sound Design" className="service-img" />,
    color: 'rgba(217, 119, 6, 0.5)', // Amber
    bgImage: '/images/sound.jpeg'
  }
];

const additionalServicesList = [
  {
    id: 5,
    title: 'Captions',
    description: 'Accurate and engaging subtitles to make your content accessible and boost viewer retention.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="service-img">
        <rect width="100" height="100" fill="#2B2D31" />
        <path d="M15 25 C15 19.477 19.477 15 25 15 L75 15 C80.523 15 85 19.477 85 25 L85 60 C85 65.523 80.523 70 75 70 L60 70 L50 85 L40 70 L25 70 C19.477 70 15 65.523 15 60 L15 25 Z" stroke="white" strokeWidth="6" strokeLinejoin="round"/>
        <rect x="20" y="38" width="8" height="6" fill="white"/>
        <rect x="34" y="38" width="20" height="6" fill="white"/>
        <rect x="60" y="38" width="20" height="6" fill="white"/>
        <rect x="20" y="52" width="16" height="6" fill="white"/>
        <rect x="42" y="52" width="16" height="6" fill="white"/>
        <rect x="64" y="52" width="16" height="6" fill="white"/>
      </svg>
    ),
    color: 'rgba(236, 72, 153, 0.5)', // Pink
    bgImage: '/images/captions.jpeg'
  },
  {
    id: 6,
    title: 'Chroma Keying',
    description: 'Flawless green screen removal and background replacement to place subjects anywhere imaginable.',
    icon: <img src="/images/chroma key icon.png" alt="Chroma Keying" className="service-img" />,
    color: 'rgba(16, 185, 129, 0.5)', // Emerald
    bgImage: '/images/chroma keying.jpg'
  },
  {
    id: 7,
    title: 'VFX',
    description: 'Stunning visual effects that blend seamlessly into your footage, adding visual flair.',
    icon: <img src="/images/vfx logo.jpg" alt="VFX" className="service-img" />,
    color: 'rgba(249, 115, 22, 0.5)', // Orange
    bgImage: '/images/vfx.jpeg'
  }
];

export default function Services() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="services" className="services-section">
      {/* Cinematic Background Images */}
      <div className="services-cinematic-bg-container">
        {[...servicesList, ...additionalServicesList].map(service => (
          <div
            key={`bg-${service.id}`}
            className={`services-cinematic-bg ${hoveredId === service.id ? 'active' : ''}`}
            style={{ backgroundImage: `url('${service.bgImage}')` }}
          />
        ))}
        {/* Dark overlay to ensure text readability */}
        <div className={`services-cinematic-overlay ${hoveredId ? 'active' : ''}`} />
      </div>

      {/* Decorative Background Elements */}
      <div className={`services-bg-orb services-bg-orb--primary ${hoveredId ? 'dimmed' : ''}`} />
      <div className={`services-bg-orb services-bg-orb--secondary ${hoveredId ? 'dimmed' : ''}`} />

      <div className="services-container">
        <div className="services-header">
          <h2 className="services-heading" style={{ fontFamily: 'Andreas, sans-serif' }}>
            My <span style={{ color: 'rgba(139, 92, 246, 1)' }}>Services</span>
          </h2>
          <div className="services-underline" />
          <p className="services-description">
            I specialize in turning raw footage into compelling stories. From tight cuts to cinematic color grading, I provide end-to-end post-production solutions.
          </p>
        </div>

        {/* First 4 layout design (Vertical Cards) */}
        <div className="services-grid">
          {servicesList.map((service) => (
            <div 
              key={service.id}
              className={`service-card ${hoveredId === service.id ? 'active' : ''}`}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                '--service-color': service.color
              } as React.CSSProperties}
            >
              <div className="service-icon-wrapper" style={{ boxShadow: hoveredId === service.id ? `0 0 20px ${service.color}` : 'none' }}>
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              
              {/* Dynamic Glow Effect */}
              <div 
                className="service-glow"
                style={{
                  background: `radial-gradient(circle at center, ${service.color} 0%, transparent 70%)`,
                  opacity: hoveredId === service.id ? 0.15 : 0
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom 3 layout design (Horizontal Cards) */}
        <div className="services-horizontal-grid">
          {additionalServicesList.map((service) => (
            <div 
              key={service.id}
              className={`service-card-horizontal ${hoveredId === service.id ? 'active' : ''}`}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                '--service-color': service.color
              } as React.CSSProperties}
            >
              <div className="service-icon-wrapper" style={{ boxShadow: hoveredId === service.id ? `0 0 20px ${service.color}` : 'none' }}>
                {service.icon}
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
              </div>
              
              {/* Dynamic Glow Effect */}
              <div 
                className="service-glow"
                style={{
                  background: `radial-gradient(circle at center, ${service.color} 0%, transparent 70%)`,
                  opacity: hoveredId === service.id ? 0.15 : 0
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
