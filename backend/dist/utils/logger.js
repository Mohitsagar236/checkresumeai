import winston from 'winston';
import { config } from '../config/index.js';
export const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json(), winston.format.prettyPrint()),
    defaultMeta: {
        service: 'checkresumeai-backend',
        environment: config.server.environment
    },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 10
        }),
    ],
});
if (config.server.environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        }))
    }));
}
import { existsSync, mkdirSync } from 'fs';
const logsDir = 'logs';
if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
}
export default logger;
