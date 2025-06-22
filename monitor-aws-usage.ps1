# CheckResumeAI AWS Free Tier Usage Monitor
# This script helps you monitor your AWS Free Tier usage to avoid unexpected charges

param (
    [switch]$EC2 = $false,
    [switch]$RDS = $false,
    [switch]$S3 = $false,
    [switch]$All = $false,
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "CheckResumeAI AWS Free Tier Usage Monitor"
    Write-Host "====================================="
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -EC2  : Check EC2/Elastic Beanstalk usage"
    Write-Host "  -RDS  : Check RDS database usage"
    Write-Host "  -S3   : Check S3 storage usage"
    Write-Host "  -All  : Check all services"
    Write-Host "  -Help : Show this help message"
    Write-Host ""
    Write-Host "Example: .\monitor-aws-usage.ps1 -All"
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

function Get-EC2Usage {
    Write-Host "`nChecking EC2/Elastic Beanstalk usage..." -ForegroundColor Cyan
    
    # Get running EC2 instances
    $instances = aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" | ConvertFrom-Json
    
    $totalInstances = 0
    $totalHours = 0
    
    foreach ($reservation in $instances.Reservations) {
        foreach ($instance in $reservation.Instances) {
            $totalInstances++
            
            $launchTime = [DateTime]::Parse($instance.LaunchTime)
            $uptime = [math]::Round(((Get-Date) - $launchTime).TotalHours, 2)
            
            Write-Host "Instance ID: $($instance.InstanceId)" -ForegroundColor Yellow
            Write-Host "  Type: $($instance.InstanceType)"
            Write-Host "  Running for: $uptime hours"
            
            $totalHours += $uptime
        }
    }
    
    # Free tier allowance
    $freeTierHours = 750
    $usagePercentage = [math]::Round(($totalHours / $freeTierHours) * 100, 2)
    
    Write-Host "`nTotal EC2/Elastic Beanstalk usage:" -ForegroundColor Green
    Write-Host "  Running instances: $totalInstances"
    Write-Host "  Total hours this month: $totalHours hours"
    Write-Host "  Free tier allowance: $freeTierHours hours"
    Write-Host "  Usage percentage: $usagePercentage%"
    
    if ($usagePercentage -gt 80) {
        Write-Host "  WARNING: You're approaching your free tier limit!" -ForegroundColor Red
    }
}

function Get-RDSUsage {
    Write-Host "`nChecking RDS database usage..." -ForegroundColor Cyan
    
    # Get RDS instances
    $rdsInstances = aws rds describe-db-instances | ConvertFrom-Json
    
    $totalInstances = 0
    $totalStorage = 0
    
    foreach ($instance in $rdsInstances.DBInstances) {
        $totalInstances++
        $totalStorage += $instance.AllocatedStorage
        
        # Calculate uptime (approximate)
        $createTime = [DateTime]::Parse($instance.InstanceCreateTime)
        $uptime = [math]::Round(((Get-Date) - $createTime).TotalHours, 2)
        
        Write-Host "DB Instance ID: $($instance.DBInstanceIdentifier)" -ForegroundColor Yellow
        Write-Host "  Type: $($instance.DBInstanceClass)"
        Write-Host "  Engine: $($instance.Engine) $($instance.EngineVersion)"
        Write-Host "  Storage: $($instance.AllocatedStorage) GB"
        Write-Host "  Running for: $uptime hours since creation"
    }
    
    # Free tier allowance
    $freeTierHours = 750
    $freeTierStorage = 20
    
    Write-Host "`nTotal RDS usage:" -ForegroundColor Green
    Write-Host "  Running DB instances: $totalInstances"
    Write-Host "  Total storage: $totalStorage GB"
    Write-Host "  Free tier storage allowance: $freeTierStorage GB"
    
    if ($totalStorage -gt $freeTierStorage) {
        Write-Host "  WARNING: You're exceeding your free tier storage limit!" -ForegroundColor Red
    }
}

function Get-S3Usage {
    Write-Host "`nChecking S3 storage usage..." -ForegroundColor Cyan
    
    # Get S3 buckets
    $buckets = aws s3api list-buckets | ConvertFrom-Json
    
    foreach ($bucket in $buckets.Buckets) {
        $bucketName = $bucket.Name
        
        # Skip if not related to CheckResumeAI
        if ($bucketName -notlike "*checkresumeai*") {
            continue
        }
        
        Write-Host "Bucket: $bucketName" -ForegroundColor Yellow
        
        # Get bucket size (this requires the AWS CLI metrics package)
        try {
            $metrics = aws s3api list-objects-v2 --bucket $bucketName --query "[sum(Contents[].Size), length(Contents[])]" | ConvertFrom-Json
            
            if ($metrics -and $metrics.Count -ge 2) {
                $totalSize = $metrics[0] / 1GB
                $totalObjects = $metrics[1]
                Write-Host "  Size: $([math]::Round($totalSize, 2)) GB"
                Write-Host "  Objects: $totalObjects"
            }
            else {
                Write-Host "  Size: 0 GB (empty bucket)"
                Write-Host "  Objects: 0"
            }
        }
        catch {
            Write-Host "  Unable to get size metrics."
        }
    }
    
    # Free tier allowance
    $freeTierStorage = 5
    
    Write-Host "`nS3 Free Tier Limits:" -ForegroundColor Green
    Write-Host "  Storage: $freeTierStorage GB"
    Write-Host "  PUT Requests: 2,000 per month"
    Write-Host "  GET Requests: 20,000 per month"
    
    Write-Host "`nNote: To view detailed S3 usage metrics, visit the AWS Billing Dashboard." -ForegroundColor Cyan
}

function Show-FreeTierSummary {
    Write-Host "`n======================================" -ForegroundColor Magenta
    Write-Host "AWS Free Tier Summary for CheckResumeAI" -ForegroundColor Magenta
    Write-Host "======================================" -ForegroundColor Magenta
    Write-Host "EC2/Elastic Beanstalk: 750 hours of t2.micro per month"
    Write-Host "RDS: 750 hours of db.t2.micro + 20 GB storage per month"
    Write-Host "S3: 5 GB storage + 20,000 GET + 2,000 PUT requests per month"
    Write-Host "`nTo view complete usage and billing information, visit:"
    Write-Host "https://console.aws.amazon.com/billing/home#/freetier" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Magenta
}

# Main execution

if ($Help) {
    Show-Help
    exit 0
}

# Check for AWS CLI
$awsCliInstalled = Test-AwsCli

if (-not $awsCliInstalled) {
    Write-Host "Please install the AWS CLI and run the script again." -ForegroundColor Red
    exit 1
}

# Configure AWS CLI if not already done
$awsConfigured = aws configure list
if ($LASTEXITCODE -ne 0) {
    Write-Host "AWS CLI not configured. Running aws configure..." -ForegroundColor Yellow
    aws configure
}

# Run selected operations
if ($EC2 -or $All) {
    Get-EC2Usage
}

if ($RDS -or $All) {
    Get-RDSUsage
}

if ($S3 -or $All) {
    Get-S3Usage
}

if (-not $EC2 -and -not $RDS -and -not $S3 -and -not $All -and -not $Help) {
    Show-Help
}

Show-FreeTierSummary
