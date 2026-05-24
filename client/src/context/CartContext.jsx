import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { showToast } = useToast();

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('nvkm_cart');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('nvkm_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Drawer/modal visibility states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('nvkm_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('nvkm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((product, weight, quantity = 1, silent = false) => {
    const variation = product.variations.find(v => v.weight === weight);
    if (!variation) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id && item.weight === weight);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
        return updated;
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        weight,
        price: variation.discountPrice,
        originalPrice: variation.price,
        image: product.image,
        quantity
      }];
    });

    if (!silent) {
      showToast(
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1 shrink-0">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <i className="fa-solid fa-circle-check"></i> Added to Cart
              </p>
              <h4 className="text-xs font-black text-slate-800 line-clamp-1 mt-0.5">
                {product.name}
              </h4>
              <span className="text-[10px] text-slate-400 font-bold block">
                Qty: {quantity} • {weight}
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCartOpen(true);
            }}
            className="bg-[#14532D] hover:bg-[#22c55e] text-white text-[10px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 pointer-events-auto"
          >
            View Cart
          </button>
        </div>,
        'success'
      );
    }
  }, [showToast, setCartOpen]);

  const updateCartQuantity = useCallback((productId, weight, change) => {
    setCart(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(item => item.productId === productId && item.weight === weight);
      if (idx > -1) {
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + change };
        if (updated[idx].quantity <= 0) {
          updated.splice(idx, 1);
          showToast('Item removed from Cart.', 'info');
        }
      }
      return updated;
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId, weight) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.weight === weight)));
    showToast('Item removed from Cart.', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Product removed from wishlist.', 'info');
        return prev.filter(id => id !== productId);
      }
      showToast('Added product to wishlist!');
      return [...prev, productId];
    });
  }, [showToast]);

  const isWishlisted = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const calculateTotals = useCallback(() => {
    let subtotal = 0;
    let originalSubtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      originalSubtotal += item.originalPrice * item.quantity;
    });
    return {
      subtotal: originalSubtotal,
      savings: originalSubtotal - subtotal,
      total: subtotal
    };
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, cartCount, wishlist,
      cartOpen, setCartOpen,
      wishlistOpen, setWishlistOpen,
      quickViewProduct, setQuickViewProduct,
      checkoutOpen, setCheckoutOpen,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      toggleWishlist, isWishlisted,
      calculateTotals
    }}>
      {children}
    </CartContext.Provider>
  );
}
