/**
 * Family Service
 * API calls for family member management
 */

import axiosInstance from '../api/axios.config';

export const familyService = {
  /**
   * Get all family members for current user
   * @returns {Promise} API response
   */
  getAll: async () => {
    // Axios interceptor already unwraps response.data
    const response = await axiosInstance.get('/family');
    return response;
  },

  /**
   * Get single family member by ID
   * @param {string} id - Family member ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/family/${id}`);
    return response;
  },

  /**
   * Add new family member
   * @param {Object} data - { Fname, Relation, Dob, Gender, Mobile, Occupation, Education }
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/family', data);
    return response;
  },

  /**
   * Update family member
   * @param {string} id - Family member ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/family/${id}`, data);
    return response;
  },

  /**
   * Delete (soft delete) family member
   * @param {string} id - Family member ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/family/${id}`);
    return response;
  },

  /**
   * Get family statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await axiosInstance.get('/family/stats');
    return response;
  },
};

export default familyService;
