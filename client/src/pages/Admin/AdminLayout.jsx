import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminContacts from './AdminContacts';
import AdminCustomers from './AdminCustomers';
import InvoicePrint from './InvoicePrint';
import AdminLogin from './AdminLogin';
import AdminCategories from './AdminCategories';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    if (!loading) {
      if (location.pathname === '/admin/login') {
        if (user && user.role === 'admin') {
          navigate('/admin');
        }
        return;
      }

      if (!user) {
        navigate('/admin/login');
      } else if (user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  // If on login page, render AdminLogin view directly without layout shell wrapper
  if (location.pathname === '/admin/login') {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-slate-400">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: '/admin/products', label: 'Products Stock', icon: 'fa-boxes-stacked' },
    { path: '/admin/categories', label: 'Product Categories', icon: 'fa-tags' },
    { path: '/admin/orders', label: 'Customer Orders', icon: 'fa-truck-ramp-box' },
    { path: '/admin/customers', label: 'Customer Records', icon: 'fa-users' },
    { path: '/admin/contacts', label: 'Contact Inquiries', icon: 'fa-envelope-open-text' },
    { path: '/admin/logs', label: 'Change Tracker Logs', icon: 'fa-clock-rotate-left' }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0F2942] text-white flex-shrink-0 shadow-2xl relative z-20">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-leaf text-white text-lg" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg leading-none tracking-wide text-white">NVKM GROUP</h2>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mt-1 block">ADMIN CONSOLE</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-white/5 bg-black/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-heading font-extrabold text-sm text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-heading font-extrabold text-xs text-white truncate">{user.name}</h3>
            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active session
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'text-slate-350 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Links */}
        <div className="p-4 border-t border-white/10 bg-black/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-[11px] font-extrabold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <i className="fa-solid fa-store" /> Back To Shop
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-350 hover:text-red-200 text-[11px] font-extrabold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket" /> Sign Out Session
          </button>
        </div>
      </aside>

      {/* ── MOBILE MENU DRAWER ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div onClick={() => setSidebarOpen(false)} className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-80 max-w-[85%] h-full bg-[#0F2942] text-white flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-leaf text-blue-400 text-lg" />
              <span className="font-heading font-black text-sm text-white">NVKM <span className="text-sky-400 font-medium">ADMIN</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5"><i className="fa-solid fa-xmark text-sm" /></button>
          </div>

          <div className="p-4 bg-black/15 flex items-center gap-3 border-b border-white/5">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-heading font-bold text-white text-xs">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="font-heading font-extrabold text-xs text-white leading-tight">{user.name}</p>
              <span className="text-[9px] text-sky-300 font-bold block mt-0.5">Administrator</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-350 hover:bg-white/5'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} text-sm`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 bg-black/10 space-y-2">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center justify-center gap-2 bg-white/10 py-2.5 rounded-xl text-xs font-bold text-white"><i className="fa-solid fa-store" /> Go To Shop</Link>
            <button
              onClick={() => { setSidebarOpen(false); handleSignOut(); }}
              className="w-full flex items-center justify-center gap-2 bg-red-500/15 text-red-300 border border-red-500/20 py-2.5 rounded-xl text-xs font-bold"
            >
              <i className="fa-solid fa-right-from-bracket" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="h-20 bg-[#0F2942] lg:bg-white text-white lg:text-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200/50 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-350 hover:text-white rounded-full bg-white/5" aria-label="Open Admin Menu">
              <i className="fa-solid fa-bars-staggered text-lg"></i>
            </button>
            <div>
              <h1 className="font-heading font-black text-lg xs:text-xl lg:text-slate-900 tracking-tight leading-none capitalize">
                {location.pathname.split('/').pop() === 'admin' ? 'Dashboard Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
              </h1>
              <p className="text-[10px] text-sky-300 lg:text-slate-400 font-bold uppercase tracking-wider mt-1 hidden xs:block">
                SYSTEM ADMINISTRATOR PANEL
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="p-2.5 rounded-xl bg-white/5 lg:bg-slate-100 hover:bg-white/10 lg:hover:bg-blue-50 text-slate-300 lg:text-slate-500 hover:text-white lg:hover:text-blue-600 border border-white/10 lg:border-slate-200/60 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
              title="Refresh Page"
            >
              <i className="fa-solid fa-arrows-rotate text-sm group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 text-blue-600 lg:text-primary text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase">
              <i className="fa-solid fa-shield-halved text-[9px]"></i> Secure Shell
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-extrabold text-white lg:text-slate-900 leading-none">{user.name}</p>
                <span className="text-[9px] font-bold text-sky-400 lg:text-slate-400 tracking-wider">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-500 flex items-center justify-center font-heading font-extrabold text-sm text-white shadow-md shadow-blue-950/20">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Routers */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/contacts" element={<AdminContacts />} />
            <Route path="/customers" element={<AdminCustomers />} />
            
            {/* Logs route */}
            <Route path="/logs" element={<AdminContacts showLogs={true} />} />
            
            {/* Printable Invoice Page */}
            <Route path="/invoice/:id" element={<InvoicePrint />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}
