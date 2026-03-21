// ============================================================
// Dustbin Model
// ============================================================
import mongoose from 'mongoose';

const dustbinSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['general', 'recyclable', 'organic', 'hazardous', 'e-waste'],
      default: 'general',
    },
    photo: {
      type: String, // URL or file path
      default: '',
    },
    status: {
      type: String,
      enum: ['functional', 'overflow', 'damaged', 'removed'],
      default: 'functional',
    },
    cleanlinessRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        issue: { type: String, enum: ['overflow', 'damaged', 'garbage_dump', 'other'] },
        description: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isRecyclingCenter: {
      type: Boolean,
      default: false,
    },
    // ── Admin Verification ──────────────────────────────────
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    adminRemark: {
      type: String,
      default: '',
    },
    ecoPointsAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// GeoSpatial index for location queries
dustbinSchema.index({ location: '2dsphere' });

const Dustbin = mongoose.model('Dustbin', dustbinSchema);
export default Dustbin;
