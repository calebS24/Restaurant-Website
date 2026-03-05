// src/pages/CustomerPage.js
import React from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Customer.css';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CustomerPage() {
  const {
    customer,
    setCurrentPage,
    reservations,
    setRescheduleModal,
    showToast,
    registerCustomer,
    loginCustomer,
    logoutCustomer,
  } = useApp();

  // auth form state
  const [authMode, setAuthMode] = React.useState('login');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [adminAccessMode, setAdminAccessMode] = React.useState(false);

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        showToast('Please enter your email and password.', 'error');
        return;
      }
      const user = await loginCustomer({ email: email.trim(), password, adminMode: adminAccessMode });
      const isStaff = ['owner', 'frontdesk', 'service_manager', 'assistant', 'waiter'].includes(user.role);
      if (adminAccessMode && !isStaff) {
        logoutCustomer();
        showToast('This account is not allowed for admin access.', 'error');
        return;
      }
      showToast(`Welcome back, ${user.name}! 👋`, 'success');
      if (adminAccessMode && isStaff) {
        setCurrentPage('admin');
      }
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    }
  };

  const handleRegister = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast('Please fill in name, email and password.', 'error');
        return;
      }
      const user = await registerCustomer({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });
      showToast(`Account created. Welcome, ${user.name}!`, 'success');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    }
  };

  const handleLogout = () => {
    logoutCustomer();
    showToast('Logged out successfully.', '');
  };

  // customer's reservations
  const myReservations = customer
    ? reservations.filter(r => r.name === customer.name || r.email === customer.email)
    : [];
  const canAccessAdmin = ['owner', 'frontdesk', 'service_manager', 'assistant', 'waiter'].includes(customer?.role);

  return (
    <div className="customer-page">
      <div className="customer-inner">

        {!customer ? (
          /* ── LOGIN ── */
          <div className="customer-auth">
            <div className="customer-auth-head">
              <div className="customer-auth-title">My Account</div>
              <button className="dark-mode-toggle" onClick={() => setAdminAccessMode(v => !v)}>
                <div className={`toggle-track ${adminAccessMode ? 'on' : ''}`}>
                  <div className={`toggle-thumb ${adminAccessMode ? 'on' : ''}`} />
                </div>
                <span className="access-label-desktop">{adminAccessMode ? '🛡️ Admin Access' : '👤 Customer Access'}</span>
                <span className="access-label-mobile">{adminAccessMode ? '🛡️ Admin' : '👤 Customer'}</span>
              </button>
            </div>
            <div className="customer-auth-sub">Sign in or create an account to track your orders, reservations and reviews.</div>

            <div className="customer-auth-tabs">
              <button
                className={`customer-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={`customer-auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            {authMode === 'register' && (
              <div className="customer-input-group">
                <label className="customer-input-label">Full Name *</label>
                <input className="customer-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="customer-input-group">
              <label className="customer-input-label">Email Address *</label>
              <input className="customer-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="customer-input-group">
              <label className="customer-input-label">Password *</label>
              <input className="customer-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            {authMode === 'register' && (
              <div className="customer-input-group">
                <label className="customer-input-label">Phone (optional)</label>
                <input className="customer-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
            )}

            {authMode === 'register' ? (
              <button className="customer-login-btn" onClick={handleRegister}>Create Account →</button>
            ) : (
              <button className="customer-login-btn" onClick={handleLogin}>Login →</button>
            )}
          </div>
        ) : (
          /* ── DASHBOARD ── */
          <>
            <div className="customer-header">
              <div className="customer-welcome">
                Hey, <span>{customer.name}</span> 👋
              </div>
              <div className="customer-header-actions">
                {canAccessAdmin && (
                  <button className="customer-admin-btn" onClick={() => setCurrentPage('admin')}>
                    Switch to Admin
                  </button>
                )}
                <button className="customer-logout-btn" onClick={handleLogout}>Sign Out</button>
              </div>
            </div>

            <div className="customer-stats">
              <div className="customer-stat-card">
                <div className="customer-stat-val">{(customer.orders || []).length}</div>
                <div className="customer-stat-label">Orders</div>
              </div>
              <div className="customer-stat-card">
                <div className="customer-stat-val">{myReservations.length}</div>
                <div className="customer-stat-label">Reservations</div>
              </div>
              <div className="customer-stat-card">
                <div className="customer-stat-val">{(customer.reviews || []).length}</div>
                <div className="customer-stat-label">Reviews</div>
              </div>
            </div>

            {/* Reservations */}
            <div className="customer-section-title">📅 My Reservations</div>
            {myReservations.length === 0 ? (
              <p className="customer-empty">
                No reservations yet. <a href="#reservation" onClick={e => { e.preventDefault(); setCurrentPage('home'); setTimeout(() => { document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }); }, 150); }}>Book a table →</a>
              </p>
            ) : (
              myReservations.map(r => (
                <div className="customer-res-card" key={r.id}>
                  <div>
                    <div className="customer-res-date">{formatDate(r.date)} at {r.time}</div>
                    <div className="customer-res-sub">{r.guests} · {r.occasion}</div>
                  </div>
                  <div className="customer-res-actions">
                    <span className={`status-badge status-${r.status}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    {/* Reschedule button — available if not cancelled/attended */}
                    {r.attendance !== 'attended' && r.attendance !== 'cancelled' && (
                      <button
                        className="customer-reschedule-btn"
                        onClick={() => setRescheduleModal(r)}
                      >
                        📆 Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Orders */}
            <div className="customer-section-title" style={{ marginTop: '2rem' }}>📦 My Orders</div>
            {(customer.orders || []).length === 0 ? (
              <p className="customer-empty">No orders yet. <a href="#!" onClick={e => { e.preventDefault(); setCurrentPage('home'); }}>Browse the menu →</a></p>
            ) : (
              (customer.orders || []).map(o => (
                <div className="customer-res-card" key={o.id}>
                  <div>
                    <div className="customer-res-date">{o.id} · ₹{o.total}</div>
                    <div className="customer-res-sub">{o.items}</div>
                  </div>
                  <span className="status-badge status-confirmed">Preparing</span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
