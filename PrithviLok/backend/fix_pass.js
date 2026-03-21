import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected');

    const User = mongoose.model('User', new mongoose.Schema({ email: String, password: String }, { strict: false }));
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('Akash@2005', salt);
    
    await User.updateOne({ email: 'akashdas2024@gift.edu.in' }, { $set: { password: hash } });
    console.log('Password successfully reset to Akash@2005');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
