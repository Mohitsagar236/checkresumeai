import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from './errorHandler.js';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

/**
 * Middleware to authenticate JWT tokens
 * This middleware verifies the JWT token in the Authorization header
 * and attaches the decoded user info to the request object
 */
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }
    
    // Extract token from Bearer format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Invalid token format.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
    
    // Fetch user from database to ensure they still exist and have proper permissions
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
    
    // Attach user info to request object
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
  } catch (error) {
    logger.error('JWT authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.'
    });
  }
};

export const authenticateJWTHandler = asyncHandler(authenticateJWT);

/**
 * Middleware to authorize based on user roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the endpoint
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before authorization.'
      });
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      logger.warn(`Unauthorized access attempt by ${req.user.email} (${req.user.role}) to ${req.method} ${req.originalUrl}`);
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Insufficient permissions.'
      });
    }
  };
};

export const authorizeRolesHandler = (allowedRoles: string[]) => asyncHandler(authorizeRoles(allowedRoles));

// Extend Express Request type to include user object
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
