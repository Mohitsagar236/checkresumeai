import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from './errorHandler.js';
export const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Invalid token format.'
            });
        }
        const decoded = jwt.verify(token, config.jwt.secret);
        const { data: user, error } = await supabase
            .from('profiles')
            .select('id, email, role, subscription_plan, subscription_status, subscription_expires_at')
            .eq('id', decoded.userId)
            .single();
        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            subscription: {
                plan: user.subscription_plan,
                status: user.subscription_status,
                expiresAt: user.subscription_expires_at
            }
        };
        next();
    }
    catch (error) {
        logger.error('JWT authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed. Invalid or expired token.'
        });
    }
};
export const authenticateJWTHandler = asyncHandler(authenticateJWT);
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required before authorization.'
            });
        }
        if (allowedRoles.includes(req.user.role)) {
            next();
        }
        else {
            logger.warn(`Unauthorized access attempt by ${req.user.email} (${req.user.role}) to ${req.method} ${req.originalUrl}`);
            return res.status(403).json({
                success: false,
                message: 'Access forbidden. Insufficient permissions.'
            });
        }
    };
};
export const authorizeRolesHandler = (allowedRoles) => asyncHandler(authorizeRoles(allowedRoles));
