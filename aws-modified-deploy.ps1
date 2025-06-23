# AWS Deployment for CheckResumeAI (Modified for Block Public Access)
# This script handles S3 Block Public Access settings and provides reliable combined deployment

$ErrorActionPreference = "Stop"

function Test-CLI-Installation {
    $awsFound = $null -ne (Get-Command aws -ErrorAction SilentlyContinue)
    if ($awsFound) {
        Write-Host "AWS CLI installed and in PATH: $awsFound" -ForegroundColor "Green"
    } else {
        Write-Host "AWS CLI installed and in PATH: $awsFound" -ForegroundColor "Red"
    }
    
    $ebFound = $null -ne (Get-Command eb -ErrorAction SilentlyContinue)
    if ($ebFound) {
        Write-Host "EB CLI installed and in PATH: $ebFound" -ForegroundColor "Green"
    } else {
        Write-Host "EB CLI installed and in PATH: $ebFound" -ForegroundColor "Red"
    }
    
    if (-not $awsFound) {
        Write-Host "Installing AWS CLI may be required: .\install-aws-cli.ps1" -ForegroundColor Yellow
    }
    
    if (-not $ebFound) {
        Write-Host "EB CLI not found in PATH but we'll try to use it via Python module" -ForegroundColor Yellow
    }
    
    return $awsFound
}

