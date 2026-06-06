import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminContacts({ showLogs = false }) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Date filter state (logs only)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = showLogs ? '/admin/logs' : '/admin/contacts';
      const params = {};
      if (showLogs) {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }
      const { data } = await api.get(endpoint, { params });
      setItems(data);
    } catch (err) {
      showToast(`Could not load ${showLogs ? 'activity log history' : 'customer inquiries'}.`, 'error');
    } finally {
      setLoading(false);
    }
  }, [showLogs, startDate, endDate, showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── RESET filters when switching tabs
  useEffect(() => {
    setStartDate('');
    setEndDate('');
  }, [showLogs]);

  // ── Delete single log entry
  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this log entry? This action cannot be undone.')) return;
    try {
      setDeletingId(id);
      const { data } = await api.delete(`/admin/logs/${id}`);
      showToast(data.message || 'Log entry deleted!');
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete log entry.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Clear all logs
  const handleClearAllLogs = async () => {
    if (!window.confirm('Are you sure you want to clear ALL log entries? This permanently erases the entire audit trail and cannot be undone.')) return;
    try {
      const { data } = await api.delete('/admin/logs');
      showToast(data.message || 'All logs cleared!');
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to clear logs.', 'error');
    }
  };

  // ── Delete single contact inquiry
  const handleDeleteContact = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the inquiry from "${name}"? This action cannot be undone.`)) return;
    try {
      setDeletingId(id);
      const { data } = await api.delete(`/admin/contacts/${id}`);
      showToast(data.message || 'Inquiry deleted successfully!');
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete inquiry.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 page-transition">

      {/* ── HEADER BAR ── */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-slate-800 text-sm">
            {showLogs ? 'System Audit Log Tracker' : 'Client Inquiries Inbox'}
          </h2>
          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1">
            {showLogs ? 'Track all catalog changes and status edits' : 'View customer support requests and messages'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchItems}
            className="text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-arrows-rotate mr-1"></i> Refresh
          </button>
          {showLogs && items.length > 0 && (
            <button
              onClick={handleClearAllLogs}
              className="text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-trash-can mr-1"></i> Clear All Logs
            </button>
          )}
        </div>
      </div>

      {/* ── DATE FILTER BAR (Logs only) ── */}
      {showLogs && (
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-extrabold text-red-500 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <i className="fa-solid fa-filter-circle-xmark"></i> Clear Filters
              </button>
            )}
            <span className="ml-auto text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100">
              {items.length} log{items.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      )}

      {/* ── CONTENT AREA ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <div className="w-14 h-14 bg-slate-50 border rounded-full flex items-center justify-center mx-auto mb-4">
            <i className={`fa-solid ${showLogs ? 'fa-timeline' : 'fa-inbox'} text-slate-350 text-lg`} />
          </div>
          <h4 className="font-heading font-black text-slate-700 text-base">
            {showLogs ? 'No logs recorded' : 'Inquiries folder is empty'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
            {showLogs
              ? (startDate || endDate)
                ? 'No logs found for the selected date range. Try adjusting the filters.'
                : 'No system operations have been logged. Actions like status changes or product uploads appear here.'
              : 'Excellent! No pending customer questions or wholesale requests found.'
            }
          </p>
          {showLogs && (startDate || endDate) && (
            <button onClick={clearFilters} className="mt-4 text-xs text-blue-600 hover:text-blue-800 font-extrabold cursor-pointer">
              <i className="fa-solid fa-filter-circle-xmark mr-1"></i> Clear date filters
            </button>
          )}
        </div>
      ) : showLogs ? (

        // ── VIEW 1: CHANGE TRACKER ACTIVITY LOGS ──
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Action Type</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Detailed Description</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Performed By</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-slate-50/40 transition-colors">

                    {/* Action Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 border font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        log.action?.includes('Created') || log.action?.includes('Submitted')
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : log.action?.includes('Edited') || log.action?.includes('Updated')
                          ? 'text-blue-700 bg-blue-50 border-blue-200'
                          : 'text-rose-700 bg-rose-50 border-rose-200'
                      }`}>
                        <i className={`fa-solid ${
                          log.action?.includes('Created') || log.action?.includes('Submitted')
                            ? 'fa-plus-circle'
                            : log.action?.includes('Edited') || log.action?.includes('Updated')
                            ? 'fa-pen-to-square'
                            : 'fa-trash-can'
                        } text-[8px]`} /> {log.action}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 leading-normal max-w-sm">
                      {log.details}
                    </td>

                    {/* Performed By */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                      {log.performed_by || log.performedBy}
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-400">
                      <span>{new Date(log.created_at || log.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="block text-[10px] text-slate-350 mt-1 font-medium">
                        {new Date(log.created_at || log.createdAt).toLocaleTimeString('en-IN')}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        disabled={deletingId === log.id}
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
      ) : (

        // ── VIEW 2: CONTACT INQUIRIES LIST ──
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Client Info</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Message Description</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Date Sent</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((msg, index) => (
                  <tr key={msg.id || index} className="hover:bg-slate-50/40 transition-colors">

                    {/* Customer */}
                    <td className="px-6 py-5">
                      <p className="text-xs font-extrabold text-slate-800 leading-none mb-1.5">{msg.name}</p>
                      <a href={`tel:${msg.phone}`} className="text-[10px] font-bold text-slate-500 block mb-0.5 hover:text-blue-600 transition-colors">
                        <i className="fa-solid fa-phone text-[8px] mr-1" />{msg.phone}
                      </a>
                      {msg.email && <p className="text-[10px] font-medium text-slate-450"><i className="fa-solid fa-envelope text-[8px] mr-1" />{msg.email}</p>}
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">{msg.subject}</span>
                    </td>

                    {/* Message */}
                    <td className="px-6 py-5">
                      <p className="text-xs text-slate-650 font-medium leading-relaxed max-w-sm whitespace-pre-line bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                        {msg.message}
                      </p>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-400">
                      <span>{new Date(msg.created_at || msg.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="block text-[10px] text-slate-350 mt-1 font-medium">
                        {new Date(msg.created_at || msg.createdAt).toLocaleTimeString('en-IN')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteContact(msg.id, msg.name)}
                        disabled={deletingId === msg.id}
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

    </div>
  );
}
