import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(mongoUri);

  const email = 'admin@admin.com'; // Or any unique admin email
  const password = 'some_secure_password'; // Change this to something secure

  // Check if admin user exists already
  const existing = await User.findOne({ email, role: 'admin' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  
  // Create the admin
  const user = new User({
    name: 'Super Admin',
    email,
    password,
    role: 'admin'
  });
  await user.save();
  console.log('Admin created!');
  process.exit(0);
}

createAdmin();
