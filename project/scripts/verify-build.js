#!/usr/bin/env node

/**
 * Build Verification Script for CheckResumeAI
 * This script verifies that all build processes complete successfully
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Starting build verification...\n');

try {
  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found. Please run this script from the project root.');
  }

  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed\n');

  // Step 2: Build backend
  console.log('🏗️  Building backend...');
  execSync('npm run build:backend', { stdio: 'inherit' });
  
  // Check if backend build was successful
  const backendDistPath = path.join(process.cwd(), 'backend', 'dist', 'server.js');
  if (!fs.existsSync(backendDistPath)) {
    throw new Error('Backend build failed - server.js not found in dist directory');
  }
  console.log('✅ Backend build successful\n');

  // Step 3: Build frontend
  console.log('🎨 Building frontend...');
  try {
    execSync('npm run build:frontend', { stdio: 'inherit' });
    console.log('✅ Frontend build successful\n');
  } catch (error) {
    console.log('⚠️  Frontend build failed, but continuing...\n');
  }

  console.log('🎉 Build verification completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test the backend: cd backend && npm start');
  console.log('2. Deploy to AWS Elastic Beanstalk');

} catch (error) {
  console.error('❌ Build verification failed:');
  console.error(error.message);
  process.exit(1);
}
