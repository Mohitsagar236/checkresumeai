# Firebase Authentication Migration Guide

This document guides you through migrating from Supabase Authentication to Firebase Authentication.

## Overview

The application now uses:
- **Firebase** - For user authentication (sign in, sign up, OAuth)
- **Supabase** - For database and storage (profiles, resumes, payments, file uploads)

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - Email/Password
   - Google (for OAuth)
   - GitHub (for OAuth)
3. For Google OAuth:
   - Add your domain to authorized domains
   - Configure OAuth consent screen in Google Cloud Console
4. For GitHub OAuth:
   - Create a GitHub OAuth App in GitHub Settings
   - Add Client ID and Secret to Firebase

### 3. Get Firebase Configuration

#### Frontend Configuration (.env)

1. In Firebase Console, go to **Project Settings** > **General**
2. Under "Your apps", click the Web icon (</>)
3. Register your app and copy the config
4. Update `d:\resumeai\checkresumeai\project\.env`:

```properties
# Firebase Authentication (Primary)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

#### Backend Configuration (backend/.env)

1. In Firebase Console, go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Update `d:\resumeai\checkresumeai\project\backend\.env`:

```properties
# Firebase Configuration (for authentication)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Note:** For the FIREBASE_PRIVATE_KEY, copy the `private_key` from the JSON file. Keep the quotes and newlines as `\n`.

### 4. Install Firebase Admin SDK (Backend)

```bash
cd backend
npm install firebase-admin
```

### 5. Update Authorized Domains

#### Firebase
1. Go to Firebase Console > **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain

#### Google Cloud Console (for Google OAuth)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add Authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)

## Code Changes

### Frontend Changes

1. **firebaseClient.ts** - Updated to include OAuth support (Google, GitHub)
2. **AuthContext.tsx** - Now uses Firebase for all auth operations
3. **authContextDefs.tsx** - Type definitions updated to use Firebase User type
4. **.env** - Added Firebase configuration variables

### Backend Changes

1. **backend/.env** - Added Firebase Admin SDK configuration
2. **middleware/auth.ts** - Will be updated to verify Firebase ID tokens
3. **routes/auth.ts** - Updated to work with Firebase authentication

## Authentication Flow

### Email/Password Authentication

1. User enters email and password
2. Frontend calls Firebase Auth `signInWithEmailAndPassword`
3. Firebase returns a User object with ID token
4. Frontend stores user in AuthContext
5. Backend verifies ID token using Firebase Admin SDK
6. Profile is created/updated in Supabase database

### OAuth Authentication (Google/GitHub)

1. User clicks "Sign in with Google/GitHub"
2. Frontend calls Firebase Auth with selected provider
3. On mobile: Redirect flow (user is redirected to provider and back)
4. On desktop: Popup flow (provider opens in popup window)
5. Firebase handles the OAuth flow and returns User object
6. Frontend stores user in AuthContext
7. Profile is created/updated in Supabase database

## Testing

### 1. Test Email/Password Sign Up
```bash
npm run dev
```
- Go to signup page
- Create a new account with email/password
- Verify user is created in Firebase Console > Authentication

### 2. Test Email/Password Sign In
- Go to login page
- Sign in with the account you created
- Verify you're logged in

### 3. Test Google OAuth
- Go to login page
- Click "Sign in with Google"
- Complete Google authentication
- Verify you're logged in

### 4. Test GitHub OAuth
- Go to login page
- Click "Sign in with GitHub"
- Complete GitHub authentication
- Verify you're logged in

## Data Migration

If you have existing users in Supabase Auth, you'll need to migrate them to Firebase:

### Option 1: User Re-registration
- Simplest approach for small user bases
- Users create new accounts in Firebase
- Link to existing Supabase profiles using email matching

### Option 2: Export/Import
1. Export users from Supabase
2. Use Firebase Auth Import feature
3. Map Supabase user IDs to Firebase UIDs in your database

### Updating Profiles Table

The profiles table in Supabase continues to work, but user IDs now come from Firebase:

```sql
-- Your existing profiles table
-- The 'id' column now stores Firebase UIDs instead of Supabase UUIDs
SELECT * FROM profiles;
```

## Security Considerations

1. **Firebase Security Rules**: Set up proper security rules for Firebase services if you use Firestore or Storage
2. **API Key Protection**: Firebase API keys are safe to expose in frontend code (they're not secret)
3. **Service Account**: Keep your Firebase service account JSON file secure, never commit to version control
4. **CORS**: Ensure your backend CORS settings allow requests from your frontend domain
5. **Token Verification**: Always verify Firebase ID tokens on the backend before trusting user identity

## Troubleshooting

### Firebase Module Not Found
```bash
npm install firebase
```

### Invalid API Key
- Verify VITE_FIREBASE_API_KEY in .env matches Firebase Console
- Restart dev server after changing .env

### OAuth Popup Blocked
- Check browser popup blocker settings
- Use redirect flow on mobile devices

### Private Key Error
- Ensure FIREBASE_PRIVATE_KEY includes quotes and `\n` for newlines
- Copy directly from service account JSON file

### User Not Found in Database
- Check createUserProfile function in AuthContext.tsx
- Verify Supabase connection is working
- Check browser console for errors

## Rollback Plan

If you need to rollback to Supabase Auth:

1. Restore previous version of:
   - `src/context/AuthContext.tsx`
   - `src/context/authContextDefs.tsx`
   - `src/utils/firebaseClient.ts`
2. Remove Firebase environment variables
3. Restore Supabase auth environment variables
4. Restart servers

## Support

For issues:
1. Check Firebase Console > Authentication for error logs
2. Check browser console for client-side errors
3. Check backend logs for server-side errors
4. Review Firebase documentation: https://firebase.google.com/docs/auth

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Supabase Documentation](https://supabase.com/docs)
