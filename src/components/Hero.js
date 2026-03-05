// src/components/Hero.js
import React from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Hero.css';

export default function Hero() {
  const { setCurrentPage } = useApp();

  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-text">VENICE</div>
      <div className="hero-grain" />
      <div className="hero-content">
        <div>
          <div className="hero-tag">Est. 2017 · Nangiarkulangara, Alappuzha</div>
          <h1 className="hero-title">
            Where Every Meal Tells a <em>Story</em>
          </h1>
          <p className="hero-desc">
            From the spice-kissed shores of Kerala to the smoky woks of Canton — The Venice Food Hub
            brings authentic flavours to your table since 2017.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo('menu')}>🍽 Explore Menu</button>
            <button className="btn-ghost" onClick={() => scrollTo('reservation')}>📅 Reserve a Table</button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">8+</div>
              <div className="hero-stat-label">Years Serving</div>
            </div>
            <div>
              <div className="hero-stat-num">50+</div>
              <div className="hero-stat-label">Menu Items</div>
            </div>
            <div>
              <div className="hero-stat-num">4</div>
              <div className="hero-stat-label">Cuisines</div>
            </div>
          </div>
        </div>

        <div className="hero-image-grid">
          <div className="hero-badge"><span>⭐</span>3.5<br />RATED</div>
          <div className="hero-img-card">
            <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80" alt="Kerala cuisine" />
            <div className="hero-img-label">Kerala Special</div>
          </div>
          <div className="hero-img-card">
            <img src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" alt="Chinese food" />
            <div className="hero-img-label">Chinese</div>
          </div>
          <div className="hero-img-card">
            <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80" alt="South Indian" />
            <div className="hero-img-label">South Indian</div>
          </div>
        </div>
      </div>
    </section>
  );
}
