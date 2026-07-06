import React, { useState, useEffect } from 'react';


const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BookingModal({ isOpen, onClose, serviceName }) {
  const safeServiceName = serviceName || '';
  const [isTrialChecked, setIsTrialChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ text: '', isError: false });


  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('Morning (8:00 AM - 9:00 AM)');
  const [date, setDate] = useState('');


  useEffect(() => {
    if (isOpen) {
      setResponseMsg({ text: '', isError: false });
      setIsTrialChecked(safeServiceName.toLowerCase().includes('trial'));


      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(getLocalDateString(tomorrow));
    }
  }, [isOpen, safeServiceName]);

  if (!isOpen) return null;


  const isPlan = safeServiceName.toLowerCase().includes('plan');
  const eligibleForTrial = !isPlan && ['garba classes', 'dance classes', 'yoga classes', 'free trial', 'trial'].some((cls) =>
  safeServiceName.toLowerCase().includes(cls)
  );


  let numericAmount = 499;
  if (isTrialChecked || safeServiceName.toLowerCase().includes('trial')) {
    numericAmount = 0;
  } else if (safeServiceName.includes('Starter')) {
    numericAmount = 1999;
  } else if (safeServiceName.includes('Professional')) {
    numericAmount = 3999;
  } else if (safeServiceName.includes('Premium')) {
    numericAmount = 5999;
  } else if (safeServiceName.includes('Garba Plan')) {
    numericAmount = 1499;
  } else if (safeServiceName.includes('Dance Plan')) {
    numericAmount = 1999;
  } else if (safeServiceName.includes('Yoga Plan')) {
    numericAmount = 1199;
  }

  const isFreeTrial = numericAmount === 0;
  const priceText = isFreeTrial ? "₹0 (Free Trial)" : `₹${numericAmount}`;


  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const minDateStr = getLocalDateString(tomorrowObj);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !date) {
      alert("Please fill out all booking details.");
      return;
    }

    setLoading(true);
    setResponseMsg({ text: '', isError: false });

    const finalService = isTrialChecked && !safeServiceName.toLowerCase().includes('trial') ?
    `${safeServiceName} (Free Trial)` :
    safeServiceName;

    const bookingData = {
      service: finalService,
      name,
      phone,
      email,
      batch,
      date
    };


    if (isFreeTrial) {
      setResponseMsg({ text: 'Submitting booking request...', isError: false });
      try {
        const response = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bookingData, paid: false })
        });
        const result = await response.json();
        if (result.success) {
          setResponseMsg({ text: '✨ Free Trial booking request submitted successfully!', isError: false });
          setTimeout(() => {
            setName('');
            setPhone('');
            setEmail('');
            onClose();
          }, 3000);
        } else {
          setResponseMsg({ text: `❌ ${result.message}`, isError: true });
        }
      } catch (err) {
        setResponseMsg({ text: '❌ Connection failed. Please try again.', isError: true });
      } finally {
        setLoading(false);
      }
      return;
    }


    setResponseMsg({ text: 'Initializing secure checkout...', isError: false });

    try {

      const orderResponse = await fetch('/api/bookings/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount })
      });
      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.message || "Failed to initiate payment order.");
      }


      const loadScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your connection.");
      }


      const options = {
        key: orderResult.key_id,
        name: "Danzup Studio",
        description: `Payment for ${finalService}`,
        image: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=120&auto=format&fit=crop"
          : window.location.origin + "/danzup-logo.png",
        order_id: orderResult.orderId,
        handler: async function (response) {
          setLoading(true);
          setResponseMsg({ text: 'Verifying payment status...', isError: false });

          try {

            const verifyResponse = await fetch('/api/bookings/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData
              })
            });
            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              setResponseMsg({ text: '✨ Payment verified! Booking request confirmed.', isError: false });
              setTimeout(() => {
                setName('');
                setPhone('');
                setEmail('');
                onClose();
              }, 3000);
            } else {
              setResponseMsg({ text: `❌ Verification failed: ${verifyResult.message}`, isError: true });
            }
          } catch (verifyErr) {
            setResponseMsg({ text: '❌ Verification failed. Please contact support.', isError: true });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setResponseMsg({ text: '⚠️ Payment cancelled by user.', isError: true });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setResponseMsg({ text: `❌ Error: ${err.message}`, isError: true });
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3"
      style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
      
      <div
        className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 position-relative"
        style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <button
          onClick={onClose}
          className="btn position-absolute top-0 end-0 m-3 text-white-50 hover-text-white border-0 bg-transparent fs-5"
          style={{ cursor: 'pointer' }}>
          
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
              disabled />
            
          </div>

          {}
          {eligibleForTrial &&
          <div className="form-check d-flex align-items-center gap-2 mb-3">
              <input
              type="checkbox"
              className="form-check-input bg-transparent border-white-10"
              id="booking-trial-toggle"
              checked={isTrialChecked}
              onChange={(e) => setIsTrialChecked(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            
              <label
              className="form-check-label small text-white-50 cursor-pointer user-select-none font-sans"
              htmlFor="booking-trial-toggle">
              
                Book as a Free Trial Class (₹0)
              </label>
            </div>
          }

          {}
          <div className="font-sans">
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="small text-white-50 mb-1">Name</label>
                <input
                  type="text"
                  className="form-control rounded-1"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required />
                
              </div>
              <div className="col-6">
                <label className="small text-white-50 mb-1">Phone</label>
                <input
                  type="tel"
                  className="form-control rounded-1"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required />
                
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
                required />
              
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="small text-white-50 mb-1">Select Batch</label>
                <select
                  className="form-select rounded-1 text-white bg-transparent"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}>
                  
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
                  min={minDateStr}
                  required />
                
              </div>
            </div>

            {}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-white border-opacity-10">
              <span className="small text-white-50 font-weight-medium text-uppercase tracking-wider">Amount to Pay</span>
              <span className="h5 text-brand-gold mb-0 font-weight-bold">{priceText}</span>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2">
              
              <span>{isFreeTrial ? 'Confirm Free Trial' : 'Pay & Confirm'}</span>
              {loading &&
              <span
                className="spinner-border spinner-border-sm text-dark"
                role="status"
                aria-hidden="true">
              </span>
              }
            </button>
          </div>

          {}
          {responseMsg.text &&
          <div className={`text-center small mt-3 p-2 rounded ${responseMsg.isError ? 'text-danger' : 'text-success'}`} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {responseMsg.text}
            </div>
          }
        </form>
      </div>
    </div>);

}