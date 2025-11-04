# Deploying CheckResumeAI to Vercel

## Quick Deployment Guide

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account
   - Click **"New Project"**
   - Import your GitHub repository

3. **Configure Build Settings**
   Vercel will auto-detect the configuration from `vercel.json`:
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `frontend-build`
   - **Install Command:** `npm install`

4. **Add Environment Variables** (Optional)
   - Go to **Project Settings** → **Environment Variables**
   - Add these variables based on your needs:
     - `VITE_USE_MOCK_API=true` (recommended for initial deployment)
     - `VITE_USE_GEMINI_API=false`
     - Add other API keys only if you need real AI functionality

5. **Deploy**
   - Click **Deploy**
   - Wait for the build to complete
   - Your app will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables Configuration

The app works in **Mock API Mode** by default, which means it will function without any API keys. For full functionality, you can add these environment variables in the Vercel dashboard:

### Essential (for basic demo):
```
VITE_USE_MOCK_API=true
```

### Optional (for real AI analysis):
```
VITE_USE_GEMINI_API=true
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional (for user authentication):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional (for premium features):
```
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## Important Notes

1. **Mock API Mode**: The application will work perfectly fine with mock data. This is ideal for:
   - Testing the UI/UX
   - Demonstrating features
   - Development purposes

2. **Client-Side Routing**: The `vercel.json` file includes rewrites to support React Router navigation. All routes will work correctly.

3. **Build Output**: The build outputs to `frontend-build` directory as configured in `vite.config.ts`.

4. **Caching**: Static assets in `/assets/` are cached for 1 year for optimal performance.

## Troubleshooting

### Build Fails
- Make sure `npm run build` works locally first
- Check that all dependencies are in `dependencies` (not `devDependencies`)
- Vite and @vitejs/plugin-react are already in `dependencies` ✓

### Routes Return 404
- This should be fixed by the `vercel.json` rewrites configuration ✓

### Environment Variables Not Working
- Make sure they start with `VITE_` prefix
- Redeploy after adding new environment variables

## Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Automatic Deployments

Once connected to GitHub:
- **Push to main branch** → Deploys to production
- **Pull requests** → Creates preview deployments
- Every commit gets its own preview URL

## What's Included

✅ Optimized Vite build with code splitting
✅ React Router support with client-side navigation  
✅ Tailwind CSS with production purging
✅ PDF.js worker files configured
✅ Mock API mode for instant demo
✅ Optimized caching headers
✅ Light mode as default theme

## Support

For issues specific to Vercel deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
