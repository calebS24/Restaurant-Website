// src/components/ReservationSection.js
import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function ReservationSection() {
  const { addReservation, customer, showToast } = useApp();

  const nameRef = useRef(), phoneRef = useRef(), emailRef = useRef();
  const dateRef = useRef(), timeRef = useRef(), guestsRef = useRef();
  const occasionRef = useRef(), notesRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = {
      name: nameRef.current.value.trim(),
      phone: phoneRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      date: dateRef.current.value,
      time: timeRef.current.value,
      guests: guestsRef.current.value,
      occasion: occasionRef.current.value || 'Regular Dining',
      notes: notesRef.current.value.trim(),
    };
    if (!res.name || !res.phone || !res.date || !res.time) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    addReservation(res);
    showToast(`✅ Reservation confirmed for ${res.name}!`, 'success');
    e.target.reset();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="reservation-section" id="reservation">
      <div className="section-inner">
        <div className="fade-in-up">
          <h2 className="section-title">Make a <em>Reservation</em></h2>
          <p className="section-desc">Reserve your table in advance and enjoy a seamless dining experience at The Venice Food Hub.</p>
        </div>

        <div className="reservation-layout">
          <form className="res-form" onSubmit={handleSubmit}>
            <div className="res-fields">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input ref={nameRef} defaultValue={customer?.name || ''} type="text" className="form-input" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input ref={phoneRef} defaultValue={customer?.phone || ''} type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input ref={emailRef} defaultValue={customer?.email || ''} type="email" className="form-input" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input ref={dateRef} type="date" className="form-input" min={today} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <select ref={timeRef} className="form-input" required defaultValue="">
                  <option value="" disabled>Select time</option>
                  {['11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','03:00 PM',
                    '06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM']
                    .map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Guests *</label>
                <select ref={guestsRef} className="form-input" required>
                  {['1 Person','2 People','3 People','4 People','5 People','6 People','7-10 People','10+ People']
                    .map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group span1 occasion-field">
                <label className="form-label">Occasion</label>
                <select ref={occasionRef} className="form-input">
                  <option value="">Regular Dining</option>
                  {['Birthday','Anniversary','Business Lunch','Family Gathering','Date Night']
                    .map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group span2 notes-field">
                <label className="form-label">Special Requests</label>
                <textarea ref={notesRef} className="form-input" placeholder="Dietary requirements, allergies, special arrangements..." rows={2} />
              </div>
            </div>
            <button type="submit" className="form-submit">✨ Confirm Reservation</button>
          </form>

          <div className="res-info">
            <div className="res-info-card">
              <div className="res-info-icon">🕐</div>
              <div>
                <div className="res-info-title">Opening Hours</div>
                <div className="hours-grid">
                  <span className="hours-row"><strong>Mon–Fri</strong></span><span className="hours-row">11 AM – 11 PM</span>
                  <span className="hours-row"><strong>Saturday</strong></span><span className="hours-row">10 AM – 11 PM</span>
                  <span className="hours-row"><strong>Sunday</strong></span><span className="hours-row">10 AM – 10:30 PM</span>
                </div>
              </div>
            </div>
            <div className="res-info-card">
              <div className="res-info-icon">📍</div>
              <div>
                <div className="res-info-title">Location</div>
                <div className="res-info-text">Nangyarkulangara, Alappuzha - 690513<br />Opposite Govt. UP School, Kerala</div>
              </div>
            </div>
            <div className="res-info-card">
              <div className="res-info-icon">📞</div>
              <div>
                <div className="res-info-title">Direct Contact</div>
                <div className="res-info-text">Call 090488 44099 for group bookings (10+) or special event arrangements.</div>
              </div>
            </div>
            <div className="res-info-card">
              <div className="res-info-icon">ℹ️</div>
              <div>
                <div className="res-info-title">Policy</div>
                <div className="res-info-text">Tables held 15 mins past booked time. Cancellations 2 hrs in advance. Parties of 6+ require advance booking.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
