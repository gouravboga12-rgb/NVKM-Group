import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/api';

const STATUS_CONFIG = {
  'Order Placed': { textClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-250/40', step: 1, icon: 'fa-box' },
  'Processing': { textClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-250/40', step: 2, icon: 'fa-gear' },
  'Shipped': { textClass: 'text-violet-600', bgClass: 'bg-violet-50 border-violet-250/40', step: 3, icon: 'fa-truck' },
  'Delivered': { textClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-250/40', step: 4, icon: 'fa-circle-check' }
};
const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setFetching(true);
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        showToast(err.response?.data?.message || 'Could not fetch order history.', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchOrders();
  }, [user, showToast]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalSpent = orders.reduce((s, o) => s + (o.totalPayable || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 page-transition">

      {/* ── HEADER BANNER ── */}
      <div
        data-aos="fade-down"
        className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-[#0F2942] to-[#1D4ED8] rounded-[20px] xs:rounded-[28px] p-5 xs:p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-950/20"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-radial-gradient(circle,rgba(56,189,248,.1),transparent) pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[11px] font-extrabold text-sky-200/70 uppercase tracking-widest mb-1">My Account</p>
          <h1 className="font-heading font-black text-xl xs:text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none">
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-[0.82rem] text-sky-100/80 mt-1.5 font-medium">Access your profile, orders, and delivery statuses.</p>
        </div>
        <button
          onClick={handleLogoutClick}
          className="relative z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-red-500/20 hover:border-red-500/40 text-white font-extrabold text-[0.82rem] px-5 py-3 rounded-2xl cursor-pointer transition-all duration-200"
        >
          <i className="fa-solid fa-power-off text-xs" /> Log Out
        </button>
      </div>

      {/* ── STAT CHIPS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4" data-aos="fade-up">
        {[
          { icon: 'fa-bag-shopping', label: 'Total Orders', value: totalOrders, textClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-100' },
          { icon: 'fa-circle-check', label: 'Delivered', value: deliveredOrders, textClass: 'text-blue-600', bgClass: 'bg-blue-50 border-blue-100' },
          { icon: 'fa-indian-rupee-sign', label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, textClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-100' },
        ].map(({ icon, label, value, textClass, bgClass }) => (
          <div
            key={label}
            className="bg-white border border-slate-100 rounded-2xl p-4 xs:p-5 flex items-center gap-3.5 xs:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${bgClass}`}>
              <i className={`fa-solid ${icon} ${textClass} text-lg`} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{label}</p>
              <p className="font-heading font-black text-xl text-slate-900 leading-tight mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Profile Card */}
        <div
          data-aos="fade-right"
          className="lg:col-span-4 glass-premium rounded-[20px] xs:rounded-[28px] p-4 xs:p-6 sm:p-8 shadow-xl border border-blue-500/10"
        >
          {/* Avatar */}
          <div className="text-center mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#0F2942] to-[#2563EB] flex items-center justify-center font-heading font-black text-2xl text-white shadow-lg shadow-blue-950/20 ring-4 ring-blue-500/10">
              {avatarLetter}
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">{user.name}</h3>
            <span className="inline-flex items-center bg-blue-50 border border-blue-100 text-accent text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mt-2 shadow-sm">
              <i className="fa-solid fa-circle-check text-[8px] mr-1" /> Premium Customer
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            {[
              { icon: 'fa-phone', label: 'Phone Number', value: user.phone || '—' },
              { icon: 'fa-envelope', label: 'Email Address', value: user.email || '—' },
              { icon: 'fa-store', label: 'Store Access', value: 'Bathalapalli (Available)', green: true }
            ].map(({ icon, label, value, green }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50/60 border border-blue-100/50 flex items-center justify-center flex-shrink-0">
                  <i className={`fa-solid ${icon} text-blue-600 text-sm`} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">{label}</span>
                  <span className={`text-[0.82rem] font-bold block mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap ${green ? 'text-blue-600' : 'text-slate-800'
                    }`}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Panel */}
        <div
          data-aos="fade-left"
          className="lg:col-span-8 glass-premium rounded-[20px] xs:rounded-[28px] p-4 xs:p-6 sm:p-8 shadow-xl border border-blue-500/10"
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F2942] to-[#2563EB] flex items-center justify-center shadow-md">
              <i className="fa-solid fa-clock-rotate-left text-white text-lg" />
            </div>
            <h2 className="font-heading font-extrabold text-base text-slate-900">Order Tracking &amp; History</h2>
          </div>

          <div className="max-h-[560px] overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin">
            {fetching ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : orders.length > 0 ? (
              orders.map((ord) => {
                const cfg = STATUS_CONFIG[ord.status] || STATUS_CONFIG['Order Placed'];
                const currentStep = cfg.step;

                return (
                  <div
                    key={ord.orderId}
                    className="bg-white border border-slate-100 rounded-xl xs:rounded-2xl p-4 xs:p-5 shadow-sm hover:shadow-md hover:border-blue-500/30 hover:bg-slate-50/10 transition-all duration-200"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold">ORDER ID</span>
                        <span className="text-[0.9rem] font-black text-blue-900 ml-2 font-heading tracking-wider">{ord.orderId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-bold">{ord.date}</span>
                        <span className={`inline-flex items-center gap-1.5 border font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider ${cfg.textClass} ${cfg.bgClass}`}>
                          <i className={`fa-solid ${cfg.icon} text-[8px]`} /> {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Items + Total */}
                    <div className="flex flex-wrap justify-between gap-4 mb-5">
                      <div>
                        <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Purchased Items</span>
                        <div className="flex flex-col gap-1.5">
                          {ord.items.map((itm, idx) => (
                            <span key={idx} className="text-[0.82rem] text-slate-700 font-semibold flex items-center gap-2">
                              <i className="fa-solid fa-circle-dot text-[6px] text-blue-500" />
                              {itm.name} ({itm.weight}) × {itm.quantity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="text-left sm:text-center">
                        <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Payment Method</span>
                        <div className="flex flex-col gap-1.5 mt-1.5 items-start sm:items-center">
                          <span className="text-xs font-bold text-slate-750 flex items-center gap-1.5">
                            <i className={`fa-solid ${ord.paymentMethod === 'Razorpay' ? 'fa-credit-card text-blue-600' : 'fa-truck text-amber-600'} text-[10px]`} />
                            {ord.paymentMethod === 'Razorpay' ? 'Paid Online' : 'Cash on Delivery'}
                          </span>
                          <span className={`inline-flex items-center gap-1 border font-extrabold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${ord.paymentStatus === 'Paid'
                              ? 'text-blue-700 bg-blue-50 border-blue-200'
                              : 'text-amber-705 bg-amber-50 border-amber-200'
                            }`}>
                            {ord.paymentStatus === 'Paid' ? 'PAID' : 'COD PENDING'}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Total Paid</span>
                        <span className="font-heading font-black text-lg text-blue-900 font-heading">₹{ord.totalPayable.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="border-t border-slate-100 pt-4">
                      <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">
                        <i className="fa-solid fa-location-dot mr-1.5 text-accent animate-pulse" /> Live Delivery Tracker
                      </span>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 relative pl-2 sm:pl-0">
                        {STEPS.map((step, i) => {
                          const isActive = i < currentStep;
                          const isCurrent = i + 1 === currentStep;
                          const sCfg = STATUS_CONFIG[step];
                          return (
                            <div key={step} className="flex-1 flex flex-row sm:flex-col items-center gap-4 sm:gap-0 relative w-full sm:w-auto">
                              {/* Connector line - Horizontal for desktop */}
                              {i < STEPS.length - 1 && (
                                <div className={`hidden sm:block absolute top-4 left-1/2 w-full h-[3px] transition-all duration-300 z-0 ${i + 1 < currentStep
                                    ? 'bg-gradient-to-r from-[#0F2942] to-[#2563EB]'
                                    : 'bg-slate-200'
                                  }`} />
                              )}
                              {/* Connector line - Vertical for mobile */}
                              {i < STEPS.length - 1 && (
                                <div className={`sm:hidden absolute left-4 top-8 w-[3px] h-[calc(100%+16px)] -translate-x-1/2 transition-all duration-300 z-0 ${i + 1 < currentStep
                                    ? 'bg-gradient-to-b from-[#0F2942] to-[#2563EB]'
                                    : 'bg-slate-200'
                                  }`} />
                              )}
                              {/* Node */}
                              <div className={`w-8 h-8 rounded-full z-10 flex items-center justify-center transition-all duration-300 border-2 shrink-0 ${isActive
                                  ? 'bg-gradient-to-br from-[#0F2942] to-[#2563EB] border-transparent shadow shadow-blue-950/20'
                                  : 'bg-white border-slate-200'
                                } ${isCurrent ? 'ring-4 ring-blue-500/25 scale-110' : ''
                                }`}>
                                {isActive ? (
                                  <i className={`fa-solid ${sCfg.icon} text-white text-[10px]`} />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                                )}
                              </div>
                              {/* Label */}
                              <span className={`text-[10px] sm:text-[9px] sm:mt-2 text-left sm:text-center font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-primary font-extrabold' : 'text-slate-400'
                                }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-6 border-2 border-dashed border-blue-500/20 rounded-2xl bg-blue-50/20">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-box-open text-blue-600 text-2xl" />
                </div>
                <h4 className="font-heading font-black text-slate-700 text-lg">No Orders Yet!</h4>
                <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Explore our powder collections to place your first order.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-5 bg-gradient-to-r from-[#0F2942] to-[#2563EB] text-white font-extrabold py-3 px-6 rounded-2xl text-[0.82rem] cursor-pointer shadow-lg shadow-blue-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 transition-all duration-200"
                >
                  <i className="fa-solid fa-cart-shopping mr-2" /> Shop Powders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
