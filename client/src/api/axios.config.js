/**
 * Axios Configuration
 * API client setup with interceptors
 */

import axios from 'axios';
import { API_BASE_URL } from '../lib/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Forbidden:', errorMessage);
    }
    
    return Promise.reject({
      message: errorMessage,
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    });
  }
);

export default api;
