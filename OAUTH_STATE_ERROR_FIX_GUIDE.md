# OAuth State Error Resolution Guide

## Problem

Users are experiencing OAuth authentication failures with the error message:

```
http://localhost:3000/?error=invalid_request&error_code=bad_oauth_state&error_description=OAuth+callback+with+invalid+state
```

This error occurs when there's a mismatch between the OAuth state parameter sent during the initial authentication request and the state parameter received in the callback.

## Root Causes

The investigation revealed several potential causes:

1. **Port Mismatch**: The most common cause is when the OAuth flow starts on one port (e.g., 5173, 5174, 5175) but the callback comes to another port (3000). This happens because:
   - The Vite development server uses dynamic ports (5173, 5174, etc.)
   - OAuth provider callbacks are configured to use port 3000
   - The state parameter includes information about the originating port

2. **State Parameter Management**: Issues with storing and retrieving the state parameter:
   - State stored in localStorage or sessionStorage gets cleared or corrupted
   - Multiple browser tabs create conflicting state parameters
   - Browser extensions or privacy settings interfere with storage access

3. **Environment Configuration**: Inconsistent environment variables:
   - `VITE_REDIRECT_URL` not correctly set for development environment
   - Supabase project settings have incorrect redirect URLs

## Implemented Fixes

We've implemented the following solutions:

1. **Fixed Port for Development**: Created a script to ensure the app always runs on port 3000:
   - `run-auth-fixed-port.js` - Forces Vite to use port 3000
   - `fix-oauth-state-error.ps1` - PowerShell utility for Windows users

2. **Enhanced OAuth State Management**:
   - Added port information to the state parameter
   - Improved storage with redundancy (both localStorage and sessionStorage)
   - Added validation and fallbacks in the auth callback handler

3. **Better Error Handling and Diagnostics**:
   - Added the `oauth-error-diagnostics.ts` utility for troubleshooting
   - Enhanced error messages with more helpful suggestions
   - Created a browser-based OAuth reset tool at `/oauth-reset.html`

4. **Environment Configuration**:
   - Added `.env.development` with explicit REDIRECT_URL configuration
   - Updated the redirect URL detection logic to ensure consistency

## How to Fix (For Users)

### Option 1: Using the OAuth Reset Tool (Recommended)

1. Run the PowerShell script to start the app on port 3000 and set up the reset tool:
   ```powershell
   .\fix-oauth-state-error.ps1
   ```

2. Visit http://localhost:3000/oauth-reset.html in your browser
3. Follow the on-screen instructions to:
   - Clear OAuth state data
   - Verify your environment
   - Try authentication again

### Option 2: Manual Fix

1. Start the app on port 3000:
   ```powershell
   cd project
   npm run dev -- --port 3000
   ```

2. Open browser DevTools (F12)
3. Run this code in the console to clear OAuth state:
   ```javascript
   // Clear localStorage
   Object.keys(localStorage).forEach(key => {
     if(key.includes('supabase') || key.includes('oauth') || key.includes('auth')) {
       console.log('Removing from localStorage:', key);
       localStorage.removeItem(key);
     }
   });
   
   // Clear sessionStorage
   Object.keys(sessionStorage).forEach(key => {
     if(key.includes('supabase') || key.includes('oauth') || key.includes('auth')) {
       console.log('Removing from sessionStorage:', key);
       sessionStorage.removeItem(key);
     }
   });
   
   console.log('OAuth state cleared. You can now try logging in again.');
   ```

4. Navigate to http://localhost:3000/login and try again

### Option 3: Create Local Environment File

Create a `.env.local` file in the project directory with:
```
VITE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## Technical Details

### Modified Files

1. `src/context/AuthContext.tsx`:
   - Enhanced redirect URL detection
   - Improved state parameter handling with port information
   - Better error logging

2. `src/pages/AuthCallback.tsx`:
   - Enhanced state validation with better diagnostics
   - Added port-aware error handling
   - Integration with diagnostic utilities

3. `src/utils/oauth-error-diagnostics.ts`:
   - Created new utility for diagnosing OAuth errors
   - Provides detailed error analysis and suggestions

### OAuth State Flow

1. User clicks "Sign in with Google/GitHub"
2. We generate a secure state parameter with the current port information
3. State is stored in both localStorage and sessionStorage
4. User is redirected to OAuth provider (Google, GitHub)
5. Provider redirects back to our callback URL with state parameter
6. We validate the state parameter, checking for port mismatches
7. If validation succeeds, we exchange the authorization code for tokens
8. If validation fails, we provide helpful error messages

## For Developers

### Testing OAuth Authentication

1. Always run the app on port 3000 for consistent OAuth behavior
2. Use the diagnostic tools in `src/utils/oauth-error-diagnostics.ts`
3. Monitor the browser console for detailed OAuth flow logging

### Configuring OAuth Providers

1. Log in to the Supabase dashboard
2. Go to Authentication > Providers
3. Ensure redirect URLs include http://localhost:3000/auth/callback
4. Update production URLs as needed

## References

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/oauth)
- [OAuth 2.0 State Parameter](https://auth0.com/docs/secure/attack-protection/state-parameters)
- [Vite Development Server Configuration](https://vitejs.dev/config/server-options.html)
