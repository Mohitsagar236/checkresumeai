#!/usr/bin/env node

/**
 * Development Environment Setup Script
 * Ensures the correct Supabase configuration is loaded
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up development environment...');

// Check if we're in the correct directory
const projectRoot = path.dirname(__dirname);
const envPath = path.join(projectRoot, '.env');
const envDevPath = path.join(projectRoot, '.env.development');
const envProdPath = path.join(projectRoot, '.env.production');

// Expected Supabase URL (the correct one)
const CORRECT_SUPABASE_URL = 'https://rvmvahwyfptyhchlvtvr.supabase.co';
const CORRECT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE';

function checkEnvFile(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${fileName} not found`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const hasCorrectUrl = content.includes(CORRECT_SUPABASE_URL);
  const hasIncorrectUrl = content.includes('gbmhfzoanmnayjvaxdfu.supabase.co');

  if (hasCorrectUrl) {
    console.log(`✅ ${fileName} has correct Supabase URL`);
    return true;
  } else if (hasIncorrectUrl) {
    console.log(`❌ ${fileName} has incorrect Supabase URL`);
    return false;
  } else {
    console.log(`⚠️  ${fileName} missing Supabase URL`);
    return false;
  }
}

function displayEnvironmentInfo() {
  console.log('\n📋 Environment Status:');
  console.log('='.repeat(50));
  
  const files = [
    [envPath, '.env'],
    [envDevPath, '.env.development'],
    [envProdPath, '.env.production']
  ];

  let allCorrect = true;
  files.forEach(([filePath, fileName]) => {
    const isCorrect = checkEnvFile(filePath, fileName);
    if (!isCorrect) allCorrect = false;
  });

  console.log('='.repeat(50));
  
  if (allCorrect) {
    console.log('🎉 All environment files are configured correctly!');
    console.log('\n💡 Next steps:');
    console.log('1. Clear your browser cache and localStorage');
    console.log('2. Restart your development server');
    console.log('3. Reload your application');
  } else {
    console.log('🚨 Some environment files need attention');
    console.log('\n🔨 Auto-fix available:');
    console.log('Run this script with --fix flag to automatically update URLs');
  }
}

function fixEnvironmentFiles() {
  console.log('\n🔨 Auto-fixing environment files...');
  
  const files = [envPath, envDevPath, envProdPath];
  
  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace incorrect URL with correct one
      if (content.includes('gbmhfzoanmnayjvaxdfu.supabase.co')) {
        content = content.replace(
          /https:\/\/gbmhfzoanmnayjvaxdfu\.supabase\.co/g,
          CORRECT_SUPABASE_URL
        );
        
        // Also update the corresponding key if present
        content = content.replace(
          /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0\.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4/g,
          CORRECT_SUPABASE_KEY
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${path.basename(filePath)}`);
      }
    }
  });
  
  console.log('\n🎉 Environment files updated successfully!');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--fix')) {
  fixEnvironmentFiles();
} else {
  displayEnvironmentInfo();
}

console.log('\n🌐 Correct Supabase URL:', CORRECT_SUPABASE_URL);
console.log('📧 If you continue to see errors, please check your network connection');
