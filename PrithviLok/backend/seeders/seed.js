// ============================================================
// PrithviLok Seeders Script
// ============================================================
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

// Models
import User from '../models/User.js';
import Dustbin from '../models/Dustbin.js';
import Lesson from '../models/Lesson.js';
import CommunityPost from '../models/CommunityPost.js';

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prithvilok');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Main seeding function
 */
const importData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old data...');
    await User.deleteMany();
    await Dustbin.deleteMany();
    await Lesson.deleteMany();
    await CommunityPost.deleteMany();

    console.log('🌱 Generating 20 users...');
    const hashedPass = await bcrypt.hash('password123', 10);
    const usersData = Array.from({ length: 20 }).map((_, i) => ({
      name: `EcoWarrior ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: hashedPass, // Manual insert to skip pre-save hooks if needed, though hook fires on create
      isEmailVerified: true,
      ecoScore: Math.floor(Math.random() * 600), // Random score
      walletAddress: `0x${Buffer.from(Math.random().toString()).toString('hex').slice(0, 40)}`,
      dustbinsReported: Math.floor(Math.random() * 10),
      communityPosts: Math.floor(Math.random() * 15),
    }));

    // Re-evaluate ecoLevel based on random ecoScore
    const usersToInsert = usersData.map(u => {
      let level = 'Seed';
      if (u.ecoScore >= 500) level = 'Forest Guardian';
      else if (u.ecoScore >= 200) level = 'Tree';
      else if (u.ecoScore >= 50) level = 'Sapling';
      return { ...u, ecoLevel: level };
    });

    const createdUsers = await User.insertMany(usersToInsert);

    console.log('🗑️ Generating 40 dustbins...');
    // Base coords (Central India, Nagpur roughly for testing visualization)
    const baseLat = 21.1458;
    const baseLng = 79.0882;
    
    const types = ['general', 'recyclable', 'organic', 'hazardous', 'e-waste'];
    const statuses = ['functional', 'functional', 'functional', 'overflow', 'damaged'];

    const dustbinsData = Array.from({ length: 40 }).map((_, i) => ({
      location: {
        type: 'Point',
        // Randomize coordinates slightly around base
        coordinates: [
          baseLng + (Math.random() - 0.5) * 0.1, // Lng
          baseLat + (Math.random() - 0.5) * 0.1, // Lat
        ],
      },
      address: `Street ${Math.floor(Math.random() * 100)}, Sustainability Block ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      cleanlinessRating: Math.floor(Math.random() * 5) + 1,
      totalRatings: Math.floor(Math.random() * 50),
      isRecyclingCenter: Math.random() > 0.8, // 20% chance it's a center
      reportedBy: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    }));

    await Dustbin.insertMany(dustbinsData);

    console.log('📚 Generating 10 lessons...');
    const lessonTitles = [
      "Introduction to Sustainability",
      "Climate Change Essentials",
      "Rainwater Harvesting",
      "Waste Management Basics",
      "Plastic-Free Lifestyle",
      "Recycling 101",
      "Energy Conservation",
      "Water Conservation",
      "SDG Goals Overview",
      "Green Transportation"
    ];

    const lessonsData = lessonTitles.map((title, i) => ({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), // Manually create initial slug to avoid pre-save hook skip on insertMany
      chapter: i + 1,
      description: `Learn the fundamentals of ${title} in this comprehensive module.`,
      content: `# ${title}\n\nWelcome to chapter ${i + 1} of the PrithviLok learning journey. In this module, we will explore the critical aspects of environmental conservation and sustainable living. **Sustainability** is our key focus. Make sure to complete the quiz!`,
      category: i < 3 ? 'sustainability' : i < 6 ? 'waste' : 'energy',
      difficulty: i < 4 ? 'beginner' : i < 8 ? 'intermediate' : 'advanced',
      points: 20 + (i * 5),
    }));

    const createdLessons = await Lesson.insertMany(lessonsData);

    // Assign random completed lessons to users
    for (let u of createdUsers) {
      if (Math.random() > 0.5) {
         // User completed 1-3 random lessons
         const completedIds = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
             () => createdLessons[Math.floor(Math.random() * createdLessons.length)]._id
         );
         await User.findByIdAndUpdate(u._id, { $set: { lessonsCompleted: [...new Set(completedIds)] } });
      }
    }

    console.log('💬 Generating 15 community posts...');
    const postCategories = ['discussion', 'tip', 'alert', 'achievement', 'question'];
    const postsData = Array.from({ length: 15 }).map((_, i) => ({
      author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
      content: `This is a sample community post #${i + 1} regarding our local sustainability efforts. What does everyone think?`,
      category: postCategories[Math.floor(Math.random() * postCategories.length)],
      tags: ['eco', 'prithvilok', 'community'],
      likes: [
        createdUsers[0]._id,
        createdUsers[1]._id,
      ]
    }));

    await CommunityPost.insertMany(postsData);

    console.log('\n✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Delete all data
 */
const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Dustbin.deleteMany();
    await Lesson.deleteMany();
    await CommunityPost.deleteMany();
    
    console.log('\n❌ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
