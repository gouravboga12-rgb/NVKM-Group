import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateCartQuantity, removeFromCart, calculateTotals, setCheckoutOpen } = useCart();
  const navigate = useNavigate();
  const { subtotal, savings, total } = calculateTotals();

  const WHATSAPP_PRIMARY = '9014274293';

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleWhatsAppDirect = () => {
    if (cart.length === 0) return;
    let itemsList = '';
    cart.forEach((item, i) => {
      itemsList += `${i + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    const msg = `Hello NVKM GROUP, I would like to place an order directly on WhatsApp!\n\n--- Items List ---\n${itemsList}\nTotal Payable: ₹${total}\nDiscount Savings: ₹${savings}\nDelivery Type: Cash on Delivery\n\nPlease let me know the confirmation and delivery time. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${cartOpen ? '' : 'pointer-events-none'}`}>
      <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b flex items-center justify-between bg-primary text-white">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            <h2 className="font-heading font-bold text-lg">Your Shopping Cart</h2>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1 text-slate-200 hover:text-white rounded-full hover:bg-emerald-800/50 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <i className="fa-solid fa-cart-shopping text-6xl text-slate-200 mb-4"></i>
              <p className="font-heading font-semibold text-lg text-slate-500">Your cart is empty!</p>
              <p className="text-sm text-slate-400 mt-1 max-w-[280px]">Add organic powders to start healthy living.</p>
              <button onClick={() => { navigate('/shop'); setCartOpen(false); }} className="mt-6 bg-primary hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">Shop Now</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.productId}-${item.weight}`} className="flex gap-4 p-4 bg-slate-50 border rounded-2xl relative group hover:border-slate-300 transition-all duration-200">
                <button onClick={() => removeFromCart(item.productId, item.weight)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 transition-colors"><i className="fa-solid fa-trash-can text-sm"></i></button>
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white shadow-sm" />
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="font-heading font-bold text-darkText truncate text-sm leading-tight">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Size: {item.weight}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button onClick={() => updateCartQuantity(item.productId, item.weight, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"><i className="fa-solid fa-minus text-[10px]"></i></button>
                      <span className="px-2 text-xs font-bold text-darkText">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.productId, item.weight, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"><i className="fa-solid fa-plus text-[10px]"></i></button>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through mr-1.5">₹{item.originalPrice * item.quantity}</span>
                      <span className="text-sm font-bold text-primary">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-slate-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-slate-600 text-sm"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-600 text-sm font-medium"><span>Discount Savings:</span><span>-₹{savings.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-600 text-sm"><span>Shipping:</span><span className="text-green-600 font-semibold">FREE Delivery</span></div>
            <div className="flex justify-between text-darkText font-bold text-lg pt-2 border-t border-slate-200"><span>Total Payable:</span><span className="text-primary">₹{total.toFixed(2)}</span></div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={handleCheckout} className="w-full bg-accent hover:bg-accentHover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all hover:scale-[1.01]">
              <i className="fa-solid fa-circle-check"></i> Checkout & Pay Online
            </button>
            <button onClick={handleWhatsAppDirect} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]">
              <i className="fa-brands fa-whatsapp text-lg"></i> Direct Order on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
