# Using the Combined AWS CLI & EB CLI Deployment Script

## Overview

The `deploy-combined.ps1` script provides a robust deployment method for the CheckResumeAI application by utilizing both AWS CLI and EB CLI tools together with automatic fallback mechanisms.

## Key Features

- **Automatic Tool Detection**: Locates AWS CLI and EB CLI executables even if they're not in your PATH
- **Fallback Mechanism**: If EB CLI commands fail, falls back to equivalent AWS CLI commands
- **Path Resolution**: Automatically adds necessary tools to your PATH temporarily
- **No Dependency Conflicts**: Works even with complex Python environments
- **Comprehensive Logging**: Clear, color-coded progress messages

## Prerequisites

1. AWS Account with programmatic access credentials
2. AWS CLI installed (can be installed with `.\install-aws-cli.ps1`)
3. Python installed for EB CLI (can be installed with `.\install-eb-cli.ps1`)

## Usage Options

The script supports the following options:

```powershell
# Show help information
.\deploy-combined.ps1 -Help

# Initialize AWS infrastructure (first-time setup)
.\deploy-combined.ps1 -InitializeInfrastructure

# Deploy application to existing infrastructure
.\deploy-combined.ps1 -DeployApp
```

## How It Works

### Tool Setup Phase

1. Checks if AWS CLI is in your PATH
2. If not, searches common installation locations
3. Temporarily adds AWS CLI to PATH if found
4. Checks if Python is available
5. Searches for Python installations if needed
6. Locates or installs EB CLI
7. Creates necessary aliases if required
8. Verifies both tools are working

### Infrastructure Initialization

1. Creates an S3 bucket with proper permissions and CORS configuration
2. Initializes Elastic Beanstalk application using EB CLI
3. Falls back to AWS CLI if EB CLI initialization fails
4. Creates configuration files manually if needed
5. Creates Elastic Beanstalk environment

### Application Deployment

1. Prepares application package with correct structure
2. Attempts deployment using EB CLI
3. If EB CLI fails, packages application as ZIP
4. Uploads to S3 and creates application version using AWS CLI
5. Updates environment with the new version
6. Retrieves and displays application URL

## Troubleshooting Tips

- If the script reports AWS CLI is missing: `.\install-aws-cli.ps1`
- If the script reports EB CLI is missing: `.\install-eb-cli.ps1`
- If AWS credentials are invalid: Run `aws configure` and verify with `aws sts get-caller-identity`
- For detailed diagnostics: `.\aws-api-diagnostic.ps1`

## Common Issues Resolved by This Script

- **PATH Issues**: No need to modify system PATH permanently
- **Python Environment Conflicts**: Works with various Python installations
- **EB CLI Installation Problems**: Falls back to AWS CLI if needed
- **AWS Credential Configuration**: Comprehensive error checking

## AWS Free Tier Usage

This script carefully uses only Free Tier eligible resources:

- t2.micro EC2 instance (Single instance)
- S3 bucket with minimal storage
- No additional resources that would incur charges

Monitor your usage with: `.\monitor-aws-usage.ps1`
