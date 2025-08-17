import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './authContextDefs.tsx';
import { 
  supabase, 
  handleSupabaseError, 
  retryOperation,
  clearProfileCache,
  getValidSession
} from '../utils/supabaseClient';
import type { Session, User, PostgrestSingleResponse } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  is_premium: boolean;
}

// Helper function to create/update a user profile using efficient upsert
const createUserProfile = async (userId: string, email: string | undefined, name: string = '') => {
  try {
    console.debug('Upserting profile for user:', userId);
    
    // Use efficient upsert operation instead of check-then-insert pattern
    const upsertResult = await retryOperation(async () => {
      const result = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email || '',
          name: name || '',
          is_premium: false
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();
      return result as PostgrestSingleResponse<Profile>;
    });
    
    if (upsertResult.error) {
      console.debug('Profile upsert failed:', handleSupabaseError(upsertResult.error));
      return { success: false, error: handleSupabaseError(upsertResult.error) };
    }
    
    console.debug('Profile upserted successfully for user:', userId);
    return { success: true, error: null, profile: upsertResult.data };
  } catch (error) {
    console.debug('Error in createUserProfile:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

// Smart redirect URL detection for different environments
const getRedirectUrl = () => {
  // If explicitly set in environment, use that (highest priority)
  if (import.meta.env.VITE_REDIRECT_URL) {
    console.log('Using explicit redirect URL from env:', import.meta.env.VITE_REDIRECT_URL);
    return import.meta.env.VITE_REDIRECT_URL;
  }
  
  // For local development (detect if we're on localhost but ensure port consistency)
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    // Extract port from current URL or default to 3000 (for consistency with error)
    const port = window.location.port || '3000';
    const redirectUrl = `http://localhost:${port}/auth/callback`;
    console.log('Using development redirect URL:', redirectUrl);
    return redirectUrl;
  }
  
  // For production (use current origin)
  const productionUrl = `${window.location.origin}/auth/callback`;
  console.log('Using production redirect URL:', productionUrl);
  return productionUrl;
};

const REDIRECT_URL = getRedirectUrl();

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // Immediately get and set session with clock skew protection
    const initializeSession = async () => {
      setIsLoading(true);
      try {
        // Use the enhanced session getter that handles clock skew
        const { session, error: sessionError } = await getValidSession();
        
        if (sessionError) {
          console.warn('Session retrieval error (may be expected on first load):', sessionError);
          // Handle clock skew specific errors
          if (sessionError instanceof Error && 
              (sessionError.message?.includes('issued in the future') || sessionError.message?.includes('clock skew'))) {
            console.warn('Clock skew detected during session initialization');
          }
          // Don't throw error for 401 on initial session load
          if (sessionError instanceof Error && 
              (sessionError.message?.includes('401') || sessionError.message?.includes('Unauthorized'))) {
            console.log('No active session found - user needs to sign in');
          }
        }
        
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // If user exists, get or create profile efficiently
        if (currentUser) {
          const profileResult = await createUserProfile(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || ''
          );
          
          if (profileResult.success && profileResult.profile) {
            setUserProfile(profileResult.profile);
          } else {
            // Fallback: try to get existing profile
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            if (existingProfile) {
              setUserProfile(existingProfile);
            }
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only log auth state changes after initial session load to reduce redundant logging
      if (hasInitialized) {
        console.log('Auth State Change:', event, session?.user?.id || null);
      }
      
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Only update profile for specific auth events to avoid redundant calls
      if (currentUser && event === 'SIGNED_IN') {
        try {
          const profileResult = await createUserProfile(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || ''
          );
          
          if (profileResult.success && profileResult.profile) {
            setUserProfile(profileResult.profile);
          }
        } catch (error) {
          console.debug('Profile creation/update failed during auth state change:', error);
          // Don't block auth flow for profile errors
        }
      } else if (!currentUser) {
        // Clear profile when user signs out
        setUserProfile(null);
      }
      
      // Mark as initialized after first auth state change
      if (!hasInitialized) {
        setHasInitialized(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [hasInitialized]);
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Initiating sign in for email:', email);
      
      // Normalize the email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Use retry logic for better reliability
      const { data, error } = await retryOperation(() =>
        supabase.auth.signInWithPassword({ 
          email: normalizedEmail, 
          password
        })
      );
      
      if (error) {
        console.error('❌ AuthContext: Sign in error:', error);
        throw error;
      }

      // Record successful login in localStorage for debugging
      if (data?.user) {
        try {
          localStorage.setItem('last_login_attempt', JSON.stringify({
            email: normalizedEmail,
            userId: data.user.id,
            timestamp: new Date().toISOString(),
            success: true
          }));
          console.log('✅ AuthContext: Login successful');
        } catch (err) {
          // Storage errors are non-critical
          console.warn('⚠️ Failed to store login success in localStorage:', err);
        }
      }

      return { user: data?.user || null, error: null };
    } catch (error) {
      console.error('❌ AuthContext: Sign in error:', error);
      
      // Record failed login in localStorage for debugging
      try {
        localStorage.setItem('last_login_attempt', JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }));
      } catch (err) {
        // Storage errors are non-critical
        console.warn('⚠️ Failed to store login error in localStorage:', err);
      }
      
      return { user: null, error: new Error(handleSupabaseError(error)) };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Initiating signup for email:', email);
      
      // Use existing retry logic but with better error handling
      const { data, error } = await retryOperation(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: REDIRECT_URL,
            data: {
              email: email,
            }
          }
        })
      );
      
      if (error) {
        console.error('❌ AuthContext: Signup error:', error);
        throw error;
      }

      // Record successful signup in localStorage for debugging
      if (data?.user) {
        try {
          localStorage.setItem('last_signup_attempt', JSON.stringify({
            email: email,
            userId: data.user.id,
            timestamp: new Date().toISOString(),
            success: true
          }));
          console.log('✅ AuthContext: Signup successful, user created');
        } catch (err) {
          // Storage errors are non-critical
          console.warn('⚠️ Failed to store signup success in localStorage:', err);
        }
      }

      // Profile will be handled by auth state change listener
      return { user: data?.user || null, error: null };
    } catch (error) {
      console.error('❌ AuthContext: Sign up error:', error);
      
      // Record failed signup in localStorage for debugging
      try {
        localStorage.setItem('last_signup_attempt', JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }));
      } catch (err) {
        // Storage errors are non-critical
        console.warn('⚠️ Failed to store signup error in localStorage:', err);
      }
      
      return { user: null, error: new Error(handleSupabaseError(error)) };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      clearProfileCache();
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(handleSupabaseError(error));
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      console.log('🔐 Starting OAuth login with:', provider);
      
      // Get the current port to ensure consistency
      const currentPort = window.location.port || '3000'; // Default to 3000 if port is not specified
      // Force the redirectUrl to use the current port to avoid mismatch errors
      const redirectUrl = import.meta.env.VITE_REDIRECT_URL || 
        (window.location.hostname === 'localhost' ? 
          `http://localhost:${currentPort}/auth/callback` : 
          `${window.location.origin}/auth/callback`);
      
      console.log('🔗 Redirect URL:', redirectUrl);
      console.log('🌐 Current location:', window.location.href);
      console.log('🏠 Window origin:', window.location.origin);
      console.log('🚀 Environment mode:', import.meta.env.MODE);
      
      // Generate a state parameter for security and clear any existing one first
      localStorage.removeItem('supabase-auth-state'); // Clear any existing state
      sessionStorage.removeItem('supabase-auth-state'); // Clear from sessionStorage too
      
      // Create a more robust state parameter with port information to avoid mismatches
      const state = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_port${currentPort}`;
      localStorage.setItem('supabase-auth-state', state);
      
      // Record OAuth attempt for analytics and debugging
      sessionStorage.setItem('last_oauth_attempt', JSON.stringify({
        provider,
        timestamp: new Date().toISOString(),
        redirectUrl,
        state,
        port: currentPort
      }));
      
      // Configure OAuth options based on provider
      const oauthOptions = {
        redirectTo: redirectUrl,
        queryParams: {}
      };
      
      // Provider-specific configurations
      if (provider === 'google') {
        oauthOptions.queryParams = {
          access_type: 'offline',
          prompt: 'select_account consent',
          state
        };
      } else if (provider === 'github') {
        oauthOptions.queryParams = {
          state
        };
      }
      
      console.log(`📝 ${provider} OAuth options:`, oauthOptions);
      
      // Before initiating OAuth, store the state in sessionStorage as well (redundancy)
      sessionStorage.setItem('supabase-auth-state', state);
      
      // Add timestamp to track when this OAuth attempt was initiated
      sessionStorage.setItem('oauth-initiated-at', Date.now().toString());
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: oauthOptions
      });
      
      if (error) {
        console.error(`❌ ${provider} OAuth initiation error:`, error);
        // Clean up stored state on error
        localStorage.removeItem('supabase-auth-state');
        sessionStorage.removeItem('supabase-auth-state');
        throw error;
      }
      
      // Store URL that the OAuth provider will redirect to
      if (data?.url) {
        console.log(`🔗 ${provider} OAuth redirect URL:`, data.url);
        sessionStorage.setItem('oauth_redirect_url', data.url);
        
        // For some browsers/environments that might block redirects
        // We'll add a manual redirect option with a small delay
        const redirectTimer = setTimeout(() => {
          if (document.location.href === window.location.href) {
            console.log(`⚠️ Manual redirect to ${provider} authorization...`);
            window.location.href = data.url;
          }
        }, 2000);
        
        // Clean up timer if component unmounts
        return () => clearTimeout(redirectTimer);
      } else {
        console.warn(`⚠️ No redirect URL returned for ${provider} OAuth`);
      }
      
      console.log(`✅ ${provider} OAuth sign-in initiated successfully`);
    } catch (err) {
      console.error(`❌ ${provider} OAuth sign-in error:`, err);
      // Record failure for debugging
      sessionStorage.setItem('oauth_error', JSON.stringify({
        provider,
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err)
      }));
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile: userProfile,
      isLoading,
      signIn, 
      signUp, 
      signOut, 
      signInWithOAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
