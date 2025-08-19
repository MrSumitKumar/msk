import axios from 'axios';

// Determine baseURL based on the current environment
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const instance = axios.create({
  baseURL: isLocalhost
    ? 'http://127.0.0.1:8000'
    : 'https://api.shikohabad.in',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
