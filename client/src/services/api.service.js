/**
 * Centralized API Service
 * All API calls should go through this service for consistency
 */

import axiosInstance from '../api/axios.config';

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  /**
   * Login with Member ID and Aadhaar
   * @param {Object} data - { memberId, password }
   * @returns {Promise} API response
   */
  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Register new member
   * @param {Object} data - { name, address, aadhaar, ward, houseNo, phone }
   * @returns {Promise} API response
   */
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Forgot password - verify Member ID and Aadhaar
   * @param {Object} data - { memberId, aadhaar }
   * @returns {Promise} API response
   */
  forgotPassword: async (data) => {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Reset password
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise} API response
   */
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken,
    });
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Logout
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @returns {Promise} API response
   */
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/auth/profile', data);
    return response; // Axios interceptor already unwraps response.data
  },

  /**
   * Change password
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise} API response
   */
  changePassword: async (data) => {
    const response = await axiosInstance.post('/auth/change-password', data);
    return response; // Axios interceptor already unwraps response.data
  },
};

// ============================================
// MEMBER APIs
// ============================================

export const memberAPI = {
  /**
   * Get all members with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/members', { params });
    return response.data;
  },

  /**
   * Get member by ID
   * @param {string} id - Member ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/members/${id}`);
    return response.data;
  },

  /**
   * Create new member
   * @param {Object} data - Member data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/members', data);
    return response.data;
  },

  /**
   * Update member
   * @param {string} id - Member ID
   * @param {Object} data - Updated member data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/members/${id}`, data);
    return response.data;
  },

  /**
   * Delete member
   * @param {string} id - Member ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/members/${id}`);
    return response.data;
  },

  /**
   * Search members
   * @param {string} query - Search query
   * @returns {Promise} API response
   */
  search: async (query) => {
    const response = await axiosInstance.get('/members/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Get member statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await axiosInstance.get('/members/stats');
    return response.data;
  },

  /**
   * Bulk import members
   * @param {FormData} formData - CSV file
   * @returns {Promise} API response
   */
  bulkImport: async (formData) => {
    const response = await axiosInstance.post('/members/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Export members to CSV
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  export: async (params = {}) => {
    const response = await axiosInstance.get('/members/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// FAMILY MEMBER APIs
// ============================================

export const familyMemberAPI = {
  /**
   * Get all family members for a member
   * @param {string} memberId - Member ID
   * @returns {Promise} API response
   */
  getByMemberId: async (memberId) => {
    const response = await axiosInstance.get(`/family-members/member/${memberId}`);
    return response.data;
  },

  /**
   * Get family member by ID
   * @param {string} id - Family member ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/family-members/${id}`);
    return response.data;
  },

  /**
   * Create family member
   * @param {Object} data - Family member data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/family-members', data);
    return response.data;
  },

  /**
   * Update family member
   * @param {string} id - Family member ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/family-members/${id}`, data);
    return response.data;
  },

  /**
   * Delete family member
   * @param {string} id - Family member ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/family-members/${id}`);
    return response.data;
  },
};

// ============================================
// BILL APIs
// ============================================

export const billAPI = {
  /**
   * Get all bills with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/bills', { params });
    return response.data;
  },

  /**
   * Get bill by ID
   * @param {string} id - Bill ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/bills/${id}`);
    return response.data;
  },

  /**
   * Get bills by member ID
   * @param {string} memberId - Member ID
   * @returns {Promise} API response
   */
  getByMemberId: async (memberId) => {
    const response = await axiosInstance.get(`/bills/member/${memberId}`);
    return response.data;
  },

  /**
   * Create new bill
   * @param {Object} data - Bill data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/bills', data);
    return response.data;
  },

  /**
   * Update bill
   * @param {string} id - Bill ID
   * @param {Object} data - Updated bill data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/bills/${id}`, data);
    return response.data;
  },

  /**
   * Delete bill
   * @param {string} id - Bill ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/bills/${id}`);
    return response.data;
  },

  /**
   * Mark bill as paid
   * @param {string} id - Bill ID
   * @param {Object} data - Payment details
   * @returns {Promise} API response
   */
  markAsPaid: async (id, data) => {
    const response = await axiosInstance.post(`/bills/${id}/pay`, data);
    return response.data;
  },

  /**
   * Get bill statistics
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  getStats: async (params = {}) => {
    const response = await axiosInstance.get('/bills/stats', { params });
    return response.data;
  },

  /**
   * Generate bill PDF
   * @param {string} id - Bill ID
   * @returns {Promise} PDF blob
   */
  generatePDF: async (id) => {
    const response = await axiosInstance.get(`/bills/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Send bill via email
   * @param {string} id - Bill ID
   * @returns {Promise} API response
   */
  sendEmail: async (id) => {
    const response = await axiosInstance.post(`/bills/${id}/send-email`);
    return response.data;
  },

  /**
   * Bulk generate bills
   * @param {Object} data - Generation parameters
   * @returns {Promise} API response
   */
  bulkGenerate: async (data) => {
    const response = await axiosInstance.post('/bills/bulk-generate', data);
    return response.data;
  },
};

// ============================================
// NOTICE APIs
// ============================================

export const noticeAPI = {
  /**
   * Get all notices with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/notices', { params });
    return response.data;
  },

  /**
   * Get notice by ID
   * @param {string} id - Notice ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/notices/${id}`);
    return response.data;
  },

  /**
   * Create notice
   * @param {Object} data - Notice data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/notices', data);
    return response.data;
  },

  /**
   * Update notice
   * @param {string} id - Notice ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/notices/${id}`, data);
    return response.data;
  },

  /**
   * Delete notice
   * @param {string} id - Notice ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/notices/${id}`);
    return response.data;
  },

  /**
   * Get active notices
   * @returns {Promise} API response
   */
  getActive: async () => {
    const response = await axiosInstance.get('/notices/active');
    return response.data;
  },

  /**
   * Upload notice attachment
   * @param {string} id - Notice ID
   * @param {FormData} formData - File data
   * @returns {Promise} API response
   */
  uploadAttachment: async (id, formData) => {
    const response = await axiosInstance.post(
      `/notices/${id}/attachment`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};

// ============================================
// PAYMENT APIs
// ============================================

export const paymentAPI = {
  /**
   * Get all payments with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/payments', { params });
    return response.data;
  },

  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  /**
   * Get payments by member ID
   * @param {string} memberId - Member ID
   * @returns {Promise} API response
   */
  getByMemberId: async (memberId) => {
    const response = await axiosInstance.get(`/payments/member/${memberId}`);
    return response.data;
  },

  /**
   * Create payment
   * @param {Object} data - Payment data
   * @returns {Promise} API response
   */
  create: async (data) => {
    const response = await axiosInstance.post('/payments', data);
    return response.data;
  },

  /**
   * Get payment statistics
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  getStats: async (params = {}) => {
    const response = await axiosInstance.get('/payments/stats', { params });
    return response.data;
  },

  /**
   * Generate payment receipt PDF
   * @param {string} id - Payment ID
   * @returns {Promise} PDF blob
   */
  generateReceipt: async (id) => {
    const response = await axiosInstance.get(`/payments/${id}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Verify payment
   * @param {string} id - Payment ID
   * @returns {Promise} API response
   */
  verify: async (id) => {
    const response = await axiosInstance.post(`/payments/${id}/verify`);
    return response.data;
  },
};

// ============================================
// DASHBOARD APIs
// ============================================

export const dashboardAPI = {
  /**
   * Get admin dashboard statistics
   * @returns {Promise} API response
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get('/dashboard/admin');
    return response.data;
  },

  /**
   * Get user dashboard data
   * @returns {Promise} API response
   */
  getUserDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/user');
    return response.data;
  },

  /**
   * Get recent activities
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getRecentActivities: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/activities', { params });
    return response.data;
  },

  /**
   * Get analytics data
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  getAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/analytics', { params });
    return response.data;
  },
};

// ============================================
// NOTIFICATION APIs
// ============================================

export const notificationAPI = {
  /**
   * Get all notifications for current user
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} API response
   */
  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Get unread count
   * @returns {Promise} API response
   */
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  },
};

// ============================================
// REPORT APIs
// ============================================

export const reportAPI = {
  /**
   * Generate member report
   * @param {Object} params - Report parameters
   * @returns {Promise} PDF blob
   */
  memberReport: async (params = {}) => {
    const response = await axiosInstance.get('/reports/members', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate payment report
   * @param {Object} params - Report parameters
   * @returns {Promise} PDF blob
   */
  paymentReport: async (params = {}) => {
    const response = await axiosInstance.get('/reports/payments', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate bill report
   * @param {Object} params - Report parameters
   * @returns {Promise} PDF blob
   */
  billReport: async (params = {}) => {
    const response = await axiosInstance.get('/reports/bills', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate custom report
   * @param {Object} data - Report configuration
   * @returns {Promise} PDF blob
   */
  customReport: async (data) => {
    const response = await axiosInstance.post('/reports/custom', data, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Export all APIs
export default {
  auth: authAPI,
  member: memberAPI,
  familyMember: familyMemberAPI,
  bill: billAPI,
  notice: noticeAPI,
  payment: paymentAPI,
  dashboard: dashboardAPI,
  notification: notificationAPI,
  report: reportAPI,
};
