import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { diagnoseOAuthError, logEnvironmentInfo } from '../utils/oauth-error-diagnostics';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Log any existing state values before processing
  console.log('⭐ Auth Callback Page Loaded');
  console.log('🔑 Stored state:', localStorage.getItem('supabase-auth-state'));
  console.log('📝 Session state:', sessionStorage.getItem('supabase-auth-state'));
  console.log('⏱️ OAuth initiated at:', sessionStorage.getItem('oauth-initiated-at'));
  
  useEffect(() => {
    const handleAuthCallback = async () => {      try {
        setIsProcessing(true);
        setError(null);

        console.log('🔄 Processing authentication callback...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('🏠 Origin:', window.location.origin);
        
        // Add enhanced OAuth diagnostic logging
        logEnvironmentInfo();
        
        // Check for authentication fragments in both URL and hash (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Debug all parameters to help troubleshoot
        console.log('📝 URL Parameters:', Object.fromEntries(urlParams.entries()));
        console.log('📝 Hash Parameters:', Object.fromEntries(hashParams.entries()));
        
        // Check if this is an OAuth callback with access_token
        const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
        const error_description = hashParams.get('error_description') || urlParams.get('error_description') || hashParams.get('error') || urlParams.get('error');
        const provider = hashParams.get('provider') || urlParams.get('provider');
        
        console.log('🔑 Access token present:', !!accessToken);
        console.log('🔄 Refresh token present:', !!refreshToken);
        console.log('🔌 Provider:', provider || 'unknown');
        console.log('❌ Error description:', error_description);
          // First check for errors with enhanced diagnostics
        if (error_description) {
          console.error('❌ OAuth error:', error_description);
          
          // Run diagnostics for better error insights
          const errorDiagnosis = diagnoseOAuthError(urlParams, hashParams);
          console.log('🔍 OAuth Error Diagnosis:', errorDiagnosis);
          
          // Show more helpful error message with potential solution
          if (urlParams.get('error_code') === 'bad_oauth_state') {
            setError(`Authentication failed: OAuth state mismatch. This might be due to a port mismatch between 3000 and ${window.location.port}. Try using the run-auth-fixed-port.js script.`);
          } else {
            setError(`Authentication failed: ${error_description}`);
          }
          
          setTimeout(() => navigate('/login'), 5000); // Give more time to read the error
          return;
        }// State parameter check for CSRF protection with enhanced handling
        const expectedState = localStorage.getItem('supabase-auth-state');
        const sessionState = sessionStorage.getItem('supabase-auth-state');
        const returnedState = hashParams.get('state') || urlParams.get('state');
        const currentPort = window.location.port || '3000';
        
        console.log('🔒 Auth State Check:', { 
          expectedState, 
          sessionState, 
          returnedState,
          currentPort,
          currentUrl: window.location.href
        });
        
        // Enhanced state validation with better logging
        if (returnedState) {
          if (expectedState === returnedState || sessionState === returnedState) {
            console.log('✅ State validation passed');
          } else if (expectedState && returnedState && expectedState !== returnedState) {
            console.warn('⚠️ State mismatch detected');
            console.log('Expected state:', expectedState);
            console.log('Session state:', sessionState);
            console.log('Returned state:', returnedState);
            
            // Special handling for port-related mismatches (common in local development)
            const portInfoRegex = /_port(\d+)$/;
            const expectedPortMatch = expectedState?.match(portInfoRegex);
            const returnedPortMatch = returnedState?.match(portInfoRegex);
            
            if (expectedPortMatch && returnedPortMatch) {
              console.log(`Expected port: ${expectedPortMatch[1]}, Returned port: ${returnedPortMatch[1]}`);
              if (expectedPortMatch[1] !== returnedPortMatch[1]) {
                console.warn(`Port mismatch detected: expected ${expectedPortMatch[1]} but got ${returnedPortMatch[1]}`);
              }
            }
            
            // Clear the stale state but continue with authentication
            localStorage.removeItem('supabase-auth-state');
            sessionStorage.removeItem('supabase-auth-state');
            
            console.log('Proceeding with authentication despite state mismatch (for usability)');
          } else {
            console.log('No state comparison possible - missing expected state');
          }
        } else {
          console.log('No state returned from OAuth provider');
        }// Clean up stored state values to prevent future conflicts
        localStorage.removeItem('supabase-auth-state');
        sessionStorage.removeItem('supabase-auth-state');
        
        // Check for code in URL (used in PKCE flow)
        const code = urlParams.get('code');
        if (code) {
          console.log('🔑 Authorization code present, exchanging for tokens...');
          // Let Supabase handle the code exchange via handleRedirectResult
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ Code exchange error:', error);
            setError(`Authentication failed: ${error.message}`);
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          
          if (data.session) {
            console.log('✅ Code exchange successful, session established');
            console.log('👤 User:', data.session.user?.email);
            
            // Clear the URL for security
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Redirect to home page on successful authentication
            navigate('/');
            return;
          }
        }
        
        // Handle implicit flow with direct tokens
        if (accessToken) {
          console.log('🔐 Setting session with OAuth tokens...');
          // Set the session manually using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            console.error('❌ Session setting error:', error);
            setError(`Authentication failed: ${error.message}`);
            setTimeout(() => navigate('/login'), 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Authentication successful, session established');
            console.log('👤 User:', data.session.user?.email);
            
            // Clear the URL fragments for security
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Redirect to home page on successful authentication
            navigate('/');
            return;
          }
        }

        // If no OAuth tokens in URL, try handleRedirectResult first
        console.log('📝 Attempting to handle redirect result...');
        try {
          const { error: redirectError } = await supabase.auth.getSession(); 
          if (redirectError) {
            console.warn('⚠️ Redirect handling produced an error:', redirectError);
            // Continue to next fallback
          } else {
            console.log('✅ Auth state updated successfully');
          }
        } catch (err) {
          console.error('❌ Error handling redirect:', err);
          // Continue to next fallback
        }
        
        // Final fallback: check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session verification error:', sessionError);
          setError('Session verification failed.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }if (session) {
          console.log('Existing session found, redirecting to home');
          navigate('/');
        } else {
          console.log('No valid session found');
          setError('No valid session found. Please sign in again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('An unexpected authentication error occurred.');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {isProcessing ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Processing authentication...
            </h2>
            <LoadingSpinner />
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
              Authentication Error
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login page...
            </p>
          </>
        ) : (          <>
            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Authentication Successful
            </h2>            <p className="text-gray-600 dark:text-gray-300">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}