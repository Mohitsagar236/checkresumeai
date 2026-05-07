import { Router, Request, Response } from 'express';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';

const router = Router();

// Lightweight DB ping — returns true if Supabase responds
async function checkDatabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  const dbOk = await checkDatabase();
  res.json({
    status: dbOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.environment,
    uptime: process.uptime(),
    database: dbOk ? 'connected' : 'unavailable',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
    },
    node: process.version,
  });
});

// Detailed health check for monitoring
router.get('/detailed', async (req: Request, res: Response) => {
  const dbOk = await checkDatabase();
  const healthData = {
    status: dbOk ? 'healthy' : 'degraded',
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
      database: dbOk ? 'connected' : 'unavailable',
      ai: {
        openrouter: config.ai.openrouter.apiKey ? 'configured' : 'not configured',
      },
      payment: config.payment.upiId ? 'configured' : 'not configured',
      email: config.email.smtp.user ? 'configured' : 'not configured',
    },
    features: config.features
  };

  res.json(healthData);
});

// Readiness probe
router.get('/ready', async (req: Request, res: Response) => {
  const dbOk = await checkDatabase();
  const checks = {
    database: dbOk,
    ai: !!config.ai.openrouter.apiKey,
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
