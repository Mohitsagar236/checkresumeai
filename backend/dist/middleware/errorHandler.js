import { logger } from '../utils/logger.js';
export const errorHandler = (error, req, res, next) => {
    logger.error('API Error:', {
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        code: error.code,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        user: req.user?.id || 'anonymous'
    });
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const code = error.code || 'INTERNAL_ERROR';
    const errorResponse = {
        error: message,
        code,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
    };
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.details = error.details;
    }
    res.status(statusCode).json(errorResponse);
};
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
        this.statusCode = 400;
        this.code = 'VALIDATION_ERROR';
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends Error {
    constructor(message = 'Authentication required') {
        super(message);
        this.statusCode = 401;
        this.code = 'AUTHENTICATION_ERROR';
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends Error {
    constructor(message = 'Access denied') {
        super(message);
        this.statusCode = 403;
        this.code = 'AUTHORIZATION_ERROR';
        this.name = 'AuthorizationError';
    }
}
export class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.statusCode = 404;
        this.code = 'NOT_FOUND';
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends Error {
    constructor(message = 'Resource conflict') {
        super(message);
        this.statusCode = 409;
        this.code = 'CONFLICT';
        this.name = 'ConflictError';
    }
}
export class RateLimitError extends Error {
    constructor(message = 'Rate limit exceeded') {
        super(message);
        this.statusCode = 429;
        this.code = 'RATE_LIMIT_EXCEEDED';
        this.name = 'RateLimitError';
    }
}
export class ExternalServiceError extends Error {
    constructor(message, service) {
        super(message);
        this.service = service;
        this.statusCode = 502;
        this.code = 'EXTERNAL_SERVICE_ERROR';
        this.name = 'ExternalServiceError';
    }
}
export class PaymentError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
        this.statusCode = 402;
        this.code = 'PAYMENT_ERROR';
        this.name = 'PaymentError';
    }
}
