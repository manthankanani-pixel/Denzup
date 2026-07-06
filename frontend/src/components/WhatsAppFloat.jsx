import React from 'react';

export default function WhatsAppFloat() {
  const whatsappUrl = "https://wa.me/919904877637?text=Hi%20Danzup%20Studio!%20I%20would%20like%20to%20inquire%20about%20your%20classes.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp">
      
      <div className="whatsapp-pulse"></div>
      <i className="fab fa-whatsapp text-3xl"></i>
    </a>);

}