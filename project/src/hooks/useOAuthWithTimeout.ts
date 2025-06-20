import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const OAUTH_TIMEOUT_MS = 30000; // Increased to 30 seconds for more reliability

export function useOAuthWithTimeout() {
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [oauthStartTime, setOauthStartTime] = useState<number | null>(null);
  const { signInWithOAuth } = useAuth();
  const safetyTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-reset the loading state if we've been stuck for too long
  // This helps recover from edge cases where the redirect doesn't happen
  useEffect(() => {
    if (oauthLoading && oauthStartTime) {
      // Safety reset after 45 seconds 
      if (safetyTimeoutIdRef.current) {
        clearTimeout(safetyTimeoutIdRef.current);
      }
      
      safetyTimeoutIdRef.current = setTimeout(() => {
        setOauthLoading(null);
        setOauthStartTime(null);
      }, 45000);
      
      return () => {
        if (safetyTimeoutIdRef.current) {
          clearTimeout(safetyTimeoutIdRef.current);
        }
      };
    }
  }, [oauthLoading, oauthStartTime]);
  
  // Store OAuth state in session storage to help detect interruptions
  // Using a ref to track previous values to prevent unnecessary storage updates
  const prevOAuthLoadingRef = useRef<string | null>(null);
  
  useEffect(() => {
    const currentLoadingState = oauthLoading || null;
    const currentLoadingStateStr = currentLoadingState?.toString() || '';
    const prevLoadingStateStr = prevOAuthLoadingRef.current || '';
    
    // Only update storage if values actually changed
    if (currentLoadingStateStr !== prevLoadingStateStr) {
      if (oauthLoading) {
        sessionStorage.setItem('lastOAuthProvider', oauthLoading);
        sessionStorage.setItem('lastOAuthStartTime', String(oauthStartTime));
      } else {
        sessionStorage.removeItem('lastOAuthProvider');
        sessionStorage.removeItem('lastOAuthStartTime');
      }
      prevOAuthLoadingRef.current = currentLoadingStateStr;
    }
  }, [oauthLoading, oauthStartTime]);
  
  const handleOAuthSignIn = useCallback(async (
    provider: 'google' | 'github',
    onError: (error: string) => void
  ) => {
    if (oauthLoading) {
      console.log(`useOAuthWithTimeout: ${provider} OAuth already in progress, ignoring`);
      return;
    }
      console.log(`useOAuthWithTimeout: Starting ${provider} OAuth authentication`);
    
    // Record start time
    const startTime = Date.now();
    setOauthStartTime(startTime);
    setOauthLoading(provider);

    // Create timeout for better UX
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        console.log(`useOAuthWithTimeout: ${provider} OAuth timed out after ${OAUTH_TIMEOUT_MS}ms`);
        reject(new Error(`${provider} sign-in is taking longer than expected. If you're not redirected soon, please try again.`));
      }, OAUTH_TIMEOUT_MS);
      
      // Store timeout ID in sessionStorage so we can clear it if page reloads during OAuth
      sessionStorage.setItem('oauthTimeoutId', String(timeoutId));
      
      return () => {
        clearTimeout(timeoutId);
        sessionStorage.removeItem('oauthTimeoutId');
      };
    });

    try {
      console.log(`useOAuthWithTimeout: Initiating ${provider} OAuth with timeout protection`);
      
      // Race between OAuth sign-in and timeout
      await Promise.race([
        signInWithOAuth(provider), // This should redirect
        timeoutPromise
      ]);
      
      // If we reach here without redirect, something went wrong
      console.warn(`useOAuthWithTimeout: ${provider} OAuth completed but no redirect occurred`);
      throw new Error(`${provider} sign-in was initiated but no redirect occurred. Please try again or use email login.`);
    } catch (error) {
      console.error(`useOAuthWithTimeout: ${provider} OAuth error:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to sign in with ${provider}. Please check your connection and try again.`;
      onError(errorMessage);
      setOauthLoading(null);
      setOauthStartTime(null);
    }
  }, [signInWithOAuth, oauthLoading]);  // Create a stable version of this function using useRef instead of useCallback
  // so it doesn't change on re-renders but still has access to latest state setter
  const clearOAuthLoadingRef = useRef(() => {
    setOauthLoading(null);
    setOauthStartTime(null);
  });
  
  // Update the ref's current value when the component re-renders
  useEffect(() => {
    clearOAuthLoadingRef.current = () => {
      setOauthLoading(null);
      setOauthStartTime(null);
    };
  }, []);

  return {
    oauthLoading,
    handleOAuthSignIn,
    clearOAuthLoading: clearOAuthLoadingRef.current
  };
}
