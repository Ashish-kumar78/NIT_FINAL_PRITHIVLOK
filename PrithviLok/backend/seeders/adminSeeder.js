// ============================================================
// Seed admin account — username: Ashish / password: Ashish@123
// Run: node seeders/adminSeeder.js
// ============================================================
import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

await connectDB();

// Remove old admin if exists, then create fresh
await Admin.deleteMany({});

await Admin.create({
  username: 'ashish',
  password: 'Ashish@123',   // auto-hashed by pre-save hook
  name: 'Ashish (Admin)',
  role: 'superadmin',
});

console.log('✅ Admin account ready!');
console.log('   Username: Ashish');
console.log('   Password: Ashish@123');
await mongoose.disconnect();
process.exit(0);