function Test-AWS-Credentials {
    Write-Host "Testing AWS credentials..." -ForegroundColor Yellow
    try {
        $identity = aws sts get-caller-identity 2>&1
        if ($LASTEXITCODE -eq 0) {
            $accountId = ($identity | ConvertFrom-Json).Account
            Write-Host "AWS credentials are valid. Account ID: $accountId" -ForegroundColor Green
            return $true
        } else {
            Write-Host "AWS credentials are invalid or expired. Please run: aws configure" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error checking AWS credentials: $_" -ForegroundColor Red
        Write-Host "Please run: aws configure" -ForegroundColor Yellow
        return $false
    }
}

function Initialize-AWS-Infrastructure {
    Write-Host "Initializing AWS Infrastructure with Block Public Access handling..." -ForegroundColor Cyan
    
    # Step 1: Create S3 bucket for storage (private by default)
    Write-Host "Creating S3 bucket for storage..." -ForegroundColor Yellow
    $bucketName = "checkresumeai-storage-$(Get-Random)"
    $region = aws configure get region
    if (-not $region) { $region = "ap-south-1" }
    
    aws s3 mb s3://$bucketName --region $region
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create S3 bucket. Please check AWS CLI configuration." -ForegroundColor Red
        return $false
    }
    
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
    
    Write-Host "S3 bucket created: $bucketName" -ForegroundColor Green
    
    # Create folder structure for public and private files
    Write-Host "Creating folder structure in S3..." -ForegroundColor Yellow
    aws s3api put-object --bucket $bucketName --key "public/"
    aws s3api put-object --bucket $bucketName --key "private/"
    
    # Step 2: Initialize Elastic Beanstalk application
    Write-Host "Initializing Elastic Beanstalk application..." -ForegroundColor Yellow
    
    # Create elasticbeanstalk directory if it doesn't exist
    $ebDir = ".elasticbeanstalk"
    if (-not (Test-Path $ebDir)) {
        New-Item -Path $ebDir -ItemType Directory | Out-Null
    }
    
    # Try using eb command
    $ebSuccess = $false
    try {
        eb init CheckResumeAI --platform "Node.js 18" --region $region
        $ebSuccess = ($LASTEXITCODE -eq 0)
    } catch {
        $ebSuccess = $false
    }
    
    # If eb command failed, use the eb-runner.bat if available
    if (-not $ebSuccess -and (Test-Path ".\eb-runner.bat")) {
        Write-Host "Trying with eb-runner.bat..." -ForegroundColor Yellow
        & .\eb-runner.bat init CheckResumeAI --platform "Node.js 18" --region $region
        $ebSuccess = ($LASTEXITCODE -eq 0)
    }
    
    # If that also failed, create config file manually
    if (-not $ebSuccess) {
        Write-Host "EB CLI commands failed. Creating configuration manually..." -ForegroundColor Yellow
        
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
        
        # Create Elastic Beanstalk application using AWS CLI
        aws elasticbeanstalk create-application --application-name "CheckResumeAI" --description "CheckResumeAI Application"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Application might already exist. Attempting to continue..." -ForegroundColor Yellow
        }
    }
    
    # Update config.yml with S3 bucket
    $configPath = "$ebDir\config.yml"
    if (Test-Path $configPath) {
        $configContent = Get-Content $configPath -Raw
        if (-not ($configContent -match "S3_BUCKET:")) {
            $configContent += "`nS3_BUCKET: $bucketName"
            $configContent | Set-Content $configPath
        }
    }
    
    Write-Host "Elastic Beanstalk application initialized successfully!" -ForegroundColor Green
    
    # Step 3: Create a new environment
    Write-Host "Creating Elastic Beanstalk environment (this will take several minutes)..." -ForegroundColor Yellow
    
    # Try using eb command
    $ebSuccess = $false
    try {
        eb create CheckResumeAI-env --instance-type t2.micro --single
        $ebSuccess = ($LASTEXITCODE -eq 0)
    } catch {
        $ebSuccess = $false
    }
    
    # If eb command failed, use the eb-runner.bat if available
    if (-not $ebSuccess -and (Test-Path ".\eb-runner.bat")) {
        Write-Host "Trying with eb-runner.bat..." -ForegroundColor Yellow
        & .\eb-runner.bat create CheckResumeAI-env --instance-type t2.micro --single
        $ebSuccess = ($LASTEXITCODE -eq 0)
    }
    
    # If that also failed, use AWS CLI
    if (-not $ebSuccess) {
        Write-Host "EB CLI commands failed. Creating environment using AWS CLI..." -ForegroundColor Yellow
        
        # Create environment using AWS CLI
        aws elasticbeanstalk create-environment `
            --application-name "CheckResumeAI" `
            --environment-name "CheckResumeAI-env" `
            --solution-stack-name "64bit Amazon Linux 2 v5.8.0 running Node.js 18" `
            --option-settings `
                "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t2.micro" `
                "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
                "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$bucketName"
    }
    
    Write-Host "Checking environment creation status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check environment status
    $envStatus = aws elasticbeanstalk describe-environments --application-name "CheckResumeAI" --environment-name "CheckResumeAI-env" --query "Environments[0].Status" --output text
    
    if ($envStatus -eq "Launching" -or $envStatus -eq "Updating") {
        Write-Host "Environment is being created. This will take several minutes." -ForegroundColor Yellow
        Write-Host "You can check the status in the AWS Elastic Beanstalk Console." -ForegroundColor Yellow
    } elseif ($envStatus -eq "Ready") {
        Write-Host "Environment created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Environment creation status: $envStatus" -ForegroundColor Yellow
    }
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
    Write-Host "S3 Bucket: $bucketName" -ForegroundColor Green
    Write-Host "To deploy your application, run: .\aws-modified-deploy.ps1 -Deploy" -ForegroundColor Yellow
    
    return $true
}

