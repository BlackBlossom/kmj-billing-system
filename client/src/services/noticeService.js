/**
 * Notice Service
 * API calls for notice board management - Simplified version
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (optional for public notices)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all active (non-expired) notices (Public)
 * @param {Object} params - Query parameters (page, limit, includeExpired)
 * @returns {Promise} Notices list
 */
export const getAllNotices = async (params = {}) => {
  const response = await api.get('/notices', { params });
  return response.data;
};

/**
 * Get notice by ID (Public)
 * @param {string} id - Notice ID
 * @returns {Promise} Notice details
 */
export const getNoticeById = async (id) => {
  const response = await api.get(`/notices/${id}`);
  return response.data;
};

/**
 * Create new notice (Admin only)
 * @param {Object} noticeData - Notice data { title, content, expiryDate }
 * @returns {Promise} Created notice
 */
export const createNotice = async (noticeData) => {
  const response = await api.post('/notices', noticeData);
  return response.data;
};

/**
 * Update notice (Admin only)
 * @param {string} id - Notice ID
 * @param {Object} noticeData - Updated notice data
 * @returns {Promise} Updated notice
 */
export const updateNotice = async (id, noticeData) => {
  const response = await api.put(`/notices/${id}`, noticeData);
  return response.data;
};

/**
 * Delete notice (Admin only)
 * @param {string} id - Notice ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteNotice = async (id) => {
  const response = await api.delete(`/notices/${id}`);
  return response.data;
};

/**
 * Increment notice view count (Public)
 * @param {string} id - Notice ID
 * @returns {Promise} Updated view count
 */
export const incrementViews = async (id) => {
  const response = await api.post(`/notices/${id}/view`);
  return response.data;
};

export default {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  incrementViews,
};
