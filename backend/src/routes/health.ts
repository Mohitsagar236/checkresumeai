import { Router, Request, Response } from 'express';
import { config } from '../config/index.js';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.environment,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
    },
    node: process.version,
  });
});

// Detailed health check for monitoring
router.get('/detailed', (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.environment,
    uptime: process.uptime(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss,
      },
      cpu: {
        userCPUTime: process.cpuUsage().user,
        systemCPUTime: process.cpuUsage().system,
      },
    },
    services: {
      database: 'connected', // TODO: Add actual database health check
      ai: {
        openai: config.ai.openai.apiKey ? 'configured' : 'not configured',
        groq: config.ai.groq.apiKey ? 'configured' : 'not configured',
      },
      payment: config.payment.razorpay.keyId ? 'configured' : 'not configured',
      email: config.email.smtp.user ? 'configured' : 'not configured',
    },
    features: config.features
  };

  res.json(healthData);
});

// Readiness probe
router.get('/ready', (req: Request, res: Response) => {
  // Check if all required services are ready
  const checks = {
    database: true, // TODO: Add actual database connectivity check
    ai: !!config.ai.openai.apiKey || !!config.ai.groq.apiKey,
    jwt: !!config.jwt.secret,
  };

  const isReady = Object.values(checks).every(Boolean);

  if (isReady) {
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks
    });
  }
});

// Liveness probe
router.get('/live', (req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
