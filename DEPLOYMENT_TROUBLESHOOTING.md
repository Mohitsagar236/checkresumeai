# AWS Deployment Troubleshooting Guide

This guide helps resolve common issues when deploying CheckResumeAI to AWS.

## Recommended Approach: Use the Combined Script

The most reliable way to deploy is using our combined script that handles AWS CLI and EB CLI with fallbacks:

```powershell
.\deploy-combined.ps1 -InitializeInfrastructure
.\deploy-combined.ps1 -DeployApp
```

This script automatically:

- Finds CLI tools even when not in PATH
- Uses both AWS CLI and EB CLI together
- Falls back to AWS CLI if EB CLI fails
- Handles paths and configuration automatically

See `COMBINED_SCRIPT_GUIDE.md` for detailed information.

## "Required tools are not installed or not in the PATH" Error

This error occurs when the deployment script cannot find AWS CLI or EB CLI in your system PATH, even though they may be installed.

### Quick Solutions

1. **Use the combined deployment script**:
   
   ```powershell
   .\deploy-combined.ps1 -Help
   ```
   
   This script handles PATH issues automatically.

2. **Use the fix-path-and-deploy.ps1 script**:
   
   ```powershell
   .\fix-path-and-deploy.ps1
   ```
   
   This script:
   - Refreshes your PATH environment variable
   - Locates AWS CLI and EB CLI in common installation locations
   - Adds them to your current session's PATH
   - Creates appropriate aliases

3. **Run diagnostic checks**:
   
   ```powershell
   .\deployment-diagnostic.ps1
   ```
   
   This shows detailed information about:
   - Which tools are installed and where
   - Current PATH environment variable
   - AWS credentials and configuration status

### Step-by-Step Manual Fix

If the automated scripts don't resolve your issue, try these manual steps:

1. **Close and reopen PowerShell** as Administrator

2. **Verify AWS CLI installation**:
   
   ```powershell
   # Check if AWS CLI is in PATH
   Get-Command aws -ErrorAction SilentlyContinue
   
   # If not found, you can locate it manually
   $awsPath = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
   if (Test-Path $awsPath) {
       Write-Host "AWS CLI found at: $awsPath"
       # Add to current session PATH
       $env:Path = "$(Split-Path $awsPath);" + $env:Path
   }
   ```

3. **Verify EB CLI installation**:
   
   ```powershell
   # Check if EB CLI is in PATH
   Get-Command eb -ErrorAction SilentlyContinue
   
   # Python Scripts folder should have eb.exe
   $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
   if ($pythonPath) {
       $ebPath = "$(Split-Path $pythonPath)\Scripts\eb.exe"
       if (Test-Path $ebPath) {
           Write-Host "EB CLI found at: $ebPath"
           # Add to current session PATH
           $env:Path = "$(Split-Path $ebPath);" + $env:Path
       }
   }
   ```

4. **Create temporary aliases**:
   
   ```powershell
   # If you found the executables but can't modify PATH
   $awsPath = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"  # Update this path
   $ebPath = "C:\Python310\Scripts\eb.exe"  # Update this path
   
   if (Test-Path $awsPath) { Set-Alias -Name aws -Value $awsPath -Scope Global }
   if (Test-Path $ebPath) { Set-Alias -Name eb -Value $ebPath -Scope Global }
   ```

5. **Run deployment with full paths**:
   
   If you can't get the tools in PATH, modify the deployment script to use full paths.

### Permanently Fix PATH Issues

To avoid this issue in future PowerShell sessions:

1. **Update System PATH**:
   
   - Press Win + X and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Edit the "Path" variable under System variables
   - Add the paths to AWS CLI and Python Scripts folders
   - Click OK and restart PowerShell

2. **AWS CLI typical installation paths**:
   - `C:\Program Files\Amazon\AWSCLIV2\`
   
3. **EB CLI typical installation paths** (via pip):
   - `C:\Python310\Scripts\` (adjust for your Python version)
   - `C:\Users\<username>\AppData\Local\Programs\Python\Python310\Scripts\`

## AWS Credentials Issues

If you get authentication errors:

1. **Configure AWS credentials**:
   
   ```powershell
   aws configure
   ```
   
   Enter:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., ap-south-1)
   - Output format (json)

2. **Verify credentials file**:
   
   ```powershell
   Test-Path "$env:USERPROFILE\.aws\credentials"
   ```

## Other Common Issues

### EB CLI Installation Fails

If `pip install awsebcli` fails:

1. **Update pip**:
   
   ```powershell
   python -m pip install --upgrade pip
   ```

2. **Install with specific version**:
   
   ```powershell
   python -m pip install awsebcli==3.20.3
   ```

3. **Check for conflicting packages**:
   
   ```powershell
   python -m pip list | findstr boto
   ```

### AWS CLI Issues

If AWS CLI commands fail:

1. **Verify installation**:
   
   ```powershell
   & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" --version
   ```

2. **Reinstall AWS CLI**:
   
   ```powershell
   .\install-aws-cli.ps1
   ```

If you continue to have issues, please contact support.
