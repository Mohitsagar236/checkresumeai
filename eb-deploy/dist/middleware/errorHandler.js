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
    details;
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends Error {
    statusCode = 401;
    code = 'AUTHENTICATION_ERROR';
    constructor(message = 'Authentication required') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends Error {
    statusCode = 403;
    code = 'AUTHORIZATION_ERROR';
    constructor(message = 'Access denied') {
        super(message);
        this.name = 'AuthorizationError';
    }
}
export class NotFoundError extends Error {
    statusCode = 404;
    code = 'NOT_FOUND';
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends Error {
    statusCode = 409;
    code = 'CONFLICT';
    constructor(message = 'Resource conflict') {
        super(message);
        this.name = 'ConflictError';
    }
}
export class RateLimitError extends Error {
    statusCode = 429;
    code = 'RATE_LIMIT_EXCEEDED';
    constructor(message = 'Rate limit exceeded') {
        super(message);
        this.name = 'RateLimitError';
    }
}
export class ExternalServiceError extends Error {
    service;
    statusCode = 502;
    code = 'EXTERNAL_SERVICE_ERROR';
    constructor(message, service) {
        super(message);
        this.service = service;
        this.name = 'ExternalServiceError';
    }
}
export class PaymentError extends Error {
    details;
    statusCode = 402;
    code = 'PAYMENT_ERROR';
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'PaymentError';
    }
}
//# sourceMappingURL=errorHandler.js.map