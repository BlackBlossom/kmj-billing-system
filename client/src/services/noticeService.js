/**
 * Notice Service
 * API calls for notice board management
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
 * Priority levels
 */
export const PRIORITY_LEVELS = [
  { value: 'urgent', label: 'Urgent', color: 'red' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'low', label: 'Low', color: 'gray' },
];

/**
 * Get all active notices (Public)
 * @param {Object} params - Query parameters (page, limit, priority)
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
 * @param {Object} noticeData - Notice data { title, content, priority, expiresAt }
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

/**
 * Get priority color class
 * @param {string} priority - Priority level
 * @returns {string} Tailwind color class
 */
export const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    normal: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[priority] || colors.normal;
};

export default {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  incrementViews,
  PRIORITY_LEVELS,
  getPriorityColor,
};
