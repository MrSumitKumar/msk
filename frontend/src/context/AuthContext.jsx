import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/auth/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth/login/', { username, password });
      const { access, refresh, user: userData } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setUser(userData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      try {
        await axios.post('/auth/logout/', { refresh });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
