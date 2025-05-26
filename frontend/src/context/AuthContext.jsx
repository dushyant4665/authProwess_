import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://auth-prowess.vercel.app/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setUser({ email });
    }
    setLoading(false);
  }, []);

  const signup = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      setUser({ email });
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      setUser({ email });
      toast.success('Signed in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signin failed');
      return false;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    toast.success('Signed out successfully!');
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Password reset email sent!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password
      });
      toast.success('Password reset successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    signup,
    signin,
    signout,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
