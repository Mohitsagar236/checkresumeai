# Simple AWS Deployment Script - No EB CLI Required
# This script uses only AWS CLI to deploy your application to AWS

Write-Host "CheckResumeAI - AWS Simple Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Verify AWS CLI works
try {
    $awsVersion = aws --version
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI not found in PATH. Adding it now..." -ForegroundColor Yellow
    $env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path
    
    try {
        $awsVersion = aws --version
        Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
    } catch {
        Write-Host "AWS CLI not found. Please install it first." -ForegroundColor Red
        exit 1
    }
}

# Verify AWS credentials
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity 2>$null
    if ($?) {
        $identityJson = $identity | ConvertFrom-Json
        Write-Host "AWS credentials are valid!" -ForegroundColor Green
        Write-Host "Account: $($identityJson.Account)" -ForegroundColor Green
        Write-Host "User: $($identityJson.Arn)" -ForegroundColor Green
    } else {
        Write-Host "Invalid AWS credentials. Please run 'aws configure' first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Invalid AWS credentials. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Set region
$region = aws configure get region
if (-not $region) {
    $region = "ap-south-1"
}
Write-Host "Using AWS region: $region" -ForegroundColor Yellow

# App name
$appName = "CheckResumeAI"

# Create S3 bucket
Write-Host "`nCreating S3 bucket for storage..." -ForegroundColor Yellow
$random = Get-Random
$bucketName = "checkresumeai-storage-$random"
aws s3 mb "s3://$bucketName" --region $region

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create S3 bucket. Check your permissions." -ForegroundColor Red
    exit 1
}

Write-Host "S3 bucket created: $bucketName" -ForegroundColor Green

# Set bucket policy for public access to reports folder
$policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForReportsAndPublicFiles",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucketName/public/*"
        }
    ]
}
"@
$policyFile = "s3-policy.json"
$policy | Out-File -FilePath $policyFile -Encoding ascii
aws s3api put-bucket-policy --bucket $bucketName --policy file://$policyFile
Remove-Item $policyFile

# Set CORS configuration
$cors = @"
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
"@
$corsFile = "s3-cors.json"
$cors | Out-File -FilePath $corsFile -Encoding ascii
aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://$corsFile
Remove-Item $corsFile

Write-Host "S3 bucket configured successfully." -ForegroundColor Green

# Check if Elastic Beanstalk application exists
Write-Host "`nChecking for existing Elastic Beanstalk application..." -ForegroundColor Yellow
$ebApplications = aws elasticbeanstalk describe-applications --application-names $appName --query "Applications" --output json
$ebApplicationsJson = $ebApplications | ConvertFrom-Json

if ($ebApplicationsJson.Count -eq 0) {
    Write-Host "Creating new Elastic Beanstalk application: $appName" -ForegroundColor Yellow
    aws elasticbeanstalk create-application --application-name $appName --tags Key=platform,Value="Node.js 18"
} else {
    Write-Host "Elastic Beanstalk application $appName already exists." -ForegroundColor Green
}

# Create environment config file
Write-Host "Creating Elastic Beanstalk configuration..." -ForegroundColor Yellow

$ebDir = ".elasticbeanstalk"
if (-not (Test-Path $ebDir)) {
    New-Item -Path $ebDir -ItemType Directory | Out-Null
}

$configContent = @"
branch-defaults:
  main:
    environment: $appName-env
    group_suffix: null
global:
  application_name: $appName
  branch: null
  default_ec2_keyname: null
  default_platform: Node.js 18
  default_region: $region
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: null
  workspace_type: Application
  S3_BUCKET: $bucketName
"@

Set-Content -Path "$ebDir\config.yml" -Value $configContent

Write-Host "Elasticbeanstalk configuration created successfully." -ForegroundColor Green

# Check if environment exists
Write-Host "`nChecking for existing Elastic Beanstalk environments..." -ForegroundColor Yellow
$envName = "$appName-env"
$ebEnvironments = aws elasticbeanstalk describe-environments --application-name $appName --environment-names $envName --query "Environments" --output json
$ebEnvironmentsJson = $ebEnvironments | ConvertFrom-Json

