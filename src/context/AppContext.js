// src/context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { menuItems as initialMenu, initialReviews, galleryPhotos as initialGallery } from '../data/menuItems';

const AppContext = createContext();
const AUTH_TOKEN_KEY = 'venice_auth_token';
const ADMIN_SESSION_KEY = 'venice_admin_session';
const GALLERY_STORAGE_KEY = 'venice_gallery_photos';
const RESERVATIONS_STORAGE_KEY = 'venice_reservations';
const API_BASE_URL = String(process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, '');
const VALID_PAGES = new Set(['home', 'customer', 'admin', 'gallery']);
const STAFF_ROLES = new Set(['owner', 'frontdesk', 'service_manager', 'assistant', 'waiter']);

function pageToPath(page) {
  if (page === 'customer') return '/customer';
  if (page === 'admin') return '/admin';
  if (page === 'gallery') return '/gallery';
  return '/';
}

function pathToPage(pathname) {
  if (pathname === '/customer') return 'customer';
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'admin';
  if (pathname === '/gallery') return 'gallery';
  return 'home';
}

function isStaffRole(role) {
  return STAFF_ROLES.has(role);
}

function loadStoredGallery() {
  if (typeof window === 'undefined') return initialGallery;
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return initialGallery;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialGallery;
    return parsed;
  } catch (_err) {
    return initialGallery;
  }
}

