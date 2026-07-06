import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function CelebrationsPage() {
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

      {/* Wedding Showcase Section */}
      <section id="showcase" className="py-5 bg-brand-primary">
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Wedding Showcase</h2>
            <p className="text-white-50 max-w-2xl mx-auto">Creating magical moments for your special day.</p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div
                className="reveal reveal-left overflow-hidden position-relative rounded shadow-lg"
                style={{ height: '320px', cursor: 'pointer' }}
                onClick={() => openBookingModal('Wedding Choreography')}>
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2074&auto=format&fit=crop"
                  className="w-100 h-100 image-zoom transition"
                  style={{ objectFit: 'cover' }}
                  alt="Sangeet" />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex align-items-center justify-content-center opacity-hover transition">
                  <span className="text-brand-gold font-serif h4 border border-brand-gold px-4 py-2 bg-black bg-opacity-50">Sangeet</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div
                className="reveal reveal-right overflow-hidden position-relative rounded shadow-lg"
                style={{ height: '320px', cursor: 'pointer' }}
                onClick={() => openBookingModal('Wedding Choreography')}>
                <img
                  src="https://images.unsplash.com/photo-1591604419794-5c32ddc19c1d?q=80&w=2070&auto=format&fit=crop"
                  className="w-100 h-100 image-zoom transition"
                  style={{ objectFit: 'cover' }}
                  alt="Family Dance" />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex align-items-center justify-content-center opacity-hover transition">
                  <span className="text-brand-gold font-serif h4 border border-brand-gold px-4 py-2 bg-black bg-opacity-50">Family Dance</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center reveal">
            <button
              onClick={() => openBookingModal('Wedding Choreography')}
              className="btn btn-outline-brand-gold py-3 px-5 btn-luxury border border-brand-gold text-brand-gold font-weight-bold">
              PLAN YOUR WEDDING
            </button>
          </div>
        </div>
      </section>

      {/* Garba Section */}
      <section id="garba" className="py-5 bg-brand-secondary position-relative overflow-hidden border-top border-white border-opacity-5">
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}>
        </div>
        <div className="container py-5 px-4 px-md-5 position-relative z-1 font-sans">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6 reveal reveal-left">
              <h2 className="display-5 font-serif font-weight-bold mb-4 text-white">
                The Ultimate <span className="text-gold-gradient font-serif">Garba</span> Experience
              </h2>
              <p className="text-white-50 mb-4 leading-relaxed">
                Learn authentic Garba techniques and modern choreography from experienced instructors. From beginner steps to Navratri final stages.
              </p>
              <ul className="list-unstyled mb-4 space-y-2">
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-circle text-brand-gold" style={{ fontSize: '8px' }}></i>
                  <span>Beginner Batch (Fundamentals)</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-circle text-brand-gold" style={{ fontSize: '8px' }}></i>
                  <span>Intermediate Batch (Raas & Garba)</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-circle text-brand-gold" style={{ fontSize: '8px' }}></i>
                  <span>Advanced Batch (Navratri Prep)</span>
                </li>
              </ul>
              <button
                onClick={() => openBookingModal('Garba Classes')}
                className="btn btn-gold py-3 px-5 font-weight-bold rounded-1 btn-luxury">
                JOIN GARBA CAMP
              </button>
            </div>
            <div className="col-12 col-lg-6 reveal reveal-right">
              <div className="row g-3">
                <div className="col-6 mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1601050690117-5f6e9dcfd0ed?q=80&w=1974&auto=format&fit=crop"
                    className="img-fluid rounded shadow"
                    style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                    alt="Garba 1" />
                </div>
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1552056768-6b2fcIObf1f7?q=80&w=1973&auto=format&fit=crop"
                    className="img-fluid rounded shadow"
                    style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                    alt="Garba 2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Day Celebrations Section */}
      <section id="theme-days" className="py-5 bg-brand-primary position-relative overflow-hidden border-top border-white border-opacity-5">
        <div className="position-absolute rounded-circle pointer-events-none" style={{ top: '25%', right: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)' }}></div>

        <div className="container py-5 px-4 px-md-5 position-relative z-1 font-sans">
          <div className="text-center mb-5 reveal">
            <p className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-3">Our Studio Vibe</p>
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">
              Theme Day <span className="text-gold-gradient font-serif">Celebrations</span>
            </h2>
            <p className="text-white-50 max-w-2xl mx-auto">
              At Danzup Studio, we celebrate creativity, color, and unity. Explore our high-energy Theme Day celebrations where passion meets styling.
            </p>
          </div>

          <div className="row g-5 justify-content-center max-w-4xl mx-auto">
            <div className="col-12 col-md-6 reveal reveal-left d-flex flex-column align-items-center">
              <div className="glass-panel p-3 rounded-4 shadow-lg w-100" style={{ maxWidth: '380px' }}>
                <div className="ratio ratio-9x16 overflow-hidden rounded-3 bg-black" style={{ height: '520px' }}>
                  <iframe
                    className="border-0 w-100"
                    src="https://www.instagram.com/reel/DMhiSWoILHe/embed"
                    scrolling="no"
                    allowtransparency="true"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    style={{ position: 'absolute', top: '-54px', height: 'calc(100% + 175px)' }}>
                  </iframe>
                </div>
              </div>
              <div className="text-center mt-4 px-2">
                <h3 className="h4 text-white mb-2">Black Day Celebration</h3>
                <p className="small text-white-50 max-w-xs mx-auto">
                  Unity, strength, and class. Experiencing the ultimate choreography vibes in coordinated black outfits.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 reveal reveal-right d-flex flex-column align-items-center">
              <div className="glass-panel p-3 rounded-4 shadow-lg w-100" style={{ maxWidth: '380px' }}>
                <div className="ratio ratio-9x16 overflow-hidden rounded-3 bg-black" style={{ height: '520px' }}>
                  <iframe
                    className="border-0 w-100"
                    src="https://www.instagram.com/reel/DMz-CViIxti/embed"
                    scrolling="no"
                    allowtransparency="true"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    style={{ position: 'absolute', top: '-54px', height: 'calc(100% + 175px)' }}>
                  </iframe>
                </div>
              </div>
              <div className="text-center mt-4 px-2">
                <h3 className="h4 text-white mb-2">Red Day Celebration</h3>
                <p className="small text-white-50 max-w-xs mx-auto">
                  Red vibes, red attire, and red-hot energy. Celebrating passion, movement, and synchronized styles.
                </p>
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
