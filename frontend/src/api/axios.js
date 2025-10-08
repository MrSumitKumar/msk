// src/api/axios.js

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logout, setAccessToken } from '../context/AuthHelpers';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // baseURL: 'https://api.shikohabad.in',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
});

// -----------------------------
// Request Interceptor
// -----------------------------
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Refresh Token Handling
// -----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// -----------------------------
// Response Interceptor
// -----------------------------
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // Ignore canceled requests
    if (axios.isCancel(error)) return Promise.reject(error);

    // Network error (no response)
    if (!error.response) {
      console.error('⚠️ Network error:', error);
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // 401 Unauthorized → try refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${instance.defaults.baseURL}/auth/token/refresh/`,
          { refresh },
          { timeout: 10000 }
        );

        const newAccess = data.access;
        if (!newAccess) throw new Error('No access token in refresh response');

        // Save new token
        localStorage.setItem('access', newAccess);
        setAccessToken(newAccess);
        instance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        toast.error('Session expired. Please login again.');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 Forbidden
    if (error.response.status === 403) {
      logout();
      toast.error('You do not have permission. Please login again.');
      return Promise.reject(error);
    }

    // Other errors (4xx / 5xx)
    const message =
      error.response.data?.detail ||
      error.response.data?.message ||
      'Something went wrong. Please try again.';
    toast.error(message);

    return Promise.reject(error);
  }
);

export default instance;
