AWS Free Tier deployment quickstart

This guide deploys:
- Frontend: S3 static hosting fronted by CloudFront (Free Tier eligible)
- Backend API: One EC2 t2.micro/t3.micro (Free Tier eligible) running Node 18 with PM2 and Nginx
- Optional: Local Redis on the same EC2 (no extra AWS cost). For production, prefer a managed Redis like Upstash.

Prereqs
- AWS account with Free Tier
- Domain (optional, for HTTPS); Route 53 or any registrar
- AWS CLI configured on your Windows machine

1) Frontend on S3 + CloudFront
- Create an S3 bucket named your-site-bucket (enable Block Public Access OFF for static website if you won’t use CloudFront; recommended: keep private and use CloudFront Origin Access Control)
- Create a CloudFront distribution pointing to the S3 bucket origin
  - Default root object: index.html
  - Behaviors: Cache Policy CachingOptimized; Compress objects
  - Error pages: 403/404 -> /index.html (SPA fallback)
- Note the Distribution ID
- Set environment variables in PowerShell:
  - $env:AWS_REGION="us-east-1" (or your region)
  - $env:S3_BUCKET="your-site-bucket"
  - $env:CLOUDFRONT_DISTRIBUTION_ID="E123ABC..."
- Deploy from your Windows PC:
  - In project folder, run scripts/aws/s3-deploy.ps1 (builds Vite and syncs to S3, then invalidates CloudFront)

2) Backend on EC2 (Node + PM2 + Nginx)
- Launch an EC2 instance (Amazon Linux 2023, t2.micro or t3.micro)
- Security Group inbound: 22 (SSH), 80 (HTTP). If you add HTTPS later, also 443.
- Optional: Paste deploy/aws/ec2-user-data.sh in User data to pre-install Node, Nginx, Redis, PM2
- SSH to the instance and copy your repository (SCP or git clone private repo)
- On the instance:
  - Place deploy/aws/nginx-api.conf to /etc/nginx/conf.d/api.conf and set your server_name
  - sudo systemctl restart nginx
  - cd project/backend; create .env with your secrets (see below)
  - npm ci && npm run build
  - pm2 start ../../deploy/aws/pm2-ecosystem.config.cjs && pm2 save && sudo systemctl enable nginx

3) Environment variables (backend .env)
- PORT=8080
- SUPABASE_URL=...
- SUPABASE_ANON_KEY=...
- OPENAI_API_KEY=... (and/or GROQ_API_KEY, TOGETHER_API_KEY)
- RAZORPAY_KEY_ID=..., RAZORPAY_KEY_SECRET=...
- REDIS_URL=redis://127.0.0.1:6379 (if using local Redis)
- ORIGIN_ALLOWED=https://your-frontend-domain (for CORS)

4) Optional HTTPS for API
- With a domain pointing to your EC2 public IP, install certbot on Amazon Linux and obtain a cert for api.yourdomain.com using the nginx plugin, or terminate TLS behind CloudFront with an origin pointing to your EC2 (advanced).

Notes
- Frontend env vars must be VITE_* and set during build time. Set them before running the S3 deploy script or configure them in a CI workflow.
- Free Tier limits apply; monitor usage to avoid charges.
