// Enhanced authentication helper functions
import { retryOperation, supabase } from './supabaseClient';

/**
 * Enhanced email signup with better error handling and retry logic
 */
export const enhancedEmailSignup = async (email: string, password: string) => {
  try {
    console.log('🔐 Enhanced email signup initiated');
    
    // Normalize the email by trimming and converting to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Default to our standard email if empty
    const emailToUse = normalizedEmail || 'checkresmueai@gmail.com';
    
    // Generate redirect URL for email confirmation
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('🔗 Email confirmation redirect URL:', redirectUrl);
    
    // Use retry operation for better reliability
    const { data, error } = await retryOperation(() =>
      supabase.auth.signUp({
        email: emailToUse,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            email: emailToUse,
          }
        }
      })
    );
    
    if (error) {
      console.error('❌ Email signup error:', error);
      throw error;
    }
    
    if (data?.user) {
      console.log('✅ Email signup successful for:', data.user.email);
      
      // Record signup success in sessionStorage
      sessionStorage.setItem('signup_success', JSON.stringify({
        email: emailToUse,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('⚠️ No user returned from signup');
    }
    
    return { user: data?.user || null, error: null };
  } catch (error) {
    console.error('💥 Email signup exception:', error);
    return { user: null, error };
  }
};

/**
 * Enhanced email login with better error handling and retry logic
 */
export const enhancedEmailLogin = async (email: string, password: string) => {
  try {
    console.log('🔐 Enhanced email login initiated');
    
    // Normalize the email
    const normalizedEmail = email.trim().toLowerCase();
    
    // Default to our standard email if empty
    const emailToUse = normalizedEmail || 'checkresmueai@gmail.com';
    
    // Use retry operation for better reliability
    const { data, error } = await retryOperation(() =>
      supabase.auth.signInWithPassword({
        email: emailToUse,
        password
      })
    );
    
    if (error) {
      console.error('❌ Email login error:', error);
      throw error;
    }
    
    if (data?.user) {
      console.log('✅ Email login successful for:', data.user.email);
    } else {
      console.warn('⚠️ No user returned from login');
    }
    
    return { user: data?.user || null, error: null };
  } catch (error) {
    console.error('💥 Email login exception:', error);
    return { user: null, error };
  }
};

/**
 * Helper to parse OAuth errors from URL
 */
export const parseOAuthErrorFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  // Check for OAuth errors in URL parameters
  const error = hashParams.get('error') || urlParams.get('error');
  const errorDescription = hashParams.get('error_description') || 
                          urlParams.get('error_description') ||
                          hashParams.get('error_msg') || 
                          urlParams.get('error_msg');
  
  if (error || errorDescription) {
    return { error, errorDescription };
  }
  
  return null;
};

/**
 * Helper to get friendly error messages for auth errors
 */
export const getAuthErrorMessage = (error: any): string => {
  if (!error) return '';
  
  const message = typeof error === 'string' 
    ? error.toLowerCase() 
    : (error.message || '').toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'Network connection issue. Please check your internet and try again.';
  }
  
  if (message.includes('user already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('invalid login') || message.includes('invalid email') || message.includes('wrong password')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (message.includes('weak password')) {
    return 'Please use a stronger password with at least 6 characters.';
  }
  
  if (message.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  // Return cleaned message if no specific match
  return typeof error === 'string' 
    ? error.charAt(0).toUpperCase() + error.slice(1)
    : error.message || 'An unknown error occurred';
};
