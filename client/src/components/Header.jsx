import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const { cartCount, wishlist, setCartOpen, setWishlistOpen, calculateTotals } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Products' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleSearch = (val) => {
    setSearchVal(val);
    navigate(`/shop?q=${encodeURIComponent(val)}`);
  };

  const handleUserClick = () => {
    if (user) navigate('/dashboard');
    else navigate('/login');
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <img 
              src="/logo.png" 
              alt="NVKM GROUP Logo" 
              className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl object-contain shadow-md shadow-primary/5 transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col leading-none text-left justify-center">
              <span className="font-heading font-extrabold text-sm sm:text-2xl lg:text-3xl tracking-tight text-primary">
                NVKM
              </span>
              <span className="font-heading font-extrabold text-sm sm:text-2xl lg:text-3xl tracking-normal bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent uppercase">
                GROUP
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-300 text-sm font-semibold tracking-wide border-b-2 pb-1 ${
                  location.pathname === link.path
                    ? 'text-primary border-primary font-bold'
                    : 'text-slate-600 border-transparent hover:text-accent hover:border-accent/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-1 sm:gap-2 sm:space-x-2">
            
            {/* Search (Desktop only) */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search powders..."
                value={searchVal}
                onChange={e => handleSearch(e.target.value)}
                className="w-48 lg:w-64 bg-slate-50 hover:bg-slate-100 focus:bg-white text-darkText pl-10 pr-4 py-2.5 rounded-full text-xs font-semibold border border-slate-200/60 focus:border-accent focus:outline-none transition-all duration-300 shadow-sm"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
            </div>

            {/* Wishlist — hidden on very small screens, visible from sm+ */}
            <button onClick={() => setWishlistOpen(true)} className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-all duration-200 hidden xs:flex" aria-label="Wishlist">
              <i className="fa-regular fa-heart text-lg"></i>
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">{wishlist.length}</span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setCartOpen(true)} 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-tr from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 text-[#0F2942] hover:text-[#2563eb] border border-blue-100 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
              aria-label="Cart"
            >
              <div className="relative flex items-center justify-center">
                <i className="fa-solid fa-cart-shopping text-sm group-hover:scale-110 transition-transform duration-200"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-accent text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center justify-center shadow-sm min-w-[16px] h-4">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-black tracking-wide pl-0.5 hidden sm:inline-block">
                {cartCount > 0 ? `₹${calculateTotals().total}` : 'Cart'}
              </span>
            </button>

            {/* User — hidden on mobile, shown on md+ */}
            <button onClick={handleUserClick} className={`hidden md:flex items-center space-x-2 p-2 rounded-full px-3 sm:px-4 transition-all duration-300 ${
              user ? 'bg-blue-50 hover:bg-blue-100 text-primary border border-primary/10 shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-primary border border-slate-200/50'
            }`}>
              <i className="fa-regular fa-user text-sm"></i>
              <span className="text-xs font-bold hidden lg:inline">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-600 hover:text-primary rounded-full hover:bg-slate-50 transition-colors" aria-label="Open menu">
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute top-0 right-0 w-80 max-w-[88%] h-full bg-white shadow-2xl rounded-l-[30px] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Drawer Header */}
          <div className="p-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="NVKM GROUP" className="w-8 h-8 rounded-lg object-contain" />
                <span className="font-heading font-extrabold text-base text-primary">NVKM <span className="bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">GROUP</span></span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            {/* Mobile Search */}
            <div className="relative w-full mt-4">
              <input type="text" placeholder="Search products..." value={searchVal} onChange={e => { handleSearch(e.target.value); setMobileOpen(false); }} className="w-full bg-slate-50 border border-slate-200/60 text-darkText pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-accent transition-all" />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`text-sm font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-between group ${
                location.pathname === link.path
                  ? 'text-primary bg-blue-50 border border-blue-100'
                  : 'text-slate-700 hover:text-accent hover:bg-slate-50'
              }`}>
                <span>{link.label === 'Products' ? 'Shop Products' : link.label}</span>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            ))}
            {/* Account Link */}
            <button onClick={() => { handleUserClick(); setMobileOpen(false); }} className="text-sm font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-between group text-slate-700 hover:text-accent hover:bg-slate-50 w-full text-left">
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-user text-xs text-slate-400"></i>
                {user ? `My Account (${user.name.split(' ')[0]})` : 'Sign In / Register'}
              </span>
              <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-bl-[30px]">
            <div className="flex items-center justify-between">
              <a href="tel:9014274293" className="flex items-center gap-2 text-primary hover:text-accent font-bold text-xs transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-phone text-xs text-primary"></i>
                </div>
                Call Store
              </a>
              <button onClick={() => { setWishlistOpen(true); setMobileOpen(false); }} className="flex items-center gap-2 text-slate-600 hover:text-red-500 font-bold text-xs transition-colors">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center relative">
                  <i className="fa-regular fa-heart text-xs"></i>
                  {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishlist.length}</span>}
                </div>
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
