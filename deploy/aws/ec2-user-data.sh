#!/bin/bash
set -e
# Amazon Linux 2023 setup for Node 18, Nginx, Redis, PM2

sudo dnf update -y
sudo dnf install -y nginx git redis

# Install Node 18 LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# PM2 global
sudo npm install -g pm2

# Enable services
sudo systemctl enable nginx
sudo systemctl enable redis
sudo systemctl start redis
sudo systemctl start nginx

# Increase file limits (optional for sharp/pdf operations)
cat <<EOF | sudo tee /etc/security/limits.d/node.conf
* soft nofile 65535
* hard nofile 65535
EOF
