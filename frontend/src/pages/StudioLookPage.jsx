import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function StudioLookPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Dance Classes (Free Trial)');

  useEffect(() => {
    // Setup reveal on scroll
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 100;
      const reveals = document.querySelectorAll('.reveal');

      reveals.forEach((reveal) => {
        if (reveal.offsetParent === null) {
          reveal.classList.remove('active');
          return;
        }

        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  const openBookingModal = (serviceName) => {
    setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative">
      <Navbar />

      {/* Studio Look Section */}
      <section id="institute-look" className="py-5 bg-brand-dark position-relative overflow-hidden">
        <div className="position-absolute rounded-circle pointer-events-none" style={{ top: '20%', left: '20%', width: '400px', height: '400px', backgroundColor: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)' }}></div>
        <div className="position-absolute rounded-circle pointer-events-none" style={{ bottom: '20%', right: '20%', width: '400px', height: '400px', backgroundColor: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)' }}></div>

        <div className="container py-5 px-4 px-md-5 position-relative z-1">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6 reveal reveal-left font-sans">
              <p className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-3">Experience the Energy</p>
              <h2 className="display-5 font-serif font-weight-bold mb-4 text-white">
                Institute <span className="text-gold-gradient font-serif">Look & Feel</span>
              </h2>
              <p className="text-white-50 mb-4 leading-relaxed">
                Step inside the state-of-the-art training space at Danzup Studio. Designed to inspire creativity, energy, and excellence, our studio features premium lighting, professional wooden flooring, and a vibrant community.
              </p>
              <p className="text-white-50 mb-4 leading-relaxed">
                Watch our featured video to see our dancers in action and get a feel for the energetic environment where passion meets performance.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => openBookingModal('Dance Classes')}
                  className="btn btn-gold py-3.5 px-4 font-weight-bold rounded-1 btn-luxury border border-brand-gold">
                  BOOK A VISIT
                </button>
                <a
                  href="https://www.instagram.com/danzup_studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-white py-3.5 px-4 font-weight-bold rounded-1 d-flex align-items-center gap-2 border border-white-30">
                  <i className="fab fa-instagram text-brand-gold"></i> FOLLOW US
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-6 reveal reveal-right d-flex justify-content-center">
              <div className="position-relative w-100" style={{ maxWidth: '380px' }}>
                <div className="position-absolute border border-brand-gold border-opacity-10 rounded-4" style={{ top: '-15px', right: '-15px', width: '100%', height: '100%', zIndex: 0 }}></div>
                <div className="glass-panel p-3 rounded-4 position-relative z-1 shadow-lg w-100">
                  <div className="ratio ratio-9x16 overflow-hidden rounded-3 bg-black" style={{ height: '520px' }}>
                    <iframe
                      className="border-0 w-100"
                      src="https://www.instagram.com/reel/DLumHCMBSdB/embed"
                      scrolling="no"
                      allowtransparency="true"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      style={{ position: 'absolute', top: '-54px', height: 'calc(100% + 175px)' }}>
                    </iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
}
