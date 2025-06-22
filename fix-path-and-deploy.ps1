# Fix PATH and Deploy Script for CheckResumeAI
# This script refreshes the PATH and helps with AWS CLI and EB CLI recognition

Write-Host "PATH Refresh and Deployment Helper" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Refresh the PATH environment variable
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "PATH environment variable refreshed" -ForegroundColor Green

# Function to locate an executable
function Find-Executable {
    param (
        [string]$Name,
        [string[]]$PossiblePaths
    )

    # First try to find in PATH
    try {
        $exePath = (Get-Command $Name -ErrorAction Stop).Source
        return $exePath
    }
    catch {
        # If not in PATH, check common installation locations
        foreach ($path in $PossiblePaths) {
            if (Test-Path $path) {
                return $path
            }
        }
    }
    
    return $null
}

# Check AWS CLI
$awsPath = Find-Executable -Name "aws" -PossiblePaths @(
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
)

if ($awsPath) {
    Write-Host "AWS CLI found at: $awsPath" -ForegroundColor Green
    # Add to current session PATH if not already there
    if ($env:Path -notlike "*$(Split-Path $awsPath)*") {
        $env:Path = "$(Split-Path $awsPath);" + $env:Path
    }
    # Display version
    $awsVersion = & $awsPath --version
    Write-Host "AWS CLI version: $awsVersion" -ForegroundColor Green
}
else {
    Write-Host "AWS CLI not found. Please run install-aws-cli.ps1 first." -ForegroundColor Red
    exit 1
}

# Check for Python and pip (needed for EB CLI)
$pythonPath = Find-Executable -Name "python" -PossiblePaths @(
    "C:\Python310\python.exe", 
    "C:\Program Files\Python310\python.exe",
    "C:\Program Files (x86)\Python310\python.exe",
    "C:\Python39\python.exe", 
    "C:\Program Files\Python39\python.exe",
    "C:\Program Files (x86)\Python39\python.exe"
)

if ($pythonPath) {
    Write-Host "Python found at: $pythonPath" -ForegroundColor Green
    # Add to current session PATH if not already there
    if ($env:Path -notlike "*$(Split-Path $pythonPath)*") {
        $env:Path = "$(Split-Path $pythonPath);" + $env:Path
        $env:Path = "$(Split-Path $pythonPath)\Scripts;" + $env:Path
    }
    # Display version
    $pythonVersion = & $pythonPath --version
    Write-Host "Python version: $pythonVersion" -ForegroundColor Green
    
    # Check for EB CLI in Python Scripts directory
    $ebPath = Find-Executable -Name "eb" -PossiblePaths @(
        "$(Split-Path $pythonPath)\Scripts\eb.exe"
    )
    
    if ($ebPath) {
        Write-Host "EB CLI found at: $ebPath" -ForegroundColor Green
        # Display version
        $ebVersion = & $ebPath --version
        Write-Host "EB CLI version: $ebVersion" -ForegroundColor Green
    }
    else {
        Write-Host "EB CLI not found. Installing..." -ForegroundColor Yellow
        & $pythonPath -m pip install awsebcli
        
        # Verify installation
        $ebPath = "$(Split-Path $pythonPath)\Scripts\eb.exe"
        if (Test-Path $ebPath) {
            Write-Host "EB CLI installed successfully" -ForegroundColor Green
            $ebVersion = & $ebPath --version
            Write-Host "EB CLI version: $ebVersion" -ForegroundColor Green
        }
        else {
            Write-Host "Failed to install EB CLI. Please run install-eb-cli.ps1 again." -ForegroundColor Red
            exit 1
        }
    }
}
else {
    Write-Host "Python not found. Please run install-eb-cli.ps1 first." -ForegroundColor Red
    exit 1
}

# Make aliases for the current session
Set-Alias -Name aws -Value $awsPath -Scope Global -Force
Set-Alias -Name eb -Value $ebPath -Scope Global -Force

Write-Host "`nPATH and tools configured successfully for this session!" -ForegroundColor Green
Write-Host "You can now run the deployment script." -ForegroundColor Cyan
Write-Host "`nOptions:" -ForegroundColor Yellow
Write-Host "1. Initialize infrastructure: .\deploy-aws-simple.ps1 -InitInfrastructure" -ForegroundColor White
Write-Host "2. Deploy application: .\deploy-aws-simple.ps1 -DeployApp" -ForegroundColor White

# Ask if user wants to run the deployment
$choice = Read-Host "`nDo you want to initialize infrastructure now? (Y/N)"
if ($choice -eq "Y" -or $choice -eq "y") {
    Write-Host "Running: .\deploy-aws-simple.ps1 -InitInfrastructure" -ForegroundColor Cyan
    & "$PSScriptRoot\deploy-aws-simple.ps1" -InitInfrastructure
}
