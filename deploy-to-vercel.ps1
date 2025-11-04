# Deploy to Vercel with Environment Variables
# Run this script to deploy your application to Vercel

Write-Host "🚀 Deploying CheckResumeAI to Vercel..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the application first
Write-Host "📦 Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Cyan
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
        Write-Host "🎉 Your website is now live!" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed. Please check the logs above." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed. Please fix the errors above." -ForegroundColor Red
}
