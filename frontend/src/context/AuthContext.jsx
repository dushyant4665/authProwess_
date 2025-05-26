import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Determine the API URL based on the environment
const getApiUrl = () => {
  // If running in GitHub Codespaces
  if (window.location.hostname.includes('github.dev')) {
    const backendUrl = 'https://glorious-yodel-x5564r4x7wr5h6r4g-5000.app.github.dev';
    console.log('Using GitHub Codespaces backend URL:', backendUrl);
    return `${backendUrl}/api`;
  }
  // Use environment variable or fallback to localhost
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  console.log('Using API URL:', url);
  return url;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add timeout and validate status
  timeout: 15000, // Increased timeout
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const requestInfo = {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      withCredentials: config.withCredentials,
      data: config.data
    };
    console.log('Making request:', requestInfo);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    const responseInfo = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: {
        url: response.config.url,
        method: response.config.method,
        baseURL: response.config.baseURL
      }
    };
    console.log('Response received:', responseInfo);
    return response;
  },
  (error) => {
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
        withCredentials: error.config?.withCredentials
      }
    };
    console.error('Response error:', errorInfo);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    
    return Promise.reject(error);
  }
);

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
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const signup = async (email, password) => {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
      const response = await api.post('/auth/signin', {
        email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Signed out successfully!');
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.post(`/auth/reset-password/${token}`, {
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