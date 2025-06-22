# AWS Deployment Strategy for CheckResumeAI

This document explains our comprehensive AWS deployment approach for the CheckResumeAI application.

## Deployment Strategy Overview

We've implemented a multi-layered deployment strategy for maximum compatibility and reliability:

### 1. Combined CLI Tool Approach (Primary Recommendation)

The `deploy-combined.ps1` script offers the most reliable deployment by:

- Using both AWS CLI and EB CLI in a single workflow
- Auto-detecting tool availability and setting up paths
- Fallback mechanisms if one CLI tool fails
- Consistent configuration handling
- Error recovery and detailed diagnostics

This script is our recommended approach for new deployments.

### 2. Targeted Deployment Scripts

In addition to the combined approach, we offer several specialized deployment scripts:

- `deploy-aws.ps1`: Full-featured EB CLI deployment with infrastructure creation
- `deploy-aws-simple.ps1`: Simplified deployment focusing on core functionality
- `aws-direct-deploy.ps1`: Direct AWS CLI deployment that bypasses EB CLI

### 3. Diagnostic and Support Tools

Our deployment ecosystem includes several supporting tools:

- `aws-api-diagnostic.ps1`: Test AWS API connectivity
- `deployment-diagnostic.ps1`: Verify environment configuration
- `install-aws-cli.ps1` and `install-eb-cli.ps1`: Install required CLI tools
- `monitor-aws-usage.ps1`: Track AWS Free Tier resource consumption

## Why This Approach Works

This deployment strategy addresses several key challenges:

1. **CLI Tool Availability**: By supporting both AWS CLI and EB CLI with fallbacks, we ensure deployment succeeds even when one tool has issues.

2. **Path and Configuration Issues**: The combined script auto-detects tools and configures paths automatically, resolving common setup issues.

3. **AWS Credential Problems**: Proper validation of credentials with clear error messages identifies issues before deployment.

4. **Windows Environment Compatibility**: All scripts are PowerShell-based and designed for Windows environments.

5. **Free Tier Resource Management**: Careful configuration ensures deployment uses only Free Tier eligible resources.

## First-Time Setup Recommendation

For first-time deployers, we recommend:

1. Run `.\install-aws-cli.ps1` to install AWS CLI
2. Run `.\install-eb-cli.ps1` to install EB CLI
3. Run `aws configure` to set up your AWS credentials
4. Verify with `aws sts get-caller-identity`
5. Run `.\deploy-combined.ps1 -InitializeInfrastructure` to set up infrastructure
6. Run `.\deploy-combined.ps1 -DeployApp` to deploy the application

This workflow provides the most reliable path to a successful deployment.
