// ============================================================
// MongoDB Connection Configuration
// ============================================================
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prithvilok');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️ Please check your IP whitelist on MongoDB Atlas! The server will continue running but database features will fail.`);
  }
};

export default connectDB;
