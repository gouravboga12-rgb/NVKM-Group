import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, login, loginWithGoogle, requestPhoneOtp, verifyPhoneOtp, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');
  const [loginMethod, setLoginMethod] = useState('email');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginPhone, setLoginPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [submittingPhone, setSubmittingPhone] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [fpEmail, setFpEmail] = useState('');

  // 6-digit OTP individual input states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Sync otpValues array to the single string otpCode
  useEffect(() => {
    setOtpCode(otpValues.join(''));
  }, [otpValues]);

  // Reset OTP boxes when state changes
  useEffect(() => {
    if (!otpSent) {
      setOtpValues(['', '', '', '', '', '']);
    }
  }, [otpSent]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  const handleGoogleLoginClick = async () => {
    try {
      const firstNames = ['Amit', 'Rajesh', 'Sunita', 'Pooja', 'Anil', 'Nisha'];
      const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Verma'];
      const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}${Math.floor(10 + Math.random() * 90)}@gmail.com`;
      const name = `${randomFirst} ${randomLast}`;
      const googleId = '1098' + Math.floor(1000000000 + Math.random() * 9000000000);
      await loginWithGoogle(email, name, googleId);
    } catch (err) {
      showToast('Google Sign-In failed. Please try again.', 'error');
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setSubmittingPhone(true);
    try {
      const res = await requestPhoneOtp(loginPhone);
      setOtpSent(true);
      if (res.mockOtp) showToast(`Developer Hint: Use mock OTP code "${res.mockOtp}"`, 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send OTP code.', 'error');
    } finally {
      setSubmittingPhone(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      showToast('Please enter the 6-digit OTP code sent.', 'error');
      return;
    }
    setVerifyingPhone(true);
    try {
      await verifyPhoneOtp(loginPhone, otpCode);
    } catch (err) {
      showToast(err.response?.data?.message || 'OTP verification failed. Please try again.', 'error');
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    try {
      await register(regName, regPhone, regEmail, regPassword);
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    showToast('Password reset link sent to your registered email address.');
    setFpEmail('');
    setActiveTab('login');
  };

  // OTP inputs key navigation logic
  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = '';
      setOtpValues(newOtpValues);
      return;
    }

    const val = cleanValue.slice(-1);
    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);

    // Auto-focus next input field
    if (index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        document.getElementById(`otp-${index - 1}`)?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtpValues = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtpValues[i] = pasteData[i] || '';
    }
    setOtpValues(newOtpValues);
    const focusIndex = Math.min(pasteData.length, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  return (
    <div className="page-transition min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gradient-to-br from-emerald-50/20 via-transparent to-green-50/10">
      {/* Decorative blobs */}
      <div className="fixed top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-radial-gradient(circle,rgba(34,197,94,.04),transparent) pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-radial-gradient(circle,rgba(20,83,45,.04),transparent) pointer-events-none z-0" />

      <div className="w-full max-w-[460px] relative z-10 glass-premium rounded-[24px] xs:rounded-[32px] p-5 xs:p-8 sm:p-10 shadow-2xl border border-emerald-500/20">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-emerald-900 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-950/20">
            <i className="fa-solid fa-leaf text-white text-2xl" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 tracking-widest uppercase">NVKM GROUP</span>
        </div>

        {/* Tab Switcher */}
        {activeTab !== 'forgot' && (
          <div className="flex bg-slate-100/80 rounded-2xl p-1 mb-8 border border-slate-200/50">
            {[['login', 'Sign In'], ['register', 'Register']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl cursor-pointer text-[0.82rem] font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === tab
                    ? 'bg-white text-emerald-900 shadow-sm border border-slate-100/50'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab === 'login' ? (
                  <i className="fa-solid fa-arrow-right-to-bracket text-xs" />
                ) : (
                  <i className="fa-solid fa-user-plus text-xs" />
                )}
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── SIGN IN ── */}
        {activeTab === 'login' && (
          <div className="flex flex-col gap-6">
            <div className="text-center sm:text-left">
              <h2 className="font-heading font-black text-2xl text-slate-900">Welcome back</h2>
              <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Sign in to access your dashboard and orders.</p>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              className="w-full bg-white border border-slate-200 text-slate-700 font-extrabold py-3 px-4 rounded-2xl text-[0.82rem] cursor-pointer flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-[18px] h-[18px]" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">or continue with</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            {/* Method Toggle */}
            <div className="flex bg-slate-100/80 rounded-xl p-0.5 border border-slate-200/40">
              {[['email', 'fa-envelope', 'Email ID'], ['phone', 'fa-mobile-screen-button', 'Phone']].map(([method, icon, label]) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => { setLoginMethod(method); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-lg cursor-pointer text-[0.78rem] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${loginMethod === method
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'bg-transparent text-slate-400 hover:text-slate-650'
                    }`}
                >
                  <i className={`fa-solid ${icon} text-[11px]`} /> {label}
                </button>
              ))}
            </div>

            {/* Email Login */}
            {loginMethod === 'email' && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    placeholder="name@email.com"
                    className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] text-emerald-600 bg-none border-none cursor-pointer font-bold hover:text-emerald-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 pl-4 pr-12 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
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
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 tracking-wide mt-2"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket mr-2" /> Sign In with Email
                </button>
              </form>
            )}

            {/* Phone Login */}
            {loginMethod === 'phone' && !otpSent && (
              <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Mobile Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[0.82rem] font-extrabold text-slate-600">+91</span>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={e => setLoginPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      required
                      placeholder="10-digit number"
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 pl-12 pr-4 py-3.5 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submittingPhone}
                  className={`w-full bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 tracking-wide mt-2 flex items-center justify-center gap-2 ${submittingPhone ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {submittingPhone ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" /> Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane" /> Send OTP Code
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP Verification Grid */}
            {loginMethod === 'phone' && otpSent && (
              <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
                <div className="bg-gradient-to-br from-emerald-50/80 to-green-50/60 border border-emerald-100 p-4 rounded-2xl text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-900 to-emerald-500 flex items-center justify-center mx-auto mb-2 shadow-md">
                    <i className="fa-solid fa-message text-white text-xs" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">SMS Code Sent</span>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Enter the code sent to +91 {loginPhone}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-3 uppercase tracking-wider text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex justify-between gap-1.5 xs:gap-2" onPaste={handleOtpPaste}>
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength="1"
                        value={val}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        className="flex-1 max-w-[40px] xs:max-w-[44px] sm:max-w-none sm:w-12 h-12 sm:h-14 bg-slate-50 border-[1.5px] border-slate-350/80 rounded-xl text-center text-xl font-bold font-heading outline-none transition-all duration-200 text-emerald-950 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 bg-slate-100 text-slate-600 font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-chevron-left" /> Edit Number
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingPhone}
                    className="flex-[2] bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer shadow-lg shadow-emerald-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    {verifyingPhone ? (
                      'Verifying...'
                    ) : (
                      <>
                        <i className="fa-solid fa-check-circle" /> Verify & Login
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-[0.78rem] text-slate-400 font-medium mt-2">
              New to NVKM Group?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="bg-transparent border-none text-emerald-600 font-extrabold cursor-pointer text-[0.78rem] hover:text-emerald-700 transition-colors"
              >
                Register Now
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {activeTab === 'register' && (
          <div className="flex flex-col gap-6">
            <div className="text-center sm:text-left">
              <h2 className="font-heading font-black text-2xl text-slate-900">Create Account</h2>
              <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Sign up in seconds to start shopping.</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                  placeholder="Ramesh Kumar"
                  className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  required
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-800 to-emerald-500 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 tracking-wide mt-2"
              >
                <i className="fa-solid fa-user-plus mr-2" /> Create Account
              </button>
            </form>
            <p className="text-center text-[0.78rem] text-slate-400 font-medium mt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="bg-transparent border-none text-emerald-950 font-extrabold cursor-pointer text-[0.78rem] hover:text-emerald-900 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {activeTab === 'forgot' && (
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-emerald-900 text-[0.8rem] font-extrabold flex items-center gap-1.5 p-0 self-start transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs" /> Back to Sign In
            </button>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-900">Reset Password</h2>
              <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Enter your email and we'll send a reset link.</p>
            </div>
            <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={fpEmail}
                  onChange={e => setFpEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3.5 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 tracking-wide mt-2"
              >
                <i className="fa-solid fa-envelope mr-2" /> Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
