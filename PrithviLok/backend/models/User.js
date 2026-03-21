// ============================================================
// User Model
// ============================================================
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 6,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Web3
    walletAddress: {
      type: String,
      default: '',
    },
    // Eco Impact
    ecoScore: {
      type: Number,
      default: 0,
    },
    ecoLevel: {
      type: String,
      enum: ['Seed', 'Sapling', 'Tree', 'Forest Guardian'],
      default: 'Seed',
    },
    nftTokenId: {
      type: String,
      default: '',
    },
    // Tracking
    dustbinsReported: {
      type: Number,
      default: 0,
    },
    // Quiz / AI Learning Engine
    attemptedQuestions: {
      type: [String],
      default: [],
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    topicProgress: {
      type: Map,
      of: Number,
      default: {},
    },
    // Per-lesson rolling memory of recently shown normalized question text
    // Used to avoid repeats across the last N quiz sessions.
    quizRecentQuestionKeys: {
      type: Map,
      of: [String],
      default: {},
    },
    lessonsCompleted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    communityPosts: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: Date,
    },
    dailyLoginStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate eco level based on score
userSchema.methods.calculateEcoLevel = function () {
  if (this.ecoScore >= 500) return 'Forest Guardian';
  if (this.ecoScore >= 200) return 'Tree';
  if (this.ecoScore >= 50) return 'Sapling';
  return 'Seed';
};

const User = mongoose.model('User', userSchema);
export default User;
