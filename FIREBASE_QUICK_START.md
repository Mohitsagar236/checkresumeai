# Quick Start: Firebase Authentication Setup

## Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name (e.g., "checkresumeai")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication (2 minutes)

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these providers:
   - **Email/Password** - Click, toggle "Enable", Save
   - **Google** - Click, toggle "Enable", Save
   - **GitHub** - Click, toggle "Enable", add Client ID/Secret from GitHub OAuth App, Save

## Step 3: Get Frontend Credentials (2 minutes)

1. Click ⚙️ icon > "Project settings"
2. Scroll to "Your apps" section
3. Click "</>" (Web platform icon)
4. Register app with nickname "checkresumeai-web"
5. Copy the `firebaseConfig` values
6. Update `d:\resumeai\checkresumeai\project\.env`:

```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## Step 4: Get Backend Credentials (3 minutes)

1. Still in Project settings, go to "Service accounts" tab
2. Click "Generate new private key"
3. Click "Generate key" (downloads JSON file)
4. Open the JSON file and copy:
   - `project_id`
   - `client_email`
   - `private_key` (entire value including `\n`)
5. Update `d:\resumeai\checkresumeai\project\backend\.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the quotes and `\n` characters in FIREBASE_PRIVATE_KEY!

## Step 5: Configure GitHub OAuth (if using) (5 minutes)

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: CheckResumeAI
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `https://your-project-id.firebaseapp.com/__/auth/handler`
4. Click "Register application"
5. Copy Client ID and generate Client Secret
6. Paste them in Firebase Console > Authentication > Sign-in method > GitHub

## Step 6: Test It! (2 minutes)

```bash
# Terminal 1: Start frontend
cd d:\resumeai\checkresumeai\project
npm run dev

# Terminal 2: Start backend
cd d:\resumeai\checkresumeai\project\backend
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google
- ✅ Sign in with GitHub

## Common Issues

### "Module 'firebase/auth' not found"
```bash
npm install firebase
```

### "Firebase Admin SDK not initialized"
- Check backend/.env has all three Firebase variables
- Restart backend server

### Google OAuth doesn't work
- Add `localhost` to Authorized domains in Firebase Console > Authentication > Settings
- Add redirect URI to Google Cloud Console

### GitHub OAuth doesn't work
- Verify callback URL in GitHub OAuth app settings
- Check Client ID and Secret in Firebase Console

## That's It!

You're now using Firebase for authentication instead of Supabase! 🎉

For detailed information, see:
- `FIREBASE_MIGRATION.md` - Full migration guide
- `FIREBASE_MIGRATION_SUMMARY.md` - Technical summary
