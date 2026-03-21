// ============================================================
// Community Routes
// ============================================================
import express from 'express';
import { getPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/communityController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getPosts)
  .post(protect, upload.single('image'), createPost);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
