# Fix for EB CLI and AWS CLI Issues
# This script addresses common issues with AWS deployment tools

Write-Host "EB CLI and AWS Credential Fix Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Step 1: Configure AWS credentials
Write-Host "`nStep 1: Configure AWS Credentials" -ForegroundColor Yellow
Write-Host "You need to provide your AWS Access Key ID and Secret Access Key."
Write-Host "If you don't have these, create them in the AWS IAM Console:"
Write-Host "https://console.aws.amazon.com/iam/home#/security_credentials" -ForegroundColor Blue

$configureNow = Read-Host "Configure AWS credentials now? (Y/N)"
if ($configureNow -eq "Y" -or $configureNow -eq "y") {
    Write-Host "Running AWS configure..." -ForegroundColor Green
    aws configure
}

# Step 2: Fix EB CLI issues by using AWS EB CLI Docker alternative
Write-Host "`nStep 2: Fix EB CLI Issues" -ForegroundColor Yellow
Write-Host "The EB CLI has dependency issues on Windows. We'll create a wrapper script."

$ebWrapperContent = @"
# EB CLI Wrapper Script for Windows
# This script executes EB CLI commands using direct AWS CLI commands where possible

param (
    [Parameter(ValueFromRemainingArguments=`$true)]
    [string[]]`$ebArgs
)

# Convert EB CLI commands to AWS CLI commands
`$command = `$ebArgs[0]

# Handle common EB commands
switch (`$command) {
    "init" {
        # eb init <app-name> --platform <platform> --region <region>
        if (`$ebArgs.Length -ge 2) {
            `$appName = `$ebArgs[1]
            `$platform = ""
            `$region = ""
            
            for (`$i = 0; `$i -lt `$ebArgs.Length; `$i++) {
                if (`$ebArgs[`$i] -eq "--platform" -and `$i+1 -lt `$ebArgs.Length) {
                    `$platform = `$ebArgs[`$i+1]
                }
                
                if (`$ebArgs[`$i] -eq "--region" -and `$i+1 -lt `$ebArgs.Length) {
                    `$region = `$ebArgs[`$i+1]
                }
            }
            
            # Create elastic beanstalk application
            Write-Host "Creating Elastic Beanstalk application: `$appName" -ForegroundColor Yellow
            aws elasticbeanstalk create-application --application-name `$appName --tags Key=platform,Value=`$platform
            
            # Create application version
            Write-Host "Setting up Elastic Beanstalk application" -ForegroundColor Yellow
            
            # Create .elasticbeanstalk directory and config.yml
            if (-not (Test-Path ".elasticbeanstalk")) {
                New-Item -Path ".elasticbeanstalk" -ItemType Directory | Out-Null
            }
            
            `$configContent = @"
branch-defaults:
  main:
    environment: null
    group_suffix: null
global:
  application_name: `$appName
  branch: null
  default_ec2_keyname: null
  default_platform: `$platform
  default_region: `$region
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: null
  workspace_type: Application
"@
            
            Set-Content -Path ".elasticbeanstalk\config.yml" -Value `$configContent
            
            Write-Host "EB application initialized successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "Error: Application name required for 'eb init'" -ForegroundColor Red
        }
    }
    
    "create" {
        # eb create <env-name> --instance-type <type> --single
        if (`$ebArgs.Length -ge 2) {
            `$envName = `$ebArgs[1]
            `$instanceType = "t2.micro"  # default
            `$single = `$false
            
            # Get application name from config.yml
            if (Test-Path ".elasticbeanstalk\config.yml") {
                `$config = Get-Content ".elasticbeanstalk\config.yml" -Raw
                if (`$config -match "application_name: (.+)") {
                    `$appName = `$matches[1]
                }
                else {
                    Write-Host "Error: Could not determine application name from config.yml" -ForegroundColor Red
                    exit 1
                }
                
                if (`$config -match "default_region: (.+)") {
                    `$region = `$matches[1]
                }
            }
            else {
                Write-Host "Error: Missing .elasticbeanstalk\config.yml. Run 'eb init' first." -ForegroundColor Red
                exit 1
            }
            
            for (`$i = 0; `$i -lt `$ebArgs.Length; `$i++) {
                if (`$ebArgs[`$i] -eq "--instance-type" -and `$i+1 -lt `$ebArgs.Length) {
                    `$instanceType = `$ebArgs[`$i+1]
                }
                
                if (`$ebArgs[`$i] -eq "--single") {
                    `$single = `$true
                }
            }
            
            # Create environment
            `$solutionStackName = "64bit Windows Server Core 2019 v2.8.5 running IIS 10.0"  # Default to Windows
            if (`$config -match "default_platform: (.+)") {
                `$platform = `$matches[1]
                if (`$platform -like "*Node.js*") {
                    `$solutionStackName = "64bit Amazon Linux 2 v5.8.0 running Node.js 18"
                }
            }
            
            Write-Host "Creating Elastic Beanstalk environment: `$envName" -ForegroundColor Yellow
            Write-Host "This may take several minutes..." -ForegroundColor Yellow
            
            if (`$single) {
                aws elasticbeanstalk create-environment --application-name `$appName --environment-name `$envName --solution-stack-name "`$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=`$instanceType" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
            }
            else {
                aws elasticbeanstalk create-environment --application-name `$appName --environment-name `$envName --solution-stack-name "`$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=`$instanceType"
            }
            
            Write-Host "Environment creation initiated. Check the AWS Elastic Beanstalk Console for status." -ForegroundColor Green
        }
        else {
            Write-Host "Error: Environment name required for 'eb create'" -ForegroundColor Red
        }
    }
    
    "deploy" {
        # Create a deployment package
        Write-Host "Creating deployment package..." -ForegroundColor Yellow
        
        # Get application name and environment from config.yml
        if (Test-Path ".elasticbeanstalk\config.yml") {
            `$config = Get-Content ".elasticbeanstalk\config.yml" -Raw
            if (`$config -match "application_name: (.+)") {
                `$appName = `$matches[1]
            }
            else {
                Write-Host "Error: Could not determine application name from config.yml" -ForegroundColor Red
                exit 1
            }
            
            if (`$config -match "environment: (.+)") {
                `$envName = `$matches[1]
            }
            else {
                # Try to get the environment name from AWS
                `$environments = aws elasticbeanstalk describe-environments --application-name `$appName --query "Environments[*].EnvironmentName" --output json | ConvertFrom-Json
                if (`$environments.Count -gt 0) {
                    `$envName = `$environments[0]
                }
                else {
                    Write-Host "Error: Could not determine environment name. Please specify with --environment" -ForegroundColor Red
                    exit 1
                }
            }
        }
        else {
            Write-Host "Error: Missing .elasticbeanstalk\config.yml. Run 'eb init' first." -ForegroundColor Red
            exit 1
        }
        
        # Create a zip file for deployment
        `$versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
        `$zipFile = "`$versionLabel.zip"
        
        # Remove previous zip if it exists
        if (Test-Path `$zipFile) {
            Remove-Item `$zipFile -Force
        }
        
        # Create the zip file
        Compress-Archive -Path * -DestinationPath `$zipFile -Force
        
        # Upload to S3
        Write-Host "Uploading application version to S3..." -ForegroundColor Yellow
        `$s3Bucket = "elasticbeanstalk-`$region-" + (aws sts get-caller-identity --query "Account" --output text)
        aws s3 cp `$zipFile "s3://`$s3Bucket/`$zipFile"
        
        # Create application version
        Write-Host "Creating new application version..." -ForegroundColor Yellow
        aws elasticbeanstalk create-application-version --application-name `$appName --version-label `$versionLabel --source-bundle S3Bucket="`$s3Bucket",S3Key="`$zipFile"
        
        # Deploy new version
        Write-Host "Deploying new version to environment `$envName..." -ForegroundColor Yellow
        aws elasticbeanstalk update-environment --environment-name `$envName --version-label `$versionLabel
        
        # Cleanup
        Remove-Item `$zipFile -Force
        
        Write-Host "Deployment initiated. Check the AWS Elastic Beanstalk Console for status." -ForegroundColor Green
    }
    
    "status" {
        # Get application name from config.yml
        if (Test-Path ".elasticbeanstalk\config.yml") {
            `$config = Get-Content ".elasticbeanstalk\config.yml" -Raw
            if (`$config -match "application_name: (.+)") {
                `$appName = `$matches[1]
            }
            else {
                Write-Host "Error: Could not determine application name from config.yml" -ForegroundColor Red
                exit 1
            }
            
            # Get environments for this application
            Write-Host "Getting environment status for application `$appName..." -ForegroundColor Yellow
            aws elasticbeanstalk describe-environments --application-name `$appName
        }
        else {
            Write-Host "Error: Missing .elasticbeanstalk\config.yml. Run 'eb init' first." -ForegroundColor Red
            exit 1
        }
    }
    
    "logs" {
        Write-Host "Retrieving logs is not directly supported in this wrapper." -ForegroundColor Yellow
        Write-Host "Please check logs in the AWS Elastic Beanstalk Console." -ForegroundColor Yellow
    }
    
    default {
        Write-Host "Command '`$command' is not supported in this wrapper script." -ForegroundColor Red
        Write-Host "Please use the AWS Management Console for advanced operations." -ForegroundColor Yellow
    }
}
"@

Set-Content -Path "eb-wrapper.ps1" -Value $ebWrapperContent

# Create a modified version of the deploy script that uses the wrapper
Write-Host "`nCreating a modified deployment script that uses direct AWS CLI commands..." -ForegroundColor Yellow

$deployScriptContent = @"
# AWS Direct CLI Deployment Script for CheckResumeAI
# This script deploys the application using AWS CLI directly instead of EB CLI

param (
    [switch]`$InitInfrastructure = `$false,
    [switch]`$DeployApp = `$false,
    [switch]`$Help = `$false
)

`$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "CheckResumeAI AWS Direct Deployment" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -InitInfrastructure : Initialize AWS infrastructure (create S3, and Elastic Beanstalk)" -ForegroundColor White
    Write-Host "  -DeployApp          : Deploy application to existing Elastic Beanstalk environment" -ForegroundColor White
    Write-Host "  -Help               : Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Example: .\deploy-aws-direct.ps1 -InitInfrastructure" -ForegroundColor Green
}

function Initialize-AWS-Infrastructure {
    Write-Host "Initializing AWS Infrastructure..." -ForegroundColor Cyan
    
    # Step 1: Create S3 bucket for storage
    Write-Host "Creating S3 bucket for storage..." -ForegroundColor Yellow
    `$bucketName = "checkresumeai-storage-`$(Get-Random)"
    aws s3 mb s3://`$bucketName --region ap-south-1
    
    if (`$LASTEXITCODE -ne 0) {
        Write-Host "Failed to create S3 bucket. Please check AWS CLI configuration." -ForegroundColor Red
        return `$false
    }
    
    # Set bucket policy for public access to reports folder
    `$policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForReportsAndPublicFiles",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::`$bucketName/public/*"
        }
    ]
}
"@
    `$policyFile = "s3-policy.json"
    `$policy | Out-File -FilePath `$policyFile -Encoding ascii
    aws s3api put-bucket-policy --bucket `$bucketName --policy file://`$policyFile
    Remove-Item `$policyFile
    
    # Set CORS configuration
    `$cors = @"
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
    `$corsFile = "s3-cors.json"
    `$cors | Out-File -FilePath `$corsFile -Encoding ascii
    aws s3api put-bucket-cors --bucket `$bucketName --cors-configuration file://`$corsFile
    Remove-Item `$corsFile
    
    Write-Host "S3 bucket created: `$bucketName" -ForegroundColor Green
    
    # Step 2: Initialize Elastic Beanstalk application using our wrapper script
    Write-Host "Initializing Elastic Beanstalk application..." -ForegroundColor Yellow
    
    # Create elasticbeanstalk directory if it doesn't exist
    `$ebDir = ".elasticbeanstalk"
    if (-not (Test-Path `$ebDir)) {
        New-Item -Path `$ebDir -ItemType Directory | Out-Null
    }
    
    # Initialize EB environment using our wrapper script
    & .\eb-wrapper.ps1 init CheckResumeAI --platform "Node.js 18" --region ap-south-1
    
    if (`$LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Elastic Beanstalk application." -ForegroundColor Red
        return `$false
    }
    
    # Update config.yml with S3 bucket
    `$configPath = ".elasticbeanstalk\config.yml"
    if (Test-Path `$configPath) {
        `$configContent = Get-Content `$configPath -Raw
        `$configContent = `$configContent + "`nS3_BUCKET: `$bucketName`n"
        `$configContent | Set-Content `$configPath
    }
    
    Write-Host "Elastic Beanstalk application initialized successfully!" -ForegroundColor Green
    
    # Step 3: Create a new environment
    Write-Host "Creating Elastic Beanstalk environment (this will take several minutes)..." -ForegroundColor Yellow
    & .\eb-wrapper.ps1 create CheckResumeAI-env --instance-type t2.micro --single
    
    if (`$LASTEXITCODE -ne 0) {
        Write-Host "Failed to create Elastic Beanstalk environment." -ForegroundColor Red
        return `$false
    }
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
    Write-Host "To deploy your application, run: .\deploy-aws-direct.ps1 -DeployApp" -ForegroundColor Yellow
    
    return `$true
}

function Deploy-Application {
    Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Cyan
    
    # Prepare the application package
    Write-Host "Preparing application package..." -ForegroundColor Yellow
    
    # Create a temporary build directory
    `$buildDir = "eb-build-temp"
    if (Test-Path `$buildDir) {
        Remove-Item -Path `$buildDir -Recurse -Force
    }
    New-Item -Path `$buildDir -ItemType Directory | Out-Null
    
    # Copy necessary files to the build directory
    if (Test-Path "project\backend") {
        Copy-Item -Path "project\backend\*" -Destination `$buildDir -Recurse
    }
    
    if (Test-Path "project\build") {
        Copy-Item -Path "project\build\*" -Destination "`$buildDir\build" -Recurse
    }
    
    # Create Procfile if it doesn't exist
    `$procfilePath = "`$buildDir\Procfile"
    if (-not (Test-Path `$procfilePath)) {
        "web: npm start" | Out-File -FilePath `$procfilePath -Encoding ascii
    }
    
    # Set the working directory to the build directory
    `$originalLocation = Get-Location
    Set-Location -Path `$buildDir
    
    # Deploy using our wrapper script
    & ..\eb-wrapper.ps1 deploy
    
    # Return to the original directory
    Set-Location -Path `$originalLocation
    
    # Clean up temporary build directory
    Remove-Item -Path `$buildDir -Recurse -Force
    
    Write-Host "Application deployed successfully!" -ForegroundColor Green
    Write-Host "Check AWS Elastic Beanstalk Console for environment URL and deployment status." -ForegroundColor Yellow
    
    # Get application status
    & .\eb-wrapper.ps1 status
    
    return `$true
}

# Main execution
if (`$Help) {
    Show-Help
    exit 0
}

# Check for AWS CLI 
try {
    `$awsVersion = aws --version
    Write-Host "AWS CLI: `$awsVersion" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please run install-aws-cli.ps1 first, then run aws configure." -ForegroundColor Red
    exit 1
}

if (`$InitInfrastructure) {
    `$success = Initialize-AWS-Infrastructure
    if (-not `$success) {
        exit 1
    }
}

if (`$DeployApp) {
    `$success = Deploy-Application
    if (-not `$success) {
        exit 1
    }
}

if (-not `$InitInfrastructure -and -not `$DeployApp -and -not `$Help) {
    Show-Help
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
"@

Set-Content -Path "deploy-aws-direct.ps1" -Value $deployScriptContent

# Step 3: Run AWS configure to fix credential issues
Write-Host "`nStep 3: Running AWS Deployment" -ForegroundColor Yellow
Write-Host "To deploy your application, use the new direct AWS CLI deployment script:" -ForegroundColor Green
Write-Host "`n  .\deploy-aws-direct.ps1 -InitInfrastructure" -ForegroundColor Cyan
Write-Host "`nThis script bypasses the problematic EB CLI and uses AWS CLI directly." -ForegroundColor Yellow

$runDeploy = Read-Host "Would you like to run the new deployment script now? (Y/N)"
if ($runDeploy -eq "Y" -or $runDeploy -eq "y") {
    & .\deploy-aws-direct.ps1 -InitInfrastructure
}
