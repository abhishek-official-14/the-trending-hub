import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.warn('MONGO_URI not set. Connect later or use memory for session.'); return; }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    console.error('Mongo error', e.message);
    process.exit(1);
  }
};
