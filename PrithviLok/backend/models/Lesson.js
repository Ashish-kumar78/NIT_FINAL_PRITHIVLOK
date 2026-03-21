// ============================================================
// Lesson Model
// ============================================================
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    sdgNumber: {
      type: Number,
      default: null,
    },
    chapter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String, // Full lesson content (markdown supported)
      required: true,
    },
    category: {
      type: String,
      enum: [
        'sustainability',
        'climate',
        'water',
        'waste',
        'energy',
        'transportation',
        'lifestyle',
        'sdg',
      ],
      default: 'sustainability',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    points: {
      type: Number,
      default: 20,
    },
    duration: {
      type: Number, // in minutes
      default: 15,
    },
    coverImage: {
      type: String,
      default: '',
    },
    quiz: [
      {
        question: String,
        options: [String],
        correctAnswer: Number, // index of correct option
      },
    ],
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
lessonSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
