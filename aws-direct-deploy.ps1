# Quick Fix for AWS Deployment Issues
# This script provides a direct AWS CLI implementation for Elastic Beanstalk

Write-Host "AWS Deployment Quick Fix" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Verify AWS CLI credentials
Write-Host "`nVerifying AWS credentials..." -ForegroundColor Yellow
$credentialsValid = $false

try {
    $identity = aws sts get-caller-identity 2>$null
    if ($?) {
        $accountId = ($identity | ConvertFrom-Json).Account
        Write-Host "AWS credentials are valid. Account ID: $accountId" -ForegroundColor Green
        $credentialsValid = $true
    }
} catch {
    Write-Host "AWS credentials are not valid or not configured." -ForegroundColor Red
}

if (-not $credentialsValid) {
    Write-Host "Setting up AWS credentials..." -ForegroundColor Yellow
    aws configure
    
    try {
        $identity = aws sts get-caller-identity 2>$null
        if ($?) {
            $accountId = ($identity | ConvertFrom-Json).Account
            Write-Host "AWS credentials are now valid. Account ID: $accountId" -ForegroundColor Green
            $credentialsValid = $true
        } else {
            Write-Host "Failed to configure valid AWS credentials." -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "Failed to configure valid AWS credentials." -ForegroundColor Red
        exit 1
    }
}

# Ask for deployment type
Write-Host "`nWhat would you like to do?" -ForegroundColor Yellow
Write-Host "1. Initialize AWS infrastructure (S3 bucket and Elastic Beanstalk app)" -ForegroundColor White
Write-Host "2. Deploy application to existing infrastructure" -ForegroundColor White
Write-Host "3. Both initialize and deploy" -ForegroundColor White
$choice = Read-Host "Select an option (1-3)"

# Create S3 bucket
function Create-S3-Bucket {
    Write-Host "`nCreating S3 bucket for storage..." -ForegroundColor Yellow
    $bucketName = "checkresumeai-storage-$(Get-Random)"
    $region = "ap-south-1"  # Default region
    
    # Check if another region is configured
    $awsConfig = aws configure get region 2>$null
    if ($?) {
        $region = $awsConfig
    }
    
    aws s3 mb "s3://$bucketName" --region $region
    
    if ($?) {
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
        
        return $bucketName
    } else {
        Write-Host "Failed to create S3 bucket. Check your AWS permissions." -ForegroundColor Red
        return $null
    }
}

# Create Elastic Beanstalk application
function Create-EB-Application {
    param(
        [string]$bucketName
    )
    
    Write-Host "`nInitializing Elastic Beanstalk application..." -ForegroundColor Yellow
    $appName = "CheckResumeAI"
    $platform = "Node.js 18"
    $region = "ap-south-1"  # Default region
    
    # Check if another region is configured
    $awsConfig = aws configure get region 2>$null
    if ($?) {
        $region = $awsConfig
    }
    
    # Create Elastic Beanstalk application
    aws elasticbeanstalk create-application --application-name $appName --tags Key=platform,Value=$platform
    
    if (-not $?) {
        Write-Host "Failed to create Elastic Beanstalk application. Check your AWS permissions." -ForegroundColor Red
        return $false
    }
    
    # Create .elasticbeanstalk directory and config.yml
    if (-not (Test-Path ".elasticbeanstalk")) {
        New-Item -Path ".elasticbeanstalk" -ItemType Directory | Out-Null
    }
    
    $configContent = @"
branch-defaults:
  main:
    environment: null
    group_suffix: null
global:
  application_name: $appName
  branch: null
  default_ec2_keyname: null
  default_platform: $platform
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

    Set-Content -Path ".elasticbeanstalk\config.yml" -Value $configContent
    Write-Host "Elastic Beanstalk application created and configured." -ForegroundColor Green
    
    # Create environment
    Write-Host "`nCreating Elastic Beanstalk environment..." -ForegroundColor Yellow
    $envName = "$appName-env"
    $instanceType = "t2.micro"
    $solutionStackName = "64bit Amazon Linux 2 v5.8.0 running Node.js 18"
    
    Write-Host "This may take several minutes..." -ForegroundColor Yellow
    aws elasticbeanstalk create-environment --application-name $appName --environment-name $envName --solution-stack-name "$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=$instanceType" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
    
    if ($?) {
        Write-Host "Environment creation initiated successfully!" -ForegroundColor Green
        Write-Host "You can check the environment status in the AWS Elastic Beanstalk Console." -ForegroundColor Yellow
        return $true
    } else {
        Write-Host "Failed to create Elastic Beanstalk environment." -ForegroundColor Red
        return $false
    }
}

# Deploy application
function Deploy-Application {
    Write-Host "`nDeploying application to Elastic Beanstalk..." -ForegroundColor Yellow
    
    # Check if config exists
    if (-not (Test-Path ".elasticbeanstalk\config.yml")) {
        Write-Host "Elastic Beanstalk configuration not found. Initialize infrastructure first." -ForegroundColor Red
        return $false
    }
    
    # Get application and environment name from config
    $config = Get-Content ".elasticbeanstalk\config.yml" -Raw
    $appName = "CheckResumeAI"  # Default
    $envName = "CheckResumeAI-env"  # Default
    
    if ($config -match "application_name: (.+)") {
        $appName = $matches[1]
    }
    
    # Get region 
    $region = "ap-south-1"  # Default region
    if ($config -match "default_region: (.+)") {
        $region = $matches[1]
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
        Copy-Item -Path "project\backend\*" -Destination $buildDir -Recurse
    }
    
    if (Test-Path "project\build") {
        Copy-Item -Path "project\build\*" -Destination "$buildDir\build" -Recurse
    }
    
    # Create Procfile if it doesn't exist
    $procfilePath = "$buildDir\Procfile"
    if (-not (Test-Path $procfilePath)) {
        "web: npm start" | Out-File -FilePath $procfilePath -Encoding ascii
    }
    
    # Create zip file for deployment
    $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
    $zipFile = "$versionLabel.zip"
    
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    if (Test-Path $zipFile) {
        Remove-Item $zipFile -Force
    }
    
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Get caller identity for S3 bucket name
    $accountId = (aws sts get-caller-identity --query "Account" --output text)
    $s3Bucket = "elasticbeanstalk-$region-$accountId"
    
    # Create S3 bucket if it doesn't exist
    $bucketExists = $false
    try {
        aws s3api head-bucket --bucket $s3Bucket 2>&1 | Out-Null
        $bucketExists = $?
    } catch {}
    
    if (-not $bucketExists) {
        Write-Host "Creating Elastic Beanstalk S3 bucket..." -ForegroundColor Yellow
        aws s3 mb "s3://$s3Bucket" --region $region
    }
    
    # Upload to S3
    Write-Host "Uploading application version to S3..." -ForegroundColor Yellow
    aws s3 cp $zipFile "s3://$s3Bucket/$zipFile"
    
    # Create application version
    Write-Host "Creating new application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version --application-name $appName --version-label $versionLabel --source-bundle S3Bucket="$s3Bucket",S3Key="$zipFile"
    
    # Deploy new version
    Write-Host "Deploying new version to environment $envName..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment --environment-name $envName --version-label $versionLabel
    
    # Cleanup
    Remove-Item $zipFile -Force
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "Deployment initiated. Check the AWS Elastic Beanstalk Console for status." -ForegroundColor Green
    return $true
}

# Main execution logic
if ($choice -eq "1" -or $choice -eq "3") {
    $bucketName = Create-S3-Bucket
    
    if ($bucketName) {
        Create-EB-Application -bucketName $bucketName
    } else {
        exit 1
    }
}

if ($choice -eq "2" -or $choice -eq "3") {
    Deploy-Application
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
