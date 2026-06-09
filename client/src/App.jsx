import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import api, { DEFAULT_SETTINGS } from './api/api';
import Header from './components/Header';

import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admin/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to load store settings:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.google_site_verification) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.google_site_verification);
    }
  }, [settings]);

  useEffect(() => {
    // Initialize AOS
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
      });
    }
  }, []);

  // Re-initialize AOS on route change to scan the newly mounted DOM elements
  const location = useLocation();
  useEffect(() => {
    const initAos = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true
        });
        window.AOS.refresh();
      }
    };
    initAos();
    // Run again with a slight delay to ensure dynamic/async React nodes are in the DOM
    const timer = setTimeout(initAos, 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Header settings={settings} />}

      <main className={isAdminPath ? "min-h-screen overflow-x-hidden bg-slate-50" : "min-h-screen pt-20 pb-12 overflow-x-hidden"}>
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact settings={settings} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer settings={settings} />}

      {/* Global Overlays */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <Toast />

      {/* Floating WhatsApp Widget */}
      {!isAdminPath && (
        <div className="fixed bottom-24 sm:bottom-6 right-6 z-40 group flex flex-col items-end">
          <div className="bg-[#1e293b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl mb-3 opacity-0 translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
            Need Help? Chat on WhatsApp
          </div>
          <a 
            href={`https://wa.me/${(settings?.whatsapp_phone_1 || DEFAULT_SETTINGS.whatsapp_phone_1).replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello, I am interested in your natural powder products.')}`} 
            target="_blank" 
            rel="noreferrer" 
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl relative hover:scale-110 transition-transform duration-300" 
            aria-label="Chat on WhatsApp"
          >
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-pulse-ring -z-10"></span>
            <i className="fa-brands fa-whatsapp text-3xl"></i>
          </a>
        </div>
      )}
    </>
  );
}

export default App;
