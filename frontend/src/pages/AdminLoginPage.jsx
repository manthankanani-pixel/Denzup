import React, { useState } from 'react';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        onLoginSuccess();
      } else {
        setErrorMsg(result.message || 'Login failed. Try again.');
      }
    } catch (err) {
      setErrorMsg('Connection error. Check backend server and make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-screen d-flex align-items-center justify-content-center bg-black p-3 font-sans"
      style={{ backgroundImage: 'radial-gradient(circle at center, #1E293B 0%, #0A0A0A 100%)' }}>
      
      <div
        className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 w-100 animate-content-fade"
        style={{ maxWidth: '440px' }}>
        
        <div className="text-center mb-4">
          <img
            src="/danzup-logo.png"
            className="img-fluid rounded mb-3"
            style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
            alt="Logo"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop';
            }} />
          
          <h2 className="h4 font-serif font-weight-bold text-gold-gradient tracking-wider text-uppercase mb-1">
            DANZUP STUDIO
          </h2>
          <p className="small text-white-50 text-uppercase tracking-widest" style={{ fontSize: '10px' }}>
            Administration Portal
          </p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-3">
            <label className="small text-white-50 mb-1 d-block">Admin Email</label>
            <input
              type="email"
              className="form-control rounded-1 py-2.5"
              placeholder="admin@danzupstudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            
          </div>

          <div className="mb-4">
            <label className="small text-white-50 mb-1 d-block">Password</label>
            <input
              type="password"
              className="form-control rounded-1 py-2.5"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex justify-content-center align-items-center gap-2 text-uppercase tracking-wider"
            style={{ fontSize: '12px' }}>
            
            <span>Login to Portal</span>
            {loading &&
            <span className="spinner-border spinner-border-sm text-dark" role="status" aria-hidden="true"></span>
            }
          </button>

          {errorMsg &&
          <div className="text-center small text-danger mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(220,53,69,0.05)' }}>
              ❌ {errorMsg}
            </div>
          }
        </form>

        <div className="text-center mt-4">
          <a
            href="/"
            className="small text-white-50 text-decoration-none hover-text-brand-gold"
            style={{ fontSize: '11px' }}>
            
            ← Back to Customer Website
          </a>
        </div>
      </div>
    </div>);

}