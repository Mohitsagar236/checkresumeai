import React from 'react';
import { supabase } from '../utils/supabaseClient';
import { useProfile } from '../hooks/useProfile';
import type { Profile } from '../types/profile';

export const ProfileManager: React.FC<{ userId: string | null }> = ({ userId }) => {
  const { profile, loading, error, createProfile, updateProfile } = useProfile(userId);

  // Handle profile creation for new users
  const handleCreateProfile = async () => {
    if (!userId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      await createProfile({
        id: userId,
        email: user.email || '',
        name: user.user_metadata?.full_name || 'New User'
      });
    } catch (err) {
      console.error('Error creating profile:', err);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    await updateProfile(updates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Profile Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              {error.includes('table not found') && (
                <p className="mt-2 font-medium">
                  Please run the database setup script to create the profiles table.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && userId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Profile Not Found</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>No profile found for this user. Would you like to create one?</p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleCreateProfile}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4 text-gray-500">
        No user selected
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Profile</h2>
        {profile.is_premium && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
            Premium
          </span>
        )}
      </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.name || 'Not set'}</dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Member Since</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(profile.created_at).toLocaleDateString()}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Premium Status</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {profile.is_premium ? 'Active' : 'Free Plan'}
            {profile.subscription_plan_period && (
              <span className="ml-1 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                {profile.subscription_plan_period === 'yearly' ? 'Yearly' : 'Monthly'}
              </span>
            )}
          </dd>
        </div>
        
        {profile.subscription_end_date && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Subscription Expires</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(profile.subscription_end_date).toLocaleDateString()}
            </dd>
          </div>
        )}        {profile.resume_usage && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-blue-700 mb-2">Resume Analysis Usage</dt>
            <dd className="mt-1 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex justify-between text-xs text-blue-800 mb-1">
                <span>Monthly Usage:</span>
                <span>{profile.resume_usage.monthly_count} resumes</span>
              </div>
              
              {/* Total usage */}
              <div className="flex justify-between text-xs text-blue-800 mt-2 mb-1">
                <span>Total Usage:</span>
                <span>{profile.resume_usage.total_count} resumes</span>
              </div>
              
              {profile.resume_usage.last_reset_date && (
                <div className="text-xs text-gray-500 mt-2">
                  Last reset: {new Date(profile.resume_usage.last_reset_date).toLocaleDateString()}
                </div>
              )}
            </dd>
          </div>
        )}
      </dl>
      
      <div className="mt-6">
        <button
          onClick={() => handleUpdateProfile({ name: prompt('Enter new name:', profile.name) || profile.name })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;
