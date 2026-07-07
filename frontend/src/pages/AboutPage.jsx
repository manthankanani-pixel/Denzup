import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCounter from '../components/StatCounter';
import BookingModal from '../components/BookingModal';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Dance Classes (Free Trial)');

  useEffect(() => {
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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    const maxRotate = 10;
    const rotateX = -yc * maxRotate;
    const rotateY = xc * maxRotate;

    const isScale105 = card.classList.contains('scale-105-default');
    const hoverScale = isScale105 ? 1.07 : 1.02;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(${hoverScale})`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.2)`;
    card.style.transition = 'none';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const isScale105 = card.classList.contains('scale-105-default');
    const defaultScale = isScale105 ? 'scale(1.05)' : 'scale(1)';

    card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0) ${defaultScale}`;
    card.style.boxShadow = '';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative">
      <Navbar />

      {/* About Section */}
      <section id="about" className="py-5 bg-brand-dark">
        <div className="container py-5 px-4 px-md-5">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6 reveal reveal-left position-relative">
              <div
                className="position-absolute border border-brand-gold border-opacity-20 rounded"
                style={{ top: '-15px', left: '-15px', width: '100%', height: '100%', zIndex: 0 }}>
              </div>
              <img
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
                className="img-fluid rounded shadow-lg about-image-glow"
                style={{ position: 'relative', zIndex: 1 }}
                alt="About Danzup" />

              <div
                className="position-absolute glass-panel p-4 rounded d-none d-md-block"
                style={{ bottom: '-30px', right: '-15px', zIndex: 2 }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="h2 font-serif font-weight-bold text-brand-gold mb-0">5+</div>
                  <div className="small text-uppercase tracking-wider text-white-50" style={{ fontSize: '10px' }}>
                    Years of<br />Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 reveal reveal-right font-sans">
              <h2 className="display-5 font-serif font-weight-bold mb-4 text-white">
                About Danzup <span className="text-brand-gold font-serif">Studio</span>
              </h2>
              <p className="text-white-50 mb-4 leading-relaxed fs-6">
                At Danzup Studio, we believe dance is more than movement—it is confidence, expression, discipline, and joy. Our mission is to create an inspiring environment where students of all ages can learn, grow, and perform.
              </p>
              <div className="row g-4">
                <div className="col-6 d-flex align-items-start gap-2">
                  <i className="fas fa-check-circle text-brand-gold mt-1"></i>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Certified Instructors</h4>
                    <p className="small text-white-50 mb-0" style={{ fontSize: '11px' }}>Expert guidance</p>
                  </div>
                </div>
                <div className="col-6 d-flex align-items-start gap-2">
                  <i className="fas fa-check-circle text-brand-gold mt-1"></i>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Personal Coaching</h4>
                    <p className="small text-white-50 mb-0" style={{ fontSize: '11px' }}>Tailored to you</p>
                  </div>
                </div>
                <div className="col-6 d-flex align-items-start gap-2">
                  <i className="fas fa-check-circle text-brand-gold mt-1"></i>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Stage Experience</h4>
                    <p className="small text-white-50 mb-0" style={{ fontSize: '11px' }}>Live performances</p>
                  </div>
                </div>
                <div className="col-6 d-flex align-items-start gap-2">
                  <i className="fas fa-check-circle text-brand-gold mt-1"></i>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Premium Ambience</h4>
                    <p className="small text-white-50 mb-0" style={{ fontSize: '11px' }}>World-class studio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="team" className="py-5 bg-brand-secondary border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">
              Meet Our <span className="text-brand-gold font-serif">Founders & Trainers</span>
            </h2>
            <p className="text-white-50 max-w-2xl mx-auto font-sans">
              The visionary leaders and elite choreographers driving the movement at Danzup Studio.
            </p>
          </div>
          <div className="row g-4 justify-content-center max-w-4xl mx-auto font-sans">
            <div className="col-12 col-md-6">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal reveal-left tilt-3d d-flex flex-column align-items-center h-100 trainer-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <div
                  className="rounded-circle overflow-hidden mb-4 border border-2 border-brand-gold border-opacity-30 shadow-lg trainer-card-image-wrapper"
                  style={{ width: '192px', height: '192px' }}>
                  <img src="/hardik.png" className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Hardik Chodvadiya" />
                </div>
                <h3 className="h4 font-serif font-weight-bold text-white mb-1 trainer-card-title">Hardik Chodvadiya</h3>
                <p className="text-brand-gold text-xs font-weight-bold text-uppercase tracking-wider mb-3">
                  Studio Owner & Lead Trainer
                </p>
                <p className="small text-white-50 leading-relaxed mb-4" style={{ maxWidth: '280px' }}>
                  Founder of Danzup Studio, leading choreography with passion, style, and a vision to make premium dance education accessible to everyone.
                </p>
                <div className="trainer-socials mt-auto d-flex gap-3 justify-content-center">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal reveal-right tilt-3d d-flex flex-column align-items-center h-100 trainer-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <div
                  className="rounded-circle overflow-hidden mb-4 border border-2 border-brand-gold border-opacity-30 shadow-lg trainer-card-image-wrapper"
                  style={{ width: '192px', height: '192px' }}>
                  <img src="/akash.png" className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Akash Tank" />
                </div>
                <h3 className="h4 font-serif font-weight-bold text-white mb-1 trainer-card-title">Akash Tank</h3>
                <p className="text-brand-gold text-xs font-weight-bold text-uppercase tracking-wider mb-3">
                  Studio Owner & Lead Trainer
                </p>
                <p className="small text-white-50 leading-relaxed mb-4" style={{ maxWidth: '280px' }}>
                  Co-founder and master instructor, specializing in high-energy choreography, fitness dance, and building stage confidence in students.
                </p>
                <div className="trainer-socials mt-auto d-flex gap-3 justify-content-center">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="trainer-social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose" className="py-5 bg-brand-dark border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Why Choose Us</h2>
            <p className="text-white-50">We create leaders, not just dancers.</p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-user-tie', title: 'Experienced Trainers', text: 'Certified industry experts' },
              { icon: 'fa-building', title: 'Professional Studio', text: 'Premium infrastructure' },
              { icon: 'fa-calendar-check', title: 'Flexible Timings', text: 'Batches that fit you' },
              { icon: 'fa-medal', title: 'Community', text: 'Events and workshops' }].
              map((item, idx) =>
                <div className="col-6 col-md-3 text-center" key={idx}>
                  <div className="glass-panel p-4 reveal h-100 border-0 bg-opacity-25">
                    <i className={`fas ${item.icon} fs-2 text-brand-gold mb-3`}></i>
                    <h4 className="h6 text-white font-weight-bold mb-1">{item.title}</h4>
                    <p className="small text-white-50 mb-0" style={{ fontSize: '11px' }}>{item.text}</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-5 bg-brand-dark border-top border-white border-opacity-5">
        <div className="container py-4 px-4 px-md-5 font-sans">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3 reveal">
              <div className="display-4 font-weight-bold text-brand-gold mb-1">
                <StatCounter endValue={1000} />+
              </div>
              <div className="small text-white-50 text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Students Trained</div>
            </div>
            <div className="col-6 col-md-3 reveal">
              <div className="display-4 font-weight-bold text-brand-gold mb-1">
                <StatCounter endValue={200} />+
              </div>
              <div className="small text-white-50 text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Wedding Projects</div>
            </div>
            <div className="col-6 col-md-3 reveal">
              <div className="display-4 font-weight-bold text-brand-gold mb-1">
                <StatCounter endValue={50} />+
              </div>
              <div className="small text-white-50 text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Events Organized</div>
            </div>
            <div className="col-6 col-md-3 reveal">
              <div className="display-4 font-weight-bold text-brand-gold mb-1">
                <StatCounter endValue={4.6} isFloat={true} />
              </div>
              <div className="small text-white-50 text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Star Rating</div>
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
