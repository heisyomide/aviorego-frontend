import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to append the token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // 🌟 FIXED: Match your context key name 'aviore_token'
      const token = localStorage.getItem('aviore_token');

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Session auto-cleanup interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Clearing records...');
      if (typeof window !== 'undefined') {
        // 🌟 FIXED: Clear matching keys
        localStorage.removeItem('aviore_token');
        localStorage.removeItem('aviore_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);