function Deploy-Application {
    Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Cyan
    
    # Get bucket name from config
    $configPath = ".elasticbeanstalk\config.yml"
    $s3Bucket = $null
    if (Test-Path $configPath) {
        $configContent = Get-Content $configPath -Raw
        if ($configContent -match "S3_BUCKET:\s*(.+)") {
            $s3Bucket = $matches[1].Trim()
            Write-Host "S3 bucket from config: $s3Bucket" -ForegroundColor Green
        }
    }
    
    # Prepare the application package
    Write-Host "Preparing application package..." -ForegroundColor Yellow
    
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
        Copy-Item -Path "project\build\*" -Destination "$buildDir\build" -Recurse
    }
    
    # Create Procfile if it doesn't exist
    $procfilePath = "$buildDir\Procfile"
    if (-not (Test-Path $procfilePath)) {
        "web: npm start" | Out-File -FilePath $procfilePath -Encoding ascii
    }
    
    # Create .ebignore file to exclude node_modules
    ".git`nnode_modules`n" | Out-File -FilePath "$buildDir\.ebignore" -Encoding ascii
    
    # Add S3 bucket info to environment vars if we have it
    if ($s3Bucket) {
        $envVarPath = "$buildDir\.ebextensions"
        if (-not (Test-Path $envVarPath)) {
            New-Item -Path $envVarPath -ItemType Directory | Out-Null
        }
        
        $envVarConfig = @"
option_settings:
  aws:elasticbeanstalk:application:environment:
    S3_BUCKET: $s3Bucket
"@
        
        $envVarConfig | Out-File -FilePath "$envVarPath\env-vars.config" -Encoding ascii
    }
    
    # Create a deployment package
    $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
    $zipFile = "$versionLabel.zip"
    
    # Create zip file
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Get the region
    $region = aws configure get region
    if (-not $region) { $region = "ap-south-1" }
    
    # Get the account ID for S3 bucket name
    $accountId = aws sts get-caller-identity --query "Account" --output text
    
    # Check if the EB S3 bucket exists, create if not
    $ebS3Bucket = "elasticbeanstalk-$region-$accountId"
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
    
    # Create application version
    Write-Host "Creating application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version `
        --application-name "CheckResumeAI" `
        --version-label $versionLabel `
        --source-bundle S3Bucket=$ebS3Bucket,S3Key=$zipFile
    
    # Update environment with new version
    Write-Host "Deploying application version to environment..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --application-name "CheckResumeAI" `
        --environment-name "CheckResumeAI-env" `
        --version-label $versionLabel
    
    # Clean up zip file
    Remove-Item $zipFile -Force
    # Clean up temporary build directory
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "Application deployment initiated!" -ForegroundColor Green
    Write-Host "Checking deployment status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Get environment URL
    $envDetails = aws elasticbeanstalk describe-environments `
        --application-name "CheckResumeAI" `
        --environment-name "CheckResumeAI-env" `
        --query "Environments[0].[Status,CNAME]" `
        --output text
    
    $envStatus = $envDetails.Split()[0]
    $envUrl = $envDetails.Split()[1]
    
    if ($envStatus -eq "Updating") {
        Write-Host "Deployment is in progress. Environment is updating." -ForegroundColor Yellow
        Write-Host "This will take several minutes to complete." -ForegroundColor Yellow
    }
    
    if ($envUrl) {
        Write-Host "Application URL: http://$envUrl" -ForegroundColor Green
    } else {
        Write-Host "Could not retrieve application URL." -ForegroundColor Yellow
        Write-Host "Check your AWS Elastic Beanstalk Console for the URL." -ForegroundColor Yellow
    }
    
    return $true
}

# Main script execution
Clear-Host
Write-Host "CheckResumeAI AWS Deployment (Modified for Block Public Access)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Check if CLI tools are installed
$cliCheck = Test-CLI-Installation

# Check AWS credentials
$credCheck = Test-AWS-Credentials

if (-not $credCheck) {
    Write-Host "AWS credentials check failed. Please run 'aws configure' and try again." -ForegroundColor Red
    exit 1
}

Write-Host "`nOptions:" -ForegroundColor Yellow
Write-Host "1. Initialize AWS infrastructure (S3 and Elastic Beanstalk app)" -ForegroundColor White
Write-Host "2. Deploy application to existing infrastructure" -ForegroundColor White
Write-Host "3. Both initialize and deploy" -ForegroundColor White
$option = Read-Host "Select an option (1-3)"

switch ($option) {
    "1" {
        Initialize-AWS-Infrastructure
    }
    "2" {
        Deploy-Application
    }
    "3" {
        $success = Initialize-AWS-Infrastructure
        if ($success) {
            Write-Host "`nProceeding to deploy application..." -ForegroundColor Cyan
            Deploy-Application
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
