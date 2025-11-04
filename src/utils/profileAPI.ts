import { supabase } from '../utils/supabaseClient';
import type { Profile } from '../types/profile';

export class ProfileAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ProfileAPIError';
  }
}

export const profileAPI = {
  // Check if profile exists
  async exists(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', userId);

      if (error) throw new ProfileAPIError(error.message, error.code);
      return (count || 0) > 0;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      throw error instanceof ProfileAPIError ? error : new ProfileAPIError('Failed to check profile existence');
    }
  },

  // Fetch profile by ID
  async fetchById(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Profile not found
        }
        if (error.code === '42P01') {
          throw new ProfileAPIError('Profiles table not found. Please run the database setup.', 'TABLE_NOT_FOUND');
        }
        throw new ProfileAPIError(error.message, error.code);
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error instanceof ProfileAPIError ? error : new ProfileAPIError('Failed to fetch profile');
    }
  },

  // Create new profile
  async create(profileData: {
    id: string;
    email: string;
    name: string;
  }): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...profileData,
          is_premium: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw new ProfileAPIError(error.message, error.code);
      if (!data) throw new ProfileAPIError('Failed to create profile: No data returned');
      
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error instanceof ProfileAPIError ? error : new ProfileAPIError('Failed to create profile');
    }
  },

  // Update profile
  async update(userId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new ProfileAPIError(error.message, error.code);
      if (!data) throw new ProfileAPIError('Failed to update profile: No data returned');

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error instanceof ProfileAPIError ? error : new ProfileAPIError('Failed to update profile');
    }
  },

  // Update resume usage information
  async updateResumeUsage(userId: string, resumeUsage: {
    total_count: number;
    monthly_count: number;
    last_reset_date?: string;
  }, subscription_plan_period?: 'monthly' | 'yearly'): Promise<Profile> {
    try {
      // First get the current profile to ensure we have the latest data
      const currentProfile = await this.fetchById(userId);
      
      if (!currentProfile) {
        throw new ProfileAPIError('Profile not found for updating resume usage');
      }

      const updates: Partial<Profile> = {
        resume_usage: resumeUsage
      };

      // Only update subscription_plan_period if it's provided
      if (subscription_plan_period) {
        updates.subscription_plan_period = subscription_plan_period;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new ProfileAPIError(error.message, error.code);
      if (!data) throw new ProfileAPIError('Failed to update profile resume usage: No data returned');

      return data;
    } catch (error) {
      console.error('Error updating profile resume usage:', error);
      throw error instanceof ProfileAPIError ? error : new ProfileAPIError('Failed to update profile resume usage');
    }
  }
};
