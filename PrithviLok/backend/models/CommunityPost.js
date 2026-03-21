// ============================================================
// Community Post Model
// ============================================================
import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['discussion', 'tip', 'alert', 'achievement', 'question'],
      default: 'discussion',
    },
    image: {
      type: String,
      default: '',
    },
    ipfsHash: {
      type: String, // IPFS content hash for decentralized storage
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;
