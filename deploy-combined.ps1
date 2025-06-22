# Combined AWS CLI and EB CLI Deployment Script for CheckResumeAI
# This script uses both AWS CLI and EB CLI to deploy the application

param (
    [switch]$InitializeInfrastructure = $false,
    [switch]$DeployApp = $false,
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "CheckResumeAI AWS Deployment (Combined CLI Tools)" -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -InitializeInfrastructure : Initialize AWS infrastructure (S3 and Elastic Beanstalk)" -ForegroundColor White
    Write-Host "  -DeployApp                : Deploy application to existing environment" -ForegroundColor White
    Write-Host "  -Help                     : Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Example: .\deploy-combined.ps1 -InitializeInfrastructure" -ForegroundColor Green
}

# Function to find and set up CLI paths
function Setup-CLI-Tools {
    Write-Host "Setting up AWS CLI and EB CLI tools..." -ForegroundColor Yellow
    
    # Add AWS CLI to PATH if needed
    try {
        $awsCommand = Get-Command aws -ErrorAction Stop
        Write-Host "AWS CLI found at: $($awsCommand.Source)" -ForegroundColor Green
    } catch {
        Write-Host "AWS CLI not in PATH, trying to locate it..." -ForegroundColor Yellow
        
        # Common AWS CLI installation paths
        $possibleAwsPaths = @(
            "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
            "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
        )
        
        $awsPath = $null
        foreach ($path in $possibleAwsPaths) {
            if (Test-Path $path) {
                $awsPath = $path
                $env:Path = "$([System.IO.Path]::GetDirectoryName($awsPath));$env:Path"
                Write-Host "AWS CLI found and added to PATH: $awsPath" -ForegroundColor Green
                break
            }
        }
        
        if (-not $awsPath) {
            Write-Host "AWS CLI not found. Please run install-aws-cli.ps1 first." -ForegroundColor Red
            return $false
        }
    }
    
    # Find Python and add to PATH if needed for EB CLI
    try {
        $pythonCommand = Get-Command python -ErrorAction Stop
        Write-Host "Python found at: $($pythonCommand.Source)" -ForegroundColor Green
    } catch {
        Write-Host "Python not in PATH, trying to locate it..." -ForegroundColor Yellow
        
        # Common Python installation paths
        $possiblePythonPaths = @(
            "C:\Python*\python.exe",
            "C:\Users\*\AppData\Local\Programs\Python\Python*\python.exe",
            "C:\Program Files\Python*\python.exe",
            "C:\Program Files (x86)\Python*\python.exe"
        )
        
        $pythonPath = $null
        foreach ($pattern in $possiblePythonPaths) {
            $paths = @(Get-Item -Path $pattern -ErrorAction SilentlyContinue)
            if ($paths.Count -gt 0) {
                $pythonPath = $paths[0].FullName
                $env:Path = "$([System.IO.Path]::GetDirectoryName($pythonPath));$([System.IO.Path]::GetDirectoryName($pythonPath))\Scripts;$env:Path"
                Write-Host "Python found and added to PATH: $pythonPath" -ForegroundColor Green
                break
            }
        }
        
        if (-not $pythonPath) {
            Write-Host "Python not found. Please run install-eb-cli.ps1 first to install Python and EB CLI." -ForegroundColor Red
            return $false
        }
    }
    
    # Verify EB CLI
    try {
        $ebCommand = Get-Command eb -ErrorAction Stop
        Write-Host "EB CLI found at: $($ebCommand.Source)" -ForegroundColor Green
    } catch {
        Write-Host "EB CLI not in PATH, trying to locate it..." -ForegroundColor Yellow
        
        # Try to find EB CLI in Python Scripts directory
        $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
        if ($pythonCommand) {
            $scriptsDir = Join-Path (Split-Path $pythonCommand.Source) "Scripts"
            $ebPath = Join-Path $scriptsDir "eb.exe"
            
            if (Test-Path $ebPath) {
                $env:Path = "$scriptsDir;$env:Path"
                Write-Host "EB CLI found and added to PATH: $ebPath" -ForegroundColor Green
            } else {
                # Install EB CLI if not found
                Write-Host "EB CLI not found. Installing..." -ForegroundColor Yellow
                python -m pip install awsebcli
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "Failed to install EB CLI. Please run install-eb-cli.ps1." -ForegroundColor Red
                    return $false
                }
                
                $env:Path = "$scriptsDir;$env:Path"
                Write-Host "EB CLI installed successfully." -ForegroundColor Green
            }
        } else {
            Write-Host "Python not found. Cannot install or locate EB CLI." -ForegroundColor Red
            return $false
        }
    }
    
    # Final verification
    try {
        $awsVersion = aws --version
        Write-Host "AWS CLI version: $awsVersion" -ForegroundColor Green
        
        # Add alias for eb command if needed
        if (-not (Get-Command eb -ErrorAction SilentlyContinue)) {
            $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
            if ($pythonCommand) {
                $scriptsDir = Join-Path (Split-Path $pythonCommand.Source) "Scripts"
                $ebPath = Join-Path $scriptsDir "eb.exe"
                
                if (Test-Path $ebPath) {
                    Set-Alias -Name eb -Value $ebPath -Scope Global
                    Write-Host "Created alias for EB CLI at: $ebPath" -ForegroundColor Green
                }
            }
        }
        
        try {
            $ebVersion = eb --version
            Write-Host "EB CLI version: $ebVersion" -ForegroundColor Green
        } catch {
            # Try one more approach with python module
            try {
                $ebVersion = python -m awsebcli.eb --version
                Write-Host "EB CLI version (via Python module): $ebVersion" -ForegroundColor Green
                # Create a batch file to run eb commands
                $ebBatContent = @"
@echo off
python -m awsebcli.eb %*
"@
                $ebBatPath = ".\eb-runner.bat"
                Set-Content -Path $ebBatPath -Value $ebBatContent
                Write-Host "Created eb-runner.bat to execute EB CLI commands" -ForegroundColor Green
            } catch {
                Write-Host "Could not determine EB CLI version. EB CLI may not be properly installed." -ForegroundColor Red
                return $false
            }
        }
    } catch {
        Write-Host "Failed to verify CLI tools: $_" -ForegroundColor Red
        return $false
    }
    
    return $true
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
    
    # Try using eb command
    try {
        eb init CheckResumeAI --platform "Node.js 18" --region ap-south-1
        $ebSuccess = ($LASTEXITCODE -eq 0)
    } catch {
        $ebSuccess = $false
    }
    
    # If eb command failed, use the eb-runner.bat if available
    if (-not $ebSuccess -and (Test-Path ".\eb-runner.bat")) {
        Write-Host "Trying with eb-runner.bat..." -ForegroundColor Yellow
        & .\eb-runner.bat init CheckResumeAI --platform "Node.js 18" --region ap-south-1
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
  default_region: ap-south-1
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
                "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create Elastic Beanstalk environment. Please check error messages above." -ForegroundColor Red
        return $false
    }
    
    Write-Host "AWS infrastructure initialized successfully!" -ForegroundColor Green
    Write-Host "To deploy your application, run: .\deploy-combined.ps1 -DeployApp" -ForegroundColor Yellow
    
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
    
    # Change to build directory for deployment
    Push-Location $buildDir
    
    # Try using eb command
    try {
        eb deploy
        $ebSuccess = ($LASTEXITCODE -eq 0)
    } catch {
        $ebSuccess = $false
    }
    
    # If eb command failed, use the eb-runner.bat if available
    if (-not $ebSuccess -and (Test-Path "..\eb-runner.bat")) {
        Write-Host "Trying with eb-runner.bat..." -ForegroundColor Yellow
        & ..\eb-runner.bat deploy
        $ebSuccess = ($LASTEXITCODE -eq 0)
    }
    
    # If that also failed, use AWS CLI
    if (-not $ebSuccess) {
        Write-Host "EB CLI commands failed. Deploying using AWS CLI..." -ForegroundColor Yellow
        
        # Create a deployment package
        $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
        $zipFile = "$versionLabel.zip"
        
        # Go back to original directory
        Pop-Location
        
        # Create zip file
        Write-Host "Creating deployment package..." -ForegroundColor Yellow
        Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
        
        # Get the account ID for S3 bucket name
        $accountId = aws sts get-caller-identity --query "Account" --output text
        $region = aws configure get region
        if (-not $region) { $region = "ap-south-1" }
        
        # Check if the EB S3 bucket exists, create if not
        $s3Bucket = "elasticbeanstalk-$region-$accountId"
        $bucketExists = $false
        try {
            aws s3api head-bucket --bucket $s3Bucket 2>&1 | Out-Null
            $bucketExists = ($LASTEXITCODE -eq 0)
        } catch {}
        
        if (-not $bucketExists) {
            Write-Host "Creating Elastic Beanstalk S3 bucket: $s3Bucket..." -ForegroundColor Yellow
            aws s3 mb "s3://$s3Bucket" --region $region
        }
        
        # Upload to S3
        Write-Host "Uploading application to S3..." -ForegroundColor Yellow
        aws s3 cp $zipFile "s3://$s3Bucket/$zipFile"
        
        # Create application version
        Write-Host "Creating application version..." -ForegroundColor Yellow
        aws elasticbeanstalk create-application-version `
            --application-name "CheckResumeAI" `
            --version-label $versionLabel `
            --source-bundle S3Bucket=$s3Bucket,S3Key=$zipFile
        
        # Update environment with new version
        Write-Host "Deploying application version to environment..." -ForegroundColor Yellow
        aws elasticbeanstalk update-environment `
            --application-name "CheckResumeAI" `
            --environment-name "CheckResumeAI-env" `
            --version-label $versionLabel
        
        # Clean up zip file
        Remove-Item $zipFile -Force
    } else {
        # Return to original directory if we used eb deploy directly
        Pop-Location
    }
    
    # Clean up temporary build directory
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "Application deployed successfully!" -ForegroundColor Green
    Write-Host "Getting application URL..." -ForegroundColor Yellow
    
    # Try getting application URL
    try {
        $env = aws elasticbeanstalk describe-environments `
            --application-name "CheckResumeAI" `
            --environment-name "CheckResumeAI-env" `
            --query "Environments[0].CNAME" --output text
        
        if ($env) {
            Write-Host "Application URL: http://$env" -ForegroundColor Green
        }
    } catch {
        Write-Host "Could not retrieve application URL." -ForegroundColor Yellow
        Write-Host "Check your AWS Elastic Beanstalk Console for the URL." -ForegroundColor Yellow
    }
    
    return $true
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

# Set up CLI tools
$setupSuccess = Setup-CLI-Tools
if (-not $setupSuccess) {
    Write-Host "Failed to set up CLI tools. Exiting." -ForegroundColor Red
    exit 1
}

if ($InitializeInfrastructure) {
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

if (-not $InitializeInfrastructure -and -not $DeployApp -and -not $Help) {
    Show-Help
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
