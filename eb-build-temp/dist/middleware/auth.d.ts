import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
                subscription?: {
                    plan: string;
                    status: string;
                    expiresAt: string;
                };
            };
        }
    }
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    subscriptionExpiresAt?: string;
    iat?: number;
    exp?: number;
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const premiumMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map