/**
 * Environment Configuration
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 */
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error('\n💡 Please check your .env file');
  process.exit(1);
}

/**
 * Environment configuration object
 */
export const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@kmj.local',
  },

  // SMS
  sms: {
    apiKey: process.env.SMS_API_KEY,
    senderId: process.env.SMS_SENDER_ID || 'KMJBILL',
  },

  // CORS
  cors: {
    origin: process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://kmj-billing-system.vercel.app'
        ],
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },

  // Pagination
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  },

  // Security
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },

  // Logging
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate Cloudinary config if provided
if (config.cloudinary.cloudName || config.cloudinary.apiKey || config.cloudinary.apiSecret) {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.warn('⚠️  Incomplete Cloudinary configuration. File uploads will not work properly.');
  }
}

export default config;
