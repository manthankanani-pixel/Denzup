import React, { useState, useEffect } from 'react';

export default function BookingModal({ isOpen, onClose, serviceName }) {
  const [step, setStep] = useState(1);
  const [isTrialChecked, setIsTrialChecked] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ text: '', isError: false });

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('Morning (8:00 AM - 9:00 AM)');
  const [date, setDate] = useState('');

  // Payment Form Fields
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Reset form when serviceName changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setResponseMsg({ text: '', isError: false });
      setIsTrialChecked(serviceName.toLowerCase().includes('trial'));
      
      // Set min date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, serviceName]);

  if (!isOpen) return null;

  // Determine eligibility for Free Trial (Garba, Dance, Yoga classes and NOT a membership plan)
  const isPlan = serviceName.toLowerCase().includes('plan');
  const eligibleForTrial = !isPlan && ['garba classes', 'dance classes', 'yoga classes', 'free trial', 'trial'].some(cls =>
    serviceName.toLowerCase().includes(cls)
  );

  // Price Calculation
  let numericAmount = 499;
  if (isTrialChecked || serviceName.toLowerCase().includes('trial')) {
    numericAmount = 0;
  } else if (serviceName.includes('Starter')) {
    numericAmount = 1999;
  } else if (serviceName.includes('Professional')) {
    numericAmount = 3999;
  } else if (serviceName.includes('Premium')) {
    numericAmount = 5999;
  } else if (serviceName.includes('Garba Plan')) {
    numericAmount = 1499;
  } else if (serviceName.includes('Dance Plan')) {
    numericAmount = 1999;
  } else if (serviceName.includes('Yoga Plan')) {
    numericAmount = 1199;
  }

  const isFreeTrial = numericAmount === 0;
  const priceText = isFreeTrial ? "₹0 (Free Trial)" : `₹${numericAmount}`;

  // UPI URL & QR
  const upiUrl = `upi://pay?pa=hjc96012-1@okaxis&pn=Danzup%20Studio&am=${numericAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;

  const handleNextStep = () => {
    if (!name || !phone || !email || !date) {
      alert("Please fill out all booking details before going to checkout.");
      return;
    }
    setStep(2);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isFreeTrial) {
      if (activePaymentMethod === 'upi') {
        if (!upiId) {
          alert("Please enter a valid UPI ID to complete payment.");
          return;
        }
      } else {
        if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
          alert("Please fill out all card details to complete payment.");
          return;
        }
      }
    }

    setLoading(true);
    setResponseMsg({
      text: isFreeTrial ? 'Submitting booking...' : 'Processing payment secure gateway...',
      isError: false
    });

    // Mock processing timeout (2000ms for payment, 500ms for free trial)
    setTimeout(async () => {
      const finalService = isTrialChecked && !serviceName.toLowerCase().includes('trial')
        ? `${serviceName} (Free Trial)`
        : serviceName;

      const bookingData = {
        service: finalService,
        name,
        phone,
        email,
        batch,
        date,
        paid: !isFreeTrial
      };

      try {
        const response = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        const result = await response.json();
        
        if (result.success) {
          setResponseMsg({
            text: isFreeTrial
              ? '✨ Booking request submitted successfully!'
              : '✨ Payment successful! Booking request confirmed.',
            isError: false
          });
          setTimeout(() => {
            // Reset forms and close modal
            setName('');
            setPhone('');
            setEmail('');
            setUpiId('');
            setCardName('');
            setCardNumber('');
            setCardExpiry('');
            setCardCvv('');
            onClose();
          }, 2000);
        } else {
          setResponseMsg({ text: '❌ ' + result.message, isError: true });
        }
      } catch (err) {
        setResponseMsg({ text: '❌ Connection failed. Please try again.', isError: true });
      } finally {
        setLoading(false);
      }
    }, isFreeTrial ? 500 : 2000);
  };

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value);
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3" 
      style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}
    >
      <div 
        className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 position-relative" 
        style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button 
          onClick={onClose} 
          className="btn position-absolute top-0 end-0 m-3 text-white-50 hover-text-white border-0 bg-transparent fs-5"
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-times"></i>
        </button>

        <h3 className="h4 text-white font-serif mb-1">Book a Class Batch</h3>
        <p className="small text-white-50 font-sans mb-4">Confirm your preferred batch and date to secure your slot.</p>

        <form onSubmit={handleBookingSubmit}>
          <div className="mb-3">
            <label className="small text-white-50 mb-1 d-block font-sans">Class Name</label>
            <input 
              type="text" 
              className="form-control rounded-1 p-2.5 text-white bg-transparent"
              value={serviceName} 
              disabled 
            />
          </div>

          {/* Trial Toggle Option */}
          {eligibleForTrial && (
            <div className="form-check d-flex align-items-center gap-2 mb-3">
              <input 
                type="checkbox" 
                className="form-check-input bg-transparent border-white-10" 
                id="booking-trial-toggle" 
                checked={isTrialChecked}
                onChange={(e) => setIsTrialChecked(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label 
                className="form-check-label small text-white-50 cursor-pointer user-select-none font-sans" 
                htmlFor="booking-trial-toggle"
              >
                Book as a Free Trial Class (₹0)
              </label>
            </div>
          )}

          {/* Step 1: User Details */}
          {step === 1 && (
            <div className="animate-fade-in font-sans">
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="small text-white-50 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-1"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-6">
                  <label className="small text-white-50 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="form-control rounded-1"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="small text-white-50 mb-1">Email</label>
                <input 
                  type="email" 
                  className="form-control rounded-1"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="small text-white-50 mb-1">Select Batch</label>
                  <select 
                    className="form-select rounded-1 text-white bg-transparent"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                  >
                    <option value="Morning (8:00 AM - 9:00 AM)">Morning (8-9 AM)</option>
                    <option value="Afternoon (4:00 PM - 5:00 PM)">Afternoon (4-5 PM)</option>
                    <option value="Evening (7:00 PM - 8:00 PM)">Evening (7-8 PM)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="small text-white-50 mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    className="form-control rounded-1 text-white" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // tomorrow
                    required 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleNextStep}
                className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2"
              >
                <span>Continue to Payment</span>
                <i className="fas fa-arrow-right small"></i>
              </button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <div className="animate-fade-in font-sans">
              <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-white border-opacity-10">
                <span className="small text-white-50 font-weight-medium text-uppercase tracking-wider">Payment Details</span>
                <span className="h6 text-brand-gold mb-0">{priceText}</span>
              </div>

              {/* Payment Selector */}
              {!isFreeTrial && (
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <button 
                      type="button" 
                      onClick={() => setActivePaymentMethod('upi')}
                      className={`btn w-100 py-2 border rounded-1 text-xs font-semibold d-flex align-items-center justify-content-center gap-2 transition ${activePaymentMethod === 'upi' ? 'border-brand-gold text-white bg-white bg-opacity-5' : 'border-white border-opacity-10 text-white-50 bg-transparent'}`}
                    >
                      <i className="fas fa-mobile-alt text-brand-gold"></i> UPI (GPay/Paytm)
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      type="button" 
                      onClick={() => setActivePaymentMethod('card')}
                      className={`btn w-100 py-2 border rounded-1 text-xs font-semibold d-flex align-items-center justify-content-center gap-2 transition ${activePaymentMethod === 'card' ? 'border-brand-gold text-white bg-white bg-opacity-5' : 'border-white border-opacity-10 text-white-50 bg-transparent'}`}
                    >
                      <i className="fas fa-credit-card text-brand-gold"></i> Card
                    </button>
                  </div>
                </div>
              )}

              {/* Free Trial Message */}
              {isFreeTrial && (
                <div className="p-4 rounded text-center mb-3 border border-white border-opacity-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <i className="fas fa-gift text-brand-gold fs-2 mb-2 animate-bounce"></i>
                  <h4 className="h6 text-white mb-1">You selected Free Trial!</h4>
                  <p className="small text-white-50 max-w-xs mx-auto mb-0">No payment is required to book a free trial class. Click "Confirm Booking" below to secure your slot.</p>
                </div>
              )}

              {/* UPI Form */}
              {!isFreeTrial && activePaymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="d-flex align-items-center justify-content-center gap-4 py-2 border-bottom border-white border-opacity-5 mb-3">
                    <img src="https://img.icons8.com/color/48/google-pay.png" className="img-fluid" style={{ height: '24px' }} alt="Google Pay" />
                    <img src="https://img.icons8.com/color/48/paytm.png" className="img-fluid" style={{ height: '24px' }} alt="Paytm" />
                    <span className="small text-white-50 border border-white border-opacity-10 px-2 py-0.5 rounded font-monospace" style={{ fontSize: '10px' }}>UPI Instant</span>
                  </div>
                  <div className="mb-3">
                    <label className="small text-white-50 mb-1">Enter UPI ID</label>
                    <input 
                      type="text" 
                      className="form-control rounded-1"
                      placeholder="example@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center justify-content-center p-3 rounded border border-white border-opacity-5 mb-3" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div 
                      className="bg-white p-1 rounded d-flex align-items-center justify-content-center position-relative mb-2 shadow overflow-hidden"
                      style={{ width: '112px', height: '112px' }}
                    >
                      <img src={qrCodeUrl} className="img-fluid w-100 h-100" alt="Scan to Pay" />
                      <div 
                        className="position-absolute start-0 w-100 bg-brand-gold shadow animate-qr-scanner" 
                        style={{ height: '2px', left: 0 }}
                      ></div>
                    </div>
                    <span className="font-monospace text-white-50 mb-1" style={{ fontSize: '9px' }}>UPI ID: hjc96012-1@okaxis</span>
                    <span className="small text-brand-gold font-weight-bold mb-1">UPI Number: 514642893904</span>
                    <span className="text-white-50" style={{ fontSize: '9px' }}>GPay/PhonePe/Paytm: 09904877637</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {!isFreeTrial && activePaymentMethod === 'card' && (
                <div className="mb-3">
                  <div className="mb-2">
                    <label className="small text-white-50 mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="form-control rounded-1"
                      placeholder="Name on Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="small text-white-50 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control rounded-1"
                      placeholder="•••• •••• •••• ••••"
                      maxLength="19"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="small text-white-50 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-control rounded-1"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                      />
                    </div>
                    <div className="col-6">
                      <label className="small text-white-50 mb-1">CVV</label>
                      <input 
                        type="password" 
                        className="form-control rounded-1"
                        placeholder="•••"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="btn btn-outline-white w-25 py-3 rounded-1 text-uppercase text-xs"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-gold w-75 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2"
                >
                  <span>{isFreeTrial ? 'Confirm Booking' : 'Pay & Confirm'}</span>
                  {loading && (
                    <span 
                      className="spinner-border spinner-border-sm text-dark" 
                      role="status" 
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Response Message */}
          {responseMsg.text && (
            <div className={`text-center small mt-3 p-2 rounded ${responseMsg.isError ? 'text-danger' : 'text-success'}`} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {responseMsg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
