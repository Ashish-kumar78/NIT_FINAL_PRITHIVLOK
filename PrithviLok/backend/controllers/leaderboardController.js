// ============================================================
// Leaderboard Controller
// ============================================================
import User from '../models/User.js';

/**
 * @route   GET /api/leaderboard
 * @desc    Get top users based on Eco Impact Score
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 20, timeRange = 'all' } = req.query;

    const queryLimit = parseInt(limit, 10);
    const filter = {};

    // Note: Time-range specific leaderboards (e.g., this week's score)
    // require additional time-series schema structure.
    // Simplifying here to use the total score for 'all' time.
    if (timeRange === 'active') {
      filter.lastLoginDate = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; // active in last 30 days
    }

    const leaderboard = await User.find(filter)
      .select('name avatar ecoScore ecoLevel dustbinsReported lessonsCompleted communityPosts dailyLoginStreak')
      .sort({ ecoScore: -1 }) // Sort descending by score
      .limit(queryLimit);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
