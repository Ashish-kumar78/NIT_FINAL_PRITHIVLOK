// ============================================================
// User Routes
// ============================================================
import express from 'express';
import { getProfile, updateProfile, linkWallet, getEcoStats, redeemPoints } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.post('/redeem', redeemPoints);
router.put('/wallet', linkWallet);
router.get('/eco-stats', getEcoStats);

export default router;
