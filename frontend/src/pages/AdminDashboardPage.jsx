import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    trialBookings: 0,
    totalCollectedFees: 0,
    totalPendingFees: 0,
    overdueFeesCount: 0
  });

  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [fees, setFees] = useState([]);
  const [healthStatus, setHealthStatus] = useState({ status: 'Unknown', version: '', timestamp: '' });


  const [contactSearch, setContactSearch] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [feeSearch, setFeeSearch] = useState('');
  const [feeFilter, setFeeFilter] = useState('all');
  const [trialSearch, setTrialSearch] = useState('');
  const [trialFilter, setTrialFilter] = useState('all');


  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showCollectPaymentModal, setShowCollectPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);


  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');


  const [inquiryFirstName, setInquiryFirstName] = useState('');
  const [inquiryLastName, setInquiryLastName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryAddress, setInquiryAddress] = useState('');
  const [inquiryService, setInquiryService] = useState('Wedding Choreography');
  const [inquiryMessage, setInquiryMessage] = useState('');


  const [bookService, setBookService] = useState('Dance Classes');
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookBatch, setBookBatch] = useState('Morning (8:00 AM - 9:00 AM)');
  const [bookDate, setBookDate] = useState('');
  const [bookPaid, setBookPaid] = useState(false);


  const [feeStudentName, setFeeStudentName] = useState('');
  const [feePhone, setFeePhone] = useState('');
  const [feeService, setFeeService] = useState('Wedding Choreography');
  const [feeTotal, setFeeTotal] = useState('');
  const [feeDueDate, setFeeDueDate] = useState('');


  const [collectAmount, setCollectAmount] = useState('');
  const [collectNotes, setCollectNotes] = useState('');


  const [logoFile, setLogoFile] = useState(null);
  const [logoUploadStatus, setLogoUploadStatus] = useState('');


  const loadData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return onLogout();

    const headers = { 'Authorization': `Bearer ${token}` };

    try {

      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.status === 401) return onLogout();
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }


      const contactsRes = await fetch('/api/admin/contacts', { headers });
      const contactsData = await contactsRes.json();
      if (contactsData.success) {
        setContacts(contactsData.data);
      }


      const bookingsRes = await fetch('/api/admin/bookings', { headers });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }


      const feesRes = await fetch('/api/admin/fees', { headers });
      const feesData = await feesRes.json();
      if (feesData.success) {
        setFees(feesData.data);
      }


      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      setHealthStatus(healthData);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleUpdateContactStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        loadData();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleUpdateBookingStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        loadData();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleToggleBookingPayment = async (id, paidStatus) => {
    const token = localStorage.getItem('adminToken');
    const booking = bookings.find((b) => b._id === id);
    if (!booking) return;

    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: booking.status, paid: paidStatus })
      });
      const result = await response.json();
      if (result.success) {
        loadData();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleDeleteFeeRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee ledger record? This action cannot be undone.')) {
      return;
    }
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/admin/fees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        loadData();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleAddInquiry = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    const token = localStorage.getItem('adminToken');

    const data = {
      firstName: inquiryFirstName,
      lastName: inquiryLastName,
      phone: inquiryPhone,
      email: inquiryEmail,
      address: inquiryAddress,
      service: inquiryService,
      message: inquiryMessage
    };

    try {
      const response = await fetch('/api/admin/contacts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        loadData();
        setShowInquiryModal(false);

        setInquiryFirstName('');
        setInquiryLastName('');
        setInquiryPhone('');
        setInquiryEmail('');
        setInquiryAddress('');
        setInquiryMessage('');
      } else {
        setModalError(result.message);
      }
    } catch (err) {
      setModalError('Connection failed.');
    } finally {
      setModalLoading(false);
    }
  };


  const handleAddBooking = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    const token = localStorage.getItem('adminToken');

    const data = {
      service: bookService,
      name: bookName,
      phone: bookPhone,
      email: bookEmail,
      batch: bookBatch,
      date: bookDate,
      paid: bookPaid
    };

    try {
      const response = await fetch('/api/admin/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        loadData();
        setShowBookingModal(false);

        setBookName('');
        setBookPhone('');
        setBookEmail('');
        setBookDate('');
        setBookPaid(false);
      } else {
        setModalError(result.message);
      }
    } catch (err) {
      setModalError('Connection failed.');
    } finally {
      setModalLoading(false);
    }
  };


  const handleAddFee = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    const token = localStorage.getItem('adminToken');

    const data = {
      studentName: feeStudentName,
      phone: feePhone,
      service: feeService,
      totalAmount: Number(feeTotal),
      dueDate: feeDueDate
    };

    try {
      const response = await fetch('/api/admin/fees/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        loadData();
        setShowFeeModal(false);

        setFeeStudentName('');
        setFeePhone('');
        setFeeTotal('');
        setFeeDueDate('');
      } else {
        setModalError(result.message);
      }
    } catch (err) {
      setModalError('Connection failed.');
    } finally {
      setModalLoading(false);
    }
  };


  const openCollectPayment = (fee) => {
    setSelectedFee(fee);
    const balance = fee.totalAmount - (fee.paidAmount || 0);
    setCollectAmount(balance.toString());
    setCollectNotes('');
    setShowCollectPaymentModal(true);
  };


  const handleCollectPaymentSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    const token = localStorage.getItem('adminToken');

    const data = {
      amount: Number(collectAmount),
      notes: collectNotes
    };

    try {
      const response = await fetch(`/api/admin/fees/${selectedFee._id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        loadData();
        setShowCollectPaymentModal(false);
      } else {
        setModalError(result.message);
      }
    } catch (err) {
      setModalError('Connection failed.');
    } finally {
      setModalLoading(false);
    }
  };


  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return;

    setLogoUploadStatus('Uploading logo...');
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setLogoUploadStatus('Upload successful! Logo updated.');
        setLogoFile(null);
      } else {
        setLogoUploadStatus('Upload failed: ' + result.message);
      }
    } catch (err) {
      setLogoUploadStatus('Error uploading: ' + err.message);
    }
  };


  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const phone = (contact.phone || '').toLowerCase();
    const service = (contact.service || '').toLowerCase();
    const query = contactSearch.toLowerCase();
    const matchesQuery = fullName.includes(query) || phone.includes(query) || service.includes(query);

    if (contactFilter === 'all') return matchesQuery;
    return matchesQuery && contact.status === contactFilter;
  });

  const filteredBookings = bookings.filter((booking) => {
    const name = (booking.name || '').toLowerCase();
    const phone = (booking.phone || '').toLowerCase();
    const service = (booking.service || '').toLowerCase();
    const query = bookingSearch.toLowerCase();
    const matchesQuery = name.includes(query) || phone.includes(query) || service.includes(query);

    if (bookingFilter === 'all') return matchesQuery;
    return matchesQuery && booking.status === bookingFilter;
  });

  const filteredTrials = bookings.filter((booking) => {
    const isTrial = (booking.service || '').toLowerCase().includes('trial');
    if (!isTrial) return false;

    const name = (booking.name || '').toLowerCase();
    const phone = (booking.phone || '').toLowerCase();
    const service = (booking.service || '').toLowerCase();
    const query = trialSearch.toLowerCase();
    const matchesQuery = name.includes(query) || phone.includes(query) || service.includes(query);

    if (trialFilter === 'all') return matchesQuery;
    return matchesQuery && booking.status === trialFilter;
  });

  const filteredFees = fees.filter((fee) => {
    const name = (fee.studentName || '').toLowerCase();
    const phone = (fee.phone || '').toLowerCase();
    const service = (fee.service || '').toLowerCase();
    const query = feeSearch.toLowerCase();
    const matchesQuery = name.includes(query) || phone.includes(query) || service.includes(query);

    if (feeFilter === 'all') return matchesQuery;
    const filterStatus = feeFilter === 'paid' ? 'fully_paid' : feeFilter === 'partial' ? 'partially_paid' : 'unpaid';
    return matchesQuery && (fee.status === feeFilter || fee.status === filterStatus);
  });

  return (
    <div className="bg-brand-dark min-h-screen text-white d-flex flex-column font-sans">
      
      {}
      <nav className="navbar navbar-expand glass-nav py-3 px-4 position-sticky top-0" style={{ zIndex: 900 }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img
              src="/danzup-logo.png"
              className="img-fluid rounded"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              alt="Logo"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop';
              }} />
            
            <span className="text-gold-gradient font-serif h5 mb-0 font-weight-bold tracking-wider">DANZUP STUDIO</span>
            <span className="badge border border-brand-gold border-opacity-30 text-brand-gold small py-1 text-uppercase font-sans" style={{ fontSize: '9px' }}>
              Admin Portal
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button onClick={loadData} className="btn btn-outline-white border-0 py-2 px-3 small text-white-50 hover-text-white d-flex align-items-center gap-2">
              <i className="fas fa-sync-alt small"></i> Refresh
            </button>
            <button onClick={onLogout} className="btn btn-danger py-2 px-3 text-xs font-weight-bold rounded-1 border-0" style={{ fontSize: '11px' }}>
              <i className="fas fa-sign-out-alt me-1"></i> LOGOUT
            </button>
          </div>
        </div>
      </nav>

      {}
      <div className="d-flex flex-grow-1">
        
        {}
        <aside className="glass-panel border-top-0 border-start-0 border-bottom-0 d-none d-md-block p-4" style={{ width: '240px', minHeight: 'calc(100vh - 70px)' }}>
          <div className="d-flex flex-column gap-2">
            {[
            { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
            { id: 'inquiries', icon: 'fa-envelope-open-text', label: 'Inquiries' },
            { id: 'bookings', icon: 'fa-calendar-check', label: 'Bookings' },
            { id: 'trials', icon: 'fa-user-clock', label: 'Book Trials' },
            { id: 'fees', icon: 'fa-file-invoice-dollar', label: 'Fee Ledgers' },
            { id: 'health', icon: 'fa-heartbeat', label: 'System Health' },
            { id: 'logo', icon: 'fa-upload', label: 'Upload Logo' }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn w-100 text-start py-2.5 px-3 rounded border-0 transition d-flex align-items-center gap-3 ${
              activeTab === tab.id ?
              'gold-gradient-bg text-black font-weight-bold shadow' :
              'text-white-50 bg-transparent hover-bg-white hover-bg-opacity-5 hover-text-white'}`
              }
              style={{ fontSize: '13px' }}>
              
                <i className={`fas ${tab.icon} small`}></i>
                <span>{tab.label}</span>
              </button>
            )}
          </div>
        </aside>

        {}
        <main className="flex-grow-1 p-4 p-md-5 animate-content-fade" style={{ maxHeight: 'calc(100vh - 70px)', overflowY: 'auto' }}>
          
          {}
          {activeTab === 'dashboard' &&
          <div>
              <h2 className="h4 font-serif font-weight-bold mb-4">Dashboard Overview</h2>
              
              {}
              <div className="row g-4 mb-5">
                {[
              { title: 'Total Inquiries', value: stats.totalContacts, icon: 'fa-users', color: 'text-brand-gold' },
              { title: 'New (Pending) Inquiries', value: stats.newContacts, icon: 'fa-envelope-open', color: 'text-info' },
              { title: 'Total Bookings', value: stats.totalBookings, icon: 'fa-calendar-check', color: 'text-success' },
              { title: 'Pending Bookings', value: stats.pendingBookings, icon: 'fa-hourglass-half', color: 'text-warning' },
              { title: 'Free Trial Bookings', value: stats.trialBookings, icon: 'fa-user-clock', color: 'text-brand-gold' }].
              map((st, i) =>
              <div className="col-12 col-sm-6 col-lg" key={i}>
                    <div className="glass-panel p-4 rounded d-flex justify-content-between align-items-center h-100">
                      <div>
                        <span className="small text-white-50 d-block mb-1">{st.title}</span>
                        <span className="h2 font-weight-bold mb-0 text-white">{st.value}</span>
                      </div>
                      <div className={`fs-1 ${st.color}`}><i className={`fas ${st.icon}`}></i></div>
                    </div>
                  </div>
              )}
              </div>

              {}
              <div className="row g-4">
                {}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="glass-panel p-4 rounded h-100">
                    <h3 className="h6 font-serif font-weight-bold mb-3 text-brand-gold uppercase tracking-wider">Quick actions</h3>
                    <div className="d-flex flex-column gap-2">
                      <button onClick={() => {
                      const today = new Date();
                      setBookDate(today.toISOString().split('T')[0]);
                      setShowBookingModal(true);
                    }} className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex align-items-center justify-content-center gap-2">
                        <i className="fas fa-plus small"></i> Create Manual Booking
                      </button>
                      <button onClick={() => setShowInquiryModal(true)} className="btn btn-outline-white w-100 py-3 rounded-1 d-flex align-items-center justify-content-center gap-2">
                        <i className="fas fa-envelope small"></i> Create Manual Inquiry
                      </button>
                      <button onClick={() => {
                      const oneWeek = new Date();
                      oneWeek.setDate(oneWeek.getDate() + 7);
                      setFeeDueDate(oneWeek.toISOString().split('T')[0]);
                      setShowFeeModal(true);
                    }} className="btn btn-outline-white w-100 py-3 rounded-1 d-flex align-items-center justify-content-center gap-2">
                        <i className="fas fa-file-invoice-dollar small"></i> Issue Fee Ledger
                      </button>
                    </div>
                  </div>
                </div>

                {}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="glass-panel p-4 rounded h-100">
                    <h3 className="h6 font-serif font-weight-bold mb-3 text-brand-gold uppercase tracking-wider">Recent Bookings</h3>
                    <div className="table-responsive">
                      <table className="table table-dark table-borderless table-sm mb-0">
                        <tbody>
                          {bookings.slice(0, 5).map((booking, i) =>
                        <tr key={i} className="border-bottom border-white border-opacity-5">
                              <td className="py-2.5 font-weight-bold text-white small">{booking.name}</td>
                              <td className="py-2.5 text-white-50 small">{booking.service}</td>
                              <td className="py-2.5 font-monospace text-warning text-xs text-uppercase" style={{ fontSize: '10px' }}>
                                {booking.status}
                              </td>
                            </tr>
                        )}
                          {bookings.length === 0 &&
                        <tr><td className="text-center py-4 text-white-50 small">No recent bookings.</td></tr>
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="glass-panel p-4 rounded h-100">
                    <h3 className="h6 font-serif font-weight-bold mb-3 text-brand-gold uppercase tracking-wider">Recent Free Trials</h3>
                    <div className="table-responsive">
                      <table className="table table-dark table-borderless table-sm mb-0">
                        <tbody>
                          {bookings
                            .filter((b) => (b.service || '').toLowerCase().includes('trial'))
                            .slice(0, 5)
                            .map((booking, i) =>
                              <tr key={i} className="border-bottom border-white border-opacity-5">
                                <td className="py-2.5 font-weight-bold text-white small">{booking.name}</td>
                                <td className="py-2.5 text-white-50 small">{booking.service}</td>
                                <td className="py-2.5 font-monospace text-warning text-xs text-uppercase" style={{ fontSize: '10px' }}>
                                  {booking.status}
                                </td>
                              </tr>
                          )}
                          {bookings.filter((b) => (b.service || '').toLowerCase().includes('trial')).length === 0 &&
                            <tr><td className="text-center py-4 text-white-50 small">No recent trials.</td></tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="glass-panel p-4 rounded h-100">
                    <h3 className="h6 font-serif font-weight-bold mb-3 text-brand-gold uppercase tracking-wider">Recent Inquiries</h3>
                    <div className="table-responsive">
                      <table className="table table-dark table-borderless table-sm mb-0">
                        <tbody>
                          {contacts.slice(0, 5).map((contact, i) =>
                        <tr key={i} className="border-bottom border-white border-opacity-5">
                              <td className="py-2.5 font-weight-bold text-white small">{contact.firstName} {contact.lastName}</td>
                              <td className="py-2.5 text-white-50 small">{contact.service}</td>
                              <td className="py-2.5 font-monospace text-brand-gold text-xs text-uppercase" style={{ fontSize: '10px' }}>
                                {contact.status || 'pending'}
                              </td>
                            </tr>
                        )}
                          {contacts.length === 0 &&
                        <tr><td className="text-center py-4 text-white-50 small">No recent inquiries.</td></tr>
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'inquiries' &&
          <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 font-serif font-weight-bold mb-0">Manage Inquiries</h2>
                <button onClick={() => setShowInquiryModal(true)} className="btn btn-gold py-2 px-3 small rounded-1">
                  <i className="fas fa-plus small me-1"></i> Add Inquiry
                </button>
              </div>

              {}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white bg-opacity-5 border-white border-opacity-10 text-white-50"><i className="fas fa-search"></i></span>
                    <input
                    type="text"
                    className="form-control rounded-end-1"
                    placeholder="Search inquiries by name, phone, program..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)} />
                  
                  </div>
                </div>
                <div className="col-12 col-md-6 d-flex gap-2">
                  {['all', 'pending', 'contacted', 'enrolled', 'spam'].map((filter) =>
                <button
                  key={filter}
                  onClick={() => setContactFilter(filter)}
                  className={`btn py-2 px-3 small text-uppercase font-weight-bold border border-white border-opacity-10 ${
                  contactFilter === filter ? 'gold-gradient-bg text-black' : 'bg-transparent text-white-50 hover-text-white'}`
                  }
                  style={{ fontSize: '11px' }}>
                  
                      {filter}
                    </button>
                )}
                </div>
              </div>

              {}
              <div className="glass-panel p-4 rounded shadow">
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr className="border-bottom border-white border-opacity-10 text-white-50">
                        <th>Student Details</th>
                        <th>Contact info</th>
                        <th>Interested Program</th>
                        <th>Message</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact, i) =>
                    <tr key={i} className="border-bottom border-white border-opacity-5">
                          <td>
                            <span className="font-weight-bold d-block text-white">{contact.firstName} {contact.lastName}</span>
                            <span className="text-white-50 small font-monospace" style={{ fontSize: '10px' }}>ID: {contact._id}</span>
                          </td>
                          <td>
                            <span className="d-block small"><i className="fas fa-phone-alt text-white-50 me-1"></i> {contact.phone}</span>
                            <span className="d-block small"><i className="fas fa-envelope text-white-50 me-1"></i> {contact.email}</span>
                          </td>
                          <td>
                            <span className="small text-white-50">{contact.service}</span>
                          </td>
                          <td style={{ maxWidth: '240px' }}>
                            <span className="small text-white-50 leading-relaxed d-block text-truncate" title={contact.message}>
                              {contact.message}
                            </span>
                          </td>
                          <td>
                            <select
                          className="form-select form-select-sm rounded-1 text-white bg-transparent border-white border-opacity-10"
                          value={contact.status || 'pending'}
                          onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                          style={{ width: '130px', fontSize: '12px' }}>
                          
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="spam">Spam</option>
                            </select>
                          </td>
                        </tr>
                    )}
                      {filteredContacts.length === 0 &&
                    <tr><td colSpan="5" className="text-center py-5 text-white-50 small">No inquiries found.</td></tr>
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'bookings' &&
          <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 font-serif font-weight-bold mb-0">Manage Bookings</h2>
                <button onClick={() => {
                const today = new Date();
                setBookDate(today.toISOString().split('T')[0]);
                setShowBookingModal(true);
              }} className="btn btn-gold py-2 px-3 small rounded-1">
                  <i className="fas fa-plus small me-1"></i> Add Booking
                </button>
              </div>

              {}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white bg-opacity-5 border-white border-opacity-10 text-white-50"><i className="fas fa-search"></i></span>
                    <input
                    type="text"
                    className="form-control rounded-end-1"
                    placeholder="Search bookings by name, phone, service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)} />
                  
                  </div>
                </div>
                <div className="col-12 col-md-6 d-flex gap-2">
                  {['all', 'pending', 'confirmed', 'cancelled'].map((filter) =>
                <button
                  key={filter}
                  onClick={() => setBookingFilter(filter)}
                  className={`btn py-2 px-3 small text-uppercase font-weight-bold border border-white border-opacity-10 ${
                  bookingFilter === filter ? 'gold-gradient-bg text-black' : 'bg-transparent text-white-50 hover-text-white'}`
                  }
                  style={{ fontSize: '11px' }}>
                  
                      {filter}
                    </button>
                )}
                </div>
              </div>

              {}
              <div className="glass-panel p-4 rounded shadow">
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr className="border-bottom border-white border-opacity-10 text-white-50">
                        <th>Student</th>
                        <th>Class Details</th>
                        <th>Scheduled Date</th>
                        <th>Payment Status</th>
                        <th>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, i) =>
                    <tr key={i} className="border-bottom border-white border-opacity-5">
                          <td>
                            <span className="font-weight-bold d-block text-white">{booking.name}</span>
                            <span className="d-block small font-monospace text-white-50" style={{ fontSize: '10px' }}>
                              Ph: {booking.phone} | {booking.email}
                            </span>
                          </td>
                          <td>
                            <span className="d-block text-white small font-weight-bold">{booking.service}</span>
                            <span className="d-block text-white-50 small font-sans" style={{ fontSize: '11px' }}>{booking.batch}</span>
                          </td>
                          <td>
                            <span className="small text-white-50 font-monospace">{new Date(booking.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                          </td>
                          <td>
                            <button
                          onClick={() => handleToggleBookingPayment(booking._id, !booking.paid)}
                          className={`btn btn-sm rounded-1 px-3 py-1 font-weight-bold text-xs ${
                          booking.paid ? 'btn-success' : 'btn-danger'}`
                          }
                          style={{ fontSize: '10px' }}>
                          
                              {booking.paid ? 'PAID' : 'UNPAID'}
                            </button>
                          </td>
                          <td>
                            <select
                          className="form-select form-select-sm rounded-1 text-white bg-transparent border-white border-opacity-10"
                          value={booking.status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                          style={{ width: '130px', fontSize: '12px' }}>
                          
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                    )}
                      {filteredBookings.length === 0 &&
                    <tr><td colSpan="5" className="text-center py-5 text-white-50 small">No bookings found.</td></tr>
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'trials' &&
          <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 font-serif font-weight-bold mb-0">Manage Book Trials</h2>
                <button onClick={() => {
                const today = new Date();
                setBookDate(today.toISOString().split('T')[0]);
                setBookService('Dance Classes (Free Trial)');
                setShowBookingModal(true);
              }} className="btn btn-gold py-2 px-3 small rounded-1">
                  <i className="fas fa-plus small me-1"></i> Add Trial Booking
                </button>
              </div>

              {}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white bg-opacity-5 border-white border-opacity-10 text-white-50"><i className="fas fa-search"></i></span>
                    <input
                    type="text"
                    className="form-control rounded-end-1"
                    placeholder="Search trials by name, phone, service..."
                    value={trialSearch}
                    onChange={(e) => setTrialSearch(e.target.value)} />
                  
                  </div>
                </div>
                <div className="col-12 col-md-6 d-flex gap-2">
                  {['all', 'pending', 'confirmed', 'cancelled'].map((filter) =>
                <button
                  key={filter}
                  onClick={() => setTrialFilter(filter)}
                  className={`btn py-2 px-3 small text-uppercase font-weight-bold border border-white border-opacity-10 ${
                  trialFilter === filter ? 'gold-gradient-bg text-black' : 'bg-transparent text-white-50 hover-text-white'}`
                  }
                  style={{ fontSize: '11px' }}>
                  
                      {filter}
                    </button>
                )}
                </div>
              </div>

              {}
              <div className="glass-panel p-4 rounded shadow">
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr className="border-bottom border-white border-opacity-10 text-white-50">
                        <th>Student</th>
                        <th>Class Details</th>
                        <th>Scheduled Date</th>
                        <th>Payment Status</th>
                        <th>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrials.map((booking, i) =>
                    <tr key={i} className="border-bottom border-white border-opacity-5">
                          <td>
                            <span className="font-weight-bold d-block text-white">{booking.name}</span>
                            <span className="d-block small font-monospace text-white-50" style={{ fontSize: '10px' }}>
                              Ph: {booking.phone} | {booking.email}
                            </span>
                          </td>
                          <td>
                            <span className="d-block text-white small font-weight-bold">{booking.service}</span>
                            <span className="d-block text-white-50 small font-sans" style={{ fontSize: '11px' }}>{booking.batch}</span>
                          </td>
                          <td>
                            <span className="small text-white-50 font-monospace">{new Date(booking.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                          </td>
                          <td>
                            <button
                          onClick={() => handleToggleBookingPayment(booking._id, !booking.paid)}
                          className={`btn btn-sm rounded-1 px-3 py-1 font-weight-bold text-xs ${
                          booking.paid ? 'btn-success' : 'btn-danger'}`
                          }
                          style={{ fontSize: '10px' }}>
                          
                              {booking.paid ? 'PAID' : 'UNPAID'}
                            </button>
                          </td>
                          <td>
                            <select
                          className="form-select form-select-sm rounded-1 text-white bg-transparent border-white border-opacity-10"
                          value={booking.status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                          style={{ width: '130px', fontSize: '12px' }}>
                          
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                    )}
                      {filteredTrials.length === 0 &&
                    <tr><td colSpan="5" className="text-center py-5 text-white-50 small">No trials found.</td></tr>
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'fees' &&
          <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 font-serif font-weight-bold mb-0">Fee Record Ledgers</h2>
                <button onClick={() => {
                const oneWeek = new Date();
                oneWeek.setDate(oneWeek.getDate() + 7);
                setFeeDueDate(oneWeek.toISOString().split('T')[0]);
                setShowFeeModal(true);
              }} className="btn btn-gold py-2 px-3 small rounded-1">
                  <i className="fas fa-plus small me-1"></i> Issue Fee Ledger
                </button>
              </div>

              {}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                  <div className="glass-panel p-4 rounded text-center h-100 d-flex flex-column justify-content-center">
                    <span className="small text-white-50 d-block mb-1">Total Collected Fees</span>
                    <span className="h3 font-weight-bold text-success m-0">₹{stats.totalCollectedFees || 0}</span>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="glass-panel p-4 rounded text-center h-100 d-flex flex-column justify-content-center">
                    <span className="small text-white-50 d-block mb-1">Total Outstanding Balance</span>
                    <span className="h3 font-weight-bold text-warning m-0">₹{stats.totalPendingFees || 0}</span>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="glass-panel p-4 rounded text-center h-100 d-flex flex-column justify-content-center">
                    <span className="small text-white-50 d-block mb-1">Overdue Ledgers count</span>
                    <span className="h3 font-weight-bold text-danger m-0">{stats.overdueFeesCount || 0}</span>
                  </div>
                </div>
              </div>

              {}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white bg-opacity-5 border-white border-opacity-10 text-white-50"><i className="fas fa-search"></i></span>
                    <input
                    type="text"
                    className="form-control rounded-end-1"
                    placeholder="Search ledgers by name, phone..."
                    value={feeSearch}
                    onChange={(e) => setFeeSearch(e.target.value)} />
                  
                  </div>
                </div>
                <div className="col-12 col-md-6 d-flex gap-2">
                  {['all', 'paid', 'partial', 'unpaid'].map((filter) =>
                <button
                  key={filter}
                  onClick={() => setFeeFilter(filter)}
                  className={`btn py-2 px-3 small text-uppercase font-weight-bold border border-white border-opacity-10 ${
                  feeFilter === filter ? 'gold-gradient-bg text-black' : 'bg-transparent text-white-50 hover-text-white'}`
                  }
                  style={{ fontSize: '11px' }}>
                  
                      {filter}
                    </button>
                )}
                </div>
              </div>

              {}
              <div className="glass-panel p-4 rounded shadow">
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr className="border-bottom border-white border-opacity-10 text-white-50">
                        <th>Student Detail</th>
                        <th>Issued Class</th>
                        <th>Ledger summary</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.map((fee, i) => {
                      const balance = fee.totalAmount - (fee.paidAmount || 0);
                      const isPaid = fee.status === 'fully_paid' || fee.status === 'paid';
                      const isPartial = fee.status === 'partially_paid' || fee.status === 'partial';
                      const isOverdue = new Date(fee.dueDate) < new Date() && !isPaid;

                      return (
                        <tr key={i} className="border-bottom border-white border-opacity-5">
                            <td>
                              <span className="font-weight-bold d-block text-white">{fee.studentName}</span>
                              <span className="d-block small text-white-50">Ph: {fee.phone}</span>
                            </td>
                            <td>
                              <span className="small text-white-50">{fee.service}</span>
                            </td>
                            <td>
                              <span className="small d-block text-white-50">Total: <b>₹{fee.totalAmount}</b></span>
                              <span className="small d-block text-success">Paid: <b>₹{fee.paidAmount || 0}</b></span>
                              <span className="small d-block text-warning">Balance: <b>₹{balance}</b></span>
                            </td>
                            <td>
                              <span className={`small font-monospace ${isOverdue ? 'text-danger font-weight-bold' : 'text-white-50'}`}>
                                {new Date(fee.dueDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                {isOverdue && <span className="d-block text-xs uppercase text-danger" style={{ fontSize: '9px' }}>OVERDUE</span>}
                              </span>
                            </td>
                            <td>
                              <span className={`badge py-1.5 px-3 text-xs rounded-1 uppercase ${
                            isPaid ? 'bg-success text-white' : isPartial ? 'bg-warning text-dark' : 'bg-danger text-white'}`
                            }>
                                {isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'UNPAID'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {!isPaid &&
                              <button onClick={() => openCollectPayment(fee)} className="btn btn-sm btn-gold rounded-1 py-1 px-2 text-xs">
                                    Collect
                                  </button>
                              }
                                <button onClick={() => handleDeleteFeeRecord(fee._id)} className="btn btn-sm btn-outline-danger border border-danger text-danger bg-transparent py-1 px-2 text-xs">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>);

                    })}
                      {filteredFees.length === 0 &&
                    <tr><td colSpan="6" className="text-center py-5 text-white-50 small">No ledgers found.</td></tr>
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'health' &&
          <div>
              <h2 className="h4 font-serif font-weight-bold mb-4">System Status & Environment</h2>
              
              <div className="glass-panel p-4 rounded max-w-2xl font-sans">
                <div className="d-flex align-items-center gap-3 pb-3 border-bottom border-white border-opacity-10 mb-4">
                  <div className="rounded-circle bg-success bg-opacity-20 text-success d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="fas fa-heartbeat fs-4 animate-pulse"></i>
                  </div>
                  <div>
                    <h3 className="h6 text-white mb-0 font-weight-bold">System Health Monitor</h3>
                    <span className="small text-white-50">API Gateway check successful</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="row">
                    <div className="col-4 text-white-50 small">API Status</div>
                    <div className="col-8 font-weight-bold text-success font-monospace small">ONLINE (OK)</div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-white-50 small">API Version</div>
                    <div className="col-8 font-monospace small">{healthStatus.version || 'unknown'}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-white-50 small">Timestamp</div>
                    <div className="col-8 font-monospace small text-white-50">{healthStatus.timestamp ? new Date(healthStatus.timestamp).toLocaleString() : 'unknown'}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-white-50 small">Connection URL</div>
                    <div className="col-8 font-monospace small text-white-50">{window.location.origin}</div>
                  </div>
                </div>
              </div>
            </div>
          }

          {}
          {activeTab === 'logo' &&
          <div>
              <h2 className="h4 font-serif font-weight-bold mb-4">Upload Brand Logo</h2>
              
              <div className="glass-panel p-4 p-md-5 rounded max-w-md font-sans">
                <form onSubmit={handleLogoUpload}>
                  <div className="text-center mb-4">
                    <div className="fs-1 text-brand-gold mb-3"><i className="fas fa-image"></i></div>
                    <p className="small text-white-50 mb-0">Select a replacement logo file. The image will overwrite the existing `danzup-logo.png` on the server.</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="small text-white-50 mb-1 d-block">Choose image file (PNG/JPG)</label>
                    <input
                    type="file"
                    accept="image/*"
                    className="form-control rounded-1 p-2"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    required />
                  
                  </div>

                  <button type="submit" className="btn btn-gold w-100 py-3 rounded-1 btn-luxury d-flex align-items-center justify-content-center gap-2">
                    <i className="fas fa-upload small"></i> Upload and Save
                  </button>

                  {logoUploadStatus &&
                <div className="text-center small text-brand-gold mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      {logoUploadStatus}
                    </div>
                }
                </form>
              </div>
            </div>
          }

        </main>
      </div>

      {}

      {}
      {showInquiryModal &&
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3" style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 w-100 position-relative" style={{ maxWidth: '500px' }}>
            <button onClick={() => setShowInquiryModal(false)} className="btn position-absolute top-0 end-0 m-3 text-white-50 border-0 bg-transparent fs-5"><i className="fas fa-times"></i></button>
            <h3 className="h5 font-serif font-weight-bold text-white mb-4">Add Manual Inquiry</h3>
            <form onSubmit={handleAddInquiry}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input type="text" className="form-control" placeholder="First Name" value={inquiryFirstName} onChange={(e) => setInquiryFirstName(e.target.value)} required />
                </div>
                <div className="col-6">
                  <input type="text" className="form-control" placeholder="Last Name" value={inquiryLastName} onChange={(e) => setInquiryLastName(e.target.value)} required />
                </div>
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" placeholder="Phone Number" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Email Address" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Address Details" value={inquiryAddress} onChange={(e) => setInquiryAddress(e.target.value)} required />
              </div>
              <div className="mb-3">
                <select className="form-select text-white bg-transparent" value={inquiryService} onChange={(e) => setInquiryService(e.target.value)}>
                  <option value="Wedding Choreography">Wedding Choreography</option>
                  <option value="Garba Training">Garba Training</option>
                  <option value="Dance Classes">Dance Classes</option>
                  <option value="Yoga Classes">Yoga Classes</option>
                  <option value="Fitness Dance">Fitness Dance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <textarea className="form-control" rows="3" placeholder="Inquiry Notes/Goals" value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} required></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={() => setShowInquiryModal(false)} className="btn btn-outline-white w-25">Cancel</button>
                <button type="submit" disabled={modalLoading} className="btn btn-gold w-75 d-flex align-items-center justify-content-center gap-2">
                  <span>Save Inquiry</span>
                  {modalLoading && <span className="spinner-border spinner-border-sm text-dark" role="status"></span>}
                </button>
              </div>
              {modalError && <div className="text-center small text-danger mt-3">{modalError}</div>}
            </form>
          </div>
        </div>
      }

      {}
      {showBookingModal &&
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3" style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 w-100 position-relative" style={{ maxWidth: '500px' }}>
            <button onClick={() => setShowBookingModal(false)} className="btn position-absolute top-0 end-0 m-3 text-white-50 border-0 bg-transparent fs-5"><i className="fas fa-times"></i></button>
            <h3 className="h5 font-serif font-weight-bold text-white mb-4">Add Manual Booking</h3>
            <form onSubmit={handleAddBooking}>
              <div className="mb-3">
                <select className="form-select text-white bg-transparent" value={bookService} onChange={(e) => setBookService(e.target.value)}>
                  <option value="Dance Classes">Dance Classes</option>
                  <option value="Wedding Choreography">Wedding Choreography</option>
                  <option value="Garba Classes">Garba Classes</option>
                  <option value="Yoga Classes">Yoga Classes</option>
                  <option value="Fitness Dance">Fitness Dance</option>
                  <option value="Starter Plan">Starter Plan</option>
                  <option value="Professional Plan">Professional Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                </select>
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Student Full Name" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input type="tel" className="form-control" placeholder="Phone" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)} required />
                </div>
                <div className="col-6">
                  <input type="email" className="form-control" placeholder="Email" value={bookEmail} onChange={(e) => setBookEmail(e.target.value)} required />
                </div>
              </div>
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <select className="form-select text-white bg-transparent" value={bookBatch} onChange={(e) => setBookBatch(e.target.value)}>
                    <option value="Morning (8:00 AM - 9:00 AM)">Morning (8-9 AM)</option>
                    <option value="Afternoon (4:00 PM - 5:00 PM)">Afternoon (4-5 PM)</option>
                    <option value="Evening (7:00 PM - 8:00 PM)">Evening (7-8 PM)</option>
                  </select>
                </div>
                <div className="col-6">
                  <input type="date" className="form-control text-white" value={bookDate} onChange={(e) => setBookDate(e.target.value)} required />
                </div>
              </div>
              <div className="form-check mb-4">
                <input type="checkbox" className="form-check-input" id="book-paid-check" checked={bookPaid} onChange={(e) => setBookPaid(e.target.checked)} />
                <label className="form-check-label small text-white-50" htmlFor="book-paid-check">Mark Booking as Paid (Yes)</label>
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-outline-white w-25">Cancel</button>
                <button type="submit" disabled={modalLoading} className="btn btn-gold w-75 d-flex align-items-center justify-content-center gap-2">
                  <span>Save Booking</span>
                  {modalLoading && <span className="spinner-border spinner-border-sm text-dark" role="status"></span>}
                </button>
              </div>
              {modalError && <div className="text-center small text-danger mt-3">{modalError}</div>}
            </form>
          </div>
        </div>
      }

      {}
      {showFeeModal &&
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3" style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 w-100 position-relative" style={{ maxWidth: '500px' }}>
            <button onClick={() => setShowFeeModal(false)} className="btn position-absolute top-0 end-0 m-3 text-white-50 border-0 bg-transparent fs-5"><i className="fas fa-times"></i></button>
            <h3 className="h5 font-serif font-weight-bold text-white mb-4">Issue Fee Record Ledger</h3>
            <form onSubmit={handleAddFee}>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Student Full Name" value={feeStudentName} onChange={(e) => setFeeStudentName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" placeholder="Contact Phone" value={feePhone} onChange={(e) => setFeePhone(e.target.value)} required />
              </div>
              <div className="mb-3">
                <select className="form-select text-white bg-transparent" value={feeService} onChange={(e) => setFeeService(e.target.value)}>
                  <option value="Wedding Choreography">Wedding Choreography</option>
                  <option value="Garba Training">Garba Training</option>
                  <option value="Dance Classes">Dance Classes</option>
                  <option value="Yoga Classes">Yoga Classes</option>
                  <option value="Fitness Dance">Fitness Dance</option>
                  <option value="Starter Plan">Starter Plan</option>
                  <option value="Professional Plan">Professional Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                </select>
              </div>
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Total Amount (INR)" value={feeTotal} onChange={(e) => setFeeTotal(e.target.value)} required />
                </div>
                <div className="col-6">
                  <input type="date" className="form-control text-white" value={feeDueDate} onChange={(e) => setFeeDueDate(e.target.value)} required />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={() => setShowFeeModal(false)} className="btn btn-outline-white w-25">Cancel</button>
                <button type="submit" disabled={modalLoading} className="btn btn-gold w-75 d-flex align-items-center justify-content-center gap-2">
                  <span>Issue Ledger</span>
                  {modalLoading && <span className="spinner-border spinner-border-sm text-dark" role="status"></span>}
                </button>
              </div>
              {modalError && <div className="text-center small text-danger mt-3">{modalError}</div>}
            </form>
          </div>
        </div>
      }

      {}
      {showCollectPaymentModal && selectedFee &&
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-75 p-3" style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel p-4 p-md-5 rounded border border-brand-gold border-opacity-25 w-100 position-relative" style={{ maxWidth: '500px' }}>
            <button onClick={() => setShowCollectPaymentModal(false)} className="btn position-absolute top-0 end-0 m-3 text-white-50 border-0 bg-transparent fs-5"><i className="fas fa-times"></i></button>
            <h3 className="h5 font-serif font-weight-bold text-white mb-4">Collect Payment</h3>
            <form onSubmit={handleCollectPaymentSubmit}>
              <div className="mb-3">
                <label className="small text-white-50 mb-1 d-block">Student Name</label>
                <input type="text" className="form-control text-white bg-transparent" value={selectedFee.studentName} disabled />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="small text-white-50 mb-1 d-block">Total Due</label>
                  <input type="text" className="form-control text-white bg-transparent" value={'₹' + (selectedFee.totalAmount - (selectedFee.paidAmount || 0))} disabled />
                </div>
                <div className="col-6">
                  <label className="small text-white-50 mb-1 d-block">Payment Amount (INR)</label>
                  <input type="number" className="form-control text-white" value={collectAmount} onChange={(e) => setCollectAmount(e.target.value)} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="small text-white-50 mb-1 d-block">Notes (Reference ID, Bank, Cash)</label>
                <input type="text" className="form-control" placeholder="UPI transaction ID, Cash, etc." value={collectNotes} onChange={(e) => setCollectNotes(e.target.value)} />
              </div>

              <div className="d-flex gap-2">
                <button type="button" onClick={() => setShowCollectPaymentModal(false)} className="btn btn-outline-white w-25">Cancel</button>
                <button type="submit" disabled={modalLoading} className="btn btn-gold w-75 d-flex align-items-center justify-content-center gap-2">
                  <span>Record Payment</span>
                  {modalLoading && <span className="spinner-border spinner-border-sm text-dark" role="status"></span>}
                </button>
              </div>
              {modalError && <div className="text-center small text-danger mt-3">{modalError}</div>}
            </form>
          </div>
        </div>
      }

    </div>);

}