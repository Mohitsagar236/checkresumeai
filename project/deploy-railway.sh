#!/bin/bash

# Railway Deployment Script - CheckResumeAI
# This script prepares and deploys the project to Railway using Nixpacks

echo "🚀 CheckResumeAI - Railway Deployment with Nixpacks"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "nixpacks.toml" ]; then
    echo "❌ Error: nixpacks.toml not found. Please run this script from the project root."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please initialize git first."
    exit 1
fi

echo "📋 Pre-deployment checks..."

# Check if nixpacks.toml is configured correctly
echo "✅ Nixpacks configuration found"

# Check if railway.toml exists
if [ -f "railway.toml" ]; then
    echo "✅ Railway configuration found"
else
    echo "⚠️  Warning: railway.toml not found (optional)"
fi

# Check if package.json has the required scripts
if grep -q "\"build\":" package.json; then
    echo "✅ Build script found in package.json"
else
    echo "❌ Error: Build script not found in package.json"
    exit 1
fi

# Add all changes
echo "📝 Adding changes to git..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy: Railway Nixpacks deployment ready"
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
echo "   - Using Nixpacks builder"
echo "   - Node.js 20 environment"
echo "   - Automatic build and deployment"

git push origin main

echo ""
echo "🎉 Deployment initiated!"
echo "📊 Monitor your deployment at: https://railway.app/"
echo "🔍 Check build logs in Railway dashboard"
echo "⚡ Your app will be available at your Railway domain"
echo ""
echo "Next steps:"
echo "1. Monitor the build in Railway dashboard"
echo "2. Set environment variables if needed"
echo "3. Test your deployed application"
echo ""
echo "Happy deploying! 🚂"
