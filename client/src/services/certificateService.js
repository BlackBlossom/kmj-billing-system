/**
 * Certificate Service
 * API calls for certificate management
 */

import axiosInstance from '../api/axios.config';

export const certificateService = {
  /**
   * Get all certificates
   * @param {Object} params - { type }
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/certificates', { params });
    return response;
  },

  /**
   * Get single certificate by ID
   * @param {string} id - Certificate ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/certificates/${id}`);
    return response;
  },

  /**
   * Create new certificate
   * @param {Object} data - { type, name, details }
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/certificates', data);
    return response;
  },

  /**
   * Update certificate
   * @param {string} id - Certificate ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/certificates/${id}`, data);
    return response;
  },

  /**
   * Delete certificate (soft delete)
   * @param {string} id - Certificate ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/certificates/${id}`);
    return response;
  },

  /**
   * Get certificate statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await axiosInstance.get('/certificates/stats');
    return response;
  },
};

export default certificateService;
