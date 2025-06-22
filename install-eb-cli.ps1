# Install EB CLI for Elastic Beanstalk Deployment
# This script installs the AWS Elastic Beanstalk CLI

Write-Host "Installing AWS Elastic Beanstalk CLI..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if Python is installed
$pythonInstalled = $false
try {
    $pythonVersion = python --version
    Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
    $pythonInstalled = $true
}
catch {
    Write-Host "Python is not installed. Installing Python..." -ForegroundColor Yellow
    
    # Download Python installer
    $pythonUrl = "https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe"
    $pythonInstaller = "$env:TEMP\python-installer.exe"
    Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonInstaller
    
    # Install Python
    Start-Process -FilePath $pythonInstaller -ArgumentList "/quiet", "InstallAllUsers=1", "PrependPath=1" -Wait
    
    # Update PATH environment variable
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    
    # Verify Python installation
    try {
        $pythonVersion = python --version
        Write-Host "Python installed successfully: $pythonVersion" -ForegroundColor Green
        $pythonInstalled = $true
    }
    catch {
        Write-Host "Failed to install Python. Please install Python manually from: https://www.python.org/downloads/" -ForegroundColor Red
    }
}

# Install pip if needed
$pipInstalled = $false
if ($pythonInstalled) {
    try {
        $pipVersion = pip --version
        Write-Host "pip is installed: $pipVersion" -ForegroundColor Green
        $pipInstalled = $true
    }
    catch {
        Write-Host "pip is not installed. Installing pip..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://bootstrap.pypa.io/get-pip.py" -OutFile "$env:TEMP\get-pip.py"
        python "$env:TEMP\get-pip.py"
        
        # Update PATH environment variable
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
        
        try {
            $pipVersion = pip --version
            Write-Host "pip installed successfully: $pipVersion" -ForegroundColor Green
            $pipInstalled = $true
        }
        catch {
            Write-Host "Failed to install pip. Please install pip manually." -ForegroundColor Red
        }
    }
}

# Install AWS EB CLI
if ($pipInstalled) {
    Write-Host "Installing AWS Elastic Beanstalk CLI..." -ForegroundColor Yellow
    pip install awsebcli
    
    # Verify EB CLI installation
    try {
        $ebVersion = eb --version
        Write-Host "AWS EB CLI installed successfully: $ebVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to install AWS EB CLI. Please try installing manually: pip install awsebcli" -ForegroundColor Red
    }
}

Write-Host "`nSetup Instructions:" -ForegroundColor Cyan
Write-Host "1. You need to configure AWS credentials:" -ForegroundColor Cyan
Write-Host "   Run: aws configure" -ForegroundColor Yellow
Write-Host "2. You're now ready to deploy your application to AWS Elastic Beanstalk!" -ForegroundColor Cyan
Write-Host "   Run: .\deploy-aws.ps1 -InitializeInfrastructure" -ForegroundColor Yellow
