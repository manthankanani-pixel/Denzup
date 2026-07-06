import React, { useState, useEffect } from 'react';

export default function TestimonialsSlider({ testimonials }) {
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
    </div>
  );
}
