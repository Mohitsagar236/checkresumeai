# Fix Deprecated Platform Issues for Elastic Beanstalk
# This script creates a fresh environment with the latest platform version

Write-Host "Fix Deprecated Platform for Elastic Beanstalk" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verify AWS credentials
try {
    $identity = aws sts get-caller-identity 2>$null
    if ($?) {
        $accountId = ($identity | ConvertFrom-Json).Account
        Write-Host "AWS credentials are valid. Account ID: $accountId" -ForegroundColor Green
    } else {
        Write-Host "AWS credentials are not valid or not configured." -ForegroundColor Red
        Write-Host "Please run 'aws configure' to set up your credentials." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "AWS credentials are not valid or AWS CLI is not installed." -ForegroundColor Red
    exit 1
}

# Get current region
$region = aws configure get region 2>$null
if (-not $?) {
    $region = "ap-south-1"  # Default region
    Write-Host "Using default region: $region" -ForegroundColor Yellow
}

# Application details
$appName = "CheckResumeAI"
$oldEnvName = "$appName-env"
$newEnvName = "$appName-env-new"
$latestPlatformArn = "arn:aws:elasticbeanstalk:$region::platform/Node.js 18 running on 64bit Amazon Linux 2023/6.5.2"

# Step 1: Get the current application version
Write-Host "`nStep 1: Checking current environment details..." -ForegroundColor Yellow
try {
    $envInfo = aws elasticbeanstalk describe-environments --environment-names $oldEnvName | ConvertFrom-Json
    if ($envInfo.Environments.Count -eq 0) {
        Write-Host "Environment $oldEnvName not found." -ForegroundColor Red
        exit 1
    }
    
    $currentVersionLabel = $envInfo.Environments[0].VersionLabel
    $currentCNAME = $envInfo.Environments[0].CNAME
    
    Write-Host "Current environment CNAME: $currentCNAME" -ForegroundColor Yellow
    Write-Host "Current version label: $currentVersionLabel" -ForegroundColor Yellow
} catch {
    Write-Host "Error retrieving environment information." -ForegroundColor Red
    exit 1
}

# Step 2: Ensure IAM instance profile exists
Write-Host "`nStep 2: Checking and creating IAM instance profile..." -ForegroundColor Yellow
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

# Step 3: Create a new environment with the latest platform version
Write-Host "`nStep 3: Creating new environment with latest platform..." -ForegroundColor Yellow
Write-Host "This will create a new environment named $newEnvName with the latest platform version." -ForegroundColor Yellow
$confirm = Read-Host "Do you want to continue? (y/n)"

if ($confirm.ToLower() -ne "y") {
    Write-Host "Operation canceled." -ForegroundColor Red
    exit 0
}

Write-Host "`nCreating new environment. This may take several minutes..." -ForegroundColor Yellow
try {
    aws elasticbeanstalk create-environment `
        --application-name $appName `
        --environment-name $newEnvName `
        --platform-arn $latestPlatformArn `
        --version-label $currentVersionLabel `
        --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t2.micro" `
                          "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=$instanceProfileName" `
                          "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
                          "Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production"
    
    if ($?) {
        Write-Host "New environment creation initiated!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create new environment." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error creating new environment." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 4: Wait for the new environment to be ready
Write-Host "`nStep 4: Waiting for new environment to be ready..." -ForegroundColor Yellow
$ready = $false
$attempts = 0
$maxAttempts = 20  # About 10 minutes

while (-not $ready -and $attempts -lt $maxAttempts) {
    $attempts++
    Write-Host "Checking environment status (Attempt $attempts/$maxAttempts)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    try {
        $envInfo = aws elasticbeanstalk describe-environments --environment-names $newEnvName | ConvertFrom-Json
        $status = $envInfo.Environments[0].Status
        $health = $envInfo.Environments[0].Health
        
        Write-Host "Status: $status, Health: $health" -ForegroundColor Yellow
        
        if ($status -eq "Ready") {
            $ready = $true
            $newCNAME = $envInfo.Environments[0].CNAME
            Write-Host "New environment is ready! CNAME: $newCNAME" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error checking environment status." -ForegroundColor Red
    }
}

if (-not $ready) {
    Write-Host "Environment creation is taking longer than expected." -ForegroundColor Yellow
    Write-Host "Please check the AWS Elastic Beanstalk Console for status." -ForegroundColor Yellow
    exit 0
}

# Step 5: Swap environment URLs
Write-Host "`nStep 5: Swap URLs between old and new environments" -ForegroundColor Yellow
$swapConfirm = Read-Host "Would you like to swap URLs to use the new environment? (y/n)"

if ($swapConfirm.ToLower() -eq "y") {
    Write-Host "Swapping environment URLs..." -ForegroundColor Yellow
    try {
        aws elasticbeanstalk swap-environment-cnames --source-environment-name $oldEnvName --destination-environment-name $newEnvName
        
        if ($?) {
            Write-Host "Environment URLs swapped successfully!" -ForegroundColor Green
            Write-Host "The new environment is now serving traffic at $currentCNAME" -ForegroundColor Green
        } else {
            Write-Host "Failed to swap environment URLs." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error swapping environment URLs." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Step 6: Ask to terminate the old environment
$terminateOld = Read-Host "`nDo you want to terminate the old environment ($oldEnvName)? (y/n)"

if ($terminateOld.ToLower() -eq "y") {
    Write-Host "Terminating old environment..." -ForegroundColor Yellow
    try {
        aws elasticbeanstalk terminate-environment --environment-name $oldEnvName
        
        if ($?) {
            Write-Host "Old environment termination initiated successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to terminate old environment." -ForegroundColor Red
        }
    } catch {
        Write-Host "Error terminating old environment." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- New environment: $newEnvName" -ForegroundColor White
Write-Host "- Platform: Node.js 18 running on 64bit Amazon Linux 2023/6.5.2 (Latest)" -ForegroundColor White
Write-Host "- Application Version: $currentVersionLabel" -ForegroundColor White
if ($swapConfirm.ToLower() -eq "y") {
    Write-Host "- The new environment is now serving traffic at $currentCNAME" -ForegroundColor White
} else {
    Write-Host "- The new environment is available at $newCNAME" -ForegroundColor White
    Write-Host "- You can swap URLs later using the AWS Elastic Beanstalk Console" -ForegroundColor White
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Verify that your application is working correctly in the new environment" -ForegroundColor White
Write-Host "2. Monitor application performance and logs" -ForegroundColor White
if ($terminateOld.ToLower() -ne "y") {
    Write-Host "3. Once verified, you can terminate the old environment to save resources" -ForegroundColor White
}

Write-Host "`nAWS Free Tier Usage Reminder:" -ForegroundColor Magenta
Write-Host "- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)" -ForegroundColor White
Write-Host "- 5GB of S3 storage" -ForegroundColor White
Write-Host "- Use .\monitor-aws-usage.ps1 to check your usage regularly!" -ForegroundColor White
