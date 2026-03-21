// ============================================================
// Environment Routes
// ============================================================
import express from 'express';
import { getAQI, getWQI, getWeather, getDashboardStats } from '../controllers/environmentController.js';

const router = express.Router();

// Publicly accessible environmental data routes
router.get('/aqi', getAQI);
router.get('/wqi', getWQI);
router.get('/weather', getWeather);
router.get('/dashboard-stats', getDashboardStats);

export default router;
