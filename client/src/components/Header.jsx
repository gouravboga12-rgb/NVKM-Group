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
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img 
              src="/logo.png" 
              alt="NVKM GROUP Logo" 
              className="w-11 h-11 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-xl object-contain shadow-md shadow-primary/5 transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline leading-none text-left justify-center">
              <span className="font-heading font-extrabold text-[15px] sm:text-2xl lg:text-3xl tracking-[0.11em] sm:tracking-tight text-primary mr-[-0.11em] sm:mr-0">
                NVKM
              </span>
              <span className="font-heading font-extrabold text-[15px] sm:text-2xl lg:text-3xl tracking-normal sm:tracking-tight bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent sm:ml-2 mt-1.5 sm:mt-0 uppercase">
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search (Desktop) */}
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

            {/* Wishlist */}
            <button onClick={() => setWishlistOpen(true)} className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-all duration-200" aria-label="Wishlist">
              <i className="fa-regular fa-heart text-lg"></i>
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">{wishlist.length}</span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setCartOpen(true)} 
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-tr from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 text-[#0F2942] hover:text-[#2563eb] border border-blue-100 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
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

            {/* User */}
            <button onClick={handleUserClick} className={`flex items-center space-x-2 p-2 rounded-full px-2.5 sm:px-4 transition-all duration-300 ${
              user ? 'bg-blue-50 hover:bg-blue-100 text-primary border border-primary/10 shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-primary border border-slate-200/50'
            }`}>
              <i className="fa-regular fa-user text-sm"></i>
              <span className="text-xs font-bold hidden lg:inline">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-600 hover:text-primary rounded-full hover:bg-slate-50 transition-colors" aria-label="Open menu">
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute top-0 right-0 w-80 max-w-[85%] h-full bg-white shadow-2xl rounded-l-[30px] flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <span className="font-heading font-extrabold text-lg text-primary">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div className="mt-6 flex flex-col space-y-4">
              <div className="relative w-full mb-4">
                <input type="text" placeholder="Search products..." value={searchVal} onChange={e => { handleSearch(e.target.value); }} className="w-full bg-slate-50 border border-slate-200/60 text-darkText pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-accent transition-all" />
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
              </div>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="text-base font-bold py-2 text-slate-700 hover:text-accent transition-colors flex items-center justify-between group">
                  <span>{link.label === 'Products' ? 'Shop Products' : link.label}</span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-bl-[30px] flex items-center justify-between">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NVKM Group Manufacturing</div>
            <a href="tel:9014274293" className="text-primary hover:text-accent font-bold text-xs flex items-center gap-1.5"><i className="fa-solid fa-phone"></i> Call Store</a>
          </div>
        </div>
      </div>
    </>
  );
}
