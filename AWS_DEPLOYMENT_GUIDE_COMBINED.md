# CheckResumeAI AWS Deployment Guide (Combined Approach)

This guide provides a comprehensive approach to deploy the CheckResumeAI application to AWS using both AWS CLI and EB CLI, ensuring maximum compatibility and reliability.

## Prerequisites

1. **AWS Account**: Create an account at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI**: Install using our script: `.\install-aws-cli.ps1` or from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **EB CLI**: Install using our script: `.\install-eb-cli.ps1` or using `pip install awsebcli`
4. **AWS Credentials**: Valid IAM user with programmatic access and these permissions:
   - AmazonS3FullAccess
   - AWSElasticBeanstalkFullAccess

## Combined Deployment Approach

Our recommended approach uses both AWS CLI and EB CLI tools together in a single script for maximum reliability:

### Step 1: Configure AWS Credentials

```powershell
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, region (recommended: ap-south-1), and output format (json).

### Step 2: Verify Your AWS Credentials

```powershell
aws sts get-caller-identity
```

This should display your account ID, user ID, and ARN. If it displays an error, check your credentials.

### Step 3: Deployment with Combined Script

Our `deploy-combined.ps1` script uses both AWS CLI and EB CLI, with fallback to AWS CLI if EB CLI fails:

```powershell
# Initialize infrastructure (first time only)
.\deploy-combined.ps1 -InitializeInfrastructure

# Deploy the application (subsequent deployments)
.\deploy-combined.ps1 -DeployApp
```

The combined script offers these benefits:

- Automatically detects and configures both AWS CLI and EB CLI
- Falls back to AWS CLI commands if EB CLI is not working properly
- Creates proper configuration for AWS environment
- Handles all aspects of deployment in one script

### What the Combined Script Does

#### When Initializing Infrastructure

1. Creates an S3 bucket for storage with proper permissions
2. Initializes an Elastic Beanstalk application
3. Creates an Elastic Beanstalk environment with a t2.micro instance (Free Tier)

#### When Deploying Application

1. Packages application files correctly
2. Uploads the package to S3 or directly to Elastic Beanstalk
3. Deploys the application to the environment
4. Displays the application URL when done

## Troubleshooting

### Common Issues

1. **CLI Tools Not Found**:
   - The script will attempt to find and configure tools automatically
   - If AWS CLI is missing: `.\install-aws-cli.ps1`
   - If EB CLI is missing: `.\install-eb-cli.ps1`

2. **AWS Credentials Error**:
   - Run `aws configure` to set up credentials correctly
   - Verify with `aws sts get-caller-identity`
   - Check your IAM permissions in AWS Console

3. **Path Issues**:
   - The script automatically attempts to find CLI tools in common locations
   - For manual PATH fixes, see `PATH_ISSUE_FIX.md`

4. **Deployment Failures**:
   - The script will automatically attempt alternative deployment methods
   - Check AWS Console for detailed logs
   - Run `.\aws-api-diagnostic.ps1` for API connectivity testing

### Additional Diagnostic Tools

- `.\deployment-diagnostic.ps1`: Checks your deployment environment
- `.\aws-api-diagnostic.ps1`: Tests AWS API connectivity
- `.\monitor-aws-usage.ps1`: Monitors Free Tier usage

## Monitoring Free Tier Usage

The combined deployment uses these Free Tier resources:

- 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)
- 5GB of S3 storage

Monitor your usage with:

```powershell
.\monitor-aws-usage.ps1
```

## Need Help?

Review these resources for additional guidance:

- `AWS_FREE_TIER_DEPLOY_GUIDE.md`: Detailed Free Tier guide
- `DEPLOYMENT_TROUBLESHOOTING.md`: Common deployment issues
- `AWS_CREDENTIAL_CHECK.md`: Guide to verify AWS credentials
