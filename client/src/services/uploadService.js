/**
 * Upload Service
 * Handles file uploads to the backend/Cloudinary
 */

import api from '../api/axios.config';

/**
 * Upload a single file
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise} - Upload response with URL
 */
export const uploadFile = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    };
  }

  const response = await api.post('/upload/single', formData, config);
  // api interceptor returns response.data
  // Backend sends: { success: true, message: '...', data: { url, ... } }
  // Interceptor unwraps to: { success: true, message: '...', data: { url, ... } }
  // We return response.data to get: { url, public_id, originalname, size, format }
  return response.data;
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise} - Upload response with URLs
 */
export const uploadMultipleFiles = async (files, onProgress = null) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    };
  }

  const response = await api.post('/upload/multiple', formData, config);
  return response.data;
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The Cloudinary public_id of the file
 * @returns {Promise} - Delete response
 */
export const deleteFile = async (publicId) => {
  // Encode the publicId to handle special characters and slashes
  const encodedPublicId = encodeURIComponent(publicId);
  const response = await api.delete(`/upload/${encodedPublicId}`);
  return response;
};

export default {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
};
