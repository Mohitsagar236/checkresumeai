import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '../types/profile';
import { profileAPI } from '../utils/profileAPI';

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile function with proper error handling
  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.fetchById(id);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create profile function
  const createProfile = async (userData: {
    id: string;
    email: string;
    name: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.create(userData);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      console.error('Error creating profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return null;

    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.update(userId, updates);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch profile when userId changes
  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    refetch: useCallback(() => userId ? fetchProfile(userId) : null, [userId])
  };
};
