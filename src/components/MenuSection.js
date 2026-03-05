// src/components/MenuSection.js
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FALLBACK_MENU_IMG = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'kerala', label: '🌴 Kerala' },
  { key: 'chinese', label: '🥢 Chinese' },
  { key: 'south-indian', label: '🌶 South Indian' },
  { key: 'beverages', label: '☕ Beverages' },
  { key: 'desserts', label: '🍮 Desserts' },
];

export default function MenuSection() {
  const { menuData, cart, addToCart, removeFromCart } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? menuData : menuData.filter(i => i.cat === activeTab);

  return (
    <section className="section menu-section" id="menu">
      <div className="section-inner">
        <div className="fade-in-up">
          <div className="section-label">Our Offerings</div>
          <h2 className="section-title">Curated <em>Menu</em></h2>
          <p className="section-desc">From the spice-rich shores of Kerala to the smoky woks of Canton — explore a menu crafted with love and tradition.</p>
        </div>

        <div className="menu-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`menu-tab ${activeTab === c.key ? 'active' : ''}`}
              onClick={() => setActiveTab(c.key)}
            >{c.label}</button>
          ))}
        </div>

        <div className="menu-grid">
          {filtered.map(item => {
            const inCart = cart[item.id];
            return (
              <div className="menu-card" key={item.id}>
                <div className="menu-card-img-wrap">
                  <img
                    className="menu-card-img"
                    src={item.img}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_MENU_IMG;
                    }}
                  />
                  <span className={`menu-card-badge ${item.type === 'veg' ? 'veg' : ''}`}>
                    {item.type === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
                  </span>
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-desc">{item.desc}</div>
                  <div className="menu-card-footer">
                    <div className="menu-card-price">
                      ₹{item.price} <small>/ serving</small>
                    </div>
                    {inCart ? (
                      <div className="menu-qty-ctrl">
                        <button className="menu-qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                        <span className="menu-qty-num">{inCart.qty}</span>
                        <button className="menu-qty-btn" onClick={() => { addToCart(item); }}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => { addToCart(item); }}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
