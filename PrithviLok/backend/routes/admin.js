// ============================================================
// Admin Routes
// ============================================================
import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  getAllReports,
  getAdminStats,
  verifyReport,
  rejectReport,
  deleteReport,
} from '../controllers/adminController.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

// Public
router.post('/login', adminLogin);

// Protected (admin token required)
router.get('/me', adminProtect, getAdminProfile);
router.get('/stats', adminProtect, getAdminStats);
router.get('/reports', adminProtect, getAllReports);
router.patch('/reports/:id/verify', adminProtect, verifyReport);
router.patch('/reports/:id/reject', adminProtect, rejectReport);
router.delete('/reports/:id', adminProtect, deleteReport);

export default router;
