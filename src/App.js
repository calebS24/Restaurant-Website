// src/App.js
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import CartFab from './components/CartFab';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import './styles/global.css';
import './styles/sections.css';

function AppInner() {
  const { currentPage, customer, setCurrentPage, adminSession, logoutCustomer, authLoading } = useApp();
  const canAccessAdmin = ['owner', 'frontdesk', 'service_manager', 'assistant', 'waiter'].includes(customer?.role);
  const adminOnly = adminSession && canAccessAdmin;
  const showAdminPage = (currentPage === 'admin' && canAccessAdmin) || adminOnly;

  React.useEffect(() => {
    if (authLoading) return;
    if (currentPage === 'admin' && !canAccessAdmin) {
      setCurrentPage('customer', { replace: true });
    }
  }, [authLoading, currentPage, canAccessAdmin, setCurrentPage]);

  React.useEffect(() => {
    if (authLoading) return;
    if (adminOnly && currentPage !== 'admin') {
      setCurrentPage('admin', { replace: true });
    }
  }, [authLoading, adminOnly, currentPage, setCurrentPage]);

  return (
    <>
      {!showAdminPage && <Navbar />}
      {!showAdminPage && currentPage === 'home' && <div style={{ paddingTop: 70 }}><HomePage /></div>}
      {!showAdminPage && currentPage === 'customer' && <CustomerPage />}
      {showAdminPage && <AdminPage adminOnly={showAdminPage} />}
      {showAdminPage && (
        <button
          onClick={logoutCustomer}
          style={{
            position: 'fixed',
            top: 14,
            right: 14,
            zIndex: 2200,
            border: '1px solid #7d1528',
            background: '#8b1a2f',
            color: '#fff',
            borderRadius: 10,
            padding: '0.45rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      )}
      {!showAdminPage && <CartSidebar />}
      {!showAdminPage && <CartFab />}
      {!showAdminPage && <CheckoutModal />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
