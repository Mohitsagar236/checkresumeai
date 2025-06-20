import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;
}
export declare const errorHandler: (error: ApiError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare class ValidationError extends Error {
    details?: any | undefined;
    statusCode: number;
    code: string;
    constructor(message: string, details?: any | undefined);
}
export declare class AuthenticationError extends Error {
    statusCode: number;
    code: string;
    constructor(message?: string);
}
export declare class AuthorizationError extends Error {
    statusCode: number;
    code: string;
    constructor(message?: string);
}
export declare class NotFoundError extends Error {
    statusCode: number;
    code: string;
    constructor(message?: string);
}
export declare class ConflictError extends Error {
    statusCode: number;
    code: string;
    constructor(message?: string);
}
export declare class RateLimitError extends Error {
    statusCode: number;
    code: string;
    constructor(message?: string);
}
export declare class ExternalServiceError extends Error {
    service?: string | undefined;
    statusCode: number;
    code: string;
    constructor(message: string, service?: string | undefined);
}
export declare class PaymentError extends Error {
    details?: any | undefined;
    statusCode: number;
    code: string;
    constructor(message: string, details?: any | undefined);
}
//# sourceMappingURL=errorHandler.d.ts.map