import { useState, useEffect } from 'react';
import api, { DEFAULT_SETTINGS } from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    contact_phone_1: '',
    contact_phone_2: '',
    whatsapp_phone_1: '',
    whatsapp_phone_2: '',
    email: '',
    address: '',
    footer_address: '',
    footer_phone_1: '',
    footer_phone_2: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
        showToast('Failed to load settings from server. Using defaults.', 'warning');
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put('/admin/settings', settings);
      showToast(data.message || 'Store settings updated successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast(err.response?.data?.message || 'Failed to update store settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset settings to default values? This will not save until you submit the form.')) {
      setSettings(DEFAULT_SETTINGS);
      showToast('Settings reset to default layout values.', 'info');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Info Card */}
        <div className="bg-gradient-to-tr from-[#0F2942] to-[#1D4ED8] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-radial-gradient(circle,rgba(56,189,248,.1),transparent) pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <h2 className="font-heading font-black text-xl flex items-center gap-2">
              <i className="fa-solid fa-address-card text-sky-400" />
              Dynamic Store Details
            </h2>
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-2xl">
              Updating these variables will instantly apply the changes to the Call support links, WhatsApp chat integration, Contact page cards, Footer blocks, and general widgets across the entire store frontend.
            </p>
          </div>
        </div>

        {/* main forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Contact Page Settings Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-headset text-xs" />
              </div>
              Contact Page Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  Call Support Phone 1
                </label>
                <input
                  type="text"
                  name="contact_phone_1"
                  value={settings.contact_phone_1}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 90142 74293"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  Call Support Phone 2
                </label>
                <input
                  type="text"
                  name="contact_phone_2"
                  value={settings.contact_phone_2}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 70756 04700"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  WhatsApp Support Phone 1
                </label>
                <input
                  type="text"
                  name="whatsapp_phone_1"
                  value={settings.whatsapp_phone_1}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 90142 74293"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  WhatsApp Support Phone 2
                </label>
                <input
                  type="text"
                  name="whatsapp_phone_2"
                  value={settings.whatsapp_phone_2}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 70756 04700"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                Support Email Address
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                required
                placeholder="e.g. support@nvkm.com"
                className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                Factory Store Physical Address
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Full address of the factory location..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3.5 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Footer Details Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-heading font-extrabold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                <i className="fa-solid fa-rectangle-list text-xs" />
              </div>
              Footer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  Footer Phone Number 1
                </label>
                <input
                  type="text"
                  name="footer_phone_1"
                  value={settings.footer_phone_1}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 90142 74293"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                  Footer Phone Number 2
                </label>
                <input
                  type="text"
                  name="footer_phone_2"
                  value={settings.footer_phone_2}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 70756 04700"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
                Footer Address Details
              </label>
              <textarea
                name="footer_address"
                value={settings.footer_address}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Address to show in the footer column..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-3.5 rounded-xl text-xs outline-none transition-all duration-200 text-slate-800 font-semibold resize-none leading-relaxed"
              />
            </div>
            
            <div className="pt-2">
              <span className="text-[10px] bg-sky-50 text-sky-700 font-bold border border-sky-100 rounded-xl p-3 block leading-relaxed">
                <i className="fa-solid fa-circle-info mr-1.5" /> Note: The primary footer social WhatsApp widget will automatically route messages to WhatsApp Phone 1 defined on the left side.
              </span>
            </div>

          </div>

        </div>

        {/* Buttons Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="w-full sm:w-auto px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-2xl cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-rotate-left mr-1.5" /> Reset to Layout Defaults
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-extrabold text-xs py-3 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check" />
                Save Store Settings
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
