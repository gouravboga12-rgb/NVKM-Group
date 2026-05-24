import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch all products to resolve wishlist items
  useEffect(() => {
    if (wishlistOpen && wishlist.length > 0) {
      api.get('/products').then(res => setProducts(res.data)).catch(() => {});
    }
  }, [wishlistOpen, wishlist]);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${wishlistOpen ? '' : 'pointer-events-none'}`}>
      <div onClick={() => setWishlistOpen(false)} className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${wishlistOpen ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ${wishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-4 sm:p-6 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 text-primary">
            <i className="fa-solid fa-heart text-xl text-red-500"></i>
            <h2 className="font-heading font-bold text-lg">Saved Favorites</h2>
          </div>
          <button onClick={() => setWishlistOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <i className="fa-regular fa-heart text-6xl text-slate-200 mb-4"></i>
              <p className="font-heading font-semibold text-lg text-slate-500">Your wishlist is empty!</p>
              <p className="text-sm text-slate-400 mt-1 max-w-[280px]">Save healthy powders to buy them later.</p>
              <button onClick={() => { navigate('/shop'); setWishlistOpen(false); }} className="mt-6 bg-primary hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">Explore Products</button>
            </div>
          ) : (
            wishlistProducts.map(item => {
              const defaultVar = item.variations[0];
              if (!defaultVar) return null;
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 border rounded-2xl relative group hover:border-slate-300 transition-all duration-200">
                  <button onClick={() => toggleWishlist(item.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 transition-colors"><i className="fa-solid fa-trash-can text-sm"></i></button>
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white shadow-sm cursor-pointer" onClick={() => { navigate(`/products/${item.id}`); setWishlistOpen(false); }} />
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-heading font-bold text-darkText truncate text-sm leading-tight cursor-pointer" onClick={() => { navigate(`/products/${item.id}`); setWishlistOpen(false); }}>{item.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.category}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through leading-none">₹{defaultVar.price}</span>
                        <span className="text-sm font-bold text-primary">₹{defaultVar.discountPrice} ({defaultVar.weight})</span>
                      </div>
                      <button onClick={() => { addToCart(item, defaultVar.weight); setWishlistOpen(false); }} className="bg-primary hover:bg-emerald-850 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm">
                        <i className="fa-solid fa-cart-shopping"></i> Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
