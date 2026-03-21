// ============================================================
// Leaderboard Routes
// ============================================================
import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

/**
 * Leaderboard doesn't strictly need auth, it's public ranking.
 */
router.get('/', getLeaderboard);

export default router;