if ($ebEnvironmentsJson.Count -eq 0) {
    # Create environment
    Write-Host "Creating Elastic Beanstalk environment: $envName" -ForegroundColor Yellow
    Write-Host "This process will take several minutes..." -ForegroundColor Yellow
    
    $solutionStackName = "64bit Amazon Linux 2 v5.8.0 running Node.js 18"
    aws elasticbeanstalk create-environment `
        --application-name $appName `
        --environment-name $envName `
        --solution-stack-name $solutionStackName `
        --option-settings `
            "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t2.micro" `
            "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
            "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$bucketName"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create environment. Check AWS Console for details." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Environment creation initiated!" -ForegroundColor Green
} else {
    Write-Host "Elastic Beanstalk environment $envName already exists." -ForegroundColor Green
    
    # Update environment with new S3 bucket
    Write-Host "Updating environment configuration..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --environment-name $envName `
        --option-settings `
            "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$bucketName"
}

# Ask if user wants to deploy application
$deployApp = Read-Host "Do you want to deploy your application now? (Y/N)"
if ($deployApp -eq "Y" -or $deployApp -eq "y") {
    # Create build directory
    Write-Host "`nPreparing application package..." -ForegroundColor Yellow
    $buildDir = "eb-build-temp"
    if (Test-Path $buildDir) {
        Remove-Item -Path $buildDir -Recurse -Force
    }
    New-Item -Path $buildDir -ItemType Directory | Out-Null
    
    # Copy necessary files to the build directory
    if (Test-Path "project\backend") {
        Write-Host "Copying backend files..." -ForegroundColor Yellow
        Copy-Item -Path "project\backend\*" -Destination $buildDir -Recurse
    } else {
        # Try to find source files
        Write-Host "Looking for source files..." -ForegroundColor Yellow
        if (Test-Path "project") {
            Copy-Item -Path "project\*" -Destination $buildDir -Recurse -Exclude node_modules
        } elseif (Test-Path "src") {
            Copy-Item -Path "src\*" -Destination $buildDir -Recurse -Exclude node_modules
        } else {
            # Copy from current directory
            Copy-Item -Path "*" -Destination $buildDir -Recurse -Exclude node_modules, .git, .elasticbeanstalk, eb-build-temp
        }
    }
    
    if (Test-Path "project\build") {
        Write-Host "Copying frontend build files..." -ForegroundColor Yellow
        Copy-Item -Path "project\build\*" -Destination "$buildDir\build" -Recurse
    }
    
    # Create Procfile if it doesn't exist
    $procfilePath = "$buildDir\Procfile"
    if (-not (Test-Path $procfilePath)) {
        "web: npm start" | Out-File -FilePath $procfilePath -Encoding ascii
    }
    
    # Check for package.json
    if (-not (Test-Path "$buildDir\package.json")) {
        Write-Host "Warning: No package.json found in the build directory." -ForegroundColor Yellow
        Write-Host "Creating a basic package.json file..." -ForegroundColor Yellow
        
        $packageJson = @"
{
  "name": "checkresumeai",
  "version": "1.0.0",
  "description": "AI-powered resume analyzer",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
"@
        Set-Content -Path "$buildDir\package.json" -Value $packageJson
        
        # Create basic index.js if none exists
        if (-not (Test-Path "$buildDir\index.js")) {
            $indexJs = @"
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from 'build' directory if it exists
try {
    const fs = require('fs');
    if (fs.existsSync('./build')) {
        app.use(express.static('build'));
        console.log('Serving static files from build directory');
    }
} catch (err) {
    console.error('Error checking for build directory:', err);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CheckResumeAI is running' });
});

// Default route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to CheckResumeAI API' });
});

// Catch all route - serve the React app
app.get('*', (req, res) => {
    try {
        const fs = require('fs');
        if (fs.existsSync('./build/index.html')) {
            res.sendFile('index.html', { root: './build' });
        } else {
            res.json({ message: 'CheckResumeAI frontend not found' });
        }
    } catch (err) {
        console.error('Error serving React app:', err);
        res.json({ message: 'CheckResumeAI API is running, but frontend is not available' });
    }
});

app.listen(port, () => {
    console.log(`CheckResumeAI running on port ${port}`);
});
"@
            Set-Content -Path "$buildDir\index.js" -Value $indexJs
        }
    }
    
    # Create deployment package
    $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
    $zipFile = "$versionLabel.zip"
    
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    if (Test-Path $zipFile) {
        Remove-Item $zipFile -Force
    }
    
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Get S3 bucket for Elastic Beanstalk storage
    $identityJson = (aws sts get-caller-identity --output json | ConvertFrom-Json)
    $accountId = $identityJson.Account
    $ebS3Bucket = "elasticbeanstalk-$region-$accountId"
    
    # Check if EB S3 bucket exists, create if not
    $bucketExists = $false
    try {
        aws s3api head-bucket --bucket $ebS3Bucket 2>&1 | Out-Null
        $bucketExists = $?
    } catch {}
    
    if (-not $bucketExists) {
        Write-Host "Creating Elastic Beanstalk S3 bucket: $ebS3Bucket" -ForegroundColor Yellow
        aws s3 mb "s3://$ebS3Bucket" --region $region
    }
    
    # Upload to S3
    Write-Host "Uploading application package to S3..." -ForegroundColor Yellow
    aws s3 cp $zipFile "s3://$ebS3Bucket/$zipFile"
    
    # Create application version
    Write-Host "Creating new application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version `
        --application-name $appName `
        --version-label $versionLabel `
        --source-bundle S3Bucket="$ebS3Bucket",S3Key="$zipFile"
    
    # Deploy new version
    Write-Host "Deploying new version to environment $envName..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --environment-name $envName `
        --version-label $versionLabel
    
    # Cleanup
    Remove-Item $zipFile -Force
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "`nDeployment initiated successfully!" -ForegroundColor Green
    Write-Host "The deployment process will take several minutes to complete." -ForegroundColor Yellow
    Write-Host "You can check the status in the AWS Elastic Beanstalk Console." -ForegroundColor Yellow
    
    # Wait for environment to be ready
    Write-Host "`nWould you like to wait for the environment to be ready?" -ForegroundColor Yellow
    $waitForEnv = Read-Host "This may take 5-10 minutes (Y/N)"
    if ($waitForEnv -eq "Y" -or $waitForEnv -eq "y") {
        Write-Host "Waiting for environment to be ready..." -ForegroundColor Yellow
        
        $ready = $false
        $status = ""
        $health = ""
        $startTime = Get-Date
        $timeout = (Get-Date).AddMinutes(15)
        
        while (-not $ready -and (Get-Date) -lt $timeout) {
            Start-Sleep -Seconds 30
            
            $envStatus = aws elasticbeanstalk describe-environments `
                --environment-names $envName `
                --query "Environments[0].[Status,Health,CNAME]" `
                --output json
                
            $envStatusJson = $envStatus | ConvertFrom-Json
            $status = $envStatusJson[0]
            $health = $envStatusJson[1]
            $url = $envStatusJson[2]
            
            $elapsedTime = [math]::Round(((Get-Date) - $startTime).TotalMinutes, 1)
            Write-Host "Status: $status, Health: $health (Elapsed: $elapsedTime minutes)" -ForegroundColor Yellow
            
            if ($status -eq "Ready") {
                $ready = $true
                Write-Host "`nEnvironment is ready!" -ForegroundColor Green
                Write-Host "Application URL: http://$url" -ForegroundColor Cyan
                
                # Save URL to a file for easy reference
                "CheckResumeAI Application URL: http://$url" | Out-File -FilePath "application-url.txt"
                Write-Host "URL saved to application-url.txt" -ForegroundColor Green
            }
        }
        
        if (-not $ready) {
            Write-Host "`nEnvironment is still being deployed." -ForegroundColor Yellow
            Write-Host "Check the AWS Elastic Beanstalk Console for status." -ForegroundColor Yellow
        }
    } else {
        # Get environment URL
        $envStatus = aws elasticbeanstalk describe-environments `
            --environment-names $envName `
            --query "Environments[0].CNAME" `
            --output json
        
        if ($envStatus) {
            $url = $envStatus.Trim('"')
            Write-Host "`nWhen deployment completes, your application will be available at:" -ForegroundColor Green
            Write-Host "http://$url" -ForegroundColor Cyan
            
            # Save URL to a file for easy reference
            "CheckResumeAI Application URL: http://$url" | Out-File -FilePath "application-url.txt"
            Write-Host "URL saved to application-url.txt" -ForegroundColor Green
        }
    }
}

Write-Host "`nAWS Free Tier usage reminder:" -ForegroundColor Magenta
Write-Host "- Your t2.micro EC2 instance is free for 750 hours/month" -ForegroundColor White
Write-Host "- S3 is free for the first 5GB of storage" -ForegroundColor White
Write-Host "- Remember to delete resources when not needed" -ForegroundColor White

Write-Host "`nTo monitor your AWS Free Tier usage:" -ForegroundColor Yellow
Write-Host "Run: .\monitor-aws-usage.ps1" -ForegroundColor Green
