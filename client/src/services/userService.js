/**
 * User Service
 * API calls for user profile and settings
 */

import axiosInstance from '../api/axios.config';

export const userService = {
  /**
   * Get current user profile with family and bills
   * @returns {Promise} API response
   */
  getProfile: async () => {
    // Axios interceptor already unwraps response.data
    const response = await axiosInstance.get('/users/profile');
    return response;
  },

  /**
   * Update user profile
   * @param {Object} data - { name, phone, email, address, ward, aadhaar }
   * @returns {Promise} API response
   */
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response;
  },

  /**
   * Update password
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise} API response
   */
  updatePassword: async (data) => {
    const response = await axiosInstance.put('/users/password', data);
    return response;
  },

  /**
   * Get user settings
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getSettings: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/settings`);
    return response;
  },

  /**
   * Update user settings
   * @param {string} userId - User ID
   * @param {Object} data - Settings data
   * @returns {Promise} API response
   */
  updateSettings: async (userId, data) => {
    const response = await axiosInstance.put(`/users/${userId}/settings`, data);
    return response;
  },

  /**
   * Get user bills
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getUserBills: async (userId, params = {}) => {
    const response = await axiosInstance.get(`/users/${userId}/bills`, { params });
    return response;
  },

  /**
   * Get user family members
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getUserMembers: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/members`);
    return response;
  },
};

export default userService;
