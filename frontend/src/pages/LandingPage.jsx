import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WhatsAppFloat from '../components/WhatsAppFloat';
import BookingModal from '../components/BookingModal';

export default function LandingPage() {
  const location = useLocation();


  useEffect(() => {
    if (location.state && location.state.openBooking) {
      setSelectedService(location.state.openBooking);
      setIsBookingOpen(true);

      window.history.replaceState({}, document.title);
    }
  }, [location]);


  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderFade, setPreloaderFade] = useState(false);


  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');


  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Dance Classes (Free Trial)');


  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactService, setContactService] = useState('Wedding Choreography');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState({ text: '', isError: false });


  const pages = {
    home: ['hero'],
    about: ['about', 'team', 'why-choose', 'stats'],
    classes: ['classes', 'membership', 'faq'],
    celebrations: ['theme-days', 'showcase', 'garba'],
    studiolook: ['institute-look'],
    gallery: ['gallery', 'testimonials'],
    contact: ['contact']
  };

  const sectionToPage = {
    hero: 'home',
    about: 'about',
    team: 'about',
    'why-choose': 'about',
    stats: 'about',
    classes: 'classes',
    membership: 'classes',
    faq: 'classes',
    'theme-days': 'celebrations',
    showcase: 'celebrations',
    garba: 'celebrations',
    'institute-look': 'studiolook',
    gallery: 'gallery',
    testimonials: 'gallery',
    contact: 'contact'
  };


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


  const navigateTo = (targetId) => {
    const pageId = sectionToPage[targetId] || 'home';
    setActivePage(pageId);
    setActiveSection(targetId);

    if (targetId && targetId !== pageId && targetId !== 'hero') {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        navigateTo(hash.substring(1));
      } else {
        navigateTo('hero');
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
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
  }, [showPreloader, activePage]);


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


  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactResponse({ text: '', isError: false });

    const data = {
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
      service: contactService,
      message: contactMessage
    };

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setContactResponse({ text: '✨ ' + result.message, isError: false });

        setContactName('');
        setContactPhone('');
        setContactEmail('');
        setContactMessage('');
      } else {
        setContactResponse({ text: '❌ ' + result.message, isError: true });
      }
    } catch (err) {
      setContactResponse({ text: '❌ Connection failed. Please try again.', isError: true });
    } finally {
      setContactLoading(false);
    }
  };

  const getSectionClass = (sectionId) => {
    const pageId = sectionToPage[sectionId];
    return activePage === pageId ? 'animate-fade-in' : 'd-none';
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative">

      {}
      {showPreloader &&
      <div
        id="preloader"
        className={`position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-black transition-all duration-1000 ${preloaderFade ? 'fade-out' : ''}`
        }
        style={{ zIndex: 2000 }}>
        
          <div className="d-flex flex-column align-items-center justify-content-center position-relative">
            <div className="position-relative mb-4 d-flex align-items-center justify-content-center" style={{ width: '108px', height: '108px' }}>
              <div
              className="position-absolute start-0 top-0 w-100 h-100 rounded-circle border border-2 border-brand-gold border-opacity-10 border-top-brand-gold spinner-border"
              style={{ animationDuration: '1.5s' }}>
            </div>
              <div
              className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-lg"
              style={{ width: '76px', height: '76px', padding: '6px' }}>
              
                <img
                src="/danzup-logo.png"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                alt="Logo"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop';
                }} />
              
              </div>
            </div>
            <h2 className="h3 font-serif font-weight-bold text-gold-gradient tracking-widest text-uppercase mb-1 opacity-0 transform translate-y-4 animate-preloader-text">
              DANZUP STUDIO
            </h2>
            <p className="small text-white-50 text-uppercase tracking-wider opacity-0 animate-preloader-subtext">
              Premium Dance Academy
            </p>
          </div>
        </div>
      }

      {}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        onOpenBooking={openBookingModal} />
      

      {}
      <section
        id="hero"
        className={`position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden ${getSectionClass('hero')}`}>
        
        <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-70 z-1"></div>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient z-1" style={{ background: 'linear-gradient(to top, var(--brand-dark), transparent, var(--brand-dark))' }}></div>
          <img
            src="https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop"
            className="w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.4 }}
            alt="Hero Background" />
          
        </div>

        {}
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
          }}>
        </div>
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
            <a
              href="#classes"
              onClick={(e) => {e.preventDefault();navigateTo('classes');}}
              className="btn btn-gold py-3 px-5 text-uppercase tracking-wider font-weight-bold rounded-1 border border-brand-gold">
              
              JOIN CLASSES
            </a>
            <a
              href="#contact"
              onClick={(e) => {e.preventDefault();navigateTo('contact');}}
              className="btn btn-outline-white py-3 px-5 text-uppercase tracking-wider font-weight-bold rounded-1 border border-white-30">
              
              BOOK FREE TRIAL
            </a>
          </div>
        </div>
      </section>

      {}
      <section
        id="about"
        className={`py-5 bg-brand-dark ${getSectionClass('about')}`}>
        
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

      {}
      <section
        id="team"
        className={`py-5 bg-brand-secondary border-top border-white border-opacity-5 ${getSectionClass('team')}`}>
        
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
             {}
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
            {}
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

      {}
      <section
        id="classes"
        className={`py-5 bg-brand-primary ${getSectionClass('classes')}`}>
        
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

      {}
      <section
        id="why-choose"
        className={`py-5 bg-brand-dark ${getSectionClass('why-choose')}`}>
        
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

      {}
      <section
        id="showcase"
        className={`py-5 bg-brand-primary ${getSectionClass('showcase')}`}>
        
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

      {}
      <section
        id="garba"
        className={`py-5 bg-brand-secondary position-relative overflow-hidden ${getSectionClass('garba')}`}>
        
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

      {}
      <section
        id="stats"
        className={`py-5 bg-brand-dark ${getSectionClass('stats')}`}>
        
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

      {}
      <section
        id="institute-look"
        className={`py-5 bg-brand-dark position-relative overflow-hidden ${getSectionClass('institute-look')}`}>
        
        {}
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

      {}
      <section
        id="theme-days"
        className={`py-5 bg-brand-primary position-relative overflow-hidden ${getSectionClass('theme-days')}`}>
        
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
            {}
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
                  Unity, strength, and pure class energy. Experiencing the ultimate choreography vibes in coordinated black outfits.
                </p>
              </div>
            </div>

            {}
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
                  Red vibes, red attire, and red-hot energy. Celebrating passion, movement, and synchronized styles with unstoppable moves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section
        id="gallery"
        className={`py-5 bg-brand-secondary ${getSectionClass('gallery')}`}>
        
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Gallery</h2>
            <p className="text-white-50">Capturing moments of grace and energy.</p>
          </div>
          <div className="row g-3">
            {[
            'https://images.unsplash.com/photo-1547153760-18fc86304498?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533628150033-14a3f9e44009?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1524594152303-9f1c49bac937?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1572916597494-1b3b6a53d7d5?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1935&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595152772831-2c1f7d5f16e4?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=2071&auto=format&fit=crop'].
            map((imgUrl, idx) =>
            <div className="col-6 col-md-3 reveal" key={idx}>
                <div className="overflow-hidden rounded position-relative group" style={{ height: '240px' }}>
                  <img src={imgUrl} className="w-100 h-100 image-zoom transition" style={{ objectFit: 'cover' }} alt={`Gallery ${idx + 1}`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {}
      <section
        id="testimonials"
        className={`py-5 bg-brand-dark ${getSectionClass('testimonials')}`}>
        
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
            { text: '"Absolutely love this place! The yoga sessions are serene, and the Zumba batches are incredibly high-energy. The perfect place for dance and fitness."', author: 'Riddhi Desai' }]
            } />
          </div>
        </div>
      </section>

      {}
      <section
        id="membership"
        className={`py-5 bg-brand-primary ${getSectionClass('membership')}`}>
        
        <div className="container py-5 px-4 px-md-5 font-sans">
          <div className="text-center mb-5 reveal">
            <h2 className="display-5 font-serif font-weight-bold mb-3 text-white">Membership Plans</h2>
            <p className="text-white-50">Choose the plan that fits your lifestyle.</p>
          </div>
          <div className="row g-4 justify-content-center max-w-5xl mx-auto align-items-center">
            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

      {}
      <section
        id="faq"
        className={`py-5 bg-brand-dark ${getSectionClass('faq')}`}>
        
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

      {}
      <section
        id="contact"
        className={`py-5 bg-brand-primary position-relative ${getSectionClass('contact')}`}>
        
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient opacity-50 z-0" style={{ background: 'linear-gradient(to right, var(--brand-dark), transparent)' }}></div>
        <div className="container py-5 px-4 px-md-5 position-relative z-1 font-sans">
          <div className="row g-5">
            <div className="col-12 col-lg-6 reveal reveal-left d-flex flex-column justify-content-center">
              <h2 className="display-5 font-serif font-weight-bold mb-4 text-white">
                Start Your <span className="text-gold-gradient font-serif">Dance Journey</span> Today
              </h2>
              <p className="text-white-50 mb-5 leading-relaxed">
                Ready to move? Book your free trial class now. Whether it's wedding choreography or a new fitness hobby, we are here to guide you.
              </p>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3 contact-item">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold contact-item-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Address</h4>
                    <p className="small text-white-50 mb-0">YAMUNA CHOWK, Rio Business Hub, 206, Mota Varachha, Surat, Gujarat 394101</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 contact-item">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold contact-item-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Phone</h4>
                    <p className="small text-white-50 mb-0">+91 099048 77637</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 contact-item">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold contact-item-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="h6 text-white font-weight-bold mb-1">Email</h4>
                    <p className="small text-white-50 mb-0">hello@danzupstudio.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 reveal reveal-right">
              <div
                className="glass-panel p-4 p-md-5 rounded shadow contact-form-panel"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}>
                
                <form onSubmit={handleContactSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="small text-white-50 mb-1 d-block">Name</label>
                      <input
                        type="text"
                        className="form-control rounded-1"
                        placeholder="Your Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required />
                      
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="small text-white-50 mb-1 d-block">Phone</label>
                      <input
                        type="tel"
                        className="form-control rounded-1"
                        placeholder="Your Number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required />
                      
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small text-white-50 mb-1 d-block">Email</label>
                    <input
                      type="email"
                      className="form-control rounded-1"
                      placeholder="Your Email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required />
                    
                  </div>
                  <div className="mb-3">
                    <label className="small text-white-50 mb-1 d-block">Interested Program</label>
                    <select
                      className="form-select rounded-1 text-white bg-transparent"
                      value={contactService}
                      onChange={(e) => setContactService(e.target.value)}>
                      
                      <option value="Wedding Choreography">Wedding Choreography</option>
                      <option value="Garba Training">Garba Training</option>
                      <option value="Dance Classes">Dance Classes</option>
                      <option value="Yoga Classes">Yoga Classes</option>
                      <option value="Fitness Dance">Fitness Dance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="small text-white-50 mb-1 d-block">Message</label>
                    <textarea
                      className="form-control rounded-1 h-32"
                      placeholder="Tell us about your goals..."
                      rows="4"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required>
                    </textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2">
                    
                    <span>Book Free Trial</span>
                    {contactLoading &&
                    <span className="spinner-border spinner-border-sm text-dark" role="status" aria-hidden="true"></span>
                    }
                  </button>
                  {contactResponse.text &&
                  <div className={`text-center small mt-3 p-2 rounded ${contactResponse.isError ? 'text-danger' : 'text-success'}`} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      {contactResponse.text}
                    </div>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer className="py-5 bg-brand-dark border-top border-white border-opacity-5">
        <div className="container py-4 px-4 px-md-5 font-sans">
          <div className="row g-4 justify-content-between align-items-center">
            <div className="col-12 col-md-4 text-center text-md-start">
              <a href="#" className="navbar-brand d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
                <img
                  src="/danzup-logo.png"
                  className="img-fluid rounded"
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                  alt="Danzup Logo"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop';
                  }} />
                
                <span className="text-gold-gradient font-serif h5 mb-0 font-weight-bold tracking-wider">DANZUP STUDIO</span>
              </a>
              <p className="small text-white-50 mb-0" style={{ maxWidth: '280px' }}>
                Premium wedding choreography, garba, dance, fitness and yoga academy in Surat.
              </p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="d-flex justify-content-center gap-3 fs-5 mb-3">
                <a href="https://www.instagram.com/danzup_studio/" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-brand-gold"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/919904877637" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-brand-gold"><i className="fab fa-whatsapp"></i></a>
                <a href="#" className="text-white-50 hover-text-brand-gold"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white-50 hover-text-brand-gold"><i className="fab fa-youtube"></i></a>
              </div>
              <p className="small text-white-50 mb-0">© {new Date().getFullYear()} Danzup Studio. All Rights Reserved.</p>
            </div>
            <div className="col-12 col-md-4 text-center text-md-end">
              <p className="small text-white-50 mb-1">Developed for ultimate luxury vibes</p>
              <a
                href="/admin"
                className="small text-brand-gold text-decoration-none"
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                
                ADMIN PORTAL <i className="fas fa-lock small ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {}
      <WhatsAppFloat />

      {}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        serviceName={selectedService} />
      
    </div>);

}


