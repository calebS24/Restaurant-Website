// src/components/CheckoutModal.js
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, cart, cartTotal, delivery, placeOrder, customer, showToast } = useApp();
  const [payment, setPayment] = useState('cash');

  const items = Object.values(cart);

  const handlePlace = () => {
    if (items.length === 0) return;
    placeOrder({ customer: customer.name, phone: customer.phone, payment });
    setCheckoutOpen(false);
    showToast('🎉 Order placed successfully!', 'success');
  };

  if (!checkoutOpen) return null;

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}>
      <div className="modal">
        <div className="modal-title">Confirm Your Order</div>
        <div className="modal-sub">Delivering to {customer?.name}</div>

        <div className="checkout-section-title">Order Summary</div>
        {items.map(i => (
          <div className="checkout-summary-item" key={i.id}>
            <span>{i.name} × {i.qty}</span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}
        <div className="checkout-summary-item"><span>Delivery</span><span>₹{delivery}</span></div>
        <div className="checkout-summary-item total"><span>Total</span><span>₹{cartTotal + delivery}</span></div>

        <div style={{ marginTop: '1.5rem' }}>
          <div className="checkout-section-title">Payment Method</div>
          {['cash', 'upi', 'card'].map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--ink)' }}>
              <input type="radio" name="payment" value={m} checked={payment === m} onChange={() => setPayment(m)} />
              {m === 'cash' ? '💵 Cash on Delivery' : m === 'upi' ? '📱 UPI / QR Code' : '💳 Card Payment'}
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setCheckoutOpen(false)}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handlePlace}>
            Place Order 🎉
          </button>
        </div>
      </div>
    </div>
  );
}
