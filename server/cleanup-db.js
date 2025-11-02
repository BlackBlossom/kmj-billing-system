import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/config/database.js';

async function cleanup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    
    console.log('🗑️  Dropping entire database...');
    await mongoose.connection.db.dropDatabase();
    
    console.log('✅ Database completely dropped');
    console.log('✅ Ready for fresh migration');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

cleanup();
