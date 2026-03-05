// src/components/CartFab.js
import React from 'react';
import { useApp } from '../context/AppContext';

export default function CartFab() {
  const { cartCount, setCartOpen, currentPage } = useApp();
  if (currentPage !== 'home') return null;
  return (
    <button className="cart-fab" onClick={() => setCartOpen(true)} aria-label="Open cart">
      🛒
      <span className={`cart-fab-badge ${cartCount > 0 ? 'show' : ''}`}>{cartCount}</span>
    </button>
  );
}
