# AWS Free Tier Deployment Guide for CheckResumeAI

This guide will help you deploy the CheckResumeAI application to AWS using Free Tier resources.

## Prerequisites

You need to have these installed on your system:
1. AWS CLI
2. EB CLI (Elastic Beanstalk CLI)
3. Node.js and npm

## Setup Process

### Step 1: Install Required Tools

Run these commands in PowerShell to install the necessary tools:

```powershell
# Install AWS CLI
.\install-aws-cli.ps1

# Install EB CLI
.\install-eb-cli.ps1
```

### Step 2: Configure AWS Credentials

Configure your AWS credentials using:

```powershell
aws configure
```

You'll need to provide:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (recommended: ap-south-1)
- Default output format (json)

### Step 3: Initialize AWS Infrastructure

This step creates the necessary AWS resources (S3 bucket, Elastic Beanstalk application):

```powershell
.\deploy-combined.ps1 -InitializeInfrastructure
```

This process will:
1. Create an S3 bucket for storing resumes and reports
2. Initialize an Elastic Beanstalk application
3. Create an Elastic Beanstalk environment with a t2.micro instance (Free Tier eligible)

The script uses both AWS CLI and EB CLI, with automatic fallback to AWS CLI if EB CLI is not working properly.

**Note**: This step might take 5-10 minutes to complete.

### Step 4: Deploy Your Application

Once infrastructure is set up, deploy your application:

```powershell
.\deploy-combined.ps1 -DeployApp
```

This script handles all the deployment steps automatically with maximum reliability.

This will:

1. Package your application files
2. Upload the package to Elastic Beanstalk
3. Deploy and launch your application on the Elastic Beanstalk environment

**Note**: This step might take a few minutes to complete.

### Step 5: Access Your Application

After deployment is complete, you'll get a URL where your application is hosted:

- Example: `http://checkresumeai-env.eba-ab12cd34.ap-south-1.elasticbeanstalk.com`

## AWS Free Tier Resources Used

This deployment uses these AWS Free Tier resources:

1. **EC2 (via Elastic Beanstalk)**:
   - t2.micro instance (750 hours/month free)
   - Powers your web application

2. **S3 Storage**:
   - 5GB free storage
   - Stores resumes and generated reports

## Monitoring AWS Usage

To monitor your AWS Free Tier usage:

```powershell
.\monitor-aws-usage.ps1 -All
```

This script helps ensure you stay within the Free Tier limits.

## Troubleshooting

### Common Issues

1. **"Required tools are not installed or not in the PATH" Error**:
   - Run the direct AWS deployment script instead: `.\aws-direct-deploy.ps1`
   - This bypasses EB CLI issues by using AWS CLI directly
   - For detailed AWS API diagnostics, run: `.\aws-api-diagnostic.ps1`
   - For PATH troubleshooting, see `DEPLOYMENT_TROUBLESHOOTING.md`

2. **Deployment Fails**:
   - Check logs with: `eb logs`
   - Ensure your application files are structured correctly

3. **Application Crashes**:
   - Check logs with: `eb logs`
   - Verify environment variables in `.elasticbeanstalk/config.yml`

4. **S3 Access Issues**:
   - Check bucket policy and permissions
   - Verify environment variable S3_BUCKET is set correctly

## Scaling Beyond Free Tier

When your application grows beyond Free Tier limits:

1. Update RDS to a larger instance
2. Add load balancing with `eb config`
3. Set up CloudFront CDN for your frontend
4. Add Lambda functions for PDF processing

By following this guide, you'll have your CheckResumeAI application running on AWS using Free Tier resources!
