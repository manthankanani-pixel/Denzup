import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialsSlider from '../components/TestimonialsSlider';
import WhatsAppFloat from '../components/WhatsAppFloat';
import BookingModal from '../components/BookingModal';

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderFade, setPreloaderFade] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Dance Classes (Free Trial)');

  useEffect(() => {
    if (location.state && location.state.openBooking) {
      setSelectedService(location.state.openBooking);
      setIsBookingOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPreloaderFade(true);
      const timer2 = setTimeout(() => {
        setShowPreloader(false);
      }, 1000);
      return () => clearTimeout(timer2);
    }, 1600);
    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (showPreloader) return;

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
  }, [showPreloader]);

  const openBookingModal = (serviceName) => {
    setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative">
      {/* Preloader */}
      {showPreloader && (
        <div
          id="preloader"
          className={`position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-black transition-all duration-1000 ${
            preloaderFade ? 'fade-out' : ''
          }`}
          style={{ zIndex: 2000 }}>
          <div className="d-flex flex-column align-items-center justify-content-center position-relative">
            <div className="position-relative mb-4 d-flex align-items-center justify-content-center" style={{ width: '108px', height: '108px' }}>
              <div
                className="position-absolute start-0 top-0 w-100 h-100 rounded-circle border border-2 border-brand-gold border-opacity-10 border-top-brand-gold spinner-border"
                style={{ animationDuration: '1.5s' }}></div>
              <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-lg" style={{ width: '84px', height: '84px', zIndex: 1 }}>
                <img src="/danzup-logo.png" className="w-100 h-100 rounded-circle p-2" style={{ objectFit: 'contain' }} alt="Danzup Preloader" />
              </div>
            </div>
            <h2 className="font-serif tracking-widest text-gold-gradient text-uppercase small font-weight-bold animate-pulse">Danzup Studio</h2>
          </div>
        </div>
      )}

      <Navbar onOpenBooking={openBookingModal} />

      {/* Hero Section */}
      <section
        id="hero"
        className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-70 z-1"></div>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient z-1" style={{ background: 'linear-gradient(to top, var(--brand-dark), transparent, var(--brand-dark))' }}></div>
          <img
            src="https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop"
            className="w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.4 }}
            alt="Hero Background"
          />
        </div>

        <div
          className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
          style={{
            backgroundImage: "url('/danzup-logo.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'min(70vw, 450px)',
            opacity: 0.08,
            filter: 'invert(1)',
            mixBlendMode: 'screen',
            zIndex: 1
          }}></div>

        <div className="position-relative z-2 text-center px-3 max-w-5xl mx-auto mt-5">
          <p className="text-brand-gold text-uppercase tracking-widest mb-3 small font-weight-bold hero-fade-in active">
            Premium Dance Academy
          </p>
          <h1 className="display-2 font-serif font-weight-bold mb-4 leading-tight text-white hero-fade-in active">
            Dance Beyond <br /> <span className="text-gold-gradient font-serif italic">Limits</span>
          </h1>
          <p className="h4 text-light mb-5 font-sans font-weight-light hero-fade-in active">
            Transform Your Passion Into Performance
          </p>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center hero-fade-in active font-sans">
            <button
              onClick={() => navigate('/classes')}
              className="btn btn-gold py-3 px-5 text-uppercase tracking-wider font-weight-bold rounded-1 border border-brand-gold">
              JOIN CLASSES
            </button>
            <button
              onClick={() => openBookingModal('Dance Classes (Free Trial)')}
              className="btn btn-outline-white py-3 px-5 text-uppercase tracking-wider font-weight-bold rounded-1 border border-white-30">
              BOOK FREE TRIAL
            </button>
          </div>
        </div>
      </section>


      {/* Highlights / Welcome Intro */}
      <section className="py-5 bg-brand-secondary border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6 reveal reveal-left position-relative">
              <div
                className="position-absolute border border-brand-gold border-opacity-20 rounded"
                style={{ top: '-15px', left: '-15px', width: '100%', height: '100%', zIndex: 0 }}></div>
              <img
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
                className="img-fluid rounded shadow-lg about-image-glow"
                style={{ position: 'relative', zIndex: 1 }}
                alt="About Danzup Highlights"
              />
            </div>
            <div className="col-12 col-lg-6 reveal reveal-right font-sans">
              <p className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-3">Welcome to Danzup</p>
              <h2 className="display-5 font-serif font-weight-bold mb-4 text-white">
                Step Into the world of <span className="text-brand-gold font-serif">Dance & Fitness</span>
              </h2>
              <p className="text-white-50 mb-4 leading-relaxed fs-6">
                We believe that movement is self-expression, joy, and confidence. Danzup Studio offers state-of-the-art training spaces, elite choreographers, and tailored programs for every age and skill level.
              </p>
              <div className="d-flex gap-3">
                <button
                  onClick={() => navigate('/about')}
                  className="btn btn-gold py-3 px-4 font-weight-bold rounded-1 border border-brand-gold">
                  LEARN MORE ABOUT US
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5 bg-brand-dark border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">What Students Say</h2>
          </div>
          <div className="reveal">
            <TestimonialsSlider testimonials={[
              { text: '"Danzup Studio transformed my wedding dance. The choreography was seamless and our guests are still talking about it!"', author: 'Priya & Rahul' },
              { text: '"Best Garba classes in the city. The energy during Navratri is unmatched. Highly recommended!"', author: 'Arjun Patel' },
              { text: '"The yoga sessions here helped me find my balance again. Beautiful studio and very supportive instructors."', author: 'Smit Dudhat' },
              { text: '"The wedding choreography packages are absolute value for money. They personalized our steps and made us feel so confident!"', author: 'Sneha & Amit' },
              { text: '"Great atmosphere, top-tier audio systems, and trainers who actually care about your progress. Best dance studio in Surat!"', author: 'Karan Patel' },
              { text: '"Absolutely love this place! The yoga sessions are serene, and the Zumba batches are incredibly high-energy. The perfect place for dance and fitness."', author: 'Riddhi Desai' }
            ]} />
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