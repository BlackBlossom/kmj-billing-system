import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import { config } from './config/env.js';
import { logger, morganStream } from './utils/logger.js';

/**
 * Create Express application
 */
const app = express();

/**
 * Security Middleware
 */
// Helmet - Set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS - Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB Sanitize - Prevent NoSQL injection
app.use(mongoSanitize());

// XSS Protection - Prevent Cross-Site Scripting attacks
app.use(xss());

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
if (config.env === 'development') {
  app.use(morgan('dev', { stream: morganStream }));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KMJ Billing System API',
    version: config.apiVersion,
    status: 'running',
    endpoints: {
      health: '/health',
      api: `/api/${config.apiVersion}`,
      documentation: `/api/${config.apiVersion}/docs`,
    },
  });
});

/**
 * API Base Route
 */
app.get(`/api/${config.apiVersion}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KMJ Billing System API',
    version: config.apiVersion,
    documentation: '/api/v1/docs',
  });
});

/**
 * API Routes
 */
import routes from './routes/index.js';
import { requestLogger, notFound, errorHandler } from './middleware/errorHandler.js';

// Request logging middleware
app.use(requestLogger);

// Mount API routes
app.use('/api', routes);

/**
 * 404 Handler - Route not found
 */
app.use(notFound);

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;
