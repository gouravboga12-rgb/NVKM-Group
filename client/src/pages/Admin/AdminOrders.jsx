import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    deliveryPackageId: '',
    trackingLink: '',
    deliveryTrackerStatus: 'Pending'
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (searchQuery) params.q = searchQuery;

      const { data } = await api.get('/admin/orders', { params });
      
      // Merge with global local storage orders (for Vercel stateless mock mode fallback)
      try {
        // Self-heal: sync any user-specific local orders to global list
        const globalExisting = JSON.parse(localStorage.getItem('nvkm_global_orders') || '[]');
        let updatedGlobal = false;
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('nvkm_orders_') || key.startsWith('nvkm_mock_orders_'))) {
            try {
              const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
              if (Array.isArray(userOrders)) {
                userOrders.forEach(ord => {
                  if (ord && ord.orderId && !globalExisting.some(o => o.orderId === ord.orderId)) {
                    globalExisting.push(ord);
                    updatedGlobal = true;
                  }
                });
              }
            } catch (err) {
              console.error(`Failed to parse local storage key ${key}:`, err);
            }
          }
        }
        if (updatedGlobal) {
          localStorage.setItem('nvkm_global_orders', JSON.stringify(globalExisting));
        }

        const localOrders = globalExisting;
        const merged = [...data];
        localOrders.forEach(localOrd => {
          if (!merged.some(o => o.orderId === localOrd.orderId)) {
            // Apply simple search filter locally if search query exists
            let match = true;
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              match = (
                localOrd.orderId.toLowerCase().includes(q) ||
                localOrd.shippingInfo?.name?.toLowerCase().includes(q) ||
                localOrd.shippingInfo?.phone?.toLowerCase().includes(q) ||
                localOrd.shippingInfo?.address?.toLowerCase().includes(q)
              );
            }
            if (match) {
              merged.push(localOrd);
            }
          }
        });
        setOrders(merged);
      } catch (e) {
        setOrders(data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load orders queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setUpdatingId(selectedOrder.orderId);
    try {
      // 1. Determine overall status based on delivery tracker status selection
      let overallStatus = 'Processing';
      if (editForm.deliveryTrackerStatus === 'Delivered') {
        overallStatus = 'Delivered';
      } else if (['Dispatched', 'In Transit', 'Out for Delivery'].includes(editForm.deliveryTrackerStatus)) {
        overallStatus = 'Shipped';
      } else if (editForm.deliveryTrackerStatus === 'Cancelled') {
        overallStatus = 'Cancelled';
      } else if (editForm.deliveryTrackerStatus === 'Pending') {
        overallStatus = selectedOrder.status === 'Order Placed' ? 'Order Placed' : 'Processing';
      }

      // 2. Update overall status on backend
      await api.put(`/admin/orders/${selectedOrder.orderId}/status`, { status: overallStatus });
      // 3. Update delivery tracking details on backend
      await api.put(`/admin/orders/${selectedOrder.orderId}/delivery`, {
        deliveryPackageId: editForm.deliveryPackageId,
        trackingLink: editForm.trackingLink,
        deliveryTrackerStatus: editForm.deliveryTrackerStatus
      });

      // 4. Update locally in global and user nvkm_orders storage for local mock redundancy
      try {
        const globalExisting = JSON.parse(localStorage.getItem('nvkm_global_orders') || '[]');
        const idx = globalExisting.findIndex(o => o.orderId === selectedOrder.orderId);
        if (idx > -1) {
          globalExisting[idx] = {
            ...globalExisting[idx],
            status: overallStatus,
            deliveryPackageId: editForm.deliveryPackageId,
            trackingLink: editForm.trackingLink,
            deliveryTrackerStatus: editForm.deliveryTrackerStatus
          };
          localStorage.setItem('nvkm_global_orders', JSON.stringify(globalExisting));
          
          const userId = globalExisting[idx].userId || selectedOrder.userId;
          if (userId) {
            const userKey = `nvkm_orders_${userId}`;
            const userExisting = JSON.parse(localStorage.getItem(userKey) || '[]');
            const uIdx = userExisting.findIndex(o => o.orderId === selectedOrder.orderId);
            if (uIdx > -1) {
              userExisting[uIdx] = {
                ...userExisting[uIdx],
                status: overallStatus,
                deliveryPackageId: editForm.deliveryPackageId,
                trackingLink: editForm.trackingLink,
                deliveryTrackerStatus: editForm.deliveryTrackerStatus
              };
              localStorage.setItem(userKey, JSON.stringify(userExisting));
            }
          }
        }
      } catch (err) {
        console.error('Error updating local mock order:', err);
      }
      
      showToast('Order status and delivery details updated successfully!');
      setShowEditModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save changes.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you absolutely sure you want to delete order ${orderId} permanently? This action cannot be undone.`)) return;
    
    try {
      setUpdatingId(orderId);
      const { data } = await api.delete(`/admin/orders/${orderId}`);
      
      // Delete locally from cache
      try {
        const globalExisting = JSON.parse(localStorage.getItem('nvkm_global_orders') || '[]');
        const found = globalExisting.find(o => o.orderId === orderId);
        const filtered = globalExisting.filter(o => o.orderId !== orderId);
        localStorage.setItem('nvkm_global_orders', JSON.stringify(filtered));
        
        if (found && found.userId) {
          const userKey = `nvkm_orders_${found.userId}`;
          const userFiltered = JSON.parse(localStorage.getItem(userKey) || '[]').filter(o => o.orderId !== orderId);
          localStorage.setItem(userKey, JSON.stringify(userFiltered));
        }
      } catch (err) {
        console.error('Error deleting local mock order:', err);
      }

      showToast(data.message || 'Order deleted successfully!');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete order.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    let defaultTrackerStatus = order.deliveryTrackerStatus || 'Pending';
    if (order.status === 'Cancelled') {
      defaultTrackerStatus = 'Cancelled';
    } else if (order.status === 'Delivered') {
      defaultTrackerStatus = 'Delivered';
    }
    setEditForm({
      status: order.status,
      deliveryPackageId: order.deliveryPackageId || '',
      trackingLink: order.trackingLink || '',
      deliveryTrackerStatus: defaultTrackerStatus
    });
    setShowEditModal(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    // Trigger reset fetch
    setTimeout(() => {
      api.get('/admin/orders').then(res => setOrders(res.data));
    }, 50);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Order Placed': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'Processing': return 'text-blue-700 bg-blue-50 border-blue-100';
      case 'Shipped': return 'text-purple-700 bg-purple-50 border-purple-100';
      case 'Delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Cancelled': return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 page-transition">
      
      {/* ── FILTER & TOOLBAR CARD ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order ID, Client Name, Address or Phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-slate-400 text-xs"></i>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            Search Queue
          </button>
        </form>

        {/* Date Calendar Filters */}
        <div className="border-t border-slate-50 pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Start Date */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>

            {(startDate || endDate || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-extrabold text-red-500 hover:text-red-700 transition-colors ml-2 cursor-pointer"
              >
                <i className="fa-solid fa-filter-circle-xmark mr-1"></i> Clear Filters
              </button>
            )}
          </div>

          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* ── ORDERS DATATABLE GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <i className="fa-solid fa-box-open text-blue-500 text-2xl" />
          </div>
          <h4 className="font-heading font-black text-slate-700 text-base">No Orders Found</h4>
          <p className="text-[11px] text-slate-450 mt-1 max-w-sm mx-auto">No orders match the selected calendar filters or keyword queries. Try adjusting your fields.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Client Details</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Purchased Stock</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Payable</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Order Status</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Delivery Logistics</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(ord => (
                  <tr key={ord.orderId} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Order ID */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-heading font-black text-xs text-blue-900 tracking-wider block">{ord.orderId}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">{ord.date}</span>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-5">
                      <p className="text-xs font-extrabold text-slate-800 leading-none mb-1">{ord.shippingInfo?.name}</p>
                      <a href={`tel:${ord.shippingInfo?.phone}`} className="text-[10px] font-bold text-slate-550 block mb-0.5 hover:text-blue-600 transition-colors"><i className="fa-solid fa-phone text-[9px] mr-1"></i>{ord.shippingInfo?.phone}</a>
                      {ord.shippingInfo?.email && <p className="text-[10px] font-medium text-slate-450 truncate max-w-[180px]"><i className="fa-solid fa-envelope text-[9px] mr-1"></i>{ord.shippingInfo?.email}</p>}
                      <p className="text-[9px] text-slate-400 font-bold mt-1.5 leading-relaxed truncate max-w-[180px]"><i className="fa-solid fa-location-dot text-[8px] mr-1 text-slate-350"></i>{ord.shippingInfo?.address}</p>
                    </td>

                    {/* Ordered Items */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 max-w-[180px]">
                        {ord.items.map((itm, index) => (
                          <span key={index} className="text-[11px] font-bold text-slate-700 flex items-start gap-1 leading-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                            <span className="truncate">{itm.name} ({itm.weight}) × {itm.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          <i className={`fa-solid ${ord.paymentMethod === 'Razorpay' ? 'fa-credit-card text-blue-600' : 'fa-truck text-amber-600'} text-[10px]`} />
                          {ord.paymentMethod === 'Razorpay' ? 'Paid Online' : 'Cash on Delivery'}
                        </span>
                        <span className={`inline-flex items-center gap-1 border font-extrabold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ord.paymentStatus === 'Paid'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {ord.paymentStatus === 'Paid' ? 'PAID' : 'COD PENDING'}
                        </span>
                      </div>
                    </td>

                    {/* Total Paid */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-heading font-black text-sm text-slate-900">₹{ord.totalPayable.toFixed(2)}</span>
                      {ord.savings > 0 && <span className="block text-[8px] text-emerald-600 font-bold mt-1">Saved ₹{ord.savings}</span>}
                    </td>

                    {/* Order Status */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 border font-extrabold text-[9px] px-3 py-1.5 rounded-full uppercase tracking-wider ${getStatusBadgeClass(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Delivery Logistics */}
                    <td className="px-6 py-5 text-xs font-semibold">
                      {ord.deliveryPackageId ? (
                        <div className="space-y-1 text-slate-700">
                          <p><span className="text-slate-400 text-[8px] font-extrabold uppercase tracking-wider block">Package ID</span> {ord.deliveryPackageId}</p>
                          {ord.trackingLink && (
                            <a href={ord.trackingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-1 transition-colors">
                              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Track Shipment
                            </a>
                          )}
                          <p className="mt-1"><span className="text-slate-400 text-[8px] font-extrabold uppercase tracking-wider block">Tracker Status</span> <span className="text-slate-800 font-black">{ord.deliveryTrackerStatus}</span></p>
                        </div>
                      ) : (
                        <span className="text-slate-450 italic text-[11px] font-bold">Not Shipped Yet</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(ord)}
                        disabled={updatingId === ord.orderId}
                        className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                      >
                        <i className="fa-solid fa-pencil text-[9px]"></i> Edit
                      </button>
                      <button
                        onClick={() => navigate(`/admin/invoice/${ord.orderId}`)}
                        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors shadow-sm"
                      >
                        <i className="fa-solid fa-file-invoice-dollar"></i> Invoice
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(ord.orderId)}
                        disabled={updatingId === ord.orderId}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                      >
                        <i className="fa-solid fa-trash-can text-[9px]"></i> Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EDIT ORDER MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-[scaleIn_0.25s_ease-out] z-10 border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm">Edit Order & Delivery Details</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Order ID: {selectedOrder?.orderId}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-slate-700">
              
              {/* Combined Status Dropdown */}
              <div>
                <label className="block text-[9px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Order Status *</label>
                <select
                  required
                  value={editForm.deliveryTrackerStatus}
                  onChange={e => setEditForm(prev => ({ ...prev, deliveryTrackerStatus: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Package ID */}
              <div>
                <label className="block text-[9px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Delivery Package ID</label>
                <input
                  type="text"
                  value={editForm.deliveryPackageId}
                  onChange={e => setEditForm(prev => ({ ...prev, deliveryPackageId: e.target.value }))}
                  placeholder="e.g. NVKM-PKG-101"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Tracking Link */}
              <div>
                <label className="block text-[9px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Tracking Link URL</label>
                <input
                  type="url"
                  value={editForm.trackingLink}
                  onChange={e => setEditForm(prev => ({ ...prev, trackingLink: e.target.value }))}
                  placeholder="e.g. https://track.co/shipment"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-500 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

