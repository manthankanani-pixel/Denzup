import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function ClassesPage() {
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

      {/* Classes Section */}
      <section id="classes" className="py-5 bg-brand-primary">
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Our Classes</h2>
            <p className="text-white-50 max-w-2xl mx-auto">Curated programs for every skill level.</p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-ring', title: 'Wedding Choreography', text: 'Customized choreography for couples and families. Sangeet, Mehendi, Reception performances.' },
              { icon: 'fa-music', title: 'Garba Classes', text: 'Traditional and modern Garba training with Navratri preparation programs.' },
              { icon: 'fa-shoe-prints', title: 'Dance Classes', text: 'Bollywood, Hip-Hop, Contemporary, Freestyle, Semi-Classical, and Fusion Dance.' },
              { icon: 'fa-child', title: 'Kids Dance Program', text: 'Creative dance learning for children with fun and confidence-building activities.' },
              { icon: 'fa-heart-pulse', title: 'Fitness Dance', text: 'Zumba, Cardio Dance, Aerobic Dance, and Weight Management Programs.' },
              { icon: 'fa-spa', title: 'Yoga Classes', text: 'Mindfulness, Flexibility, Strength Training, Meditation, and Wellness Sessions.' }].
              map((cls, idx) =>
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div
                    className="glass-panel p-4 p-md-5 reveal tilt-3d h-100 cursor-pointer border-opacity-10 hover-border-brand-gold transition class-card"
                    onClick={() => openBookingModal(cls.title)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}>
                    <div className="class-card-content d-flex flex-column h-100">
                      <div className="fs-1 text-brand-gold mb-3 class-card-icon-wrapper">
                        <i className={`fas ${cls.icon} class-card-icon`}></i>
                      </div>
                      <h3 className="h4 font-serif font-weight-bold text-white mb-2 class-card-title">{cls.title}</h3>
                      <p className="small text-white-50 mb-4 class-card-text">{cls.text}</p>
                      <div className="mt-auto pt-2 class-card-action text-brand-gold d-flex align-items-center gap-2">
                        <span className="small text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>Book Free Trial</span>
                        <i className="fas fa-chevron-right class-card-arrow" style={{ fontSize: '10px' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="membership" className="py-5 bg-brand-primary border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Membership Plans</h2>
            <p className="text-white-50">Choose the plan that fits your lifestyle.</p>
          </div>
          <div className="row g-4 justify-content-center max-w-5xl mx-auto align-items-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal tilt-3d h-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Garba</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹1499<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>6 Classes / Month</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>1 Workshop</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>Garba Event Access</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Garba Plan')}
                  className="btn btn-outline-white w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  JOIN GARBA
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal tilt-3d h-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Dance</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹1999<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>8 Classes / Month</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>2 Workshops</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>Dance Event Access</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Dance Plan')}
                  className="btn btn-outline-white w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  JOIN DANCE
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal tilt-3d h-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Yoga</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹1199<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>5 Classes / Month</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>1 Workshop</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>Wellness Sessions</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Yoga Plan')}
                  className="btn btn-outline-white w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  JOIN YOGA
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal tilt-3d h-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Starter</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹1999<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>4 Classes / Month</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>1 Workshop</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>Studio Access</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Starter Plan')}
                  className="btn btn-outline-white w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  GET STARTED
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center position-relative border border-brand-gold reveal tilt-3d scale-105-default h-100"
                style={{ transform: 'scale(1.05)', borderColor: 'var(--brand-gold) !important' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <div
                  className="position-absolute gold-gradient-bg text-black px-4 py-1.5 text-xs font-weight-bold text-uppercase tracking-widest rounded-pill shadow-sm"
                  style={{ top: '0', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, fontSize: '11px', letterSpacing: '0.1em' }}>
                  Popular
                </div>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Professional</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹3999<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>12 Classes / Month</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>Unlimited Workshops</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>Event Priority</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Professional Plan')}
                  className="btn btn-gold w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  CHOOSE PLAN
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="glass-panel p-4 p-md-5 text-center reveal tilt-3d h-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                <h3 className="h5 font-serif font-weight-bold text-white mb-3">Premium</h3>
                <div className="display-6 font-weight-bold text-brand-gold mb-4">₹5999<span className="small text-white-50 font-weight-normal" style={{ fontSize: '14px' }}>/month</span></div>
                <ul className="list-unstyled space-y-2 text-white-50 mb-4" style={{ fontSize: '13px' }}>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>Unlimited Classes</li>
                  <li className="mb-2"><i className="fas fa-check text-brand-gold me-2"></i>Private Coaching</li>
                  <li className="mb-0"><i className="fas fa-check text-brand-gold me-2"></i>VIP Events</li>
                </ul>
                <button
                  onClick={() => openBookingModal('Premium Plan')}
                  className="btn btn-outline-white w-100 py-2.5 rounded-1 text-uppercase text-xs">
                  GO PREMIUM
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-5 bg-brand-dark border-top border-white border-opacity-5">
        <div className="container py-5 px-4 px-md-5 max-w-3xl font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Frequently Asked Questions</h2>
          </div>
          <div className="accordion d-flex flex-column gap-3">
            {[
              { q: 'What age groups can join?', a: 'We offer classes for all age groups starting from 4 years old to seniors. Check our Kids and Senior programs.' },
              { q: 'Do beginners need prior experience?', a: 'No, we welcome beginners with open arms. Our instructors are trained to teach from scratch.' },
              { q: 'Are trial classes available?', a: 'Yes! Book a free trial class to experience our studio and teaching style before committing.' },
              { q: 'Can wedding choreography be customized?', a: 'Absolutely. Every wedding is unique. We tailor choreography to your song selection, family size, and preferences.' },
              { q: 'Do you offer online sessions?', a: 'Yes, we have hybrid plans and online fitness/yoga sessions available for remote learners.' }].
              map((faq, idx) =>
                <details className="group glass-panel p-3 rounded cursor-pointer transition" key={idx} style={{ backgroundColor: 'rgba(30, 41, 59, 0.2)' }}>
                  <summary className="d-flex justify-content-between align-items-center font-weight-bold list-unstyled user-select-none">
                    <span>{faq.q}</span>
                    <i className="fas fa-chevron-down text-brand-gold transition duration-300"></i>
                  </summary>
                  <p className="mt-3 text-white-50 small mb-0 leading-relaxed font-sans">{faq.a}</p>
                </details>
              )}
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
