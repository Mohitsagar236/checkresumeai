# Railway Deployment Instructions for CheckResumeAI

This document provides step-by-step instructions for deploying CheckResumeAI to Railway.

## Prerequisites

1. A [Railway](https://railway.app/) account
2. The Railway CLI installed (optional, for advanced usage)

   ```bash
   npm i -g @railway/cli
   ```

## Deployment Steps

### 1. Set Up a New Project in Railway

1. Log in to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select the GitHub repository: `https://github.com/Mohitsagar236/www.checkresumeai.com.git`
4. Choose the branch to deploy (usually `main` or `master`)

### 2. Configure Environment Variables

Add the following environment variables in the Railway dashboard:

- `NODE_ENV`: `production`
- `PORT`: `5000` (Railway will handle port mapping)
- `API_VERSION`: `v1`
- Any other necessary environment variables for your application:
  - Supabase configuration
  - API keys
  - Authentication secrets
  - Database URLs

### 3. Deploy the Application

1. Railway will automatically deploy your application based on the configuration files
2. The deployment uses Nixpacks as the builder
3. Railway will use the health check endpoint at `/api/health` to verify deployment success

### 4. Monitoring and Troubleshooting

1. Check the deployment logs in the Railway dashboard
2. Monitor the application's health and performance
3. If you encounter issues, check:
   - Environment variables are properly set
   - Build logs for any errors
   - The health check endpoint is returning a 200 status code

### 5. Custom Domain Setup (Optional)

1. In the Railway dashboard, go to Settings → Domains
2. Add your custom domain (e.g., `checkresumeai.com`)
3. Configure DNS settings as instructed by Railway
4. Wait for DNS propagation and SSL certificate generation

## Deployment Files

The following files are used for Railway deployment:

1. `railway.json`: Primary Railway configuration
2. `nixpacks.toml`: Nixpacks build configuration
3. `Procfile`: Process type definitions
4. `.nixpacks`: Legacy Nixpacks configuration file

## Support

If you encounter any issues with deployment, please contact:

- Railway Support: [https://railway.app/support](https://railway.app/support)
- Repository Maintainer: [mohitsagar236@gmail.com](mailto:mohitsagar236@gmail.com)
