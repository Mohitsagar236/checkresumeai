import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Access denied',
                message: 'No token provided or invalid token format'
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.jwt.secret);
        const { data: user, error } = await supabase
            .from('profiles')
            .select(`
        id,
        email,
        role,
        subscription_plan,
        subscription_status,
        subscription_expires_at
      `)
            .eq('id', decoded.userId)
            .single();
        if (error || !user) {
            logger.warn(`Authentication failed for user ${decoded.userId}: User not found`);
            res.status(401).json({
                error: 'Access denied',
                message: 'Invalid token or user not found'
            });
            return;
        }
        let subscriptionStatus = user.subscription_status;
        if (subscriptionStatus === 'active' &&
            user.subscription_expires_at &&
            new Date(user.subscription_expires_at) < new Date()) {
            await supabase
                .from('profiles')
                .update({
                subscription_status: 'expired',
                updated_at: new Date().toISOString(),
            })
                .eq('id', user.id);
            subscriptionStatus = 'expired';
            logger.info(`Updated expired subscription for user ${user.id}`);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            subscription: {
                plan: user.subscription_plan || 'free',
                status: subscriptionStatus || 'inactive',
                expiresAt: user.subscription_expires_at
            }
        };
        logger.debug(`User authenticated: ${req.user.email} (${req.user.id})`);
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn('Invalid JWT token:', error.message);
            res.status(401).json({
                error: 'Access denied',
                message: 'Invalid token'
            });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('JWT token expired');
            res.status(401).json({
                error: 'Access denied',
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
            return;
        }
        logger.error('Authentication middleware error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Authentication failed'
        });
    }
};
export const premiumMiddleware = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            error: 'Access denied',
            message: 'Authentication required'
        });
        return;
    }
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_plan, subscription_status, subscription_expires_at')
            .eq('id', req.user.id)
            .single();
        if (error || !profile) {
            logger.warn(`Failed to fetch subscription data for user ${req.user.id}`);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to verify subscription status'
            });
            return;
        }
        req.user.subscription = {
            plan: profile.subscription_plan || 'free',
            status: profile.subscription_status || 'inactive',
            expiresAt: profile.subscription_expires_at
        };
        const isPremium = (profile.subscription_plan === 'premium' || profile.subscription_plan === 'professional') &&
            profile.subscription_status === 'active' &&
            new Date(profile.subscription_expires_at) > new Date();
        if (!isPremium) {
            res.status(403).json({
                error: 'Premium subscription required',
                message: 'This feature requires an active premium subscription',
                upgradeUrl: '/pricing'
            });
            return;
        }
        next();
    }
    catch (error) {
        logger.error('Premium middleware error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Unable to verify subscription status'
        });
    }
};
export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            error: 'Access denied',
            message: 'Authentication required'
        });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({
            error: 'Access denied',
            message: 'Admin privileges required'
        });
        return;
    }
    next();
};
export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        await authMiddleware(req, res, next);
    }
    catch (error) {
        next();
    }
};
