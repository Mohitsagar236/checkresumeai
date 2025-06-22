# CheckResumeAI: AI-Powered Resume Analyzer SaaS

CheckResumeAI is an AI-powered resume analysis and improvement platform that helps job seekers optimize their resumes for specific job postings.

## AWS Deployment

This project can be deployed to AWS Free Tier resources using the provided deployment scripts.

### Available Deployment Methods

1. **Combined Deployment (RECOMMENDED)**
   - Uses both AWS CLI and EB CLI with automatic fallback
   - Run `.\deploy-combined.ps1 -InitializeInfrastructure` to set up AWS resources
   - Then run `.\deploy-combined.ps1 -DeployApp` to deploy the application
   - See `AWS_DEPLOYMENT_GUIDE_COMBINED.md` for detailed instructions

2. **PowerShell Script Deployment**
   - Run `.\deploy-aws.ps1` to deploy to Elastic Beanstalk, S3, and RDS
   - See deployment options with `.\deploy-aws.ps1 -Help`

3. **CloudFormation Deployment**
   - Use the `cloudformation-template.yml` to deploy the entire infrastructure
   - Provides IaC (Infrastructure as Code) approach for reproducible deployments

4. **Simplified Deployment**
   - Use `.\deploy-aws-simple.ps1 -InitInfrastructure` to set up AWS resources
   - Then use `.\deploy-aws-simple.ps1 -DeployApp` to deploy the application

### AWS Free Tier Resources Used

- **Elastic Beanstalk**: Node.js application hosting (t2.micro EC2 instance)
- **RDS PostgreSQL**: Database storage (db.t2.micro instance)
- **S3**: Storage for resumes and generated reports

### Monitoring AWS Usage

Use the `.\monitor-aws-usage.ps1` script to check your Free Tier usage and avoid unexpected charges.

### Deployment Troubleshooting

If you encounter issues with AWS CLI or EB CLI not being recognized, try these steps:

1. **Run the diagnostic script** to check your environment:

   ```powershell
   .\deployment-diagnostic.ps1
   ```

2. **Fix PATH issues** with the helper script:

   ```powershell
   .\fix-path-and-deploy.ps1
   ```

3. **Install required tools** if missing:

   ```powershell
   .\install-aws-cli.ps1
   .\install-eb-cli.ps1
   ```

4. **Restart your PowerShell session** after installing tools

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/checkresumeai.git
   cd checkresumeai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Deployment

For detailed deployment instructions, see [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md).

## Features

- AI-powered resume analysis
- Keyword optimization for job descriptions
- Course recommendations based on skill gaps
- Resume grading and scoring
- Premium subscription features

## Learn More

- [Feature Comparison](CheckResumeAI_Feature_Comparison.md)
- [Market Analysis](CheckResumeAI_Market_Analysis.md)
- [Pricing Page Design](CheckResumeAI_Pricing_Page_Design.md)