function StatCounter({ endValue, duration = 15000, isFloat = false }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTimestamp = null;

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);

          let currentValue = progress * endValue;
          if (isFloat) {
            setCount(parseFloat(currentValue.toFixed(1)));
          } else {
            setCount(Math.floor(currentValue));
          }

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(endValue);
          }
        };

        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        if (observer && observer.unobserve) {
          observer.unobserve(elementRef.current);
        }
      }
    };
  }, [endValue, duration, isFloat]);

  return <span ref={elementRef}>{count}</span>;
}


function TestimonialsSlider({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 992) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = testimonials.length;
  const extendedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalItems, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  return (
    <div
      className="position-relative overflow-hidden px-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      
      <div
        className="d-flex transition-all duration-500 ease-in-out py-3"
        style={{
          transform: `translateX(calc(-${currentIndex} * (${100 / itemsToShow}% + ${24 / itemsToShow}px)))`,
          gap: '24px'
        }}>
        
        {extendedTestimonials.map((testi, idx) =>
        <div
          key={idx}
          className="flex-shrink-0"
          style={{
            width: `calc(${100 / itemsToShow}% - ${(itemsToShow - 1) * 24 / itemsToShow}px)`
          }}>
          
            <div className="glass-panel p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="text-brand-gold mb-3">
                  <i className="fas fa-star me-1"></i>
                  <i className="fas fa-star me-1"></i>
                  <i className="fas fa-star me-1"></i>
                  <i className="fas fa-star me-1"></i>
                  <i className="fas fa-star me-1"></i>
                </div>
                <p className="text-light mb-4 italic" style={{ fontSize: '14px', lineHeight: '1.6' }}>{testi.text}</p>
              </div>
              <h5 className="h6 font-weight-bold text-white mb-0">— {testi.author}</h5>
            </div>
          </div>
        )}
      </div>
    </div>);

}