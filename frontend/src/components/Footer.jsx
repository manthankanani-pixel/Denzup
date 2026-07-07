import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-5 bg-brand-dark border-top border-white border-opacity-5">
      <div className="container py-4 px-4 px-md-5 font-sans">
        <div className="row g-5 justify-content-between">
          {/* Left Column: Brand Info */}
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start">
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
            <p className="small text-white-50 mb-0" style={{ maxWidth: '360px', lineHeight: '1.6' }}>
              With a Passion for Garba, Excellence in Dance, Dedication to Fitness, and Expertise in Wedding Celebrations, we create meaningful experiences filled with tradition, energy, elegance, and lifelong memories.
            </p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="col-12 col-md-3 col-lg-2 text-center text-md-start">
            <h5 className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-3 font-sans">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/about" className="small text-white-50 text-decoration-none hover-text-brand-gold transition">About Us</Link></li>
              <li><Link to="/classes" className="small text-white-50 text-decoration-none hover-text-brand-gold transition">Our Classes</Link></li>
              <li><Link to="/studio-look" className="small text-white-50 text-decoration-none hover-text-brand-gold transition">Studio Look</Link></li>
              <li><Link to="/celebrations" className="small text-white-50 text-decoration-none hover-text-brand-gold transition">Celebrations</Link></li>
            </ul>
          </div>

          {/* Right Column: Contact & Socials */}
          <div className="col-12 col-md-3 col-lg-3 text-center text-md-start">
            <h5 className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-3 font-sans">Connect</h5>
            <p className="small text-white-50 mb-2">
              <i className="fas fa-phone-alt text-brand-gold me-2"></i> +91 99048 77637
            </p>
            <p className="small text-white-50 mb-3">
              <i className="fas fa-envelope text-brand-gold me-2"></i> hello@danzupstudio.com
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5">
              <a href="https://www.instagram.com/danzup_studio/" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-brand-gold transition"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/919904877637" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-brand-gold transition"><i className="fab fa-whatsapp"></i></a>
              <a href="#" className="text-white-50 hover-text-brand-gold transition"><i className="fab fa-facebook"></i></a>
              <a href="https://www.youtube.com/@Danzup_studio" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-brand-gold transition"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Admin link */}
        <div className="border-top border-white border-opacity-5 mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small text-white-50 mb-0">© {new Date().getFullYear()} Danzup Studio. All Rights Reserved.</p>
          <div className="d-flex align-items-center gap-3">
            <span className="small text-white-30" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Developed for ultimate luxury vibes</span>
            <span className="text-white-30" style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <Link
              to="/admin"
              className="small text-brand-gold text-decoration-none hover-text-white transition d-flex align-items-center gap-1"
              style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              ADMIN PORTAL <i className="fas fa-lock small"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
