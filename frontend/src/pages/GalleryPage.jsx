import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialsSlider from '../components/TestimonialsSlider';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function GalleryPage() {
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

  return (
    <div className="bg-brand-dark min-h-screen text-white position-relative">
      <Navbar />

      {/* Gallery Section */}
      <section id="gallery" className="py-5 bg-brand-secondary">
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
              { text: '"Absolutely love this place! The yoga sessions are serene, and the Zumba batches are incredibly high-energy. The perfect place for dance and fitness."', author: 'Riddhi Desai' }]
            } />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
