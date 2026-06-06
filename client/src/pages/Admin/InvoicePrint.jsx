import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Fetch all orders and locate this specific ID
        const { data } = await api.get('/admin/orders');
        const found = data.find(o => o.orderId === id || o.id === id);
        
        if (found) {
          setOrder(found);
        } else {
          showToast(`Order with ID ${id} not found.`, 'error');
          navigate('/admin/orders');
        }
      } catch (err) {
        showToast('Failed to fetch invoice details.', 'error');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate, showToast]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate prices
  const subtotal = order.items.reduce((s, itm) => s + (itm.originalPrice || itm.price) * itm.quantity, 0);
  const savings = order.savings || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 page-transition">
      
      {/* ── PRINT & NAV BAR (HIDDEN DURING PRINT) ── */}
      <div className="no-print bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-1"></i> Back to Orders
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/10"
        >
          <i className="fa-solid fa-print"></i> Print / Save as PDF
        </button>
      </div>

      {/* ── INVOICE SHEET ── */}
      <div className="bg-white border border-slate-200 p-6 sm:p-12 shadow-md rounded-[20px] print:border-none print:shadow-none print:p-0 text-slate-800 text-sm">
        
        {/* Style block specifically to force A4 print margins and hide browser header/footers */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; color: black !important; }
            @page { margin: 1.5cm; }
          }
        `}} />

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="NVKM GROUP" className="w-12 h-12 object-contain rounded-lg" />
              <span className="font-heading font-black text-2xl text-slate-900 leading-none">NVKM <span className="text-blue-600">GROUP</span></span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed uppercase tracking-wider">
              Natural Organic Powder Manufacturer
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Near bypass Anantapur Road, Bathalapalli,<br />
              Sri Sathya Sai Dist, Andhra Pradesh 515661
            </p>
          </div>
          
          <div className="text-left sm:text-right">
            <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">TAX INVOICE</h2>
            <p className="text-xs font-extrabold text-slate-450 block mt-2">INVOICE ID: <span className="text-slate-800 font-heading tracking-wider">{order.orderId}</span></p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Date: {order.date}</p>
          </div>
        </div>

        {/* Billing & Shipping Details Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-100">
          <div>
            <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">Billed & Shipped To</h4>
            <p className="font-heading font-extrabold text-sm text-slate-900 mb-1">{order.shippingInfo?.name}</p>
            <p className="text-xs text-slate-600 font-semibold mb-1">Phone: {order.shippingInfo?.phone}</p>
            {order.shippingInfo?.email && <p className="text-xs text-slate-650 font-medium mb-1">Email: {order.shippingInfo?.email}</p>}
            <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line max-w-xs font-medium">
              {order.shippingInfo?.address}
            </p>
          </div>

          <div className="space-y-3 sm:text-right">
            <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 sm:block hidden">Invoice Details</h4>
            <div className="space-y-1 text-xs">
              <p className="text-slate-500 font-bold">Payment Method: <span className="text-slate-800 font-extrabold">{order.paymentMethod === 'Razorpay' ? 'Paid Online (Razorpay)' : 'Cash on Delivery'}</span></p>
              <p className="text-slate-500 font-bold">Payment Status: <span className="text-slate-800 font-extrabold">{order.paymentStatus}</span></p>
              {order.paymentId && <p className="text-slate-500 font-semibold">Payment ID: <span className="text-slate-850 font-mono text-[10px]">{order.paymentId}</span></p>}
              <p className="text-slate-500 font-bold">Shipping Status: <span className="text-slate-800 font-extrabold">{order.status}</span></p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3 font-extrabold">Product Description</th>
                <th className="py-3 text-center font-extrabold">Weight</th>
                <th className="py-3 text-right font-extrabold">Unit Price</th>
                <th className="py-3 text-center font-extrabold">Qty</th>
                <th className="py-3 text-right font-extrabold">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((itm, i) => {
                const itemPrice = itm.originalPrice || itm.price;
                const totalItem = itemPrice * itm.quantity;
                return (
                  <tr key={i} className="text-xs">
                    <td className="py-4 font-bold text-slate-900">{itm.name}</td>
                    <td className="py-4 text-center font-semibold text-slate-600">{itm.weight}</td>
                    <td className="py-4 text-right font-semibold text-slate-700">₹{itemPrice.toFixed(2)}</td>
                    <td className="py-4 text-center font-bold text-slate-800">{itm.quantity}</td>
                    <td className="py-4 text-right font-heading font-extrabold text-slate-900">₹{totalItem.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col items-end gap-2 text-xs">
          <div className="flex justify-between w-64 text-slate-500 font-bold">
            <span>Items Subtotal:</span>
            <span className="text-slate-800 font-heading">₹{subtotal.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between w-64 text-emerald-600 font-bold">
              <span>Applied Discount:</span>
              <span className="font-heading">-₹{savings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between w-64 text-slate-500 font-bold">
            <span>Shipping Fees:</span>
            <span className="text-slate-800 font-semibold">₹0.00 (FREE)</span>
          </div>
          <div className="flex justify-between w-64 text-slate-500 font-bold border-b border-slate-100 pb-3">
            <span>Tax (GST Included):</span>
            <span className="text-slate-800 font-semibold">₹0.00 (0% Exchanged)</span>
          </div>
          <div className="flex justify-between w-64 text-sm font-heading font-black text-[#0F2942] pt-2">
            <span>Net Payable Total:</span>
            <span className="text-lg">₹{order.totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Terms and Bottom Notes */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 font-semibold leading-relaxed">
          <p className="text-slate-500 font-bold mb-1">Thank you for supporting sustainable farming & natural health!</p>
          <p>This is a computer-generated invoice and requires no physical signature or seal.</p>
          <p className="mt-1">For return queries or bulk quotations, write to us at Navakiranamgroup@gmail.com or WhatsApp +91 9014274293.</p>
        </div>

      </div>

    </div>
  );
}
