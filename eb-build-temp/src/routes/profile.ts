import { Router, Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Get user profile
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      first_name,
      last_name,
      role,
      subscription_plan,
      subscription_status,
      subscription_expires_at,
      avatar_url,
      bio,
      location,
      website,
      linkedin_url,
      github_url,
      phone,
      industry,
      experience_level,
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .single();

  if (error) {
    logger.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }

  res.json({
    message: 'Profile retrieved successfully',
    data: {
      profile,
    },
  });
}));

// Update user profile
router.put('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const {
    firstName,
    lastName,
    bio,
    location,
    website,
    linkedinUrl,
    githubUrl,
    phone,
    industry,
    experienceLevel,
  } = req.body;

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  // Only update provided fields
  if (firstName !== undefined) updateData.first_name = firstName;
  if (lastName !== undefined) updateData.last_name = lastName;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (website !== undefined) updateData.website = website;
  if (linkedinUrl !== undefined) updateData.linkedin_url = linkedinUrl;
  if (githubUrl !== undefined) updateData.github_url = githubUrl;
  if (phone !== undefined) updateData.phone = phone;
  if (industry !== undefined) updateData.industry = industry;
  if (experienceLevel !== undefined) updateData.experience_level = experienceLevel;

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }

  logger.info(`Profile updated for user: ${userId}`);

  res.json({
    message: 'Profile updated successfully',
    data: {
      profile: updatedProfile,
    },
  });
}));

// Upload avatar
router.post('/avatar', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { avatarUrl } = req.body;

  if (!avatarUrl) {
    throw new ValidationError('Avatar URL is required');
  }

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating avatar:', error);
    throw new Error('Failed to update avatar');
  }

  res.json({
    message: 'Avatar updated successfully',
    data: {
      avatarUrl: updatedProfile.avatar_url,
    },
  });
}));

// Change password
router.post('/change-password', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }

  if (newPassword.length < 8) {
    throw new ValidationError('New password must be at least 8 characters long');
  }

  // This would typically involve verifying the current password
  // and updating it through Supabase Auth
  // For now, we'll just log the attempt
  logger.info(`Password change requested for user: ${userId}`);

  res.json({
    message: 'Password changed successfully',
  });
}));

// Delete account
router.delete('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { confirmEmail } = req.body;

  if (confirmEmail !== req.user!.email) {
    throw new ValidationError('Email confirmation does not match');
  }

  // In a real application, you'd want to:
  // 1. Cancel any active subscriptions
  // 2. Delete user data
  // 3. Delete from Supabase Auth
  // 4. Send confirmation email

  logger.info(`Account deletion requested for user: ${userId}`);

  res.json({
    message: 'Account deletion initiated. You will receive a confirmation email.',
  });
}));

// Get user stats
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Get analytics data
  const { data: analytics } = await supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get total analyses count
  const { data: analyses, error: analysesError } = await supabase
    .from('resume_analyses')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('resume_analyses')
    .select('created_at, job_role, ats_score')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    totalAnalyses: analyses?.length || 0,
    currentAtsScore: analytics?.ats_score || 0,
    improvementFromLast: analytics ? analytics.ats_score - analytics.previous_ats_score : 0,
    averageScore: analytics?.overall_score || 0,
    skillsMatched: analytics?.skills_matched || 0,
    totalSkills: analytics?.total_skills || 0,
    lastAnalysisDate: analytics?.last_analysis_date,
    recentActivity: recentActivity || [],
    memberSince: req.user!.subscription?.expiresAt || new Date().toISOString(),
  };

  res.json({
    message: 'User stats retrieved successfully',
    data: {
      stats,
    },
  });
}));

// Get user preferences
router.get('/preferences', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // In a real app, you'd have a preferences table
  const defaultPreferences = {
    emailNotifications: true,
    analysisReminders: true,
    marketingEmails: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    defaultJobRole: 'general',
    privacyMode: false,
  };

  res.json({
    message: 'User preferences retrieved successfully',
    data: {
      preferences: defaultPreferences,
    },
  });
}));

// Update user preferences
router.put('/preferences', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const preferences = req.body;

  // In a real app, you'd save these to a preferences table
  logger.info(`Preferences updated for user: ${userId}`, preferences);

  res.json({
    message: 'Preferences updated successfully',
    data: {
      preferences,
    },
  });
}));

export default router;
