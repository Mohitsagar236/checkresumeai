# AWS Deployment Script for CheckResumeAI
# This script helps deploy the application to AWS Free Tier resources

param (
    [switch]$InitializeInfrastructure = $false,
    [switch]$DeployApp = $false,
    [switch]$SetupRDS = $false,
    [switch]$SetupS3 = $false,
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "CheckResumeAI AWS Deployment Script"
    Write-Host "=================================="
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -InitializeInfrastructure : Set up initial AWS infrastructure"
    Write-Host "  -SetupRDS                 : Configure RDS database instance"
    Write-Host "  -SetupS3                  : Create and configure S3 bucket"
    Write-Host "  -DeployApp                : Deploy application to Elastic Beanstalk"
    Write-Host "  -Help                     : Show this help message"
    Write-Host ""
    Write-Host "Example: .\deploy-aws.ps1 -InitializeInfrastructure"
}

function Test-AwsCli {
    try {
        $awsVersion = aws --version
        Write-Host "AWS CLI is installed: $awsVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "AWS CLI is not installed. Please install it from https://aws.amazon.com/cli/" -ForegroundColor Red
        return $false
    }
}

function Test-EbCli {
    try {
        $ebVersion = eb --version
        Write-Host "EB CLI is installed: $ebVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "EB CLI is not installed. Installing..." -ForegroundColor Yellow
        pip install awsebcli
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install EB CLI. Please install it manually: pip install awsebcli" -ForegroundColor Red
            return $false
        }
        Write-Host "EB CLI installed successfully" -ForegroundColor Green
        return $true
    }
}

function Initialize-AwsInfrastructure {
    Write-Host "Initializing AWS Infrastructure..." -ForegroundColor Cyan
    
    # Create Elastic Beanstalk application
    Write-Host "Creating Elastic Beanstalk application..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application --application-name CheckResumeAI --description "AI-Powered Resume Analyzer SaaS"
    
    # Create Elastic Beanstalk environment
    Write-Host "Creating Elastic Beanstalk environment (this may take several minutes)..." -ForegroundColor Yellow
    eb create CheckResumeAI-env --instance_type t2.micro --single
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
}

function Setup-RdsDatabase {
    Write-Host "Setting up RDS database..." -ForegroundColor Cyan
    
    $dbPassword = Read-Host "Enter database password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    
    # Create RDS instance (PostgreSQL)
    Write-Host "Creating RDS PostgreSQL instance (this may take 5-10 minutes)..." -ForegroundColor Yellow
    aws rds create-db-instance --db-instance-identifier checkresumeai-db `
        --db-instance-class db.t2.micro `
        --engine postgres `
        --allocated-storage 20 `
        --master-username checkresumeai `
        --master-user-password $plainPassword `
        --backup-retention-period 7 `
        --publicly-accessible

    Write-Host "Waiting for RDS instance to become available..." -ForegroundColor Yellow
    aws rds wait db-instance-available --db-instance-identifier checkresumeai-db

    # Get RDS endpoint
    $rdsInfo = aws rds describe-db-instances --db-instance-identifier checkresumeai-db | ConvertFrom-Json
    $rdsEndpoint = $rdsInfo.DBInstances[0].Endpoint.Address
    $rdsPort = $rdsInfo.DBInstances[0].Endpoint.Port

    # Update Elastic Beanstalk environment variables
    Write-Host "Updating Elastic Beanstalk environment with database details..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment --environment-name CheckResumeAI-env --option-settings `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_HOSTNAME,Value=$rdsEndpoint" `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_PORT,Value=$rdsPort" `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_DB_NAME,Value=checkresumeai" `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_USERNAME,Value=checkresumeai" `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RDS_PASSWORD,Value=$plainPassword"
    
    Write-Host "RDS database setup complete!" -ForegroundColor Green
    Write-Host "RDS Endpoint: $rdsEndpoint" -ForegroundColor Cyan
}

function Setup-S3Bucket {
    Write-Host "Setting up S3 storage..." -ForegroundColor Cyan
    
    # Create S3 bucket
    $bucketName = "checkresumeai-storage"
    Write-Host "Creating S3 bucket: $bucketName..." -ForegroundColor Yellow
    aws s3api create-bucket --bucket $bucketName --region us-east-1
    
    # Configure bucket policy for public read access for resume/report files
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
    
    $policyFile = "$env:TEMP\s3-policy.json"
    $policy | Out-File -FilePath $policyFile -Encoding ascii
    aws s3api put-bucket-policy --bucket $bucketName --policy file://$policyFile
    
    # Configure CORS for the bucket
    $corsConfig = @"
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"]
        }
    ]
}
"@
    
    $corsFile = "$env:TEMP\s3-cors.json"
    $corsConfig | Out-File -FilePath $corsFile -Encoding ascii
    aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://$corsFile
    
    # Update Elastic Beanstalk environment variables for S3
    Write-Host "Updating Elastic Beanstalk environment with S3 details..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment --environment-name CheckResumeAI-env --option-settings `
        "Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET,Value=$bucketName"
    
    Write-Host "S3 bucket setup complete!" -ForegroundColor Green
    Write-Host "S3 Bucket: $bucketName" -ForegroundColor Cyan
}

function Deploy-Application {
    Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Cyan
    
    # Create deployment package
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    npm install
    npm run build

    # Create build.zip for deployment
    Write-Host "Creating build.zip for deployment..." -ForegroundColor Yellow
    if (Test-Path "build.zip") { Remove-Item "build.zip" }
    
    # Package the build folder for deployment
    Compress-Archive -Path "./project/backend/*", "./project/build/*" -DestinationPath "build.zip"
    
    # Deploy to Elastic Beanstalk
    Write-Host "Deploying to Elastic Beanstalk..." -ForegroundColor Yellow
    eb deploy CheckResumeAI-env
    
    Write-Host "Application deployed successfully!" -ForegroundColor Green
    
    # Get application URL
    $envDetails = aws elasticbeanstalk describe-environments --environment-names CheckResumeAI-env | ConvertFrom-Json
    $appUrl = $envDetails.Environments[0].CNAME
    
    Write-Host "Application URL: http://$appUrl" -ForegroundColor Cyan
}

# Main execution

if ($Help) {
    Show-Help
    exit 0
}

# Check for AWS CLI and EB CLI
$awsCliInstalled = Test-AwsCli
$ebCliInstalled = Test-EbCli

if (-not $awsCliInstalled -or -not $ebCliInstalled) {
    Write-Host "Please install the required tools and run the script again." -ForegroundColor Red
    exit 1
}

# Configure AWS CLI if not already done
$awsConfigured = aws configure list
if ($LASTEXITCODE -ne 0) {
    Write-Host "AWS CLI not configured. Running aws configure..." -ForegroundColor Yellow
    aws configure
}

# Run selected operations
if ($InitializeInfrastructure) {
    Initialize-AwsInfrastructure
}

if ($SetupRDS) {
    Setup-RdsDatabase
}

if ($SetupS3) {
    Setup-S3Bucket
}

if ($DeployApp) {
    Deploy-Application
}

if (-not $InitializeInfrastructure -and -not $SetupRDS -and -not $SetupS3 -and -not $DeployApp -and -not $Help) {
    Show-Help
}

Write-Host "For cost optimization, remember that AWS Free Tier includes:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor Magenta
Write-Host "- 750 hours/month of db.t2.micro RDS instance" -ForegroundColor Magenta
Write-Host "- 5GB of S3 storage" -ForegroundColor Magenta
Write-Host "Monitor your usage to stay within free tier limits." -ForegroundColor Magenta
