# Build frontend and deploy to S3 + invalidate CloudFront
param(
  [string]$Region = $env:AWS_REGION,
  [string]$Bucket = $env:S3_BUCKET,
  [string]$DistributionId = $env:CLOUDFRONT_DISTRIBUTION_ID
)

if (-not $Region -or -not $Bucket) {
  Write-Error "Please set AWS_REGION and S3_BUCKET environment variables or pass -Region and -Bucket."
  exit 1
}

Push-Location "$PSScriptRoot\..\.." # project root

# Install deps and build
npm ci
npm run build

# Upload to S3
aws s3 sync ./frontend-build s3://$Bucket/ --region $Region --delete --cache-control "public, max-age=31536000" --exclude "index.html"
aws s3 cp ./frontend-build/index.html s3://$Bucket/index.html --region $Region --cache-control "no-cache, no-store, must-revalidate" --content-type "text/html"

# Invalidate CloudFront (optional)
if ($DistributionId) {
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/index.html" "/assets/*"
}

Pop-Location
