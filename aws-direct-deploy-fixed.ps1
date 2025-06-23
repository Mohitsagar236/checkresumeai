# Simple AWS Deployment Script - Handles Common Issues
# Uses AWS CLI directly, avoiding common errors

# Check AWS credentials
$ErrorActionPreference = "Stop"

Write-Host "AWS Deployment Quick Fix" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Verify AWS credentials
Write-Host "Verifying AWS credentials..." -ForegroundColor Yellow
try {
    $caller = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        $accountId = ($caller | ConvertFrom-Json).Account
        Write-Host "AWS credentials are valid. Account ID: $accountId" -ForegroundColor Green
    } else {
        Write-Host "AWS credentials are invalid or expired." -ForegroundColor Red
        Write-Host "Please run: aws configure" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Error checking AWS credentials. Please run: aws configure" -ForegroundColor Red
    exit 1
}

# Get AWS region
$region = aws configure get region
if (-not $region) { 
    $region = "ap-south-1" 
    Write-Host "No region configured. Using ap-south-1 as default." -ForegroundColor Yellow
} else {
    Write-Host "Using region: $region" -ForegroundColor Green
}

# Menu options
Write-Host "`nWhat would you like to do?" -ForegroundColor Yellow
Write-Host "1. Initialize AWS infrastructure (S3 bucket for private storage)" -ForegroundColor White
Write-Host "2. Deploy application to existing infrastructure" -ForegroundColor White
Write-Host "3. Both initialize and deploy" -ForegroundColor White
$option = Read-Host "Select an option (1-3)"

# Initialize infrastructure function
function Initialize-AWS-Infrastructure {
    # Create S3 bucket for private storage (avoids public policy issues)
    Write-Host "`nCreating S3 bucket for storage..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $bucketName = "checkresumeai-storage-$timestamp"
    
    aws s3 mb "s3://$bucketName" --region $region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create S3 bucket. Check AWS CLI configuration." -ForegroundColor Red
        return $false
    }
    
    Write-Host "S3 bucket created: $bucketName" -ForegroundColor Green
    
    # Create folder structure that respects Block Public Access settings
    Write-Host "Creating folder structure in S3..." -ForegroundColor Yellow
    aws s3api put-object --bucket $bucketName --key "data/" | Out-Null
    aws s3api put-object --bucket $bucketName --key "uploads/" | Out-Null
    aws s3api put-object --bucket $bucketName --key "reports/" | Out-Null
    
    # Set basic CORS configuration
    $cors = @"
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}
"@
    
    $corsFile = "s3-cors.json"
    $cors | Out-File -FilePath $corsFile -Encoding ascii
    
    Write-Host "Setting CORS configuration on bucket..." -ForegroundColor Yellow
    aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://$corsFile
    Remove-Item $corsFile
    
    # Store bucket name in environment file for deployment
    $envContent = "S3_BUCKET=$bucketName"
    $envFile = ".env.aws"
    $envContent | Out-File -FilePath $envFile -Encoding ascii
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
    Write-Host "S3 bucket name ($bucketName) saved to .env.aws file" -ForegroundColor Green
    
    return $true
}

# Deploy application function
function Deploy-Application {
    # Check if we have environment file
    $envFile = ".env.aws"
    $s3Bucket = $null
    
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile
        foreach ($line in $envContent) {
            if ($line -match "S3_BUCKET=(.*)") {
                $s3Bucket = $matches[1]
                Write-Host "Found S3 bucket: $s3Bucket" -ForegroundColor Green
                break
            }
        }
    }
    
    if (-not $s3Bucket) {
        Write-Host "No S3 bucket found in .env.aws file. Please initialize infrastructure first." -ForegroundColor Yellow
        return $false
    }
    
    # Prepare application package
    Write-Host "`nPreparing application package..." -ForegroundColor Yellow
    
    # Create a build directory
    $buildDir = "deploy-build"
    if (Test-Path $buildDir) {
        Remove-Item -Path $buildDir -Recurse -Force
    }
    New-Item -Path $buildDir -ItemType Directory | Out-Null
    
    # Copy project files
    if (Test-Path "project") {
        Write-Host "Copying project files..." -ForegroundColor Yellow
        Copy-Item -Path "project\*" -Destination $buildDir -Recurse -Exclude "node_modules", ".git"
    } else {
        Write-Host "No 'project' directory found. Copying all files..." -ForegroundColor Yellow
        Get-ChildItem -Path "." -Exclude "node_modules", ".git", $buildDir | Copy-Item -Destination $buildDir -Recurse
    }
    
    # Add environment variable configuration
    $ebExtDir = "$buildDir\.ebextensions"
    if (-not (Test-Path $ebExtDir)) {
        New-Item -Path $ebExtDir -ItemType Directory | Out-Null
    }
    
    $envConfig = @"
option_settings:
  aws:elasticbeanstalk:application:environment:
    S3_BUCKET: $s3Bucket
    NODE_ENV: production
