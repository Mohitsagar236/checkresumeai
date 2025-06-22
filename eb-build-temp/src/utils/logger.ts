import winston from 'winston';
import { config } from '../config/index.js';

// Create winston logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: {
    service: 'checkresumeai-backend',
    environment: config.server.environment
  },
  transports: [
    // Write all logs with importance level of 'error' or higher to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
  ],
});

// Add console transport for development
if (config.server.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    )
  }));
}

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const logsDir = 'logs';
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

export default logger;
