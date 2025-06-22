// Health check route handler
import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint for Railway monitoring
 * @access  Public
 */
router.get('/', (req, res) => {
  // Return basic health information
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

export default router;
