/**
 * Member Service
 * API calls for member/census management
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

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all members (paginated and filtered)
 * @param {Object} params - Query parameters (page, limit, search, ward, gender, etc.)
 * @returns {Promise} Members list with pagination
 */
export const getAllMembers = async (params = {}) => {
  const response = await api.get('/members', { params });
  return response.data;
};

/**
 * Search members
 * @param {string} query - Search query
 * @param {string} type - Search type (all|name|id|aadhaar|phone)
 * @returns {Promise} Matched members
 */
export const searchMembers = async (query, type = 'all') => {
  const response = await api.get('/members/search', {
    params: { q: query, type },
  });
  return response.data;
};

/**
 * Get member by ID
 * @param {string} id - Member ID
 * @returns {Promise} Member details
 */
export const getMemberById = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

/**
 * Get family members
 * @param {string} familyId - Family/Mahal ID (ward/house format)
 * @returns {Promise} Family members list
 */
export const getFamilyMembers = async (familyId) => {
  const response = await api.get(`/members/family/${familyId}`);
  return response.data;
};

/**
 * Create new member (census entry)
 * @param {Object} memberData - Member data (25 fields)
 * @returns {Promise} Created member
 */
export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

/**
 * Update member
 * @param {string} id - Member ID
 * @param {Object} memberData - Updated member data
 * @returns {Promise} Updated member
 */
export const updateMember = async (id, memberData) => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data;
};

/**
 * Delete member
 * @param {string} id - Member ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};

/**
 * Get member statistics (Admin only)
 * @returns {Promise} Member stats
 */
export const getMemberStats = async () => {
  const response = await api.get('/members/stats');
  return response.data;
};

/**
 * Get total count of members (for pagination calculation)
 * @param {Object} params - Optional filters (ward, gender, relation)
 * @returns {Promise} Total count and pages info
 */
export const getMemberCount = async (params = {}) => {
  const response = await api.get('/members/count', { params });
  return response.data;
};

/**
 * Bulk import members (Admin only)
 * @param {Array} members - Array of member objects
 * @returns {Promise} Import results
 */
export const importMembers = async (members) => {
  const response = await api.post('/members/import', { members });
  return response.data;
};

export default {
  getAllMembers,
  searchMembers,
  getMemberById,
  getFamilyMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberStats,
  getMemberCount,
  importMembers,
};
