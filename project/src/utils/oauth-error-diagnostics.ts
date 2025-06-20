// Debug tool for OAuth errors
// This should be imported in the AuthCallback component when troubleshooting
// Import with: import { diagnoseOAuthError } from '../utils/oauth-error-diagnostics';

/**
 * Diagnoses common OAuth errors and provides solutions
 * @param {URLSearchParams} urlParams - URL parameters from the callback
 * @param {URLSearchParams} hashParams - Hash parameters from the callback
 * @returns {Object} Diagnosis and potential solutions
 */
export function diagnoseOAuthError(urlParams, hashParams) {
  const error = urlParams.get('error') || hashParams.get('error');
  const errorCode = urlParams.get('error_code') || hashParams.get('error_code');
  const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
  
  const diagnosis = {
    error,
    errorCode,
    errorDescription,
    possibleCauses: [],
    solutions: []
  };
  
  // Bad OAuth state error
  if (errorCode === 'bad_oauth_state') {
    diagnosis.possibleCauses = [
      'The OAuth state parameter from the redirect does not match the expected state',
      'The user may have started OAuth on one port (e.g., 5173) but was redirected to another (e.g., 3000)',
      'Potential CSRF attack (though unlikely)',
      'OAuth process took too long and state was cleared from storage',
      'User has two browser windows open with different OAuth flows'
    ];
    
    diagnosis.solutions = [
      'Ensure the VITE_REDIRECT_URL in .env matches the actual port your app is running on',
      'Explicitly set the port when starting the development server (use the run-auth-fixed-port.js script)',
      'Clear browser storage and try again',
      'Make sure your OAuth provider settings in Supabase Dashboard have the correct redirect URL'
    ];
  }
  
  // Log all available info from storage for debugging
  const debugInfo = {
    localStorage: {},
    sessionStorage: {},
    supabaseStateMismatch: false
  };
  
  try {
    // Collect localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        if (key.includes('supabase') || key.includes('oauth') || key.includes('auth')) {
          debugInfo.localStorage[key] = localStorage.getItem(key);
        }
      }
    }
    
    // Collect sessionStorage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        if (key.includes('supabase') || key.includes('oauth') || key.includes('auth')) {
          debugInfo.sessionStorage[key] = sessionStorage.getItem(key);
        }
      }
    }
    
    // Check for state mismatch
    const expectedState = localStorage.getItem('supabase-auth-state');
    const sessionState = sessionStorage.getItem('supabase-auth-state');
    const returnedState = urlParams.get('state') || hashParams.get('state');
    
    if (expectedState && returnedState && expectedState !== returnedState) {
      debugInfo.supabaseStateMismatch = true;
      debugInfo.stateDiagnosis = {
        expectedState,
        sessionState,
        returnedState,
        match: expectedState === returnedState || sessionState === returnedState
      };
    }
    
    diagnosis.debugInfo = debugInfo;
  } catch (e) {
    diagnosis.storageError = e.message;
  }
  
  return diagnosis;
}

/**
 * Gets the actual port where the app is running
 * @returns {string} The current port
 */
export function getCurrentPort() {
  return window.location.port || 
    (window.location.protocol === 'https:' ? '443' : '80');
}

/**
 * Logs diagnostic information about the environment
 */
export function logEnvironmentInfo() {
  console.log('=== OAuth Environment Info ===');
  console.log('Current URL:', window.location.href);
  console.log('Port:', getCurrentPort());
  console.log('Hostname:', window.location.hostname);
  console.log('Protocol:', window.location.protocol);
  console.log('User Agent:', navigator.userAgent);
  console.log('Environment Variables:');
  
  // Safe way to check environment variables
  const envVars = [
    'VITE_REDIRECT_URL',
    'VITE_SUPABASE_URL',
    'VITE_DEBUG_OAUTH'
  ];
  
  envVars.forEach(varName => {
    try {
      console.log(`- ${varName}: ${import.meta.env[varName] || 'not set'}`);
    } catch (e) {
      console.log(`- ${varName}: error reading`);
    }
  });
}
