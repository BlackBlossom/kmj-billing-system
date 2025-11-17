/**
 * Axios Configuration
 * API client setup with interceptors and automatic token refresh
 */

import axios from 'axios';
import { API_BASE_URL } from '../lib/constants';
import toast from 'react-hot-toast';

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

// Logout helper function
const handleLogout = (message = 'Session expired. Please login again.') => {
  console.log('🚪 Logging out user:', message);
  
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-storage');
  
  // Clear axios default headers
  delete api.defaults.headers.common['Authorization'];
  
  // Show notification
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
  });
  
  // Small delay to ensure storage is cleared and toast shows
  setTimeout(() => {
    // Force redirect using replace to prevent back button issues
    window.location.replace('/login');
  }, 100);
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
    
    console.log('❌ API Error:', { 
      status: error.response?.status, 
      message: errorMessage,
      url: originalRequest?.url,
      retry: originalRequest?._retry 
    });
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Check if it's a token-related error
      const isTokenError = errorMessage.toLowerCase().includes('token') || 
                          errorMessage.toLowerCase().includes('unauthorized') ||
                          errorMessage.toLowerCase().includes('expired') ||
                          errorMessage.toLowerCase().includes('authentication');
      
      // If message explicitly says expired or if we've already tried to refresh, logout
      if (errorMessage.toLowerCase().includes('expired') || originalRequest._retry) {
        console.warn('🚪 Token expired or refresh failed, logging out...');
        handleLogout('Your session has expired. Please login again.');
        return Promise.reject({ message: errorMessage, status: 401 });
      }
      
      // Only try to refresh if it's a token error and we haven't tried yet
      if (isTokenError && !originalRequest._retry) {
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
        
        if (!refreshToken) {
          // No refresh token, logout
          console.warn('🚪 No refresh token found, logging out');
          isRefreshing = false;
          handleLogout('Session expired. Please login again.');
          return Promise.reject({ message: errorMessage, status: 401 });
        }

        try {
          // Call refresh token endpoint
          console.log('🔄 Attempting to refresh token...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
          
          console.log('✅ Token refresh successful');
          
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
          console.error('🚪 Refresh token failed, logging out');
          processQueue(refreshError, null);
          isRefreshing = false;
          handleLogout('Session expired. Please login again.');
          return Promise.reject({ message: errorMessage, status: 401 });
        }
      }
      
      // If it's a 401 but not a token error (like wrong credentials), don't auto-logout
      // Let the component handle it
      if (!isTokenError) {
        return Promise.reject({
          message: errorMessage,
          errors: error.response?.data?.errors || [],
          status: 401,
        });
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }
    
    return Promise.reject({
      message: errorMessage,
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    });
  }
);

export default api;
