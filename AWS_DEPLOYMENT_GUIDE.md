# CheckResumeAI AWS Deployment Guide

This guide will help you deploy the CheckResumeAI application to AWS using the Free Tier resources.

## AWS Free Tier Resources

The deployment leverages these AWS Free Tier resources:

- **Elastic Beanstalk**: Hosting the Node.js application (using t2.micro EC2 instance)
- **RDS PostgreSQL**: Database storage (using db.t2.micro instance)
- **S3**: Storage for resumes and generated reports

## Prerequisites

1. **AWS Account**: Create an account at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI**: Install from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **EB CLI**: Install using `pip install awsebcli`
4. **IAM User**: Create an IAM user with programmatic access and these permissions:
   - AmazonS3FullAccess
   - AmazonRDSFullAccess
   - AWSElasticBeanstalkFullAccess

## Deployment Options

You have two options for deploying:

### Option 1: Using the PowerShell Script

1. Configure your AWS CLI:
   ```powershell
   aws configure
   ```

2. Run the deployment script with different options:
   ```powershell
   # Initialize all infrastructure
   .\deploy-aws.ps1 -InitializeInfrastructure

   # Setup RDS database
   .\deploy-aws.ps1 -SetupRDS

   # Setup S3 bucket
   .\deploy-aws.ps1 -SetupS3

   # Deploy the application
   .\deploy-aws.ps1 -DeployApp
   ```

### Option 2: Using CloudFormation

1. Open AWS Console and navigate to CloudFormation.
2. Click "Create stack" and upload the `cloudformation-template.yml` file.
3. Fill in parameters:
   - ApplicationName: CheckResumeAI
   - EnvironmentName: CheckResumeAI-env
   - DBName: checkresumeaidb
   - DBUser: [your-username]
   - DBPassword: [your-secure-password]
   - S3BucketName: checkresumeai-storage

4. Follow the wizard to create the stack (takes ~10-15 minutes).
5. Once complete, deploy your application code using:
   ```powershell
   npm install
   npm run build
   Compress-Archive -Path "./project/backend/*", "./project/build/*" -DestinationPath "build.zip"
   eb deploy CheckResumeAI-env
   ```

## Monitoring Free Tier Usage

To avoid unexpected charges:

1. Set up AWS Budgets to monitor Free Tier usage:
   - Go to AWS Billing Dashboard
   - Create a budget with Free Tier usage alert

2. Monitor your usage monthly:
   - 750 hours/month of t2.micro EC2 instance (Elastic Beanstalk)
   - 750 hours/month of db.t2.micro RDS instance
   - 5GB of S3 storage, 20,000 GET requests, 2,000 PUT requests

## Customizing the Deployment

### Adding Environment Variables

To add custom environment variables:

1. Edit the `.elasticbeanstalk/config.yml` file
2. Add new variables under `aws:elasticbeanstalk:application:environment`

### Scaling Beyond Free Tier

When ready to scale beyond Free Tier:

1. Update RDS instance: Change to db.t3.small or larger
2. Update EC2 instance: Change to t3.small or larger
3. Enable load balancing: Change `EnvironmentType` to `LoadBalanced`

## Troubleshooting

### Common Issues

1. **RDS Connection Issues**:
   - Ensure security groups allow traffic from Elastic Beanstalk
   - Check endpoint and credentials in environment variables

2. **S3 Access Issues**:
   - Verify bucket policy and CORS configuration
   - Check IAM permissions for the application

3. **Elastic Beanstalk Deployments Failing**:
   - Check logs in Elastic Beanstalk console
   - Validate your build.zip contains all required files

### Getting Support

For issues, check CloudWatch logs:
```powershell
aws logs get-log-events --log-group-name /aws/elasticbeanstalk/CheckResumeAI-env/var/log/eb-activity.log
```

## Future AWS Service Additions

As your application grows, consider adding:

1. **Amazon Cognito**: User authentication
2. **AWS Lambda**: Serverless functions for PDF processing
3. **Amazon CloudFront**: CDN for frontend assets
4. **AWS API Gateway**: Managed API endpoints

Each of these can be added incrementally as your user base grows.
