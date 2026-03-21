// ============================================================
// Learning Controller
// ============================================================
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import { addEcoPoints } from '../utils/ecoScore.js';

/**
 * @route   GET /api/learning/lessons
 * @desc    Get all lessons summarized
 */
export const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .select('-content -quiz')
      .sort({ chapter: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/learning/lessons/:slug
 * @desc    Get a specific lesson by slug
 */
export const getLessonBySlug = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/learning/lessons/:id/complete
 * @desc    Mark lesson as completed and award points
 */
export const completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user already completed this lesson
    if (user.lessonsCompleted.includes(lesson._id)) {
      return res.status(400).json({ message: 'Lesson already completed' });
    }

    // Add lesson to user's completed list
    user.lessonsCompleted.push(lesson._id);
    await user.save();

    // Add lesson ID to the lesson's completedBy list
    lesson.completedBy.push(user._id);
    await lesson.save();

    // Award points
    const ecoResult = await addEcoPoints(req.user, 'COMPLETE_LESSON');

    res.json({
      message: 'Lesson completed successfully!',
      ecoPoints: ecoResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/learning/lessons
 * @desc    Create a new lesson (Admin functionality mock)
 */
export const createLesson = async (req, res) => {
  try {
    const newLesson = await Lesson.create(req.body);
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
