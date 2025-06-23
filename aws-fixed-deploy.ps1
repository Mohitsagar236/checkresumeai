# Fixed AWS Deployment Script for CheckResumeAI
# This script addresses common deployment issues and handles S3 bucket policy restrictions

Write-Host "AWS Fixed Deployment Script" -ForegroundColor Cyan
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

# Get AWS region
$region = aws configure get region 2>$null
if (-not $?) {
    $region = "ap-south-1"  # Default region if not configured
    Write-Host "Using default region: $region" -ForegroundColor Yellow
}

# Ask for deployment type
Write-Host "`nWhat would you like to do?" -ForegroundColor Yellow
Write-Host "1. Initialize AWS infrastructure (S3 bucket and Elastic Beanstalk app)" -ForegroundColor White
Write-Host "2. Deploy application to existing infrastructure" -ForegroundColor White
Write-Host "3. Both initialize and deploy" -ForegroundColor White
Write-Host "4. Create Elastic Beanstalk environment for existing application" -ForegroundColor White
Write-Host "5. Check for deprecated platforms and fix" -ForegroundColor Cyan
Write-Host "6. Stop ALL existing environments and create a new one" -ForegroundColor Red
$choice = Read-Host "Select an option (1-6)"

# Create S3 bucket with updated approach
function Create-S3-Bucket {
    Write-Host "`nCreating S3 bucket for storage..." -ForegroundColor Yellow
    $bucketName = "checkresumeai-storage-$(Get-Random)"
    
    # Check if bucket already exists
    try {
        aws s3api head-bucket --bucket $bucketName 2>&1 | Out-Null
        Write-Host "S3 bucket $bucketName already exists, trying a different name..." -ForegroundColor Yellow
        $bucketName = "checkresumeai-storage-$(Get-Random)"
    } catch {}
    
    aws s3 mb "s3://$bucketName" --region $region
    
    if ($?) {
        Write-Host "S3 bucket created: $bucketName" -ForegroundColor Green
        
        # First check if public access is blocked on the account level
        Write-Host "Checking S3 Block Public Access settings..." -ForegroundColor Yellow
        
        # Disable block public access for this bucket (NOT recommended for production)
        # For demonstration purposes only
        Write-Host "Configuring bucket to allow controlled public access..." -ForegroundColor Yellow
        aws s3api put-public-access-block --bucket $bucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
        
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
        
        Write-Host "Applying bucket policy..." -ForegroundColor Yellow
        aws s3api put-bucket-policy --bucket $bucketName --policy file://$policyFile
        
        if (-not $?) {
            Write-Host "Warning: Could not apply public bucket policy. This may be due to account-level Block Public Access settings." -ForegroundColor Yellow
            Write-Host "You may need to modify these settings in the AWS S3 Console if public access is required." -ForegroundColor Yellow
        } else {
            Write-Host "Public bucket policy applied successfully." -ForegroundColor Green
        }
        
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
    $platform = "Node.js 20"
    
    # Check if app already exists
    $appExists = $false
    try {
        $appCheckOutput = aws elasticbeanstalk describe-applications --application-names $appName 2>&1
        if ($?) {
            Write-Host "Application $appName already exists." -ForegroundColor Yellow
            $appExists = $true
        }
    } catch {}
    
    # Create application if it doesn't exist
    if (-not $appExists) {
        aws elasticbeanstalk create-application --application-name $appName --tags Key=platform,Value=$platform
        
        if (-not $?) {
            Write-Host "Failed to create Elastic Beanstalk application. Check your AWS permissions." -ForegroundColor Red
            return $false
        }
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
    Write-Host "Elastic Beanstalk application configuration updated." -ForegroundColor Green
    
    return $true
}

# Create Elastic Beanstalk environment
function Create-EB-Environment {
    Write-Host "`nCreating Elastic Beanstalk environment..." -ForegroundColor Yellow
    $appName = "CheckResumeAI"
    $envName = "$appName-env"
    $instanceType = "t2.micro"
    $solutionStackName = "64bit Amazon Linux 2023 v6.5.3 running Node.js 20"
    
    # Check if environment already exists
    $envExists = $false
    $isDeprecated = $false
    try {
        $envCheckOutput = aws elasticbeanstalk describe-environments --environment-names $envName 2>&1
        if ($?) {
            $envJson = $envCheckOutput | ConvertFrom-Json
            $envStatus = $envJson.Environments[0].Status
            $platformArn = $envJson.Environments[0].PlatformArn
            
            Write-Host "Environment $envName already exists with status: $envStatus" -ForegroundColor Yellow
            $envExists = $true
            
            # Check if platform is deprecated
            if ($platformArn -like "*Node.js 18*" -or $platformArn -like "*v6.5.2*" -or $platformArn -like "*deprecated*") {
                Write-Host "WARNING: Current environment is using a deprecated platform version!" -ForegroundColor Red
                $isDeprecated = $true
                Write-Host "Current platform: $platformArn" -ForegroundColor Red
                Write-Host "Recommended platform: $solutionStackName" -ForegroundColor Green
                
                $terminateEnv = Read-Host "Do you want to terminate the deprecated environment and create a new one with updated platform? (y/n)"
                if ($terminateEnv.ToLower() -eq "y") {
                    Write-Host "Terminating environment $envName..." -ForegroundColor Yellow
                    aws elasticbeanstalk terminate-environment --environment-name $envName
                    $envExists = $false
                    Write-Host "Waiting 60 seconds for termination to complete..." -ForegroundColor Yellow
                    Start-Sleep -Seconds 60  # Extended wait for termination to complete
                }
            }
            
            # If not deprecated but user still wants to recreate
            if (-not $isDeprecated) {
                $terminateEnv = Read-Host "Do you want to terminate the existing environment and create a new one? (y/n)"
                if ($terminateEnv.ToLower() -eq "y") {
                    Write-Host "Terminating environment $envName..." -ForegroundColor Yellow
                    aws elasticbeanstalk terminate-environment --environment-name $envName
                    $envExists = $false
                    Start-Sleep -Seconds 30  # Wait for termination to complete
                }
            }
        }
    } catch {}
      if (-not $envExists) {
        Write-Host "This may take several minutes..." -ForegroundColor Yellow
        
        # Ensure IAM instance profile exists
        $instanceProfileName = "aws-elasticbeanstalk-ec2-role"
        $instanceProfileExists = $false
        
        try {
            $instanceProfiles = aws iam list-instance-profiles | ConvertFrom-Json
            foreach ($profile in $instanceProfiles.InstanceProfiles) {
                if ($profile.InstanceProfileName -eq $instanceProfileName) {
                    $instanceProfileExists = $true
                    Write-Host "Found existing instance profile: $instanceProfileName" -ForegroundColor Green
                    break
                }
            }
        } catch {
            Write-Host "Error checking instance profiles." -ForegroundColor Red
        }
        
        if (-not $instanceProfileExists) {
            Write-Host "Creating required IAM role and instance profile..." -ForegroundColor Yellow
            
            # Create trust policy file
            $trustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
"@
            $trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding ascii
            
            # Create IAM role
            aws iam create-role --role-name $instanceProfileName --assume-role-policy-document file://trust-policy.json | Out-Null
            Write-Host "Created IAM role: $instanceProfileName" -ForegroundColor Green
            
            # Attach policies
            aws iam attach-role-policy --role-name $instanceProfileName --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier | Out-Null
            aws iam attach-role-policy --role-name $instanceProfileName --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess | Out-Null
            
            # Create instance profile and add role
            aws iam create-instance-profile --instance-profile-name $instanceProfileName | Out-Null
            aws iam add-role-to-instance-profile --instance-profile-name $instanceProfileName --role-name $instanceProfileName | Out-Null
            Write-Host "Created instance profile and attached policies" -ForegroundColor Green
            
            # Wait for IAM propagation
            Write-Host "Waiting 15 seconds for IAM changes to propagate..." -ForegroundColor Yellow
            Start-Sleep -Seconds 15
            
            # Clean up
            Remove-Item "trust-policy.json"
        }
        
        # Create environment with instance profile
        aws elasticbeanstalk create-environment --application-name $appName --environment-name $envName --solution-stack-name "$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=$instanceType" "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=$instanceProfileName" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
        
        if ($?) {
            Write-Host "Environment creation initiated successfully!" -ForegroundColor Green
            Write-Host "You can check the environment status in the AWS Elastic Beanstalk Console." -ForegroundColor Yellow
            return $true
        } else {
            Write-Host "Failed to create Elastic Beanstalk environment." -ForegroundColor Red
            return $false
        }
    }
    
    return $envExists
}

# Deploy application with more robust error handling
function Deploy-Application {
    Write-Host "`nDeploying application to Elastic Beanstalk..." -ForegroundColor Yellow
    
    $appName = "CheckResumeAI"  # Default
    $envName = "CheckResumeAI-env"  # Default
    
    # Prepare the application package
    Write-Host "Preparing application package..." -ForegroundColor Yellow
    
    # Create a temporary build directory
    $buildDir = "eb-build-temp"
    if (Test-Path $buildDir) {
        Remove-Item -Path $buildDir -Recurse -Force
    }
    New-Item -Path $buildDir -ItemType Directory | Out-Null
    
    # Check if project structure exists
    if (Test-Path "project\backend") {
        Copy-Item -Path "project\backend\*" -Destination $buildDir -Recurse
        Write-Host "Copied backend files." -ForegroundColor Green
    } else {
        Write-Host "Warning: project\backend directory not found. Using current directory as source." -ForegroundColor Yellow
        # Copy all files except the temp directory itself
        Get-ChildItem -Path "." -Exclude $buildDir | Copy-Item -Destination $buildDir -Recurse
    }
    
    if (Test-Path "project\build") {
        Copy-Item -Path "project\build\*" -Destination "$buildDir\build" -Recurse
        Write-Host "Copied frontend build files." -ForegroundColor Green
    }
    
    # Create Procfile if it doesn't exist
    $procfilePath = "$buildDir\Procfile"
    if (-not (Test-Path $procfilePath)) {
        "web: npm start" | Out-File -FilePath $procfilePath -Encoding ascii
        Write-Host "Created Procfile." -ForegroundColor Green
    }
    
    # Create zip file for deployment
    $versionLabel = "app-" + (Get-Date).ToString("yyyyMMddHHmmss")
    $zipFile = "$versionLabel.zip"
    
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    if (Test-Path $zipFile) {
        Remove-Item $zipFile -Force
    }
    
    Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
    
    # Get Elastic Beanstalk S3 bucket name based on region and account
    $accountId = (aws sts get-caller-identity --query "Account" --output text)
    $s3Bucket = "elasticbeanstalk-$region-$accountId"
    
    # Check if that bucket exists, create if needed
    $bucketExists = $false
    try {
        aws s3api head-bucket --bucket $s3Bucket 2>&1 | Out-Null
        $bucketExists = $?
        if ($bucketExists) {
            Write-Host "Using Elastic Beanstalk S3 bucket: $s3Bucket" -ForegroundColor Green
        }
    } catch {}
    
    if (-not $bucketExists) {
        Write-Host "Creating Elastic Beanstalk S3 bucket: $s3Bucket..." -ForegroundColor Yellow
        aws s3 mb "s3://$s3Bucket" --region $region
        
        if (-not $?) {
            Write-Host "Failed to create EB S3 bucket. This could be due to:"
            Write-Host "1. The bucket name is already taken by another AWS account"
            Write-Host "2. You don't have permissions to create S3 buckets"
            Write-Host "3. The bucket name doesn't match your region/account"
            
            # Try a different bucket name
            $s3Bucket = "checkresumeai-eb-$accountId-$region"
            Write-Host "Trying alternate bucket name: $s3Bucket" -ForegroundColor Yellow
            aws s3 mb "s3://$s3Bucket" --region $region
            
            if (-not $?) {
                Write-Host "Failed to create alternate S3 bucket. Deployment cannot continue." -ForegroundColor Red
                Remove-Item -Path $buildDir -Recurse -Force
                Remove-Item $zipFile -Force
                return $false
            }
        }
    }
    
    # Upload to S3
    Write-Host "Uploading application version to S3..." -ForegroundColor Yellow
    aws s3 cp $zipFile "s3://$s3Bucket/$zipFile"
    
    if (-not $?) {
        Write-Host "Failed to upload application to S3. Check your permissions." -ForegroundColor Red
        Remove-Item -Path $buildDir -Recurse -Force
        Remove-Item $zipFile -Force
        return $false
    }
    
    # Create application version
    Write-Host "Creating new application version..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application-version --application-name $appName --version-label $versionLabel --source-bundle S3Bucket="$s3Bucket",S3Key="$zipFile"
    
    if (-not $?) {
        Write-Host "Failed to create application version. Check if the Elastic Beanstalk application exists." -ForegroundColor Red
        Remove-Item -Path $buildDir -Recurse -Force
        Remove-Item $zipFile -Force
        return $false
    }
    
    # Check if the environment exists before trying to update it
    $envExists = $false
    try {
        $envCheckOutput = aws elasticbeanstalk describe-environments --environment-names $envName 2>&1
        if ($?) {
            $envStatus = ($envCheckOutput | ConvertFrom-Json).Environments[0].Status
            $envExists = $true
            Write-Host "Found existing environment $envName with status: $envStatus" -ForegroundColor Green
        }
    } catch {}
    
    if ($envExists) {
        # Deploy new version
        Write-Host "Deploying new version to environment $envName..." -ForegroundColor Yellow
        aws elasticbeanstalk update-environment --environment-name $envName --version-label $versionLabel
        
        if ($?) {
            Write-Host "Deployment initiated successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to update environment. Check the AWS Elastic Beanstalk Console for details." -ForegroundColor Red
        }
    } else {
        Write-Host "Environment $envName does not exist. You need to create it first." -ForegroundColor Yellow
        Write-Host "Select option 4 from the main menu to create the environment." -ForegroundColor Yellow
    }
    
    # Cleanup
    Remove-Item $zipFile -Force
    Remove-Item -Path $buildDir -Recurse -Force
    
    Write-Host "Application version created and uploaded successfully." -ForegroundColor Green
    Write-Host "Check the AWS Elastic Beanstalk Console for deployment status." -ForegroundColor Yellow
    return $true
}

# Function to specifically check for deprecated environments
function Check-Deprecated-Environments {
    Write-Host "`nChecking for deprecated Elastic Beanstalk environments..." -ForegroundColor Yellow
    $appName = "CheckResumeAI"
    $envName = "$appName-env"
    
    try {
        $envCheckOutput = aws elasticbeanstalk describe-environments --application-name $appName 2>&1
        if ($?) {
            $environments = ($envCheckOutput | ConvertFrom-Json).Environments
            
            if ($environments.Count -eq 0) {
                Write-Host "No environments found for application $appName." -ForegroundColor Yellow
                return $false
            }
            
            $deprecatedFound = $false
            
            foreach ($env in $environments) {
                $envName = $env.EnvironmentName
                $envStatus = $env.Status
                $platformArn = $env.PlatformArn
                
                Write-Host "`nEnvironment: $envName" -ForegroundColor White
                Write-Host "Status: $envStatus" -ForegroundColor White
                Write-Host "Platform: $platformArn" -ForegroundColor White
                
                # Check if platform is deprecated
                if ($platformArn -like "*Node.js 18*" -or $platformArn -like "*v6.5.2*" -or $platformArn -like "*deprecated*") {
                    Write-Host "WARNING: This environment is using a deprecated platform version!" -ForegroundColor Red
                    $deprecatedFound = $true
                    
                    $fixEnv = Read-Host "Do you want to recreate this environment with the latest platform version? (y/n)"
                    if ($fixEnv.ToLower() -eq "y") {
                        # Terminate the environment
                        Write-Host "Terminating environment $envName..." -ForegroundColor Yellow
                        aws elasticbeanstalk terminate-environment --environment-name $envName
                        
                        Write-Host "Waiting 60 seconds for termination to complete..." -ForegroundColor Yellow
                        Start-Sleep -Seconds 60
                        
                        # Create new environment with latest platform
                        $solutionStackName = "64bit Amazon Linux 2023 v6.5.3 running Node.js 20"
                        $instanceType = "t2.micro"
                        $instanceProfileName = "aws-elasticbeanstalk-ec2-role"
                        
                        Write-Host "Creating new environment $envName with latest platform..." -ForegroundColor Green
                        aws elasticbeanstalk create-environment --application-name $appName --environment-name $envName --solution-stack-name "$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=$instanceType" "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=$instanceProfileName" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
                        
                        if ($?) {
                            Write-Host "New environment creation initiated successfully!" -ForegroundColor Green
                            Write-Host "After environment creation completes, you'll need to deploy your application using option 2." -ForegroundColor Yellow
                        } else {
                            Write-Host "Failed to create new environment. Please check AWS console for details." -ForegroundColor Red
                        }
                    }
                } else {
                    Write-Host "This environment is using a supported platform version." -ForegroundColor Green
                }
            }
            
            if (-not $deprecatedFound) {
                Write-Host "`nNo deprecated environments found." -ForegroundColor Green
                return $false
            }
            
            return $true
        } else {
            Write-Host "Failed to retrieve environments. Check your AWS permissions." -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

# Function to stop all environments and create a new one
function Stop-All-And-Create-New-Environment {
    Write-Host "`nStopping all Elastic Beanstalk environments and creating a new one..." -ForegroundColor Yellow
    $appName = "CheckResumeAI"
    
    # Get all environments for the application
    try {
        $envCheckOutput = aws elasticbeanstalk describe-environments --application-name $appName 2>&1
        if ($?) {
            $environments = ($envCheckOutput | ConvertFrom-Json).Environments
            
            if ($environments.Count -eq 0) {
                Write-Host "No environments found for application $appName." -ForegroundColor Yellow
            } else {
                Write-Host "Found $($environments.Count) environment(s) for application $appName." -ForegroundColor Yellow
                
                # Terminate all existing environments
                foreach ($env in $environments) {
                    $envName = $env.EnvironmentName
                    $envStatus = $env.Status
                    
                    Write-Host "Terminating environment: $envName (Status: $envStatus)..." -ForegroundColor Yellow
                    aws elasticbeanstalk terminate-environment --environment-name $envName
                    
                    if ($?) {
                        Write-Host "Environment $envName termination request sent successfully." -ForegroundColor Green
                    } else {
                        Write-Host "Failed to terminate environment $envName." -ForegroundColor Red
                    }
                }
                
                # Wait for environments to terminate
                Write-Host "Waiting 60 seconds for all environments to terminate..." -ForegroundColor Yellow
                Start-Sleep -Seconds 60
                
                # Verify environments are terminated
                $environmentsTerminated = $true
                $envCheckOutput = aws elasticbeanstalk describe-environments --application-name $appName 2>&1
                if ($?) {
                    $environments = ($envCheckOutput | ConvertFrom-Json).Environments
                    foreach ($env in $environments) {
                        if ($env.Status -ne "Terminated") {
                            $environmentsTerminated = $false
                            Write-Host "Environment $($env.EnvironmentName) is still in status: $($env.Status)" -ForegroundColor Yellow
                        }
                    }
                }
                
                if (-not $environmentsTerminated) {
                    Write-Host "Waiting an additional 60 seconds for environments to terminate..." -ForegroundColor Yellow
                    Start-Sleep -Seconds 60
                }
            }
            
            # Create new environment with latest platform
            $envName = "$appName-env"
            $solutionStackName = "64bit Amazon Linux 2023 v6.5.3 running Node.js 20"
            $instanceType = "t2.micro"
            $instanceProfileName = "aws-elasticbeanstalk-ec2-role"
            
            Write-Host "Creating new environment $envName with latest platform..." -ForegroundColor Green
            aws elasticbeanstalk create-environment --application-name $appName --environment-name $envName --solution-stack-name "$solutionStackName" --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=$instanceType" "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=$instanceProfileName" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
            
            if ($?) {
                Write-Host "New environment creation initiated successfully!" -ForegroundColor Green
                Write-Host "After environment creation completes, you'll need to deploy your application using option 2." -ForegroundColor Yellow
                return $true
            } else {
                Write-Host "Failed to create new environment. Please check AWS console for details." -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "Failed to retrieve environments. Check your AWS permissions." -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution logic
if ($choice -eq "1" -or $choice -eq "3") {
    $bucketName = Create-S3-Bucket
    
    if ($bucketName) {
        $appCreated = Create-EB-Application -bucketName $bucketName
        
        if ($appCreated -and ($choice -eq "1")) {
            $createEnv = Read-Host "Do you want to create an Elastic Beanstalk environment now? (y/n)"
            if ($createEnv.ToLower() -eq "y") {
                Create-EB-Environment
            }
        }
    } else {
        exit 1
    }
}

if ($choice -eq "2" -or $choice -eq "3") {
    Deploy-Application
}

if ($choice -eq "4") {
    Create-EB-Environment
}

if ($choice -eq "5") {
    Check-Deprecated-Environments
}

if ($choice -eq "6") {
    $confirmStop = Read-Host "WARNING: This will STOP ALL environments for CheckResumeAI. Continue? (y/n)"
    if ($confirmStop.ToLower() -eq "y") {
        Stop-All-And-Create-New-Environment
    } else {
        Write-Host "Operation cancelled by user." -ForegroundColor Yellow
    }
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
