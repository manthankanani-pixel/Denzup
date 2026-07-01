import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function ContactPage() {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactService, setContactService] = useState('Wedding Choreography');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState({ text: '', isError: false });

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
        // Reset form
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

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative d-flex flex-column font-sans">

      {/* NAVBAR */}
      <Navbar activePage="contact" />

      {/* HEADER HERO */}
      <div
        className="py-5 text-center d-flex align-items-center justify-content-center border-bottom border-white border-opacity-5"
        style={{
          marginTop: '70px',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '240px'
        }}
      >
        <div>
          <span className="text-brand-gold text-uppercase tracking-widest small font-weight-bold mb-2 d-block">Get In Touch</span>
          <h1 className="display-4 font-serif font-weight-bold text-white mb-2">Contact Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0" style={{ fontSize: '12px' }}>
              <li className="breadcrumb-item"><a href="/" className="text-white-50 text-decoration-none">Home</a></li>
              <li className="breadcrumb-item active text-brand-gold" aria-current="page">Contact Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="container py-5 px-4 px-md-5 flex-grow-1">
        <div className="row g-5 justify-content-center">

          {/* Details Column */}
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-center">
            <h2 className="h3 font-serif font-weight-bold mb-3 text-white">
              Start Your <span className="text-gold-gradient font-serif">Dance Journey</span> Today
            </h2>
            <p className="text-white-50 mb-5 leading-relaxed">
              Have questions about our wedding choreography packages, garba batches, or schedule options? Reach out to us, and our team will get back to you within 24 hours.
            </p>

            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="h6 text-white font-weight-bold mb-1">Address</h4>
                  <p className="small text-white-50 mb-0"> 206, Rio Business Hub, YAMUNA CHOWK, Mota Varachha, Surat, Gujarat 394101</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="h6 text-white font-weight-bold mb-1">Phone</h4>
                  <p className="small text-white-50 mb-0">+91 099048 77637</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-brand-gold flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="h6 text-white font-weight-bold mb-1">Email</h4>
                  <p className="small text-white-50 mb-0 font-sans">hello@danzupstudio.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="col-12 col-lg-7">
            <div className="glass-panel p-4 p-md-5 rounded shadow-lg border border-white border-opacity-5">
              <h3 className="h4 font-serif font-weight-bold mb-4 text-white">Send Us a Message</h3>
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
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="small text-white-50 mb-1 d-block">Phone</label>
                    <input
                      type="tel"
                      className="form-control rounded-1"
                      placeholder="Your Number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
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
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="small text-white-50 mb-1 d-block">Interested Program</label>
                  <select
                    className="form-select rounded-1 text-white bg-transparent"
                    value={contactService}
                    onChange={(e) => setContactService(e.target.value)}
                  >
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
                    className="form-control rounded-1"
                    placeholder="Tell us about your goals..."
                    rows="4"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2"
                >
                  <span>Submit Inquiry</span>
                  {contactLoading && (
                    <span className="spinner-border spinner-border-sm text-dark" role="status" aria-hidden="true"></span>
                  )}
                </button>

                {contactResponse.text && (
                  <div className={`text-center small mt-3 p-2 rounded ${contactResponse.isError ? 'text-danger' : 'text-success'}`} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    {contactResponse.text}
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* MAP CONTAINER */}
        <div className="row mt-5">
          <div className="col-12 animate-fade-in">
            <div className="glass-panel p-2 rounded shadow" style={{ height: '400px' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.2835746797955!2d72.87533237454727!3d21.231802180775187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fb9031b8d5f%3A0xb032c0a0546853d0!2sRio%20Business%20Hub!5e1!3m2!1sen!2sin!4v1782901989731!5m2!1sen!2sin" 
                className="w-100 h-100 border-0 rounded"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title="Danzup Studio Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
                  }}
                />
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
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}
              >
                ADMIN PORTAL <i className="fas fa-lock small ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <WhatsAppFloat />
    </div>
  );
}
