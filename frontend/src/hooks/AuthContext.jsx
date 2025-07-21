
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('auth/login/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      await fetchUser();
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh');

    if (refresh) {
      try {
        await api.post('auth/logout/', { refresh });
      } catch (error) {
        toast.error('Logout failed.');
        console.error('Failed to logout from backend:', error);
      }
    }

    setUser(null);
    localStorage.clear();
    toast.info('You have been logged out.');
    navigate('/login');
  };


  const fetchUser = async () => {
    try {
      const res = await api.get('auth/user/');
      setUser(res.data);
    } catch (err) {
      setUser(null);
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);
