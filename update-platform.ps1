# Update Elastic Beanstalk Platform Version
# This script updates the platform version of an existing Elastic Beanstalk environment

Write-Host "Updating Elastic Beanstalk Platform Version" -ForegroundColor Cyan
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

# Environment details
$appName = "CheckResumeAI"
$envName = "$appName-env"
$newPlatformArn = "arn:aws:elasticbeanstalk:ap-south-1::platform/Node.js 18 running on 64bit Amazon Linux 2023/6.5.2"

# Get current environment info
Write-Host "Checking current environment status..." -ForegroundColor Yellow
try {
    $envInfo = aws elasticbeanstalk describe-environments --environment-names $envName | ConvertFrom-Json
    if ($envInfo.Environments.Count -eq 0) {
        Write-Host "Environment $envName not found." -ForegroundColor Red
        exit 1
    }
    
    $currentStatus = $envInfo.Environments[0].Status
    $currentPlatform = $envInfo.Environments[0].PlatformArn
    
    Write-Host "Current environment status: $currentStatus" -ForegroundColor Yellow
    Write-Host "Current platform: $currentPlatform" -ForegroundColor Yellow
    
    if ($currentStatus -ne "Ready") {
        Write-Host "Environment is not in a Ready state. Cannot update platform." -ForegroundColor Red
        Write-Host "Please wait until the environment is Ready and try again." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Error retrieving environment information." -ForegroundColor Red
    exit 1
}

# Get current application version
$currentVersionLabel = $envInfo.Environments[0].VersionLabel
Write-Host "Current version label: $currentVersionLabel" -ForegroundColor Yellow

# Confirm update
Write-Host "`nThis will update the platform for environment $envName from:" -ForegroundColor Yellow
Write-Host "  - $currentPlatform" -ForegroundColor Yellow
Write-Host "To:" -ForegroundColor Yellow
Write-Host "  - $newPlatformArn" -ForegroundColor Yellow
$confirm = Read-Host "`nDo you want to continue? (y/n)"

if ($confirm.ToLower() -ne "y") {
    Write-Host "Platform update canceled." -ForegroundColor Red
    exit 0
}

# Check and update IAM instance profile
Write-Host "`nChecking IAM instance profile..." -ForegroundColor Yellow
$instanceProfileExists = $false

try {
    $instanceProfiles = aws iam list-instance-profiles | ConvertFrom-Json
    foreach ($profile in $instanceProfiles.InstanceProfiles) {
        if ($profile.InstanceProfileName -eq "aws-elasticbeanstalk-ec2-role") {
            $instanceProfileExists = $true
            Write-Host "Found existing instance profile: aws-elasticbeanstalk-ec2-role" -ForegroundColor Green
            break
        }
    }
} catch {
    Write-Host "Error checking instance profiles." -ForegroundColor Red
}

# Create instance profile if it doesn't exist
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
    try {
        aws iam create-role --role-name aws-elasticbeanstalk-ec2-role --assume-role-policy-document file://trust-policy.json | Out-Null
        Write-Host "Created IAM role: aws-elasticbeanstalk-ec2-role" -ForegroundColor Green
        
        # Attach policies
        aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier | Out-Null
        aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess | Out-Null
        aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess | Out-Null
        
        # Create instance profile and add role
        aws iam create-instance-profile --instance-profile-name aws-elasticbeanstalk-ec2-role | Out-Null
        aws iam add-role-to-instance-profile --instance-profile-name aws-elasticbeanstalk-ec2-role --role-name aws-elasticbeanstalk-ec2-role | Out-Null
        Write-Host "Created instance profile and attached policies" -ForegroundColor Green
        
        # Clean up
        Remove-Item "trust-policy.json"
    } catch {
        Write-Host "Error creating IAM resources. Continuing with existing permissions." -ForegroundColor Yellow
    }
}

# Update the platform version
Write-Host "`nUpdating platform version with proper instance profile..." -ForegroundColor Yellow
Write-Host "This may take several minutes to complete." -ForegroundColor Yellow

try {
    aws elasticbeanstalk update-environment --environment-name $envName --platform-arn $newPlatformArn --version-label $currentVersionLabel --option-settings "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role" "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
    
    if ($?) {
        Write-Host "Platform update initiated successfully!" -ForegroundColor Green
        Write-Host "Check the AWS Elastic Beanstalk Console for update status." -ForegroundColor Yellow
        Write-Host "Note: It may take 5-10 minutes for the update to complete." -ForegroundColor Yellow
    } else {
        Write-Host "Failed to update platform. See error message above." -ForegroundColor Red
    }
} catch {
    Write-Host "Error updating environment platform." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`nTo check the status, run:" -ForegroundColor Cyan
Write-Host "aws elasticbeanstalk describe-environments --environment-names $envName" -ForegroundColor White
