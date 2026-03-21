// Fix old dustbins that don't have verificationStatus
import 'dotenv/config';
import mongoose from 'mongoose';

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('dustbins');

  // Update dustbins without verificationStatus field
  const r1 = await collection.updateMany(
    { verificationStatus: { $exists: false } },
    { $set: { verificationStatus: 'pending' } }
  );
  console.log(`Updated ${r1.modifiedCount} dustbins (missing field) to pending`);

  // Update dustbins with null verificationStatus
  const r2 = await collection.updateMany(
    { verificationStatus: null },
    { $set: { verificationStatus: 'pending' } }
  );
  console.log(`Updated ${r2.modifiedCount} dustbins (null status) to pending`);

  // Update dustbins with empty string verificationStatus
  const r3 = await collection.updateMany(
    { verificationStatus: '' },
    { $set: { verificationStatus: 'pending' } }
  );
  console.log(`Updated ${r3.modifiedCount} dustbins (empty status) to pending`);

  // Show totals
  const total = await collection.countDocuments();
  const pending = await collection.countDocuments({ verificationStatus: 'pending' });
  const verified = await collection.countDocuments({ verificationStatus: 'verified' });
  const rejected = await collection.countDocuments({ verificationStatus: 'rejected' });
  console.log(`\nTotal: ${total} | Pending: ${pending} | Verified: ${verified} | Rejected: ${rejected}`);

  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
