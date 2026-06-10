import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Timeline from './components/Timeline/Timeline';
import Services from './components/Services/Services';
import Footer from './components/Footer';
import ContactOverlay from './components/Contact/ContactOverlay';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);

  return (
    <div className="grain-overlay">
      {/* Premium Top Blur Line */}
      <div 
        className="fixed top-0 left-0 w-full h-24 z-[60] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(7, 7, 10, 0.6) 0%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
        }}
      />
      <Navbar onOpenContact={openContact} />
      <main>
        <Hero onOpenContact={openContact} />
        <About />
        <Timeline />
        <Services />
      </main>
      <Footer />
      <ContactOverlay isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
}
