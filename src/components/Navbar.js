// src/components/Navbar.js
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { setCurrentPage, cartCount, setCartOpen, customer, showToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (page, hash) => {
    if (page === 'admin' && !['owner', 'frontdesk', 'service_manager', 'assistant', 'waiter'].includes(customer?.role)) {
      showToast('Admin access is restricted. Please login with an admin account.', 'error');
      setCurrentPage('customer');
      setMenuOpen(false);
      return;
    }

    setCurrentPage(page);
    setMenuOpen(false);

    if (page === 'home' && !hash) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
      return;
    }

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const navEl = document.querySelector('.nav');
          const navHeight = navEl ? navEl.getBoundingClientRect().height : 70;
          const extraGap = 14;
          const y = el.getBoundingClientRect().top + window.pageYOffset - navHeight - extraGap;
          window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => goTo('home')}>
          <img className="nav-logo-img" src="/venice-logo.png" alt="The Venice Food Hub" />
          <span className="nav-logo-text">The Venice <em>Food Hub</em></span>
        </button>

        <ul className="nav-links">
          <li><button className="nav-link-btn" onClick={() => goTo('home', 'menu')}>Menu</button></li>
          <li><button className="nav-link-btn" onClick={() => goTo('home', 'reservation')}>Reserve</button></li>
          <li><button className="nav-link-btn" onClick={() => goTo('home', 'reviews')}>Reviews</button></li>
          <li><button className="nav-link-btn" onClick={() => goTo('home', 'gallery')}>Gallery</button></li>
          <li>
            <button className="nav-link-btn" onClick={() => setCartOpen(true)}>
              Your Cart {cartCount > 0 && <span style={{ background: 'var(--spice)', color: '#fff', borderRadius: '50%', padding: '0 5px', fontSize: '0.7rem', marginLeft: '2px' }}>{cartCount}</span>}
            </button>
          </li>
          <li><button className="nav-link-btn nav-cta" onClick={() => goTo('customer')}>My Account</button></li>
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => goTo('home', 'menu')}>Menu</button>
        <button onClick={() => goTo('home', 'reservation')}>Reserve</button>
        <button onClick={() => goTo('home', 'reviews')}>Reviews</button>
        <button onClick={() => goTo('home', 'gallery')}>Gallery</button>
        <button onClick={() => { setCartOpen(true); setMenuOpen(false); }}>Your Cart {cartCount > 0 && `(${cartCount})`}</button>
        <button className="nav-mobile-cta" onClick={() => goTo('customer')}>My Account</button>
      </div>
    </nav>
  );
}
