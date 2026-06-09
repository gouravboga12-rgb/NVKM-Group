import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: dashboardData } = await api.get('/admin/dashboard');
        setData(dashboardData);
      } catch (err) {
        if (err.response?.status !== 401) {
          showToast(err.response?.data?.message || 'Failed to fetch dashboard analytics.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, chartData, recentLogs } = data;

  // Find max chart amount to scale the SVG chart height dynamically
  const maxAmount = Math.max(...chartData.map(c => c.amount), 100);

  // SVG Chart Dimensions
  const width = 600;
  const height = 180;
  const padding = 30;

  // Compute coordinates for SVG points
  const points = chartData.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1);
    // invert y because (0,0) is top-left in SVG
    const y = height - padding - (d.amount * (height - 2 * padding)) / maxAmount;
    return { x, y, ...d };
  });

  // SVG path definition
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // Area path (closed at the bottom)
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="space-y-8 page-transition">
      
      {/* ── METRIC CARD CHIPS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Earnings', value: `₹${stats.totalSales.toLocaleString('en-IN')}`, icon: 'fa-indian-rupee-sign', color: 'text-emerald-500 bg-emerald-50 border-emerald-100', detail: 'Paid orders + COD delivered' },
          { label: 'Order Submissions', value: stats.totalOrders, icon: 'fa-cart-shopping', color: 'text-blue-500 bg-blue-50 border-blue-100', detail: 'Lifetime orders count' },
          { label: 'Customer Base', value: stats.totalCustomers, icon: 'fa-users', color: 'text-amber-500 bg-amber-50 border-amber-100', detail: 'Unique user records' },
          { label: 'Customer Queries', value: stats.pendingContacts, icon: 'fa-comments', color: 'text-rose-500 bg-rose-50 border-rose-100', detail: 'Submitted contact inquiries' },
          { label: 'Products in Catalog', value: stats.totalProducts ?? 0, icon: 'fa-box-open', color: 'text-violet-500 bg-violet-50 border-violet-100', detail: 'Active listed products' },
          { label: 'Active Categories', value: stats.totalCategories ?? 0, icon: 'fa-tags', color: 'text-cyan-500 bg-cyan-50 border-cyan-100', detail: 'Product category groups' }
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">{card.label}</p>
                <p className="font-heading font-black text-xl text-slate-900 mt-2 leading-none">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${card.color}`}>
                <i className={`fa-solid ${card.icon} text-base`} />
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-bold mt-3 border-t border-slate-50 pt-3 flex items-center gap-1">
              <i className="fa-solid fa-info-circle text-[10px] text-slate-350" /> {card.detail}
            </p>
          </div>
        ))}
      </div>

      {/* ── SALES ANALYTICS & QUICK ACTIONS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Sales Area Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-50">
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">7-Day Sales Trend</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">DAILY REVENUE IN INR</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live updates
            </span>
          </div>

          {/* Custom SVG Area Chart */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E2E8F0" strokeWidth="1" />

              {/* Area Gradient Fill */}
              {areaPath && <path d={areaPath} fill="url(#chartGlow)" />}

              {/* Main Line */}
              {linePath && <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Data points (dots) with tooltips */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="5.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" className="hover:r-7 transition-all duration-150" />
                  {/* Tooltip Overlay */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <rect x={p.x - 35} y={p.y - 30} width="70" height="20" rx="6" fill="#0F2942" />
                    <text x={p.x} y={p.y - 17} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">₹{p.amount.toFixed(0)}</text>
                  </g>
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, i) => {
                // Shorten date label to "Mon DD" or just DD
                const parts = p.date.split('/');
                const label = parts.length === 3 ? `${parts[0]}/${parts[1]}` : p.date;
                return (
                  <text key={i} x={p.x} y={height - 10} fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0F2942] to-[#1D4ED8] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full bg-radial-gradient(circle,rgba(56,189,248,.12),transparent) pointer-events-none" />
          <h3 className="font-heading font-black text-sm text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-sky-400" /> Administrative Wizard
          </h3>
          <p className="text-[11px] text-sky-100/70 leading-relaxed font-medium mb-6">
            Easily manage catalog stock, fulfill client requests, adjust weights and product parameters, or check direct user messages.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/admin/products?action=add')}
              className="w-full bg-white text-[#0F2942] font-extrabold text-[11px] py-3.5 px-4 rounded-2xl cursor-pointer hover:bg-sky-100 hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 shadow-md shadow-black/10"
            >
              <i className="fa-solid fa-plus-circle text-xs" /> Add New Product
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full bg-white/10 border border-white/20 hover:bg-white/15 text-white font-extrabold text-[11px] py-3.5 px-4 rounded-2xl cursor-pointer hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-clipboard-list text-xs" /> View Orders Queue
            </button>
          </div>
        </div>

      </div>

      {/* ── CHANGE TRACKER LOGS (TIMELINE FEED) ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-50">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">Dashboard Change Tracker</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">LATEST ADMINISTRATIVE SYSTEM ACTIONS</p>
          </div>
          <button
            onClick={() => navigate('/admin/logs')}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Show All Logs <i className="fa-solid fa-arrow-right-long text-xs" />
          </button>
        </div>

        <div className="flow-root">
          <ul className="-mb-8">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, logIdx) => (
                <li key={log.id || logIdx}>
                  <div className="relative pb-8">
                    {logIdx !== recentLogs.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-[2px] bg-slate-100" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3 items-start">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          log.action?.includes('Created') || log.action?.includes('Submitted')
                            ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                            : log.action?.includes('Edited') || log.action?.includes('Updated')
                            ? 'bg-blue-50 text-blue-500 border border-blue-100'
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}>
                          <i className={`fa-solid text-xs ${
                            log.action?.includes('Created') || log.action?.includes('Submitted')
                              ? 'fa-plus-circle'
                              : log.action?.includes('Edited') || log.action?.includes('Updated')
                              ? 'fa-pen-to-square'
                              : 'fa-trash-can'
                          }`} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs text-slate-800 font-extrabold">
                            {log.action} <span className="font-medium text-slate-500">{log.details}</span>
                          </p>
                          <span className="text-[10px] font-bold text-slate-450 block mt-1">
                            By <span className="text-slate-650">{log.performed_by || log.performedBy || 'System'}</span>
                          </span>
                        </div>
                        <div className="text-right text-[10px] font-semibold text-slate-400 whitespace-nowrap pt-0.5">
                          {new Date(log.created_at || log.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          <span className="block text-[8px] text-slate-350 mt-0.5">
                            {new Date(log.created_at || log.createdAt || Date.now()).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-8 text-slate-450 text-xs font-semibold">
                No activity logs recorded yet. All administrative events will appear here.
              </div>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}
