import React, { useState, useEffect, useRef } from 'react';

export default function StatCounter({ endValue, duration = 1500, isFloat = false }) {
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
