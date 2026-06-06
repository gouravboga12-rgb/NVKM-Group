import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nvkm_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('nvkm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('nvkm_user', JSON.stringify(data));
    setUser(data);
    showToast(`Welcome back, ${data.name}!`);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    localStorage.setItem('nvkm_user', JSON.stringify(data));
    setUser(data);
    showToast(`Welcome back, signed in as ${data.name}!`);
    return data;
  };

  const requestPhoneOtp = async (phone) => {
    const { data } = await api.post('/auth/phone-login', { phone });
    showToast(data.message);
    return data;
  };

  const verifyPhoneOtp = async (phone, otp) => {
    const { data } = await api.post('/auth/phone-verify', { phone, otp });
    localStorage.setItem('nvkm_user', JSON.stringify(data));
    setUser(data);
    showToast(`Successfully verified! Welcome back, ${data.name}.`);
    return data;
  };

  const register = async (name, phone, email, password) => {
    const { data } = await api.post('/auth/register', { name, phone, email, password });
    // Auto-login after registration
    localStorage.setItem('nvkm_user', JSON.stringify(data));
    setUser(data);
    showToast('Account created successfully!');
    return data;
  };

  const requestRegisterOtp = async (name, phone, email, password) => {
    const { data } = await api.post('/auth/register-otp', { name, phone, email, password });
    showToast(data.message);
    return data;
  };

  const verifyRegisterOtp = async (email, otp) => {
    const { data } = await api.post('/auth/register-verify', { email, otp });
    localStorage.setItem('nvkm_user', JSON.stringify(data));
    setUser(data);
    showToast('Account created and verified successfully!');
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    showToast(data.message);
    return data;
  };

  const resetPassword = async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    showToast(data.message);
    return data;
  };

  const resetPasswordWithOtp = async (email, otp, password) => {
    const { data } = await api.post('/auth/reset-password', { email, otp, password });
    showToast(data.message);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nvkm_user');
    setUser(null);
    showToast('Successfully logged out.', 'info');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGoogle, 
      requestPhoneOtp, 
      verifyPhoneOtp, 
      register, 
      requestRegisterOtp, 
      verifyRegisterOtp, 
      forgotPassword,
      resetPassword,
      resetPasswordWithOtp,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
