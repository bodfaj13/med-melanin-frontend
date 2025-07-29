import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // if you want to send cookies
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  response => response,
  error => {
    // Optionally handle 401/403 errors globally
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // For example, redirect to login or clear user session
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
