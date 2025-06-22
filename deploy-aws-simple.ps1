# Simplified AWS Deployment Script for CheckResumeAI
# This script helps deploy the application to AWS Free Tier resources

param (
    [switch]$InitInfrastructure = $false,
    [switch]$DeployApp = $false,
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "CheckResumeAI AWS Simplified Deployment" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -InitInfrastructure : Initialize AWS infrastructure (create S3, RDS, and Elastic Beanstalk)" -ForegroundColor White
    Write-Host "  -DeployApp          : Deploy application to existing Elastic Beanstalk environment" -ForegroundColor White
    Write-Host "  -Help               : Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Example: .\deploy-aws-simple.ps1 -InitInfrastructure" -ForegroundColor Green
}

function Initialize-AWS-Infrastructure {
    Write-Host "Initializing AWS Infrastructure..." -ForegroundColor Cyan
    
    # Step 1: Create S3 bucket for storage
    Write-Host "Creating S3 bucket for storage..." -ForegroundColor Yellow
    $bucketName = "checkresumeai-storage-$(Get-Random)"
    aws s3 mb s3://$bucketName --region ap-south-1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create S3 bucket. Please check AWS CLI configuration." -ForegroundColor Red
        return $false
    }
    
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
    
    Write-Host "S3 bucket created: $bucketName" -ForegroundColor Green
    
    # Step 2: Initialize Elastic Beanstalk application
    Write-Host "Initializing Elastic Beanstalk application..." -ForegroundColor Yellow
    
    # Create elasticbeanstalk directory if it doesn't exist
    $ebDir = ".elasticbeanstalk"
    if (-not (Test-Path $ebDir)) {
        New-Item -Path $ebDir -ItemType Directory | Out-Null
    }
    
    # Initialize EB environment
    eb init CheckResumeAI --platform "Node.js 18" --region ap-south-1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Elastic Beanstalk application. Please check EB CLI configuration." -ForegroundColor Red
        return $false
    }
    
    # Update config.yml with S3 bucket
    $configPath = ".elasticbeanstalk\config.yml"
    $configContent = Get-Content $configPath -Raw
    $configContent = $configContent -replace "S3_BUCKET: checkresumeai-storage", "S3_BUCKET: $bucketName"
    $configContent | Set-Content $configPath
    
    Write-Host "Elastic Beanstalk application initialized successfully!" -ForegroundColor Green
    
    # Step 3: Create a new environment
    Write-Host "Creating Elastic Beanstalk environment (this will take several minutes)..." -ForegroundColor Yellow
    eb create CheckResumeAI-env --instance-type t2.micro --single
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create Elastic Beanstalk environment. Please check EB CLI logs." -ForegroundColor Red
        return $false
    }
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
    Write-Host "To deploy your application, run: .\deploy-aws-simple.ps1 -DeployApp" -ForegroundColor Yellow
    
    return $true
}

function Deploy-Application {
    Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Cyan
    
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
    
    # Create the deployment package
    if (Test-Path "build.zip") {
        Remove-Item "build.zip" -Force
    }
    
    # Create build.zip
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    Compress-Archive -Path "$buildDir\*" -DestinationPath "build.zip"
    
    # Clean up temporary build directory
    Remove-Item -Path $buildDir -Recurse -Force
    
    # Deploy to Elastic Beanstalk
    Write-Host "Deploying to Elastic Beanstalk (this will take a few minutes)..." -ForegroundColor Yellow
    eb deploy
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to deploy application. Please check EB CLI logs." -ForegroundColor Red
        return $false
    }
    
    Write-Host "Application deployed successfully!" -ForegroundColor Green
    Write-Host "Getting application URL..." -ForegroundColor Yellow
    
    # Get application URL
    $ebStatus = eb status
    if ($ebStatus -match "CNAME: (.+)") {
        $appUrl = $matches[1]
        Write-Host "Application URL: http://$appUrl" -ForegroundColor Green
    } else {
        Write-Host "Application deployed, but couldn't get the URL. Check with: eb status" -ForegroundColor Yellow
    }
    
    return $true
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

# Check for AWS CLI and EB CLI
try {
    $awsVersion = aws --version
    $ebVersion = eb --version
    Write-Host "AWS CLI: $awsVersion" -ForegroundColor Green
    Write-Host "EB CLI: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "Required tools are not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please run install-aws-cli.ps1 and install-eb-cli.ps1 first." -ForegroundColor Red
    exit 1
}

if ($InitInfrastructure) {
    $success = Initialize-AWS-Infrastructure
    if (-not $success) {
        exit 1
    }
}

if ($DeployApp) {
    $success = Deploy-Application
    if (-not $success) {
        exit 1
    }
}

if (-not $InitInfrastructure -and -not $DeployApp -and -not $Help) {
    Show-Help
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
