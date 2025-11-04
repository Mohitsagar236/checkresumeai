import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './authContextDefs.tsx';
import { 
  supabase, 
  handleSupabaseError, 
  retryOperation,
  clearProfileCache
} from '../utils/supabaseClient';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { 
  onAuthChange, 
  signIn as firebaseSignIn, 
  signUp as firebaseSignUp, 
  signOut as firebaseSignOut,
  signInWithOAuthProvider,
  handleOAuthRedirect
} from '../utils/firebaseClient';

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

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize Firebase and check for OAuth redirect
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Check if returning from OAuth redirect
        const { user: redirectUser, error: redirectError } = await handleOAuthRedirect();
        
        if (redirectError) {
          console.error('OAuth redirect error:', redirectError);
        }
        
        if (redirectUser) {
          console.log('✅ OAuth redirect successful, user:', redirectUser.email);
          setUser(redirectUser);
          
          // Create/update profile
          const profileResult = await createUserProfile(
            redirectUser.uid,
            redirectUser.email ?? '',
            redirectUser.displayName || ''
          );
          
          if (profileResult.success && profileResult.profile) {
            setUserProfile(profileResult.profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthChange(async (fbUser) => {
      if (hasInitialized) {
        console.log('Auth State Change (Firebase):', fbUser?.uid || null);
      }

      let tokenSession = null;
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        tokenSession = { id_token: idToken, user: { id: fbUser.uid, email: fbUser.email } };
      }

      setSession(tokenSession);
      setUser(fbUser ?? null);

      if (fbUser) {
        try {
          const profileResult = await createUserProfile(
            fbUser.uid,
            fbUser.email,
            fbUser.displayName || ''
          );

          if (profileResult.success && profileResult.profile) {
            setUserProfile(profileResult.profile);
          }
        } catch (error) {
          console.debug('Profile creation/update failed during auth state change:', error);
        }
      } else {
        setUserProfile(null);
      }

      if (!hasInitialized) setHasInitialized(true);
    });

    return () => {
      try { unsubscribe(); } catch { /* ignore */ }
    };
  }, [hasInitialized]);
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Initiating sign in for email:', email);
      
      // Normalize the email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Use Firebase signIn
      const result = await firebaseSignIn(normalizedEmail, password);
      const fbUser = result.user;

      try {
        localStorage.setItem('last_login_attempt', JSON.stringify({
          email: normalizedEmail,
          userId: fbUser.uid,
          timestamp: new Date().toISOString(),
          success: true
        }));
        console.log('✅ AuthContext: Login successful');
      } catch (err) {
        console.warn('⚠️ Failed to store login success in localStorage:', err);
      }

      return { user: fbUser || null, error: null };
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
      
      const result = await firebaseSignUp(email, password);
      const fbUser = result.user;

      try {
        localStorage.setItem('last_signup_attempt', JSON.stringify({
          email: email,
          userId: fbUser.uid,
          timestamp: new Date().toISOString(),
          success: true
        }));
        console.log('✅ AuthContext: Signup successful, user created');
      } catch (err) {
        console.warn('⚠️ Failed to store signup success in localStorage:', err);
      }

      return { user: fbUser || null, error: null };
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
      await firebaseSignOut();
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
      console.log('🔐 Starting Firebase OAuth login with:', provider);
      
      // Determine if we should use redirect or popup
      // Use redirect for mobile devices or if popups might be blocked
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const useRedirect = isMobile;
      
      console.log(`� Using ${useRedirect ? 'redirect' : 'popup'} flow for ${provider} OAuth`);
      
      // Record OAuth attempt for analytics and debugging
      sessionStorage.setItem('last_oauth_attempt', JSON.stringify({
        provider,
        timestamp: new Date().toISOString(),
        method: useRedirect ? 'redirect' : 'popup'
      }));
      
      const { user, error } = await signInWithOAuthProvider(provider, useRedirect);
      
      if (error) {
        // Handle user cancellation silently
        if (error.isCancellation || error.code === 'auth/popup-closed-by-user') {
          console.log(`ℹ️ ${provider} OAuth sign-in cancelled by user`);
          return; // Don't throw error for user cancellations
        }
        
        console.error(`❌ ${provider} OAuth error:`, error);
        sessionStorage.setItem('oauth_error', JSON.stringify({
          provider,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error)
        }));
        throw error;
      }
      
      if (user) {
        console.log(`✅ ${provider} OAuth sign-in successful:`, user.email);
        // Profile will be created/updated by the onAuthChange listener
      } else if (useRedirect) {
        console.log(`🔄 ${provider} OAuth redirect initiated`);
        // User will be set after redirect completes
      }
      
      console.log(`✅ ${provider} OAuth sign-in initiated successfully`);
    } catch (err) {
      console.error(`❌ ${provider} OAuth sign-in error:`, err);
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
