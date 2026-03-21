// ============================================================
// Dustbin Routes
// ============================================================
import express from 'express';
import {
  getDustbins,
  getDustbinById,
  createDustbin,
  reportDustbin,
  rateDustbin,
  deleteDustbin,
} from '../controllers/dustbinController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getDustbins) // Anyone can view dustbins
  .post(protect, upload.single('photo'), createDustbin); // Authenticated users can add dustbins

router.route('/:id')
  .get(getDustbinById)
  .delete(protect, deleteDustbin);

router.post('/:id/report', protect, reportDustbin);
router.post('/:id/rate', protect, rateDustbin);

export default router;
