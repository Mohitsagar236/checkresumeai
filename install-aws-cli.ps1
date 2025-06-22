# AWS CLI Installation and Setup Script for Windows
# This script will download and install AWS CLI v2 for Windows

Write-Host "AWS CLI Installation Script" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Check if AWS CLI is installed
$awsInstalled = $false
try {
    $awsPath = (Get-Command aws -ErrorAction Stop).Source
    $awsVersion = & aws --version
    Write-Host "AWS CLI is already installed: $awsVersion" -ForegroundColor Green
    $awsInstalled = $true
}
catch {
    Write-Host "AWS CLI is not installed. Proceeding with installation..." -ForegroundColor Yellow
}

# If AWS CLI is not installed, download and install it
if (-not $awsInstalled) {
    # Set file paths
    $downloadDir = "$env:TEMP"
    $installerPath = "$downloadDir\AWSCLIV2.msi"

    # Download AWS CLI installer
    Write-Host "Downloading AWS CLI v2 installer..." -ForegroundColor Yellow
    $url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $installerPath
        Write-Host "Download complete." -ForegroundColor Green

        # Install AWS CLI
        Write-Host "Installing AWS CLI v2. This might take a few minutes..." -ForegroundColor Yellow
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $installerPath, "/quiet", "/norestart" -Wait
        Write-Host "AWS CLI installation completed." -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to download or install AWS CLI. Error: $_" -ForegroundColor Red
        Write-Host "Please download and install AWS CLI manually from: https://aws.amazon.com/cli/" -ForegroundColor Red
        exit 1
    }
    
    # Add AWS CLI to PATH (might require restart)
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
}

# Verify installation
try {
    $awsPath = (Get-Command aws -ErrorAction Stop).Source
    $awsVersion = & aws --version
    Write-Host "AWS CLI is installed at: $awsPath" -ForegroundColor Green
    Write-Host "AWS CLI version: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Host "AWS CLI was installed but is not accessible in the current session." -ForegroundColor Yellow
    Write-Host "You may need to restart your PowerShell session or your computer." -ForegroundColor Yellow
    
    # Try to find the AWS CLI executable
    $possiblePaths = @(
        "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
        "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "AWS CLI found at: $path" -ForegroundColor Green
            Write-Host "You can use it directly with: & '$path' configure" -ForegroundColor Green
            break
        }
    }
}

Write-Host "`nAWS CLI is installed. You can now configure it with your AWS credentials." -ForegroundColor Cyan
Write-Host "After restarting your PowerShell session, run: aws configure" -ForegroundColor Cyan
Write-Host "For more information, visit: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html" -ForegroundColor Cyan
