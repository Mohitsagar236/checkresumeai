# Deployment Environment Diagnostic Script for CheckResumeAI
# This script checks the environment variables and installed tools

Write-Host "CheckResumeAI Deployment Diagnostic" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "This script will check your environment for required deployment tools."
Write-Host

# Check PowerShell Version
$psVersion = $PSVersionTable.PSVersion
Write-Host "PowerShell Version: $($psVersion.Major).$($psVersion.Minor).$($psVersion.Build)" -ForegroundColor Yellow

# Check System Environment
$osInfo = Get-CimInstance Win32_OperatingSystem
Write-Host "Operating System: $($osInfo.Caption) $($osInfo.OSArchitecture)" -ForegroundColor Yellow

# Current user information
Write-Host "Current User: $env:USERNAME" -ForegroundColor Yellow
Write-Host "Is Admin: $([bool](([System.Security.Principal.WindowsIdentity]::GetCurrent()).groups -match 'S-1-5-32-544'))" -ForegroundColor Yellow

# Check Python
Write-Host "`nPython Environment:" -ForegroundColor Magenta
try {
    $pythonVersion = python --version
    Write-Host "Python: $pythonVersion" -ForegroundColor Green
    $pipVersion = pip --version
    Write-Host "pip: $pipVersion" -ForegroundColor Green
}
catch {
    Write-Host "Python: Not found in PATH" -ForegroundColor Red
    # Check common installation locations
    $possiblePythonPaths = @(
        "C:\Python*\python.exe",
        "C:\Program Files\Python*\python.exe",
        "C:\Program Files (x86)\Python*\python.exe"
    )
    
    $foundPython = $false
    foreach ($path in $possiblePythonPaths) {
        $pythonExes = Get-Item -Path $path -ErrorAction SilentlyContinue
        if ($pythonExes) {
            $foundPython = $true
            Write-Host "Found Python at: $($pythonExes.FullName)" -ForegroundColor Yellow
        }
    }
    
    if (-not $foundPython) {
        Write-Host "Python: Not found in common installation locations" -ForegroundColor Red
    }
}

# Check AWS CLI
Write-Host "`nAWS CLI:" -ForegroundColor Magenta
try {
    $awsExe = Get-Command aws -ErrorAction Stop
    $awsVersion = & aws --version
    Write-Host "AWS CLI: $awsVersion" -ForegroundColor Green
    Write-Host "AWS CLI Path: $($awsExe.Source)" -ForegroundColor Green
}
catch {
    Write-Host "AWS CLI: Not found in PATH" -ForegroundColor Red
    
    # Check common installation locations
    $possibleAwsPaths = @(
        "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
        "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
    )
    
    $foundAws = $false
    foreach ($path in $possibleAwsPaths) {
        if (Test-Path $path) {
            $foundAws = $true
            Write-Host "Found AWS CLI at: $path" -ForegroundColor Yellow
            try {
                $awsVersion = & $path --version
                Write-Host "AWS CLI Version: $awsVersion" -ForegroundColor Yellow
            }
            catch {
                Write-Host "Failed to get AWS CLI version" -ForegroundColor Red
            }
        }
    }
    
    if (-not $foundAws) {
        Write-Host "AWS CLI: Not found in common installation locations" -ForegroundColor Red
    }
}

# Check EB CLI
Write-Host "`nElastic Beanstalk CLI:" -ForegroundColor Magenta
try {
    $ebExe = Get-Command eb -ErrorAction Stop
    $ebVersion = & eb --version
    Write-Host "EB CLI: $ebVersion" -ForegroundColor Green
    Write-Host "EB CLI Path: $($ebExe.Source)" -ForegroundColor Green
}
catch {
    Write-Host "EB CLI: Not found in PATH" -ForegroundColor Red
    
    # Check if EB CLI is in Python scripts
    $possibleEbPaths = @(
        "C:\Python*\Scripts\eb.exe",
        "C:\Program Files\Python*\Scripts\eb.exe",
        "C:\Program Files (x86)\Python*\Scripts\eb.exe"
    )
    
    $foundEb = $false
    foreach ($path in $possibleEbPaths) {
        $ebExes = Get-Item -Path $path -ErrorAction SilentlyContinue
        if ($ebExes) {
            $foundEb = $true
            Write-Host "Found EB CLI at: $($ebExes.FullName)" -ForegroundColor Yellow
        }
    }
    
    if (-not $foundEb) {
        Write-Host "EB CLI: Not found in common installation locations" -ForegroundColor Red
    }
}

# Display PATH environment variable
Write-Host "`nPATH Environment Variable:" -ForegroundColor Magenta
$paths = $env:Path -split ';' | Where-Object { $_ }
foreach ($path in $paths) {
    if ($path -match "python|aws|amazon|eb") {
        Write-Host $path -ForegroundColor Cyan
    } else {
        Write-Host $path -ForegroundColor Gray
    }
}

# Check AWS Credentials
Write-Host "`nAWS Credentials:" -ForegroundColor Magenta
$awsCredentialsPath = "$env:USERPROFILE\.aws\credentials"
if (Test-Path $awsCredentialsPath) {
    Write-Host "AWS credentials file exists" -ForegroundColor Green
    # Don't display content for security reasons
    Write-Host "Location: $awsCredentialsPath" -ForegroundColor Green
} else {
    Write-Host "AWS credentials file not found" -ForegroundColor Red
    Write-Host "You need to run 'aws configure' before deploying" -ForegroundColor Yellow
}

# Check AWS Configuration
Write-Host "`nAWS Configuration:" -ForegroundColor Magenta
$awsConfigPath = "$env:USERPROFILE\.aws\config"
if (Test-Path $awsConfigPath) {
    Write-Host "AWS config file exists" -ForegroundColor Green
    Write-Host "Location: $awsConfigPath" -ForegroundColor Green
} else {
    Write-Host "AWS config file not found" -ForegroundColor Red
}

# Summary and Recommendations
Write-Host "`nSummary and Recommendations:" -ForegroundColor Cyan
if (-not (Get-Command aws -ErrorAction SilentlyContinue) -or -not (Get-Command eb -ErrorAction SilentlyContinue)) {
    Write-Host "Issues detected with your deployment environment." -ForegroundColor Yellow
    Write-Host "To fix PATH issues, try running: .\fix-path-and-deploy.ps1" -ForegroundColor Green
    
    if (-not (Test-Path $awsCredentialsPath)) {
        Write-Host "Don't forget to run 'aws configure' to set up your AWS credentials." -ForegroundColor Yellow
    }
}
else {
    Write-Host "Your environment appears to be properly configured for deployment!" -ForegroundColor Green
    Write-Host "You can proceed with: .\deploy-aws-simple.ps1 -InitInfrastructure" -ForegroundColor Green
}

# Check for ElasticBeanstalk directory
Write-Host "`nElasticBeanstalk Configuration:" -ForegroundColor Magenta
$ebConfigDir = ".elasticbeanstalk"
if (Test-Path $ebConfigDir) {
    Write-Host "$ebConfigDir directory exists" -ForegroundColor Green
    
    $configYml = "$ebConfigDir\config.yml"
    if (Test-Path $configYml) {
        Write-Host "config.yml found" -ForegroundColor Green
    }
    else {
        Write-Host "config.yml not found" -ForegroundColor Red
    }
} else {
    Write-Host "$ebConfigDir directory not found - will be created during initialization" -ForegroundColor Yellow
}
