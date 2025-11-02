/**
 * KMJ Billing System - Server Entry Point
 * MERN Stack Backend
 */

import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const PORT = config.port;
    
    const server = app.listen(PORT, () => {
      logger.info('═'.repeat(60));
      logger.info('🚀 KMJ BILLING SYSTEM - SERVER STARTED');
      logger.info('═'.repeat(60));
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`🌐 Server running on: http://localhost:${PORT}`);
      logger.info(`📡 API Base URL: http://localhost:${PORT}/api/${config.apiVersion}`);
      logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
      logger.info('═'.repeat(60));
      
      if (config.env === 'development') {
        logger.info('\n💡 Development Tips:');
        logger.info('   • API Docs: http://localhost:${PORT}/api/${config.apiVersion}');
        logger.info('   • MongoDB: Check connection in logs above');
        logger.info('   • Cloudinary: Configure in .env for uploads');
        logger.info('\n📝 Quick Commands:');
        logger.info('   • npm run dev      → Start with nodemon');
        logger.info('   • npm run migrate  → Migrate SQL data');
        logger.info('   • npm run seed     → Seed sample data');
        logger.info('═'.repeat(60) + '\n');
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('❌ UNHANDLED REJECTION! Shutting down...');
      logger.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('✅ Process terminated');
      });
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