function loadStoredReservations() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_err) {
    return [];
  }
}

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let url = path;
  if (!/^https?:\/\//i.test(path)) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const base = API_BASE_URL;
    if (base && /\/api\/?$/i.test(base) && /^\/api\//i.test(normalizedPath)) {
      url = `${base.replace(/\/+$/, '')}${normalizedPath.replace(/^\/api/, '')}`;
    } else {
      url = `${base}${normalizedPath}`;
    }
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (_err) {
    throw new Error('Cannot reach server. Start backend and check network.');
  }

  const contentType = res.headers.get('content-type') || '';
  let data = {};
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    const text = await res.text().catch(() => '');
    data = text ? { error: text } : {};
  }
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function AppProvider({ children }) {
  // ── Page navigation ──
  const [currentPage, setCurrentPageState] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    return pathToPage(window.location.pathname);
  }); // 'home' | 'customer' | 'admin'

  const setCurrentPage = React.useCallback((nextPage, { replace = false } = {}) => {
    const safePage = VALID_PAGES.has(nextPage) ? nextPage : 'home';
    setCurrentPageState(safePage);

    if (typeof window !== 'undefined') {
      const nextPath = pageToPath(safePage);
      const currentPath = window.location.pathname;
      if (nextPath !== currentPath) {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', nextPath);
      }
    }
  }, []);

  // ── Dark mode (customer page only) ──
  const [darkMode, setDarkMode] = useState(false);

  // ── Auth ──
  const [customer, setCustomer] = useState(null); // null = not logged in
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '');
  const [adminSession, setAdminSession] = useState(() => localStorage.getItem(ADMIN_SESSION_KEY) === '1');
  const [authLoading, setAuthLoading] = useState(true);

  // ── Menu ──
  const [menuData, setMenuData] = useState(initialMenu);

  // ── Cart: { [id]: { ...item, qty } } ──
  const [cart, setCart] = useState({});

  // ── Modals ──
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(null); // reservation object or null

  // ── Reviews ──
  const [reviews, setReviews] = useState(initialReviews);

  // ── Reservations ──
  const [reservations, setReservations] = useState(() => loadStoredReservations());

  // ── Orders ──
  const [orders, setOrders] = useState([]);

  // ── Gallery ──
  const [gallery, setGallery] = useState(() => loadStoredGallery());

  // ── Toast ──
  const [toast, setToast] = useState({ msg: '', type: '', visible: false });

  // ── Cart helpers ──
  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: prev[item.id]
        ? { ...prev[item.id], qty: prev[item.id].qty + 1 }
        : { ...item, qty: 1 }
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      if (!prev[id]) return prev;
      if (prev[id].qty <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...prev[id], qty: prev[id].qty - 1 } };
    });
  };

  const clearCart = () => setCart({});

  const cartTotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const delivery = cartTotal > 0 ? 40 : 0;

  // ── Toast helper ──
  const showToast = (msg, type = '') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  // ── Auth helpers ──
  const hydrateAuthUser = async (token) => {
    if (!token) {
      setCustomer(null);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminSession(false);
      setAuthLoading(false);
      return;
    }
    try {
      const data = await apiRequest('/api/auth/me', { token });
      setCustomer(prev => ({
        ...data.user,
        orders: prev?.orders || [],
        reviews: prev?.reviews || [],
        reservations: prev?.reservations || [],
      }));
      if (!isStaffRole(data.user.role)) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminSession(false);
      }
    } catch (_err) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setAuthToken('');
      setAdminSession(false);
      setCustomer(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const registerCustomer = async ({ name, email, password, phone }) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name, email, password, phone },
    });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    setAuthToken(data.token);
    setCustomer(prev => ({
      ...data.user,
      orders: prev?.orders || [],
      reviews: prev?.reviews || [],
      reservations: prev?.reservations || [],
    }));
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminSession(false);
    return data.user;
  };

  const loginCustomer = async ({ email, password, adminMode = false }) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password, adminMode },
    });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    setAuthToken(data.token);
    setCustomer(prev => ({
      ...data.user,
      orders: prev?.orders || [],
      reviews: prev?.reviews || [],
      reservations: prev?.reservations || [],
    }));
    const adminOnly = adminMode && isStaffRole(data.user.role);
    if (adminOnly) {
      localStorage.setItem(ADMIN_SESSION_KEY, '1');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    setAdminSession(adminOnly);
    return data.user;
  };

  const logoutCustomer = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthToken('');
    setAdminSession(false);
    setCustomer(null);
  };

  useEffect(() => {
    hydrateAuthUser(authToken);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onPopState = () => {
      setCurrentPageState(pathToPage(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  // ── Review helpers ──
  const addReview = (review) => {
    setReviews(prev => [{ ...review, id: 'rv' + Date.now() }, ...prev]);
    if (customer) {
      setCustomer(prev => ({ ...prev, reviews: [review, ...(prev.reviews || [])] }));
    }
  };
  const removeReview = (id) => setReviews(prev => prev.filter(r => r.id !== id));

  // ── Reservation helpers ──
  const addReservation = (res) => {
    const maxId = reservations.reduce((max, r) => {
      const n = parseInt(String(r?.id || '').replace(/^RES/, ''), 10);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    const newRes = {
      ...res,
      id: 'RES' + String(maxId + 1).padStart(3, '0'),
      status: 'pending',
      attendance: null,
    };
    setReservations(prev => [...prev, newRes]);
    if (customer) {
      setCustomer(prev => ({ ...prev, reservations: [...(prev.reservations || []), newRes] }));
    }
    return newRes;
  };
  const updateReservation = (id, updates) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };
  const removeReservation = (id) => setReservations(prev => prev.filter(r => r.id !== id));

  // ── Menu helpers ──
  const addMenuItem = (item) => setMenuData(prev => [...prev, { ...item, id: Date.now() }]);
  const removeMenuItem = (id) => setMenuData(prev => prev.filter(i => i.id !== id));
  const updateMenuItem = (id, updates) => {
    setMenuData(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
  };

  // ── Order helpers ──
  const placeOrder = (details) => {
    const orderItems = Object.values(cart).map(i => ({
      id: i.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      lineTotal: i.price * i.qty,
    }));
    const order = {
      id: 'ORD' + String(orders.length + 1).padStart(3, '0'),
      ...details,
      orderItems,
      items: Object.values(cart).map(i => `${i.name}×${i.qty}`).join(', '),
      subtotal: cartTotal,
      deliveryFee: delivery,
      total: cartTotal + delivery,
      status: 'preparing',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders(prev => [...prev, order]);
    if (customer) {
      setCustomer(prev => ({ ...prev, orders: [...(prev.orders || []), order] }));
    }
    clearCart();
    return order;
  };

  // ── Gallery helper ──
  const addPhoto = (photo) => setGallery(prev => [photo, ...prev]);
  const removePhoto = (id) => setGallery(prev => prev.filter(photo => photo.id !== id));

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      darkMode, setDarkMode,
      customer, setCustomer,
      adminSession,
      authToken, authLoading,
      registerCustomer, loginCustomer, logoutCustomer,
      menuData, addMenuItem, removeMenuItem, updateMenuItem,
      cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, delivery,
      cartOpen, setCartOpen,
      checkoutOpen, setCheckoutOpen,
      reviewModalOpen, setReviewModalOpen,
      rescheduleModal, setRescheduleModal,
      reviews, addReview, removeReview,
      reservations, addReservation, updateReservation, removeReservation,
      orders, placeOrder,
      gallery, addPhoto, removePhoto,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
