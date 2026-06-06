import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { 
    user, 
    login, 
    loginWithGoogle, 
    requestPhoneOtp, 
    verifyPhoneOtp, 
    register, 
    requestRegisterOtp, 
    verifyRegisterOtp,
    forgotPassword,
    resetPasswordWithOtp
  } = useAuth();
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
  const [fpOtpSent, setFpOtpSent] = useState(false);
  const [fpOtpValues, setFpOtpValues] = useState(['', '', '', '', '', '']);
  const [fpOtpCode, setFpOtpCode] = useState('');
  const [fpPassword, setFpPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpSubmitting, setFpSubmitting] = useState(false);
  const [fpVerifying, setFpVerifying] = useState(false);

  // 6-digit OTP individual input states (Phone Login)
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  // 6-digit OTP individual input states (Email registration)
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regVerifying, setRegVerifying] = useState(false);
  const [regOtpValues, setRegOtpValues] = useState(['', '', '', '', '', '']);
  const [regOtpCode, setRegOtpCode] = useState('');

  useEffect(() => {
    if (user) navigate('/shop');
  }, [user, navigate]);

  // Sync otpValues array to the single string otpCode (Phone Login)
  useEffect(() => {
    setOtpCode(otpValues.join(''));
  }, [otpValues]);

  // Reset OTP boxes when state changes (Phone Login)
  useEffect(() => {
    if (!otpSent) {
      setOtpValues(['', '', '', '', '', '']);
    }
  }, [otpSent]);

  // Sync regOtpValues array to the single string regOtpCode (Email Registration)
  useEffect(() => {
    setRegOtpCode(regOtpValues.join(''));
  }, [regOtpValues]);

  // Reset OTP boxes when registration OTP state changes
  useEffect(() => {
    if (!regOtpSent) {
      setRegOtpValues(['', '', '', '', '', '']);
    }
  }, [regOtpSent]);

  // Sync fpOtpValues array to the single string fpOtpCode (Forgot Password)
  useEffect(() => {
    setFpOtpCode(fpOtpValues.join(''));
  }, [fpOtpValues]);

  // Reset OTP boxes when forgot password OTP state changes
  useEffect(() => {
    if (!fpOtpSent) {
      setFpOtpValues(['', '', '', '', '', '']);
    }
  }, [fpOtpSent]);

  // Handle Google OAuth Credentials Response
  const handleGoogleCredentialResponse = async (response) => {
    try {
      await loginWithGoogle(response.credential);
    } catch (err) {
      showToast(err.response?.data?.message || 'Google Sign-In failed.', 'error');
    }
  };

  // Helper for development mock login when Google GSI is not loaded or for local testing
  const handleMockGoogleLogin = async () => {
    const firstNames = ['Amit', 'Rajesh', 'Sunita', 'Pooja', 'Anil', 'Nisha'];
    const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Verma'];
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}${Math.floor(10 + Math.random() * 90)}@gmail.com`;
    const name = `${randomFirst} ${randomLast}`;
    const googleId = '1098' + Math.floor(1000000000 + Math.random() * 9000000000);
    
    // We send a mock token string structured so the backend knows it is mock
    const mockCredential = `mock-|${email}|${name}|${googleId}`;
    try {
      await loginWithGoogle(mockCredential);
    } catch (err) {
      showToast('Mock Google Sign-In failed.', 'error');
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '963315322219-0fq7qrch87cs6r47ama0pcg4fq9d48eb.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
      });

      // Render button in Sign In tab if visible
      const signinBtn = document.getElementById('google-signin-btn');
      if (signinBtn) {
        google.accounts.id.renderButton(signinBtn, {
          theme: 'outline',
          size: 'large',
          width: signinBtn.offsetWidth || 380,
          text: 'signin_with'
        });
      }

      // Render button in Register tab if visible
      const signupBtn = document.getElementById('google-signup-btn');
      if (signupBtn) {
        google.accounts.id.renderButton(signupBtn, {
          theme: 'outline',
          size: 'large',
          width: signupBtn.offsetWidth || 380,
          text: 'signup_with'
        });
      }
    }
  }, [activeTab, regOtpSent]);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
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
    setRegSubmitting(true);
    try {
      await requestRegisterOtp(regName, regPhone, regEmail, regPassword);
      setRegOtpSent(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration OTP request failed. Please try again.', 'error');
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleRegOtpVerify = async (e) => {
    e.preventDefault();
    if (!regOtpCode || regOtpCode.length < 6) {
      showToast('Please enter the 6-digit OTP code sent.', 'error');
      return;
    }
    setRegVerifying(true);
    try {
      await verifyRegisterOtp(regEmail, regOtpCode);
    } catch (err) {
      showToast(err.response?.data?.message || 'OTP verification failed. Please check the code and try again.', 'error');
    } finally {
      setRegVerifying(false);
    }
  };

  // OTP inputs key navigation logic (Email Registration)
  const handleRegOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) {
      const newOtpValues = [...regOtpValues];
      newOtpValues[index] = '';
      setRegOtpValues(newOtpValues);
      return;
    }

    const val = cleanValue.slice(-1);
    const newOtpValues = [...regOtpValues];
    newOtpValues[index] = val;
    setRegOtpValues(newOtpValues);

    // Auto-focus next input field
    if (index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
    }
  };

  const handleRegOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!regOtpValues[index] && index > 0) {
        const newOtpValues = [...regOtpValues];
        newOtpValues[index - 1] = '';
        setRegOtpValues(newOtpValues);
        document.getElementById(`reg-otp-${index - 1}`)?.focus();
      } else {
        const newOtpValues = [...regOtpValues];
        newOtpValues[index] = '';
        setRegOtpValues(newOtpValues);
      }
    }
  };

  const handleRegOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtpValues = [...regOtpValues];
    for (let i = 0; i < 6; i++) {
      newOtpValues[i] = pasteData[i] || '';
    }
    setRegOtpValues(newOtpValues);
    const focusIndex = Math.min(pasteData.length, 5);
    document.getElementById(`reg-otp-${focusIndex}`)?.focus();
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!fpEmail) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    setFpSubmitting(true);
    try {
      await forgotPassword(fpEmail);
      setFpOtpSent(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send reset OTP code.', 'error');
    } finally {
      setFpSubmitting(false);
    }
  };

  const handleForgotPasswordVerify = async (e) => {
    e.preventDefault();
    if (!fpOtpCode || fpOtpCode.length < 6) {
      showToast('Please enter the 6-digit OTP code sent.', 'error');
      return;
    }
    if (fpPassword !== fpConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (fpPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setFpVerifying(true);
    try {
      await resetPasswordWithOtp(fpEmail, fpOtpCode, fpPassword);
      // Clear all fields and redirect
      setFpOtpSent(false);
      setFpEmail('');
      setFpOtpValues(['', '', '', '', '', '']);
      setFpPassword('');
      setFpConfirmPassword('');
      setActiveTab('login');
    } catch (err) {
      showToast(err.response?.data?.message || 'OTP verification or password reset failed. Please try again.', 'error');
    } finally {
      setFpVerifying(false);
    }
  };

  // OTP inputs key navigation logic (Forgot Password)
  const handleFpOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) {
      const newOtpValues = [...fpOtpValues];
      newOtpValues[index] = '';
      setFpOtpValues(newOtpValues);
      return;
    }

    const val = cleanValue.slice(-1);
    const newOtpValues = [...fpOtpValues];
    newOtpValues[index] = val;
    setFpOtpValues(newOtpValues);

    // Auto-focus next input field
    if (index < 5) {
      document.getElementById(`fp-otp-${index + 1}`)?.focus();
    }
  };

  const handleFpOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!fpOtpValues[index] && index > 0) {
        const newOtpValues = [...fpOtpValues];
        newOtpValues[index - 1] = '';
        setFpOtpValues(newOtpValues);
        document.getElementById(`fp-otp-${index - 1}`)?.focus();
      } else {
        const newOtpValues = [...fpOtpValues];
        newOtpValues[index] = '';
        setFpOtpValues(newOtpValues);
      }
    }
  };

  const handleFpOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtpValues = [...fpOtpValues];
    for (let i = 0; i < 6; i++) {
      newOtpValues[i] = pasteData[i] || '';
    }
    setFpOtpValues(newOtpValues);
    const focusIndex = Math.min(pasteData.length, 5);
    document.getElementById(`fp-otp-${focusIndex}`)?.focus();
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
    <div className="page-transition min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50/20 via-transparent to-sky-50/10">
      {/* Decorative blobs */}
      <div className="fixed top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-radial-gradient(circle,rgba(37,99,235,.04),transparent) pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-radial-gradient(circle,rgba(15,41,66,.04),transparent) pointer-events-none z-0" />

      <div className="w-full max-w-[460px] relative z-10 glass-premium rounded-[24px] xs:rounded-[32px] p-5 xs:p-8 sm:p-10 shadow-2xl border border-blue-500/20">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-950/20">
            <i className="fa-solid fa-leaf text-white text-2xl" />
          </div>
          <span className="text-[10px] font-extrabold text-blue-600 tracking-widest uppercase">NVKM GROUP</span>
        </div>

        {/* Tab Switcher */}
        {activeTab !== 'forgot' && (
          <div className="flex bg-slate-100/80 rounded-2xl p-1 mb-8 border border-slate-200/50">
            {[['login', 'Sign In'], ['register', 'Register']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl cursor-pointer text-[0.82rem] font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === tab
                    ? 'bg-white text-blue-900 shadow-sm border border-slate-100/50'
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
            <div className="w-full flex flex-col gap-2 items-center">
              <div id="google-signin-btn" className="w-full min-h-[44px] flex justify-center"></div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">or continue with</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                  className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-blue-600 bg-none border-none cursor-pointer font-bold hover:text-blue-700 transition-colors"
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
                    className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 pl-4 pr-12 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
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
                className="w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 tracking-wide mt-2"
              >
                <i className="fa-solid fa-arrow-right-to-bracket mr-2" /> Sign In with Email
              </button>
            </form>

            <p className="text-center text-[0.78rem] text-slate-400 font-medium mt-2">
              New to NVKM Group?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="bg-transparent border-none text-blue-600 font-extrabold cursor-pointer text-[0.78rem] hover:text-blue-700 transition-colors"
              >
                Register Now
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {activeTab === 'register' && (
          <div className="flex flex-col gap-6">
            {!regOtpSent ? (
              <>
                <div className="text-center sm:text-left">
                  <h2 className="font-heading font-black text-2xl text-slate-900">Create Account</h2>
                  <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Sign up in seconds to start shopping.</p>
                </div>

                {/* Google Sign-up Button */}
                <div className="w-full flex flex-col gap-2 items-center">
                  <div id="google-signup-btn" className="w-full min-h-[44px] flex justify-center"></div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-slate-200" />
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">or continue with</span>
                  <div className="flex-1 h-[1px] bg-slate-200" />
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
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
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
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
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
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
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
                        className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
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
                        className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={regSubmitting}
                    className={`w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 tracking-wide mt-2 flex items-center justify-center gap-2 ${regSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {regSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Sending OTP...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-user-plus mr-2" /> Create Account
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* OTP Verification View for Email Registration */
              <form onSubmit={handleRegOtpVerify} className="flex flex-col gap-5">
                <div className="bg-gradient-to-br from-blue-50/80 to-sky-50/60 border border-blue-100 p-4 rounded-2xl text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center mx-auto mb-2 shadow-md">
                    <i className="fa-solid fa-envelope-open-text text-white text-xs" />
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest block">Email Code Sent</span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Enter the 6-digit OTP code sent to {regEmail}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-3 uppercase tracking-wider text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-between gap-1.5 xs:gap-2" onPaste={handleRegOtpPaste}>
                    {regOtpValues.map((val, idx) => (
                      <input
                        key={idx}
                        id={`reg-otp-${idx}`}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength="1"
                        value={val}
                        onChange={e => handleRegOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleRegOtpKeyDown(e, idx)}
                        className="flex-1 max-w-[40px] xs:max-w-[44px] sm:max-w-none sm:w-12 h-12 sm:h-14 bg-slate-50 border-[1.5px] border-slate-350/80 rounded-xl text-center text-xl font-bold font-heading outline-none transition-all duration-200 text-blue-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setRegOtpSent(false)}
                    className="flex-1 bg-slate-100 text-slate-600 font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-chevron-left" /> Edit Form
                  </button>
                  <button
                    type="submit"
                    disabled={regVerifying}
                    className="flex-[2] bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer shadow-lg shadow-blue-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    {regVerifying ? (
                      'Verifying...'
                    ) : (
                      <>
                        <i className="fa-solid fa-check-circle" /> Verify & Sign Up
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
            <p className="text-center text-[0.78rem] text-slate-400 font-medium mt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setRegOtpSent(false); }}
                className="bg-transparent border-none text-blue-950 font-extrabold cursor-pointer text-[0.78rem] hover:text-blue-900 transition-colors"
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
              onClick={() => { setActiveTab('login'); setFpOtpSent(false); }}
              className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-blue-900 text-[0.8rem] font-extrabold flex items-center gap-1.5 p-0 self-start transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs" /> Back to Sign In
            </button>

            {!fpOtpSent ? (
              <>
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">Reset Password</h2>
                  <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Enter your email and we'll send a 6-digit verification code.</p>
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
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3.5 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={fpSubmitting}
                    className={`w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-[0.85rem] cursor-pointer shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 tracking-wide mt-2 flex items-center justify-center gap-2 ${fpSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {fpSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Sending OTP...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-envelope mr-2" /> Send OTP Code
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">Verify OTP</h2>
                  <p className="text-[0.8rem] text-slate-400 mt-1 font-medium">Enter the 6-digit code sent to {fpEmail} and choose a new password.</p>
                </div>
                <form onSubmit={handleForgotPasswordVerify} className="flex flex-col gap-5">
                  <div className="bg-gradient-to-br from-blue-50/80 to-sky-50/60 border border-blue-100 p-4 rounded-2xl text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center mx-auto mb-2 shadow-md">
                      <i className="fa-solid fa-key text-white text-xs" />
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest block">Reset Code Sent</span>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Please enter verification code below</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-3 uppercase tracking-wider text-center">
                      Enter Verification Code
                    </label>
                    <div className="flex justify-between gap-1.5 xs:gap-2" onPaste={handleFpOtpPaste}>
                      {fpOtpValues.map((val, idx) => (
                        <input
                          key={idx}
                          id={`fp-otp-${idx}`}
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength="1"
                          value={val}
                          onChange={e => handleFpOtpChange(e.target.value, idx)}
                          onKeyDown={e => handleFpOtpKeyDown(e, idx)}
                          className="flex-1 max-w-[40px] xs:max-w-[44px] sm:max-w-none sm:w-12 h-12 sm:h-14 bg-slate-50 border-[1.5px] border-slate-350/80 rounded-xl text-center text-xl font-bold font-heading outline-none transition-all duration-200 text-blue-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={fpPassword}
                      onChange={e => setFpPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                    <input
                      type="password"
                      value={fpConfirmPassword}
                      onChange={e => setFpConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-[1.5px] border-slate-300/80 px-4 py-3 rounded-2xl text-[0.82rem] outline-none transition-all duration-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setFpOtpSent(false)}
                      className="flex-1 bg-slate-100 text-slate-600 font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-chevron-left" /> Edit Email
                    </button>
                    <button
                      type="submit"
                      disabled={fpVerifying}
                      className="flex-[2] bg-gradient-to-r from-blue-900 to-blue-600 text-white font-extrabold py-3.5 rounded-2xl text-[0.82rem] cursor-pointer shadow-lg shadow-blue-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      {fpVerifying ? (
                        'Verifying...'
                      ) : (
                        <>
                          <i className="fa-solid fa-check-circle" /> Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
