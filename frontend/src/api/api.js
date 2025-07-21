import axios from 'axios';

// const api = axios.create( {baseURL: 'http://localhost:8000/api/', } );
const api = axios.create( {baseURL: 'https://api.shikohabad.in/api/', } );

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
