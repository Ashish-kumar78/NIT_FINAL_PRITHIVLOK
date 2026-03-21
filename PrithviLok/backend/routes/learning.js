// ============================================================
// Learning Routes
// ============================================================
import express from 'express';
import { getAllLessons, getLessonBySlug, completeLesson, createLesson } from '../controllers/learningController.js';
import { generateQuiz, submitQuiz } from '../controllers/quizController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getAllLessons) // View all lessons
  .post(protect, createLesson); // Mock admin route to create lessons
router.post('/quiz/generate', protect, generateQuiz);
router.post('/quiz/submit', protect, submitQuiz);

router.get('/:slug', optionalAuth, getLessonBySlug);
router.post('/:id/complete', protect, completeLesson);

export default router;
