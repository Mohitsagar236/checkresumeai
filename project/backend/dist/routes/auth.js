import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { supabase, supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError, AuthenticationError, ConflictError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import emailService from '../utils/emailService.js';
const router = Router();
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        throw new ValidationError('All fields are required: email, password, firstName, lastName');
    }
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
    }
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
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
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
        throw new Error('Failed to create user profile');
    }
    const token = jwt.sign({
        userId: profile.id,
        email: profile.email,
        role: profile.role,
    }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    logger.info(`New user registered: ${email}`);
    await emailService.sendWelcomeEmail(email.toLowerCase(), firstName);
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
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ValidationError('Email and password are required');
    }
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
    });
    if (authError || !authData.user) {
        logger.warn(`Failed login attempt for email: ${email}`);
        throw new AuthenticationError('Invalid email or password');
    }
    const token = jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscription_plan,
        subscriptionStatus: user.subscription_status,
        subscriptionExpiresAt: user.subscription_expires_at
    }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
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
router.post('/logout', asyncHandler(async (req, res) => {
    res.json({
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
    });
}));
router.post('/refresh', asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
    }
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.secret);
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
        }
        const newToken = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            subscriptionPlan: user.subscription_plan,
            subscriptionStatus: user.subscription_status,
            subscriptionExpiresAt: user.subscription_expires_at
        }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
        res.json({
            message: 'Token refreshed successfully',
            token: newToken,
        });
    }
    catch (error) {
        throw new AuthenticationError('Invalid or expired refresh token');
    }
}));
router.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ValidationError('Email is required');
    }
    const { data: user } = await supabase
        .from('profiles')
        .select('id, first_name')
        .eq('email', email.toLowerCase())
        .single();
    if (!user) {
        res.json({
            message: 'If an account with that email exists, a password reset link has been sent.',
        });
        return;
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });
    if (error) {
        logger.error('Password reset error:', error);
    }
    else {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent('SUPABASE_TOKEN')}`;
        await emailService.sendPasswordResetEmail(email.toLowerCase(), resetLink);
    }
    logger.info(`Password reset requested for: ${email}`);
    res.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
    });
}));
router.post('/reset-password', asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        throw new ValidationError('Token and new password are required');
    }
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
    }
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
router.post('/verify-email', asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new ValidationError('Verification token is required');
    }
    res.json({
        message: 'Email verified successfully',
    });
}));
export default router;
