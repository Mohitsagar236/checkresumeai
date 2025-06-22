# Quick AWS Deployment Fix for S3 Access Issues

This script addresses the issues with S3 bucket public policy restrictions by setting up a private S3 bucket without public access policies - which is a more secure approach.

param (
    [switch]$DeployWithPrivateS3 = $true
)

$ErrorActionPreference = "Stop"

Write-Host "CheckResumeAI AWS Deployment - Private S3 Mode" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Validate AWS credentials
try {
    Write-Host "Verifying AWS credentials..." -ForegroundColor Yellow
    $awsAccount = aws sts get-caller-identity --query "Account" --output text 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "AWS credential error: $awsAccount" -ForegroundColor Red
        Write-Host "Please run 'aws configure' to set up credentials." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "AWS credentials are valid. Account ID: $awsAccount" -ForegroundColor Green
    
    # Get region
    $region = aws configure get region
    if (-not $region) {
        $region = "us-east-1" # Default region
        Write-Host "No region configured, using default: $region" -ForegroundColor Yellow
    } else {
        Write-Host "Using region: $region" -ForegroundColor Green
    }
} catch {
    Write-Host "Error verifying AWS credentials: $_" -ForegroundColor Red
    exit 1
}

# Create S3 bucket (without public policies)
try {
    Write-Host "Creating private S3 bucket for storage..." -ForegroundColor Yellow
    $bucketName = "checkresumeai-storage-$(Get-Random)"
    aws s3 mb s3://$bucketName --region $region
    
    # Set CORS configuration (but no public policy)
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
    
    Write-Host "S3 bucket created (private mode): $bucketName" -ForegroundColor Green
} catch {
    Write-Host "Error creating S3 bucket: $_" -ForegroundColor Red
    exit 1
}

# Initialize or update Elastic Beanstalk application
try {
    Write-Host "Setting up Elastic Beanstalk application..." -ForegroundColor Yellow
    
    # Create elasticbeanstalk directory if it doesn't exist
    $ebDir = ".elasticbeanstalk"
    if (-not (Test-Path $ebDir)) {
        New-Item -Path $ebDir -ItemType Directory | Out-Null
    }
    
    # Try to create the application
    aws elasticbeanstalk create-application --application-name "CheckResumeAI" --description "CheckResumeAI Application" 2>&1 | Out-Null
    
    # Create config.yml file
    $configContent = @"
branch-defaults:
  main:
    environment: null
    group_suffix: null
global:
  application_name: CheckResumeAI
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
"@
    $configPath = "$ebDir\config.yml"
    $configContent | Out-File -FilePath $configPath -Encoding ascii
    
    # Update config.yml with S3 bucket
    $configContent = Get-Content $configPath -Raw
    if (-not ($configContent -match "S3_BUCKET:")) {
        $configContent += "`nS3_BUCKET: $bucketName"
        $configContent | Set-Content $configPath
    }
    
    Write-Host "Elastic Beanstalk application configured successfully!" -ForegroundColor Green
    
    # Try to create a new environment or update existing
    Write-Host "Creating/updating Elastic Beanstalk environment (this will take several minutes)..." -ForegroundColor Yellow
    
    # Check if environment exists
    $envExists = $false
    try {
        $envCheck = aws elasticbeanstalk describe-environments --application-name "CheckResumeAI" --environment-names "CheckResumeAI-env" --query "Environments[0].Status" --output text 2>&1
        if ($LASTEXITCODE -eq 0) {
            $envExists = $true
        }
    } catch {}
    
    if (-not $envExists) {
        # Create environment
        aws elasticbeanstalk create-environment `
            --application-name "CheckResumeAI" `
            --environment-name "CheckResumeAI-env" `
            --solution-stack-name "64bit Amazon Linux 2 v5.8.0 running Node.js 18" `
            --option-settings `
                "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t2.micro" `
                "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
                "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$bucketName"
    } else {
        Write-Host "Environment already exists, will deploy to existing environment." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Warning when setting up Elastic Beanstalk: $_" -ForegroundColor Yellow
    Write-Host "Continuing with deployment..." -ForegroundColor Yellow
}

# Deploy Application
try {
    Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Cyan
    
    # Create a temporary build directory
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
        Write-Host "Backend directory not found. Copying all project files..." -ForegroundColor Yellow
        Copy-Item -Path "project\*" -Destination $buildDir -Recurse -Exclude "node_modules", ".git"
    }
    
    if (Test-Path "project\build") {
        Write-Host "Copying frontend build files..." -ForegroundColor Yellow
        New-Item -Path "$buildDir\build" -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
        Copy-Item -Path "project\build\*" -Destination "$buildDir\build" -Recurse
    }
    
    # Create Procfile if it doesn't exist
    $procfilePath = "$buildDir\Procfile"
    if (-not (Test-Path $procfilePath)) {
        "web: npm start" | Out-File -FilePath $procfilePath -Encoding ascii
    }
    
    # Create deployment package
    $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
    $zipFile = "$versionLabel.zip"
    
    # Create zip file
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Upload to S3
    Write-Host "Uploading application to S3..." -ForegroundColor Yellow
    aws s3 cp $zipFile "s3://$bucketName/$zipFile"
    
    # Create application version
    Write-Host "Creating application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version `
        --application-name "CheckResumeAI" `
        --version-label $versionLabel `
        --source-bundle S3Bucket=$bucketName,S3Key=$zipFile
    
    # Update environment with new version
    Write-Host "Deploying application version to environment..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --application-name "CheckResumeAI" `
        --environment-name "CheckResumeAI-env" `
        --version-label $versionLabel
    
    # Clean up
    Remove-Item $zipFile -Force
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "Application deployment initiated!" -ForegroundColor Green
    Write-Host "Getting application URL..." -ForegroundColor Yellow
    
    # Wait a moment for deployment to start
    Start-Sleep -Seconds 5
    
    # Try getting application URL
    try {
        $env = aws elasticbeanstalk describe-environments `
            --application-name "CheckResumeAI" `
            --environment-name "CheckResumeAI-env" `
            --query "Environments[0].CNAME" --output text
        
        if ($env) {
            Write-Host "Application URL: http://$env" -ForegroundColor Green
            Write-Host "Note: It may take 5-10 minutes for the environment to be fully ready." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Could not retrieve application URL." -ForegroundColor Yellow
        Write-Host "Check your AWS Elastic Beanstalk Console for the URL." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error during deployment: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
Write-Host "Your S3 bucket name is: $bucketName - Keep this for future reference" -ForegroundColor Green
