import cloudinary from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { logger } from '../utils/logger.js';

// Use v1 API
const cloudinaryV1 = cloudinary.v2;

/**
 * Configure Cloudinary
 */
cloudinaryV1.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Test Cloudinary connection
 */
const testConnection = async () => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      await cloudinaryV1.api.ping();
      logger.info('✅ Cloudinary connected successfully');
    } else {
      logger.warn('⚠️  Cloudinary credentials not configured. File uploads will be disabled.');
    }
  } catch (error) {
    logger.error('❌ Cloudinary connection failed:', error.message);
  }
};

testConnection();

/**
 * Custom storage implementation for Cloudinary
 */
class CloudinaryStorage {
  constructor(options) {
    this.options = options;
  }

  _handleFile(req, file, cb) {
    const uploadOptions = {
      folder: this.options.folder,
      resource_type: 'auto',
      allowed_formats: this.options.allowed_formats,
    };

    if (this.options.transformation) {
      uploadOptions.transformation = this.options.transformation;
    }

    // Generate public_id
    if (typeof this.options.public_id === 'function') {
      uploadOptions.public_id = this.options.public_id(req, file);
    }

    // Upload to Cloudinary
    const uploadStream = cloudinaryV1.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return cb(error);
        }
        cb(null, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          url: result.secure_url,
          public_id: result.public_id,
          size: result.bytes,
          format: result.format,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    cloudinaryV1.uploader.destroy(file.public_id, (error, result) => {
      cb(error);
    });
  }
}

/**
 * Storage configurations for different upload types
 */

// Profile pictures storage
export const profileStorage = new CloudinaryStorage({
  folder: 'kmj-billing/profiles',
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [
    { width: 500, height: 500, crop: 'fill', gravity: 'face' }
  ],
  public_id: (req, file) => {
    const memberId = req.user?.memberId || 'unknown';
    const timestamp = Date.now();
    return `profile-${memberId}-${timestamp}`;
  },
});

// Document uploads storage
export const documentStorage = new CloudinaryStorage({
  folder: 'kmj-billing/documents',
  allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  public_id: (req, file) => {
    const memberId = req.user?.memberId || 'unknown';
    const timestamp = Date.now();
    const originalName = file.originalname.split('.')[0];
    return `doc-${memberId}-${originalName}-${timestamp}`;
  },
});

// Receipt/Bill storage
export const receiptStorage = new CloudinaryStorage({
  folder: 'kmj-billing/receipts',
  allowed_formats: ['pdf', 'jpg', 'png'],
  public_id: (req, file) => {
    const receiptNo = req.body?.receiptNo || Date.now();
    return `receipt-${receiptNo}`;
  },
});

// Notice attachments storage
export const noticeStorage = new CloudinaryStorage({
  folder: 'kmj-billing/notices',
  allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  public_id: (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.split('.')[0];
    return `notice-${originalName}-${timestamp}`;
  },
});

/**
 * Multer configurations
 */

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed!'), false);
  }
};

// File size limit
const fileSizeLimit = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB

/**
 * Multer upload instances
 */

export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: fileSizeLimit,
  },
});

export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: fileSizeLimit,
  },
});

export const uploadReceipt = multer({
  storage: receiptStorage,
  limits: {
    fileSize: fileSizeLimit,
  },
});

export const uploadNotice = multer({
  storage: noticeStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: fileSizeLimit,
  },
});

/**
 * Utility functions for Cloudinary operations
 */

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinaryV1.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Delete multiple files
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinaryV1.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    logger.error('Error deleting multiple from Cloudinary:', error);
    throw error;
  }
};

// Get resource details
export const getCloudinaryResource = async (publicId) => {
  try {
    const result = await cloudinaryV1.api.resource(publicId);
    return result;
  } catch (error) {
    logger.error('Error getting Cloudinary resource:', error);
    throw error;
  }
};

// Generate signed URL for private resources
export const generateSignedUrl = (publicId, options = {}) => {
  return cloudinaryV1.url(publicId, {
    sign_url: true,
    type: 'private',
    ...options,
  });
};

export { cloudinaryV1 as cloudinary };
export default cloudinaryV1;
