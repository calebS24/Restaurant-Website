// src/components/CartSidebar.js
import React from 'react';
import { useApp } from '../context/AppContext';

const FALLBACK_MENU_IMG = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80';

export default function CartSidebar() {
  const {
    cart, addToCart, removeFromCart,
    cartOpen, setCartOpen,
    cartTotal, delivery,
    setCheckoutOpen,
    customer, setCurrentPage,
    showToast,
  } = useApp();

  const items = Object.values(cart);

  const handleCheckout = () => {
    if (!customer) {
      showToast('Please log in to your account before checking out.', 'error');
      setCartOpen(false);
      setCurrentPage('customer');
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">🛒 Your Cart</div>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🍽</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Add some delicious items from our menu!</p>
            </div>
          ) : (
            items.map(item => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item-img"
                  src={item.img}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_MENU_IMG;
                  }}
                />
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price * item.qty}</div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          {cartTotal > 0 && (
            <div className="cart-total-row">
              <span className="cart-total-label">Delivery</span>
              <span>₹{delivery}</span>
            </div>
          )}
          <div className="cart-total-row">
            <span className="cart-total-label" style={{ fontWeight: 700 }}>Total</span>
            <span className="cart-total-val">₹{cartTotal + delivery}</span>
          </div>
          <button
            className="cart-checkout-btn"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            {customer ? '✨ Proceed to Checkout' : '🔒 Login to Checkout'}
          </button>
        </div>
      </div>
    </>
  );
}
