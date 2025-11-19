/**
 * Contact Service
 * API calls for contact management
 */

import axiosInstance from '../api/axios.config';

export const contactService = {
  /**
   * Get all contacts
   * @param {Object} params - { category, status, search }
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/contacts', { params });
    return response;
  },

  /**
   * Get single contact by ID
   * @param {string} id - Contact ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response;
  },

  /**
   * Create new contact
   * @param {Object} data - Contact data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/contacts', data);
    return response;
  },

  /**
   * Update contact
   * @param {string} id - Contact ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/contacts/${id}`, data);
    return response;
  },

  /**
   * Delete contact (soft delete)
   * @param {string} id - Contact ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/contacts/${id}`);
    return response;
  },

  /**
   * Delete warranty file from contact
   * @param {string} contactId - Contact ID
   * @param {string} fileId - File ID
   * @returns {Promise} API response
   */
  deleteFile: async (contactId, fileId) => {
    const response = await axiosInstance.delete(`/contacts/${contactId}/files/${fileId}`);
    return response;
  },

  /**
   * Get contact statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await axiosInstance.get('/contacts/stats');
    return response;
  },
};

export default contactService;
