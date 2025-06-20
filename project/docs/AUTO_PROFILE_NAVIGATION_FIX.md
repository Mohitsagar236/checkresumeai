# Auto Profile Navigation Fix

## Issue
Users were automatically redirected to the profile section after successful login, which was not desired behavior. The user requested to remove this automatic navigation.

## Root Cause
The automatic navigation to the profile section was happening in the `AuthCallback.tsx` component, which handles OAuth authentication redirects (Google, GitHub login). After successful OAuth authentication, users were automatically navigated to `/profile`.

## Solution
Modified the `AuthCallback.tsx` component to redirect users to the home page (`/`) instead of the profile page (`/profile`) after successful OAuth authentication.

### Changed File
- `src/pages/AuthCallback.tsx`

### Specific Change
```typescript
// Before (line 18)
if (session) {
  navigate('/profile');
} else {
  navigate('/login');
}

// After (line 18)
if (session) {
  navigate('/');
} else {
  navigate('/login');
}
```

## Verification
✅ Regular email/password login: Only closes modal, no automatic navigation  
✅ Signup: Only closes modal, no automatic navigation  
✅ OAuth login (Google/GitHub): Now redirects to home page instead of profile  

## User Experience Impact
- Users will land on the home page after login instead of being forced to the profile section
- Users can now choose where to navigate after authentication
- Maintains consistent behavior across all login methods
- Profile page is still accessible via navigation menu when needed

## Files Modified
1. `src/pages/AuthCallback.tsx` - Changed OAuth redirect destination from `/profile` to `/`

## Testing
After this fix, users should:
1. Be able to login via any method (email/password, OAuth)
2. Land on the home page after successful authentication
3. Have the choice to navigate to profile or any other section manually
4. Not experience any unwanted automatic redirects

## Related Issues
This fix addresses the user's request to remove automatic navigation to profile section after login while maintaining all authentication functionality.
