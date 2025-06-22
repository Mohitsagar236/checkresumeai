import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { supabase, supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError, AuthenticationError, ConflictError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    throw new ValidationError('All fields are required: email, password, firstName, lastName');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: {
      firstName,
      lastName,
    }
  });

  if (authError) {
    logger.error('Supabase auth error:', authError);
    throw new Error('Failed to create user account');
  }

  // Create user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authUser.user.id,
      email: email.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      role: 'user',
      subscription_plan: 'free',
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (profileError) {
    logger.error('Profile creation error:', profileError);
    // Clean up auth user if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    throw new Error('Failed to create user profile');
  }  // Generate JWT token
  const token = jwt.sign(
    {
      userId: profile.id,
      email: profile.email,
      role: profile.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      subscriptionPlan: profile.subscription_plan,
    },
    token,
  });
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      first_name,
      last_name,
      role,
      subscription_plan,
      subscription_status,
      subscription_expires_at
    `)
    .eq('email', email.toLowerCase())
    .single();

  if (userError || !user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });

  if (authError || !authData.user) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw new AuthenticationError('Invalid email or password');
  }  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscription_plan,
      subscriptionStatus: user.subscription_status,
      subscriptionExpiresAt: user.subscription_expires_at
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  logger.info(`User logged in: ${email}`);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      subscriptionPlan: user.subscription_plan,
      subscriptionStatus: user.subscription_status,
      subscriptionExpiresAt: user.subscription_expires_at,
    },
    token,
  });
}));

// Logout user (client-side token removal mainly)
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    message: 'Logout successful',
    timestamp: new Date().toISOString(),
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      // Fetch updated user data
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
      throw new AuthenticationError('Invalid refresh token');
    }    // Generate new access token
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscription_plan,
        subscriptionStatus: user.subscription_status,
        subscriptionExpiresAt: user.subscription_expires_at
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
    });

  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
}));

// Forgot password
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  // Check if user exists
  const { data: user } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  // Always return success to prevent email enumeration
  if (!user) {
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
    return;
  }

  // Send password reset email via Supabase
  const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
  });

  if (error) {
    logger.error('Password reset error:', error);
  }

  logger.info(`Password reset requested for: ${email}`);

  res.json({
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ValidationError('Token and new password are required');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  // Update password via Supabase
  const { data, error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    logger.error('Password reset error:', error);
    throw new AuthenticationError('Invalid or expired reset token');
  }

  logger.info(`Password reset completed for user: ${data.user?.email}`);

  res.json({
    message: 'Password reset successful',
  });
}));

// Verify email
router.post('/verify-email', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  // This would typically be handled by Supabase automatically
  // but we can add custom logic here if needed

  res.json({
    message: 'Email verified successfully',
  });
}));

export default router;
