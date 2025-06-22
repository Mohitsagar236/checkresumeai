# AWS Direct API Diagnostic Tool
# This script tests AWS API access directly without using EB CLI

Write-Host "AWS Direct API Diagnostics" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Test AWS Identity
Write-Host "`nTesting AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        $identityJson = $identity | ConvertFrom-Json
        Write-Host "AWS credentials are valid!" -ForegroundColor Green
        Write-Host "Account ID: $($identityJson.Account)" -ForegroundColor Green
        Write-Host "User ARN: $($identityJson.Arn)" -ForegroundColor Green
    } else {
        Write-Host "AWS credentials error: $identity" -ForegroundColor Red
        Write-Host "Please run 'aws configure' to set up your credentials." -ForegroundColor Yellow
    }
} catch {
    Write-Host "AWS credentials error: $_" -ForegroundColor Red
    Write-Host "Please run 'aws configure' to set up your credentials." -ForegroundColor Yellow
}

# Test S3 Access
Write-Host "`nTesting S3 access..." -ForegroundColor Yellow
try {
    $s3Buckets = aws s3 ls 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "S3 access successful!" -ForegroundColor Green
        if ($s3Buckets) {
            Write-Host "Your S3 buckets:" -ForegroundColor Green
            Write-Host $s3Buckets -ForegroundColor White
        } else {
            Write-Host "No S3 buckets found in your account." -ForegroundColor Yellow
        }
    } else {
        Write-Host "S3 access error: $s3Buckets" -ForegroundColor Red
    }
} catch {
    Write-Host "S3 access error: $_" -ForegroundColor Red
}

# Test Elastic Beanstalk Access
Write-Host "`nTesting Elastic Beanstalk access..." -ForegroundColor Yellow
try {
    $ebApps = aws elasticbeanstalk describe-applications 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Elastic Beanstalk access successful!" -ForegroundColor Green
        $ebAppsJson = $ebApps | ConvertFrom-Json
        if ($ebAppsJson.Applications.Count -gt 0) {
            Write-Host "Your Elastic Beanstalk applications:" -ForegroundColor Green
            foreach ($app in $ebAppsJson.Applications) {
                Write-Host "- $($app.ApplicationName) (Created: $($app.DateCreated))" -ForegroundColor White
            }
            
            # Test environments
            Write-Host "`nTesting Elastic Beanstalk environments..." -ForegroundColor Yellow
            $ebEnvs = aws elasticbeanstalk describe-environments 2>&1
            if ($LASTEXITCODE -eq 0) {
                $ebEnvsJson = $ebEnvs | ConvertFrom-Json
                if ($ebEnvsJson.Environments.Count -gt 0) {
                    Write-Host "Your Elastic Beanstalk environments:" -ForegroundColor Green
                    foreach ($env in $ebEnvsJson.Environments) {
                        Write-Host "- $($env.EnvironmentName) (Status: $($env.Status), Health: $($env.Health))" -ForegroundColor White
                        if ($env.CNAME) {
                            Write-Host "  URL: http://$($env.CNAME)" -ForegroundColor Cyan
                        }
                    }
                } else {
                    Write-Host "No Elastic Beanstalk environments found." -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "No Elastic Beanstalk applications found." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Elastic Beanstalk access error: $ebApps" -ForegroundColor Red
    }
} catch {
    Write-Host "Elastic Beanstalk access error: $_" -ForegroundColor Red
}

# Test EC2 Access
Write-Host "`nTesting EC2 access..." -ForegroundColor Yellow
try {
    $ec2Instances = aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]" --output json 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "EC2 access successful!" -ForegroundColor Green
        $ec2InstancesJson = $ec2Instances | ConvertFrom-Json
        if ($ec2InstancesJson.Count -gt 0 -and $ec2InstancesJson[0].Count -gt 0) {
            Write-Host "Your EC2 instances:" -ForegroundColor Green
            foreach ($instance in $ec2InstancesJson) {
                foreach ($i in $instance) {
                    Write-Host "- $($i[0]) (Status: $($i[1]), Type: $($i[2]))" -ForegroundColor White
                }
            }
        } else {
            Write-Host "No EC2 instances found." -ForegroundColor Yellow
        }
    } else {
        Write-Host "EC2 access error: $ec2Instances" -ForegroundColor Red
    }
} catch {
    Write-Host "EC2 access error: $_" -ForegroundColor Red
}

# Check AWS Region
Write-Host "`nChecking AWS region configuration..." -ForegroundColor Yellow
try {
    $region = aws configure get region 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "AWS region: $region" -ForegroundColor Green
        
        # Check if the region is Free Tier eligible
        $freeTierRegions = @(
            "us-east-1", # N. Virginia
            "us-east-2", # Ohio
            "us-west-2", # Oregon
            "eu-west-1", # Ireland
            "ap-south-1", # Mumbai
            "ap-northeast-1", # Tokyo
            "ap-northeast-2", # Seoul
            "ap-southeast-1", # Singapore
            "ap-southeast-2"  # Sydney
        )
        
        if ($freeTierRegions -contains $region) {
            Write-Host "This region is eligible for AWS Free Tier resources." -ForegroundColor Green
        } else {
            Write-Host "WARNING: This region may not support all Free Tier resources." -ForegroundColor Yellow
            Write-Host "Consider using one of these Free Tier regions: $($freeTierRegions -join ', ')" -ForegroundColor Yellow
        }
    } else {
        Write-Host "AWS region not configured: $region" -ForegroundColor Red
        Write-Host "Please run 'aws configure' to set your region." -ForegroundColor Yellow
    }
} catch {
    Write-Host "AWS region error: $_" -ForegroundColor Red
}

Write-Host "`nDiagnostics Summary:" -ForegroundColor Cyan
Write-Host "1. To deploy using AWS CLI directly, run:" -ForegroundColor White
Write-Host "   .\aws-direct-deploy.ps1" -ForegroundColor Green

Write-Host "`n2. To monitor your AWS Free Tier usage:" -ForegroundColor White
Write-Host "   .\monitor-aws-usage.ps1" -ForegroundColor Green

Write-Host "`nRemember to clean up resources when not in use to avoid unexpected charges." -ForegroundColor Magenta
