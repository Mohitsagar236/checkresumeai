# AWS Credential Check

This document outlines the steps to check and create valid AWS credentials for deployment.

## Current Status

You're experiencing issues with AWS credentials. The most common reasons include:

1. Invalid access key ID or secret access key
2. Expired credentials
3. Insufficient permissions for the IAM user

## Step 1: Check if you have an AWS account

Before attempting to deploy, make sure you:

1. Have an active AWS account
2. Can sign in to the AWS Management Console at https://console.aws.amazon.com/

## Step 2: Create new access keys

If you're unable to use your current access keys, create new ones:

1. Sign in to the AWS Management Console
2. Navigate to IAM (Identity and Access Management)
3. Select "Users" from the left sidebar
4. Select your username or create a new user
5. Go to the "Security credentials" tab
6. Under "Access keys", click "Create access key"
7. Follow the prompts and SAVE your access key ID and secret access key
8. Download the CSV file when prompted

## Step 3: Configure AWS CLI with your new keys

After creating new keys, configure AWS CLI:

```powershell
aws configure
```

When prompted:
- Enter your new Access Key ID
- Enter your new Secret Access Key
- Default region: ap-south-1
- Default output format: json

## Step 4: Verify your credentials

To verify your credentials work:

```powershell
aws sts get-caller-identity
```

You should see output like:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

## Step 5: Grant necessary permissions

Ensure your IAM user has these permissions:
- AmazonS3FullAccess
- AWSElasticBeanstalkFullAccess
- AmazonEC2FullAccess

## Next Steps

Once your credentials are working correctly:

1. Run the diagnostics script: `.\aws-api-diagnostic.ps1`
2. Run the direct deployment script: `.\aws-direct-deploy.ps1`

If you need to create an AWS account or need further assistance with AWS access, please refer to the AWS documentation or contact AWS Support.
