# Fixing OAuth Authentication Issues

This guide helps you resolve the "bad_oauth_state" error that occurs during authentication with OAuth providers like Google or GitHub.

## Common Error

```
http://localhost:3000/?error=invalid_request&error_code=bad_oauth_state&error_description=OAuth+callback+with+invalid+state
```

## Cause

This error occurs when there's a mismatch between:
1. The port where the OAuth flow was initiated (e.g., 5173, 5174, 5175)
2. The port where the callback is received (usually 3000)

## Solution

### Option 1: Use the Fixed Port Script (Recommended)

Run the application on port 3000 to match the expected callback URL:

```bash
node run-auth-fixed-port.js
```

This will start the development server on port 3000, ensuring that the redirect URL matches the callback.

### Option 2: Clear OAuth State and Try Again

1. Open the browser console (F12 or right-click > Inspect > Console)
2. Use our cleanup script:

```javascript
// Option 1: Run directly in console
const keys1 = [];
for(let i=0; i<localStorage.length; i++) {
  const k = localStorage.key(i);
  if(k && (k.includes('supabase') || k.includes('auth'))) {
    keys1.push(k);
    localStorage.removeItem(k);
  }
}
const keys2 = [];
for(let i=0; i<sessionStorage.length; i++) {
  const k = sessionStorage.key(i);
  if(k && (k.includes('supabase') || k.includes('auth'))) {
    keys2.push(k);
    sessionStorage.removeItem(k);
  }
}
console.log('Cleared keys:', {localStorage: keys1, sessionStorage: keys2});

// Option 2: Import and run our utility
import('../src/utils/reset-oauth-state.js').then(module => {
  console.log('OAuth state reset complete');
});
```

3. Reload the page and try signing in again

### Option 3: Configure Environment Variables

Create a `.env.local` file in the project directory with:

```
VITE_REDIRECT_URL=http://localhost:3000/auth/callback
```

This ensures the OAuth redirect URL uses the correct port.

## Still Having Issues?

1. Check Supabase dashboard to ensure your OAuth provider configuration has the correct redirect URL
2. Try using a private/incognito browser window
3. Clear all browser cookies and storage for your site
4. Check for any browser extensions that might interfere with OAuth flows

## Additional Resources

- The `oauth-error-diagnostics.ts` utility provides advanced diagnostic tools
- See `AuthContext.tsx` and `AuthCallback.tsx` for the implementation details
