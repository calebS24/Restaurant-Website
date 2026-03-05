// src/components/ReviewsSection.js
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function ReviewModal({ onClose }) {
  const { addReview, customer, showToast, menuData } = useApp();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState(customer?.name || '');
  const [dish, setDish] = useState('');
  const dishOptions = Array.from(new Set((menuData || []).map(item => item.name))).sort((a, b) => a.localeCompare(b));

  const submit = () => {
    if (!rating || !text.trim() || !name.trim()) {
      showToast('Please fill in all fields and select a rating.', 'error');
      return;
    }
    addReview({
      name, rating, text, dish,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
      date: new Date().toLocaleString('en-IN', { month: 'short', year: 'numeric' }),
    });
    showToast('Thank you for your review! 🌟', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-title">Write a Review</div>
        <div className="modal-sub">Share your experience at The Venice Food Hub</div>

        <div className="star-picker">
          {[1,2,3,4,5].map(s => (
            <span
              key={s}
              className={`star-pick ${s <= (hovered || rating) ? 'active' : ''}`}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
            >★</span>
          ))}
        </div>

        <div className="review-form-grid">
          <div>
            <label className="admin-label">Your Name</label>
            <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label className="admin-label">What did you order?</label>
            <select className="admin-input" value={dish} onChange={e => setDish(e.target.value)}>
              <option value="">Select a dish</option>
              {dishOptions.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="span2">
            <label className="admin-label">Your Review *</label>
            <textarea className="admin-input" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Tell us about your experience..." style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>Submit Review ✨</button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { reviews } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const GOOGLE_RATING = 3.4;
  const GOOGLE_REVIEW_COUNT = 1938;

  return (
    <section className="section reviews-section" id="reviews">
      <div className="section-inner">
        <div className="reviews-header">
          <div>
            <div className="section-label">What People Say</div>
            <h2 className="section-title">Guest <em>Reviews</em></h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="overall-rating">
              <div className="big-rating">{GOOGLE_RATING.toFixed(1)}</div>
              <div>
                <div className="stars">{'★'.repeat(Math.round(GOOGLE_RATING))}{'☆'.repeat(5 - Math.round(GOOGLE_RATING))}</div>
                <div className="rating-total">{GOOGLE_REVIEW_COUNT.toLocaleString('en-IN')} Google reviews</div>
                <div className="rating-total">Showing {reviews.length} latest in-app reviews</div>
              </div>
            </div>
            <button className="write-review-btn" onClick={() => setModalOpen(true)}>✍ Write a Review</button>
          </div>
        </div>

        <div className="reviews-marquee">
          <div className="fade-edge-left" />
          <div className="fade-edge-right" />
          <div className="reviews-track">
            {[...reviews, ...reviews].map((r, i) => (
              <div className="review-card" key={`${r.id}-${i}`}>
                <div className="reviewer">
                  <img className="reviewer-avatar" src={r.avatar} alt={r.name} />
                  <div>
                    <div className="reviewer-name">{r.name}</div>
                    <div className="reviewer-date">{r.date}</div>
                  </div>
                </div>
                <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <div className="review-text">{r.text}</div>
                {r.dish && <span className="review-food-tag">🍽 {r.dish}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && <ReviewModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
