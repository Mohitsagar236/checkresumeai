@echo off
REM Railway Deployment Script - CheckResumeAI (Windows)
REM This script prepares and deploys the project to Railway using Nixpacks

echo 🚀 CheckResumeAI - Railway Deployment with Nixpacks
echo ==================================================

REM Check if we're in the right directory
if not exist "nixpacks.toml" (
    echo ❌ Error: nixpacks.toml not found. Please run this script from the project root.
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not a git repository. Please initialize git first.
    exit /b 1
)

echo 📋 Pre-deployment checks...

REM Check configurations
echo ✅ Nixpacks configuration found

if exist "railway.toml" (
    echo ✅ Railway configuration found
) else (
    echo ⚠️  Warning: railway.toml not found (optional)
)

REM Check package.json for build script
findstr /C:"\"build\":" package.json >nul
if %errorlevel% equ 0 (
    echo ✅ Build script found in package.json
) else (
    echo ❌ Error: Build script not found in package.json
    exit /b 1
)

REM Add all changes
echo 📝 Adding changes to git...
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo 💾 Committing changes...
    git commit -m "Deploy: Railway Nixpacks deployment ready"
) else (
    echo ℹ️  No changes to commit
)

REM Deploy to Railway
echo 🚀 Deploying to Railway...
echo    - Using Nixpacks builder
echo    - Node.js 20 environment
echo    - Automatic build and deployment

git push origin main

echo.
echo 🎉 Deployment initiated!
echo 📊 Monitor your deployment at: https://railway.app/
echo 🔍 Check build logs in Railway dashboard
echo ⚡ Your app will be available at your Railway domain
echo.
echo Next steps:
echo 1. Monitor the build in Railway dashboard
echo 2. Set environment variables if needed
echo 3. Test your deployed application
echo.
echo Happy deploying! 🚂

pause
