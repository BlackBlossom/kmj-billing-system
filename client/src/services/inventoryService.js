/**
 * Inventory Service
 * API calls for inventory management
 */

import axiosInstance from '../api/axios.config';

export const inventoryService = {
  /**
   * Get all inventory items
   * @param {Object} params - { department }
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/inventory', { params });
    return response;
  },

  /**
   * Get single inventory item by ID
   * @param {string} id - Inventory ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/inventory/${id}`);
    return response;
  },

  /**
   * Create new inventory item
   * @param {Object} data - { name, title, department, count, purchaseDate, phoneNumber, attachmentUrl, warrantyUrl }
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/inventory', data);
    return response;
  },

  /**
   * Update inventory item
   * @param {string} id - Inventory ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/inventory/${id}`, data);
    return response;
  },

  /**
   * Delete inventory item (soft delete)
   * @param {string} id - Inventory ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/inventory/${id}`);
    return response;
  },

  /**
   * Get inventory statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await axiosInstance.get('/inventory/stats');
    return response;
  },
};

export default inventoryService;
