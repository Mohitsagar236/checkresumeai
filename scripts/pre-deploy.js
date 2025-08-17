// Pre-deploy script for Render deployment
// This script runs before the application starts
// Created: June 19, 2025

import fs from 'fs';
import path from 'path';

console.log('Running pre-deployment tasks for CheckResumeAI...');

// Ensure the static.config.toml is properly configured
try {
  // Check for environment variables
  console.log('Validating environment variables...');
  const requiredEnvVars = [
    'VITE_SUPABASE_URL', 
    'VITE_SUPABASE_ANON_KEY', 
    'VITE_OPENAI_API_KEY'
  ];
  
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Application may not function correctly without these variables.');
  } else {
    console.log('✅ Environment variables validated successfully');
  }
  
  // Create the dist directory if it doesn't exist yet
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('Creating dist directory...');
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Copy static config to dist directory
  const staticConfigPath = path.resolve(process.cwd(), 'static.config.toml');
  const distConfigPath = path.resolve(distDir, 'static.config.toml');
  
  if (fs.existsSync(staticConfigPath)) {
    console.log('Copying static.config.toml to dist folder...');
    fs.copyFileSync(staticConfigPath, distConfigPath);
    console.log('✅ Configuration copied successfully');
  } else {
    console.warn('⚠️ Warning: static.config.toml not found');
  }

  console.log('Pre-deployment tasks completed successfully!');
} catch (error) {
  console.error('Error during pre-deployment:', error);
  // Don't exit with error code as we don't want to fail the deployment
}
