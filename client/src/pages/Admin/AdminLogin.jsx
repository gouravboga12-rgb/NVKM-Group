import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in as admin, redirect to admin home
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credentials.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const userData = await login(email, password);
      
      // Strict client-side check to verify they are admin
      if (userData.role !== 'admin') {
        logout(); // Immediately clear non-admin session
        showToast('Access denied: Customer accounts cannot log in here.', 'error');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-300">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-radial-gradient(circle,rgba(37,99,235,.07),transparent) pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-radial-gradient(circle,rgba(56,189,248,.07),transparent) pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <i className="fa-solid fa-shield-halved text-white text-2xl" />
          </div>
          <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase">NVKM GROUP</span>
          <h2 className="font-heading font-black text-xl text-white mt-2 tracking-tight">Administrative Console</h2>
          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5">STAFF LOG IN ONLY</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-450 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@nvkm.com"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-xs outline-none transition-all text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:bg-slate-950/40"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                <i className="fa-solid fa-user-shield text-[11px]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-450 mb-2 uppercase tracking-wider">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-xs outline-none transition-all text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:bg-slate-950/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[11px]`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-extrabold py-4 px-4 rounded-2xl text-xs cursor-pointer shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authorizing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock-open text-[10px]" /> Authenticate Session
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[9px] text-slate-500 font-bold mt-8 border-t border-white/5 pt-4">
          This connection is monitored. Unauthorized attempts will be logged.
        </p>

      </div>
      
    </div>
  );
}
