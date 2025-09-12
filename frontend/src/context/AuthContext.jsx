// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../api/axios';
import { setLogoutFn, setAccessTokenFnHelper } from './AuthHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // On Mount → check token presence
  // -----------------------------
  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Register helpers for axios.js
  // -----------------------------
  useEffect(() => {
    setLogoutFn(logout);
    setAccessTokenFnHelper((newAccess) =>
      localStorage.setItem('access', newAccess)
    );
  }, []);

  // -----------------------------
  // Refresh Token
  // -----------------------------
  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return false;

    try {
      const { data } = await axios.post('/auth/token/refresh/', { refresh });
      if (data?.access) {
        localStorage.setItem('access', data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(false); // silent logout
      return false;
    }
  };

  // -----------------------------
  // Auth Check
  // -----------------------------
  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get('/auth/me/');
      setUser(data);
    } catch (error) {
      if (error.response?.status === 401) {
        const success = await refreshAccessToken();
        if (success) return checkAuthStatus(); // retry
      }
      console.error('Auth check failed:', error);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (identifier, password) => {
    try {
      const { data } = await axios.post('/auth/login/', {
        identifier,
        password,
      });

      const { access, refresh, user: userData } = data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setUser(userData);

      // Role-based redirect
      const role = userData?.role?.toLowerCase?.() || null;
      switch (role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/');
      }

      return true;
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data?.errors?.[0]?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async (showToast = true) => {
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
    navigate('/login');
    if (showToast) toast.success('Logged out successfully');
  };

  // -----------------------------
  // Derived State
  // -----------------------------
  const isAuthenticated = !!user;

  // -----------------------------
  // Provider
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout, setUser }}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Hook for context usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
