/**
 * Axios Configuration
 * API client setup with interceptors and automatic token refresh
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

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// Response interceptor - Handle errors globally and refresh token
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if it's a token-related error (expired, invalid, etc.)
      const isTokenError = errorMessage.toLowerCase().includes('token') || 
                          errorMessage.toLowerCase().includes('unauthorized') ||
                          errorMessage.toLowerCase().includes('expired');
      
      if (isTokenError) {
        
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        
        console.log('Token expired, attempting refresh...', { 
          hasRefreshToken: !!refreshToken,
          refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : null 
        });
        
        if (!refreshToken) {
          // No refresh token, logout
          console.warn('No refresh token found, logging out');
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Call refresh token endpoint using plain axios (not the intercepted instance)
          console.log('Calling refresh token endpoint...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          console.log('Refresh successful, new tokens received');
          const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Store new tokens
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process all queued requests with new token
          processQueue(null, newToken);
          
          isRefreshing = false;
          
          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          console.error('Refresh token failed:', refreshError.response?.data || refreshError.message);
          processQueue(refreshError, null);
          isRefreshing = false;
          
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        }
      } else {
        // Other 401 errors (invalid credentials, etc.)
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
