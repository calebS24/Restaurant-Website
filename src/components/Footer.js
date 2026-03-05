// src/components/Footer.js
import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setCurrentPage } = useApp();

  const scrollTo = (id) => {
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">
            <img className="footer-brand-logo" src="/venice-logo-1.png" alt="The Venice Food Hub" />
          </div>
          <p className="footer-tagline">
            Serving authentic Kerala, Chinese and South Indian cuisine since 2017.
            Located in the heart of Nangiarkulangara, Alappuzha.
          </p>
          <div className="footer-social">
            <a
              className="social-btn"
              href="https://www.facebook.com/profile.php?id=100063849047797"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              className="social-btn"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              📸
            </a>
            <a
              className="social-btn"
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>
        </div>
        <div>
          <div className="footer-heading">Navigate</div>
          <ul className="footer-links">
            <li><button onClick={() => scrollTo('menu')}>Menu</button></li>
            <li><button onClick={() => scrollTo('reservation')}>Reservations</button></li>
            <li><button onClick={() => scrollTo('reviews')}>Reviews</button></li>
            <li><button onClick={() => scrollTo('gallery')}>Gallery</button></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Visit Us</div>
          <ul className="footer-links">
            <li><a href="#!">Nangiarkulangara</a></li>
            <li><a href="#!">Alappuzha - 690513</a></li>
            <li><a href="#!">Kerala, India</a></li>
            <li><a href="#!">Opp. Govt. UP School</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Hours</div>
          <ul className="footer-links">
            <li><a href="#!">Mon–Fri: 11AM–11PM</a></li>
            <li><a href="#!">Saturday: 10AM–11PM</a></li>
            <li><a href="#!">Sunday: 10AM–10:30PM</a></li>
          </ul>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <span>© 2026 The Venice Food Hub. All rights reserved.</span>
        <span>Made with ❤️ in Alappuzha</span>
      </div>
    </footer>
  );
}
