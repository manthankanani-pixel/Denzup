import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingClick = (e, serviceName) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking(serviceName);
    } else {
      navigate('/', { state: { openBooking: serviceName } });
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-md fixed-top transition-all duration-300 py-3 ${
          isScrolled || location.pathname === '/contact' ? 'glass-nav py-2' : 'bg-transparent'
        }`}
        style={{ zIndex: 1000 }}>
        
        <div className="container px-4 px-md-5 d-flex justify-content-between align-items-center">
          <Link
            to="/"
            onClick={handleNavClick}
            className="navbar-brand d-flex align-items-center gap-2 h-12">
            <img
              src="/danzup-logo.png"
              className="img-fluid rounded"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              alt="DANZUP STUDIO Logo"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop';
              }} />
            <span className="text-gold-gradient font-serif h5 mb-0 font-weight-bold tracking-wider">DANZUP STUDIO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="d-none d-md-flex align-items-center gap-4">
            <NavLink
              to="/"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              HOME
            </NavLink>
            <NavLink
              to="/about"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              ABOUT
            </NavLink>
            <NavLink
              to="/classes"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              CLASSES
            </NavLink>
            <NavLink
              to="/studio-look"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              STUDIO LOOK
            </NavLink>
            <NavLink
              to="/celebrations"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              CELEBRATIONS
            </NavLink>
            <NavLink
              to="/gallery"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              GALLERY
            </NavLink>
            <NavLink
              to="/contact"
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link-brand ${isActive ? 'active' : ''}`}>
              CONTACT
            </NavLink>

            <div className="dropdown">
              <button
                className="btn btn-gold rounded-0 py-2.5 px-4 btn-luxury d-flex align-items-center gap-2 text-xs font-weight-bold dropdown-toggle"
                type="button"
                id="trialDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '12px' }}>
                <span>BOOK TRIAL</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end border-white border-opacity-10 shadow-lg p-0 overflow-hidden glass-panel"
                aria-labelledby="trialDropdown"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)' }}>
                <li>
                  <a
                    className="dropdown-item py-2 px-4 text-xs text-white-50 hover-bg-brand-gold hover-text-black transition"
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                    onClick={(e) => handleBookingClick(e, 'Dance Classes (Free Trial)')}>
                    Dance Trial
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item py-2 px-4 text-xs text-white-50 hover-bg-brand-gold hover-text-black transition"
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                    onClick={(e) => handleBookingClick(e, 'Garba Classes (Free Trial)')}>
                    Garba Trial
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item py-2 px-4 text-xs text-white-50 hover-bg-brand-gold hover-text-black transition"
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                    onClick={(e) => handleBookingClick(e, 'Yoga Classes (Free Trial)')}>
                    Yoga Trial
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Hamburguer Toggler */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="navbar-toggler d-md-none text-white border-0 bg-transparent"
            type="button"
            aria-label="Toggle navigation">
            <i className="fas fa-bars fs-4"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Navigation */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-brand-dark d-flex flex-column align-items-center justify-content-center animate-fade-in"
          style={{ zIndex: 1100 }}>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="btn position-absolute top-0 end-0 m-4 text-white border-0 bg-transparent fs-2">
            <i className="fas fa-times"></i>
          </button>

          <div className="d-flex flex-column align-items-center gap-4 text-center font-serif">
            <NavLink
              to="/"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              About
            </NavLink>
            <NavLink
              to="/classes"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Classes
            </NavLink>
            <NavLink
              to="/studio-look"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Studio Look
            </NavLink>
            <NavLink
              to="/celebrations"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Celebrations
            </NavLink>
            <NavLink
              to="/gallery"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Gallery
            </NavLink>
            <NavLink
              to="/contact"
              onClick={handleNavClick}
              className={({ isActive }) => `text-white text-decoration-none fs-3 hover-text-brand-gold ${isActive ? 'text-brand-gold' : ''}`}>
              Contact
            </NavLink>

            <div className="w-25 border-top border-white border-opacity-10 my-2"></div>
            
            <div className="d-flex flex-column align-items-center gap-2 mt-2 font-sans">
              <span className="text-uppercase tracking-wider text-brand-gold small font-weight-bold">Book Free Trial</span>
              <a
                onClick={(e) => handleBookingClick(e, 'Dance Classes (Free Trial)')}
                className="text-white-50 text-decoration-none fs-5 hover-text-brand-gold"
                style={{ cursor: 'pointer' }}>
                Dance Trial
              </a>
              <a
                onClick={(e) => handleBookingClick(e, 'Garba Classes (Free Trial)')}
                className="text-white-50 text-decoration-none fs-5 hover-text-brand-gold"
                style={{ cursor: 'pointer' }}>
                Garba Trial
              </a>
              <a
                onClick={(e) => handleBookingClick(e, 'Yoga Classes (Free Trial)')}
                className="text-white-50 text-decoration-none fs-5 hover-text-brand-gold"
                style={{ cursor: 'pointer' }}>
                Yoga Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}