/**
 * Land Service
 * API calls for land management
 */

import axiosInstance from '../api/axios.config';

export const landService = {
  /**
   * Get all land records
   * @param {Object} params - { ward }
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/lands', { params });
    return response;
  },

  /**
   * Get single land record by ID
   * @param {string} id - Land ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/lands/${id}`);
    return response;
  },

  /**
   * Create new land record
   * @param {Object} data - { name, area, ward, attachmentUrl }
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/lands', data);
    return response;
  },

  /**
   * Update land record
   * @param {string} id - Land ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/lands/${id}`, data);
    return response;
  },

  /**
   * Delete land record (soft delete)
   * @param {string} id - Land ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/lands/${id}`);
    return response;
  },
};

export default landService;
