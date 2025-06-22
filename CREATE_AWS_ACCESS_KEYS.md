# How to Create Valid AWS Access Keys

This guide will help you create valid AWS access keys that you can use with the AWS CLI to deploy your application.

## Prerequisites

1. An AWS account. If you don't have one, sign up at https://aws.amazon.com/

## Steps to Create Access Keys

1. **Sign in to the AWS Management Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your account credentials

2. **Open the IAM Console**
   - Click on the services menu (top left)
   - Select "IAM" under "Security, Identity, & Compliance"

3. **Create a New User (if you don't already have one for programmatic access)**
   - In the left navigation pane, click "Users"
   - Click "Add users"
   - Enter a user name (e.g., "checkresumeai-deployer")
   - Select "Access key - Programmatic access" as the access type
   - Click "Next: Permissions"

4. **Attach Permissions**
   - Select "Attach existing policies directly"
   - Search for and select these policies (for deployment purposes):
     - AmazonS3FullAccess
     - AWSElasticBeanstalkFullAccess
     - AmazonEC2FullAccess
   - Click "Next: Tags"
   - (Optional) Add tags if desired
   - Click "Next: Review"
   - Review the information and click "Create user"

5. **Save Your Access Keys**
   - You will see a screen with your "Access key ID" and "Secret access key"
   - Click "Download .csv" to save these credentials
   - **IMPORTANT**: This is the ONLY time you'll see this secret access key, so make sure to save it!

6. **Configure AWS CLI**
   - Open PowerShell
   - Run `aws configure`
   - Enter your new Access Key ID when prompted
   - Enter your Secret Access Key when prompted
   - For Default region name, enter `ap-south-1` (or your preferred region)
   - For Default output format, enter `json`

7. **Verify Your Configuration**
   - Run `aws sts get-caller-identity`
   - If configured correctly, you should see your AWS account information

## Security Considerations

- **Never share your Secret Access Key** with anyone
- Store your credentials in a secure location
- If your keys are compromised, go to the IAM console, select your user, select the "Security credentials" tab, and delete the compromised keys
- Consider using named profiles if you work with multiple AWS accounts

## Cleaning Up

When you're done with this project:
1. Delete the Elastic Beanstalk environment
2. Delete any S3 buckets you created
3. (Optional) Delete the IAM user if no longer needed

Remember: Keeping your access keys secure is critical. Exposed credentials can result in unauthorized AWS usage and unexpected charges.