"@
    
    $envConfig | Out-File -FilePath "$ebExtDir\env.config" -Encoding ascii
    
    # Create package.json if it doesn't exist
    if (-not (Test-Path "$buildDir\package.json")) {
        Write-Host "Creating basic package.json..." -ForegroundColor Yellow
        $packageJson = @"
{
  "name": "checkresumeai",
  "version": "1.0.0",
  "description": "AI-Powered Resume Analyzer",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": "18.x"
  }
}
"@
        $packageJson | Out-File -FilePath "$buildDir\package.json" -Encoding ascii
    }
    
    # Create simple server if it doesn't exist
    if (-not (Test-Path "$buildDir\index.js")) {
        Write-Host "Creating basic server file..." -ForegroundColor Yellow
        $serverJs = @"
const http = require('http');

const port = process.env.PORT || 3000;
const s3Bucket = process.env.S3_BUCKET || 'not-configured';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CheckResumeAI</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #4a86e8; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>CheckResumeAI</h1>
          <p>AI-Powered Resume Analyzer</p>
          <p>Server is running successfully!</p>
          <p>S3 Bucket: ${s3Bucket}</p>
          <p>Node Environment: ${process.env.NODE_ENV || 'development'}</p>
          <p>Server Time: ${new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`S3 Bucket: ${s3Bucket}`);
});
"@
        $serverJs | Out-File -FilePath "$buildDir\index.js" -Encoding ascii
    }
    
    # Create Procfile
    "web: npm start" | Out-File -FilePath "$buildDir\Procfile" -Encoding ascii
    
    # Create .npmrc to avoid permission issues
    "unsafe-perm=true" | Out-File -FilePath "$buildDir\.npmrc" -Encoding ascii
    
    # Create deployment package
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $appName = "CheckResumeAI"
    $versionLabel = "app-$timestamp"
    $zipFile = "$versionLabel.zip"
    
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Get the account ID for S3 bucket name
    $accountId = ($caller | ConvertFrom-Json).Account
    $ebS3Bucket = "elasticbeanstalk-$region-$accountId"
    
    # Check if the EB S3 bucket exists, create if not
    $bucketExists = $false
    try {
        aws s3api head-bucket --bucket $ebS3Bucket 2>&1 | Out-Null
        $bucketExists = ($LASTEXITCODE -eq 0)
    } catch {}
    
    if (-not $bucketExists) {
        Write-Host "Creating Elastic Beanstalk S3 bucket: $ebS3Bucket..." -ForegroundColor Yellow
        aws s3 mb "s3://$ebS3Bucket" --region $region
    }
    
    # Upload to S3
    Write-Host "Uploading application to S3..." -ForegroundColor Yellow
    aws s3 cp $zipFile "s3://$ebS3Bucket/$zipFile"
    
    # Check if application exists
    $appExists = $false
    try {
        aws elasticbeanstalk describe-applications --application-name $appName | Out-Null
        $appExists = ($LASTEXITCODE -eq 0)
    } catch {}
    
    if (-not $appExists) {
        Write-Host "Creating Elastic Beanstalk application..." -ForegroundColor Yellow
        aws elasticbeanstalk create-application --application-name $appName --description "CheckResumeAI Application"
    }
    
    # Create new application version
    Write-Host "Creating new application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version `
        --application-name $appName `
        --version-label $versionLabel `
        --source-bundle S3Bucket=$ebS3Bucket,S3Key=$zipFile `
        --auto-create-application
    
    # Check if environment exists
    $envExists = $false
    $envName = "CheckResumeAI-env"
    
    try {
        $env = aws elasticbeanstalk describe-environments --application-name $appName --environment-names $envName --query "Environments[0].Status" --output text
        $envExists = ($env -ne "null" -and $LASTEXITCODE -eq 0)
    } catch {}
    
    if ($envExists) {
        Write-Host "Updating existing environment..." -ForegroundColor Yellow
        aws elasticbeanstalk update-environment `
            --application-name $appName `
            --environment-name $envName `
            --version-label $versionLabel
    } else {
        Write-Host "Creating new environment..." -ForegroundColor Yellow
        aws elasticbeanstalk create-environment `
            --application-name $appName `
            --environment-name $envName `
            --solution-stack-name "64bit Amazon Linux 2 v5.8.0 running Node.js 18" `
            --version-label $versionLabel `
            --option-settings `
                "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t2.micro" `
                "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
                "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$s3Bucket" `
                "Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production"
    }
    
    # Clean up
    Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
    Remove-Item -Path $zipFile -Force
    Remove-Item -Path $buildDir -Recurse -Force
    
    # Check deployment status
    Write-Host "Deployment initiated. Checking status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    try {
        $envStatus = aws elasticbeanstalk describe-environments `
            --application-name $appName `
            --environment-names $envName `
            --query "Environments[0].[Status,CNAME]" `
            --output text
        
        $status = $envStatus.Split()[0]
        $url = $envStatus.Split()[1]
        
        Write-Host "Environment status: $status" -ForegroundColor Yellow
        if ($url) {
            Write-Host "Application URL: http://$url" -ForegroundColor Green
            Write-Host "Note: It may take a few minutes for the application to become available." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Could not retrieve environment status." -ForegroundColor Yellow
    }
    
    return $true
}

# Execute selected operation
switch ($option) {
    "1" {
        $result = Initialize-AWS-Infrastructure
        Write-Host "Infrastructure initialization completed: $result" -ForegroundColor Cyan
    }
    "2" {
        $result = Deploy-Application
        Write-Host "Application deployment completed: $result" -ForegroundColor Cyan
    }
    "3" {
        $initResult = Initialize-AWS-Infrastructure
        if ($initResult) {
            Write-Host "Proceeding to deploy application..." -ForegroundColor Cyan
            $deployResult = Deploy-Application
            Write-Host "Deployment completed: $deployResult" -ForegroundColor Cyan
        }
    }
    default {
        Write-Host "Invalid option selected." -ForegroundColor Red
    }
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
