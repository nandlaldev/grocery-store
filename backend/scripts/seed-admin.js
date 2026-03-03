import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@grocery.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === 'admin') {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    existing.role = 'admin';
    await existing.save();
    console.log('Updated user to admin:', email);
  } else {
    await User.create({ fullName: 'Admin', email, password, role: 'admin' });
    console.log('Created admin:', email);
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
