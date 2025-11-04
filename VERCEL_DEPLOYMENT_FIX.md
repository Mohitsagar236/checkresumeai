# Vercel Deployment Fix - Blank Page Issue

## Problem
The website is deployed but showing a blank page because the environment variables are not configured in Vercel.

## Solution

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `checkresumeai` project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

#### Firebase Authentication Variables
```
VITE_FIREBASE_API_KEY=AIzaSyBDXzlvujTQSzLJ6_C00TghdNv8GuvKt-Q
VITE_FIREBASE_AUTH_DOMAIN=resumeai-8c61e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=resumeai-8c61e
```

#### Supabase Variables
```
VITE_SUPABASE_URL=https://rvmvahwyfptyhchlvtvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE
```

#### AI API Configuration
```
VITE_GROQ_API_KEY=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
VITE_USE_GROQ_API=true
VITE_OPENROUTER_API_KEY=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
```

#### Feature Flags
```
VITE_USE_MOCK_API=false
VITE_ENABLE_REAL_TIME_ANALYSIS=true
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_API_FALLBACKS=true
```

#### UPI Payment
```
VITE_UPI_ID=your-upi-id@paytm
```

**Important:** Make sure to set these variables for **Production**, **Preview**, and **Development** environments.

### Step 2: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click on the three dots (...) next to the latest deployment
3. Select **Redeploy**
4. Wait for the deployment to complete

### Step 3: Verify

1. Visit your site: https://checkresumeai.vercel.app
2. Open browser DevTools (F12)
3. Check the **Console** tab for any errors
4. Check the **Network** tab to ensure assets are loading

## Alternative: Deploy from Local

If you prefer to deploy from your local machine:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd d:\resumeai\checkresumeai\project
vercel --prod
```

## Common Issues

### Issue 1: Assets Not Loading
- **Cause:** Incorrect `base` path in `vite.config.ts`
- **Solution:** Ensure `base: '/'` in vite.config.ts (already set correctly)

### Issue 2: 404 Errors
- **Cause:** SPA routing not configured
- **Solution:** Already configured in `vercel.json` with catch-all route

### Issue 3: White Screen
- **Cause:** Missing environment variables
- **Solution:** Follow Step 1 above to add all required environment variables

## Verification Checklist

- [ ] All environment variables added to Vercel
- [ ] Build completes without errors
- [ ] Deployment shows "Ready" status
- [ ] Website loads without blank page
- [ ] No console errors in browser DevTools
- [ ] Assets load correctly (check Network tab)

## Need Help?

If the issue persists:
1. Check Vercel deployment logs for build errors
2. Verify all environment variables are set correctly
3. Make sure the build output directory is `frontend-build`
4. Ensure the framework is set to "Vite" in Vercel settings
