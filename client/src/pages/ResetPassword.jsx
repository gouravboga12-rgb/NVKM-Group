import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ResetPassword() {
  const { resetPassword, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) {
      showToast('Invalid password reset link. No token found.', 'error');
      navigate('/login');
    }
  }, [token, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password. Link might be expired.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-transition min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50/20 via-transparent to-sky-50/10">
      {/* Decorative blobs */}
      <div className="fixed top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-radial-gradient(circle,rgba(37,99,235,.04),transparent) pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-radial-gradient(circle,rgba(15,41,66,.04),transparent) pointer-events-none z-0" />

      <div className="w-full max-w-[460px] relative z-10 glass-premium rounded-[24px] xs:rounded-[32px] p-5 xs:p-8 sm:p-10 shadow-2xl border border-blue-500/20">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-950/20">
            <i className="fa-solid fa-key text-white text-2xl" />
          </div>
          <span className="text-[10px] font-extrabold text-blue-600 tracking-widest uppercase">NVKM GROUP</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-heading font-black text-2xl text-slate-900">Choose New Password</h2>
          <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Create a strong, secure password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 pl-4 pr-12 py-3.5 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-slate-400 hover:text-slate-650 transition-colors text-sm flex items-center justify-center w-8 h-8"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3.5 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 tracking-wide mt-2 flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Resetting...
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check mr-2" /> Save New Password
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="bg-transparent border-none cursor-pointer text-slate-500 hover:text-blue-900 text-[0.8rem] font-extrabold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
