import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes from './routes/payment.js';
import profileRoutes from './routes/profile.js';
import courseRoutes from './routes/courses.js';
import uploadRoutes from './routes/upload.js';
import healthRoutes from './routes/health.js';
import emailRoutes from './routes/email.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { logger } from './utils/logger.js';
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://checkresumeai.vercel.app', 'https://checkresumeai.com']
            : ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});
app.set('io', io);
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://api.openai.com", "https://api.groq.com"]
        }
    }
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://checkresumeai.vercel.app', 'https://checkresumeai.com']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/health`, healthRoutes);
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/upload`, uploadRoutes);
app.use(`/api/${apiVersion}/email`, emailRoutes);
app.use(`/api/${apiVersion}/resume`, authMiddleware, resumeRoutes);
app.use(`/api/${apiVersion}/analytics`, authMiddleware, analyticsRoutes);
app.use(`/api/${apiVersion}/payment`, authMiddleware, paymentRoutes);
app.use(`/api/${apiVersion}/profile`, authMiddleware, profileRoutes);
app.use(`/api/${apiVersion}/courses`, authMiddleware, courseRoutes);
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../../frontend-build');
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendBuildPath, 'index.html'));
        }
        else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
    });
}
app.get('/', (req, res) => {
    res.json({
        message: 'CheckResumeAI Backend API',
        version: '1.0.0',
        status: 'running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
        logger.info(`User ${userId} joined their room`);
    });
    socket.on('resume:analysis:start', (data) => {
        socket.to(`user:${data.userId}`).emit('resume:analysis:progress', {
            stage: 'started',
            progress: 0,
            message: 'Starting resume analysis...'
        });
    });
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});
app.use(errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist.`,
        availableEndpoints: [
            `GET /api/${apiVersion}/health`,
            `POST /api/${apiVersion}/auth/register`,
            `POST /api/${apiVersion}/auth/login`,
            `POST /api/${apiVersion}/resume/analyze`,
            `GET /api/${apiVersion}/analytics/dashboard`,
            `POST /api/${apiVersion}/payment/create-order`,
            `GET /api/${apiVersion}/profile`,
            `GET /api/${apiVersion}/courses/recommendations`
        ]
    });
});
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
    });
});
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
    });
});
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : (process.env.HOST || 'localhost');
server.listen(PORT, HOST, () => {
    logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
    logger.info(`📚 API Documentation: http://${HOST}:${PORT}/api/${apiVersion}/health`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔐 CORS enabled for: ${process.env.NODE_ENV === 'production' ? 'Production domains' : 'Development domains'}`);
});
export default app;
