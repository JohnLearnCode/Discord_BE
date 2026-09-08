import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URL || !DB_NAME) {
  throw new Error('Please provide MONGODB_URL and DB_NAME in environment variables');
}

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDatabase;
