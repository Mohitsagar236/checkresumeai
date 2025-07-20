import { Router } from 'express';
import { config } from '../config/index.js';
const router = Router();
router.get('/', (req, res) => {
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
router.get('/detailed', (req, res) => {
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
            database: 'connected',
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
router.get('/ready', (req, res) => {
    const checks = {
        database: true,
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
    }
    else {
        res.status(503).json({
            status: 'not ready',
            timestamp: new Date().toISOString(),
            checks
        });
    }
});
router.get('/live', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
export default router;
