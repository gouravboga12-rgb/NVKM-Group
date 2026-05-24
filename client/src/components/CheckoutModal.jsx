import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/api';

export default function CheckoutModal() {
  const { cart, checkoutOpen, setCheckoutOpen, calculateTotals, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // Razorpay is recommended/default
  const [mockPaymentData, setMockPaymentData] = useState(null);

  const handleOpen = () => {
    if (user) {
      setForm(f => ({ ...f, name: user.name || '', phone: user.phone || '', email: user.email || '' }));
    }
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    setMockPaymentData(null);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    const { savings, total } = calculateTotals();

    // ── CASH ON DELIVERY (COD) FLOW ──
    if (paymentMethod === 'COD') {
      try {
        const { data } = await api.post('/orders', {
          items: cart,
          shippingInfo: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address
          },
          totalPayable: total,
          savings,
          paymentMethod: 'COD'
        });

        clearCart();
        setCheckoutOpen(false);
        showToast(`Congratulations! Order ${data.orderId} has been submitted!`);

        if (user) {
          navigate('/dashboard');
        } else {
          alert(`Thank you ${form.name}!\nYour order ${data.orderId} for ₹${total} has been placed successfully via Cash on Delivery.\nWe will contact you shortly at ${form.phone} to confirm dispatch!`);
          navigate('/');
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to place order.', 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── RAZORPAY ONLINE PAYMENT FLOW ──
    try {
      // 1. Create order on backend (returns mock details if credentials not configured)
      const { data: rpOrder } = await api.post('/payment/create-order', { amount: total });

      const handlePaymentSuccess = async (response) => {
        setLoading(true);
        try {
          const { data } = await api.post('/orders', {
            items: cart,
            shippingInfo: {
              name: form.name,
              phone: form.phone,
              email: form.email,
              address: form.address
            },
            totalPayable: total,
            savings,
            paymentMethod: 'Razorpay',
            paymentDetails: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            }
          });

          clearCart();
          setCheckoutOpen(false);
          showToast(`Congratulations! Order ${data.orderId} has been placed successfully!`);

          if (user) {
            navigate('/dashboard');
          } else {
            alert(`Thank you ${form.name}!\nYour order ${data.orderId} for ₹${total} has been placed and payment has been verified successfully.\nWe will contact you shortly at ${form.phone}!`);
            navigate('/');
          }
        } catch (err) {
          showToast(err.response?.data?.message || 'Order creation failed after payment.', 'error');
        } finally {
          setLoading(false);
        }
      };

      // 2. High-fidelity Sandbox modal fallback
      if (rpOrder.isMock || rpOrder.keyId.includes('placeholder')) {
        setMockPaymentData({
          orderId: rpOrder.id,
          amount: total,
          form: { ...form },
          handler: handlePaymentSuccess
        });
        return;
      }

      // 3. Load script and execute real Razorpay modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setLoading(false);
        showToast('Failed to load Razorpay payment gateway. Please try Cash on Delivery.', 'error');
        return;
      }

      const options = {
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'NVKM GROUP',
        description: 'Purchase organic powders',
        order_id: rpOrder.id,
        handler: handlePaymentSuccess,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: '#0f5132' // NVKM Forest Green
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            showToast('Online payment cancelled.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || 'Razorpay initialization failed.', 'error');
      setLoading(false);
    }
  };

  if (!checkoutOpen) return null;

  // Initialize form with user data
  if (user && !form.name) {
    handleOpen();
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
        <div onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div className="relative bg-white w-full max-w-2xl rounded-[24px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-[fadeIn_0.3s_ease-out]">
          <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>

          <div className="p-4 sm:p-6 border-b bg-slate-50">
            <h2 className="font-heading font-bold text-xl text-primary flex items-center gap-2"><i className="fa-solid fa-cart-shopping"></i> Complete Your Purchase</h2>
            <p className="text-xs text-slate-500 mt-1">Please provide your details below to place your order securely.</p>
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-darkText mb-1.5">Full Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-accent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-darkText mb-1.5">Mobile Phone *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-accent transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-darkText mb-1.5">Email Address (Optional)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-accent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-darkText mb-1.5">Full Shipping Address *</label>
                <textarea required rows="3" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-accent transition-all" placeholder="House/Flat No, Street, Landmark, Town, District, State & Pincode"></textarea>
              </div>

              <div className="bg-emerald-55/40 border border-emerald-200 p-4 rounded-2xl flex flex-col gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="text-sm font-bold text-primary flex items-center gap-1.5"><i className="fa-solid fa-shield-halved"></i> Secure Online Payment</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">Transactions are processed securely via Razorpay. We support Credit/Debit Cards, UPI, Netbanking, and Wallets. No extra transaction fees apply!</p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                <button type="button" onClick={handleClose} className="px-5 py-3 rounded-xl border border-slate-200 font-semibold text-slate-500 hover:bg-slate-50 text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-accent hover:bg-accentHover text-white font-bold text-sm transition-all hover:scale-[1.01] shadow-lg shadow-accent/20 disabled:opacity-50">
                  {loading ? 'Processing...' : 'Pay and Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── MOCK RAZORPAY SANDBOX MODAL OVERLAY ── */}
      {mockPaymentData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-[scaleIn_0.25s_ease-out] z-10">
            {/* Mock Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-sm text-slate-900">R</div>
                <div>
                  <h3 className="font-heading font-black text-sm tracking-tight">Razorpay Checkout</h3>
                  <p className="text-[10px] text-slate-400">Sandbox Test Environment</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">AMOUNT</span>
                <span className="font-heading font-extrabold text-sm text-emerald-400">₹{mockPaymentData.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-triangle-exclamation"></i> Sandbox Mode</span>
                <p className="text-[11px] text-amber-850 leading-relaxed">No real money will be charged. Choose whether to simulate a successful payment or cancel/fail the transaction below.</p>
              </div>

              {/* Order Details Preview */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-xs text-slate-500 font-medium"><span>Customer</span><span className="text-slate-800 font-bold">{mockPaymentData.form.name}</span></div>
                <div className="flex justify-between text-xs text-slate-500 font-medium"><span>Phone</span><span className="text-slate-800 font-bold">{mockPaymentData.form.phone}</span></div>
                <div className="flex justify-between text-xs text-slate-500 font-medium"><span>Mock Order ID</span><span className="text-slate-850 font-bold font-mono text-[11px]">{mockPaymentData.orderId}</span></div>
              </div>

              {/* Payment Methods Simulation */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={async () => {
                    const response = {
                      razorpay_payment_id: 'pay_mock_' + Math.floor(100000 + Math.random() * 900000),
                      razorpay_order_id: mockPaymentData.orderId,
                      razorpay_signature: 'sig_mock_2026_' + Math.random().toString(36).substring(7)
                    };
                    const handler = mockPaymentData.handler;
                    setMockPaymentData(null);
                    await handler(response);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-emerald-600/20 text-sm"
                >
                  <i className="fa-solid fa-circle-check"></i> Simulate Success (Success Handler)
                </button>
                <button
                  onClick={() => {
                    setMockPaymentData(null);
                    setLoading(false);
                    showToast('Mock payment cancelled by user.', 'info');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  Cancel Payment Simulation
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 text-center border-t text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-lock text-[8px]"></i> Secured by Razorpay Mock Sandbox
            </div>
          </div>
        </div>
      )}
    </>
  );
}
