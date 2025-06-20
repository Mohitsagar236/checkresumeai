// This script updates the Vercel configuration for proper SPA deployment
// It creates a properly configured vercel.json file in the root directory

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory (should be the root of the project)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;

// Create an optimized vercel.json configuration
const vercelConfig = {
  "version": 2,
  "buildCommand": "node scripts/fast-vercel-build.js",
  "outputDirectory": "project/dist",
  "installCommand": "npm ci --omit=dev && npm run setup-pdf-worker",
  "framework": "vite",
  "rewrites": [
    { "source": "/assets/(.*)", "destination": "/assets/$1" },
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/static/(.*)", "destination": "/static/$1" },
    { "source": "/(.*\\.[a-z0-9]+)", "destination": "/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self'"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/(.+\\.(js|css|svg|ttf|woff|woff2|eot|png|jpg|jpeg|webp|gif|ico)$)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
};

// Write the vercel.json file
console.log('Creating optimized vercel.json...');
fs.writeFileSync(path.join(rootDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
console.log('✅ vercel.json created successfully!');

// Update project vercel.json to ensure consistency
const projectVercelConfig = {
  ...vercelConfig,
  "buildCommand": "node scripts/fast-vercel-build.js",
  "outputDirectory": "dist"
};

// Ensure the project directory exists
const projectDir = path.join(rootDir, 'project');
if (fs.existsSync(projectDir)) {
  console.log('Updating project vercel.json...');
  fs.writeFileSync(path.join(projectDir, 'vercel.json'), JSON.stringify(projectVercelConfig, null, 2));
  console.log('✅ Project vercel.json updated successfully!');
}

console.log('✅ Vercel configuration updated successfully! Your application is now optimized for Vercel deployment.');
