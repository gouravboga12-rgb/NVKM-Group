import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCustomers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingEmail, setDeletingEmail] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/customers');
      setCustomers(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        showToast('Could not load client directories.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteCustomer = async (email, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete the customer account for "${name}" (${email})? Their order history will remain, but their login account will be removed.`)) return;
    try {
      setDeletingEmail(email);
      const { data } = await api.delete(`/admin/customers/${encodeURIComponent(email)}`);
      showToast(data.message || 'Customer deleted successfully!');
      fetchCustomers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete customer.', 'error');
    } finally {
      setDeletingEmail(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Placed': return 'text-amber-600 bg-amber-50';
      case 'Processing': return 'text-blue-600 bg-blue-50';
      case 'Shipped': return 'text-purple-650 bg-purple-50';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50';
      case 'Cancelled': return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  // Filter customers locally by query
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 page-transition">
      
      {/* ── SEARCH & STATS BAR ── */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, email, or mobile..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-slate-400 text-xs"></i>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            {filtered.length} Unique Customer{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── CUSTOMER TABLE GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <i className="fa-solid fa-users text-slate-350 text-4xl mb-4" />
          <h4 className="font-heading font-black text-slate-700 text-base">No Customers Found</h4>
          <p className="text-[11px] text-slate-400 mt-1">No user profiles or order names match your active filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Client Identity</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-center">Total Orders</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Value spent</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Lifetime Purchase History Log</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Identity Avatar & Name */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-heading font-extrabold text-sm shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 leading-tight">{c.name}</p>
                          {c.totalSpent > 1000 && <span className="inline-block text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-2 py-0.5 rounded-full uppercase tracking-wider mt-1"><i className="fa-solid fa-crown mr-0.5" /> High Spender</span>}
                        </div>
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="px-6 py-5 whitespace-nowrap text-xs">
                      <p className="font-bold text-slate-700 mb-0.5"><i className="fa-solid fa-phone text-[9px] text-slate-400 mr-1" /> {c.phone}</p>
                      {c.email && c.email !== 'N/A' && <p className="font-medium text-slate-450"><i className="fa-solid fa-envelope text-[9px] text-slate-400 mr-1" /> {c.email}</p>}
                    </td>

                    {/* Total Orders */}
                    <td className="px-6 py-5 whitespace-nowrap text-center text-xs font-extrabold text-[#0f2942]">
                      {c.totalOrders}
                    </td>

                    {/* Total spent */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-heading font-black text-sm text-slate-900">₹{c.totalSpent.toFixed(2)}</span>
                    </td>

                    {/* Order Logs */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2 max-w-[320px]">
                        {c.orders && c.orders.length > 0 ? (
                          c.orders.map((ord, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => navigate(`/admin/invoice/${ord.orderId}`)}
                              className={`inline-flex items-center gap-1 border border-slate-200/50 rounded-lg px-2.5 py-1 text-[9px] font-bold text-slate-650 cursor-pointer shadow-sm hover:border-blue-400/50 transition-all ${getStatusBadge(ord.status)}`}
                              title={`View invoice for order ${ord.orderId}`}
                            >
                              <span className="font-heading font-extrabold text-[8px] tracking-wider">{ord.orderId}</span>
                              <span>(₹{ord.total.toFixed(0)})</span>
                            </button>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">No orders placed yet</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      {c.email && c.email !== 'N/A' && (
                        <button
                          onClick={() => handleDeleteCustomer(c.email, c.name)}
                          disabled={deletingEmail === c.email}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                        >
                          <i className="fa-solid fa-trash-can text-[9px]"></i> Delete
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
