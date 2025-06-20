import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Extend Request interface to include user
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

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Access denied',
        message: 'No token provided or invalid token format'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Fetch user details from database
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
    }    // Check if subscription is expired but status is still active
    let subscriptionStatus = user.subscription_status;
    if (
      subscriptionStatus === 'active' &&
      user.subscription_expires_at && 
      new Date(user.subscription_expires_at) < new Date()
    ) {
      // Update subscription status to expired in database
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      // Update the status for this request
      subscriptionStatus = 'expired';
      logger.info(`Updated expired subscription for user ${user.id}`);
    }
    
    // Attach user information to request
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

  } catch (error) {
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

// Middleware to check if user has premium subscription
export const premiumMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
    return;
  }

  try {
    // Always fetch fresh subscription data from database to ensure latest status
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

    // Update req.user with latest subscription data
    req.user.subscription = {
      plan: profile.subscription_plan || 'free',
      status: profile.subscription_status || 'inactive',
      expiresAt: profile.subscription_expires_at
    };

    const isPremium = 
      (profile.subscription_plan === 'premium' || profile.subscription_plan === 'professional') && 
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
  } catch (error) {
    logger.error('Premium middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Unable to verify subscription status'
    });
  }
};

// Middleware to check admin role
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    await authMiddleware(req, res, next);
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};
