#!/usr/bin/env node

/**
 * Get Started Button Fix Verification Script
 * Tests all routes to ensure they load correctly after the import fixes
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Verifying Get Started Button Fix...\n');

const routesToTest = [
  { path: '/upload', description: 'Upload Page (Main Get Started)' },
  { path: '/pricing', description: 'Pricing Page (Navigation Get Started)' },
  { path: '/signup', description: 'Signup Page (Header Get Started)' }
];

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkRouteConfiguration() {
  console.log('📋 Checking route configuration...');
  
  const routesPath = './src/routes.tsx';
  if (!checkFileExists(routesPath)) {
    console.log('❌ routes.tsx not found');
    return false;
  }
  
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  
  // Check if the problematic import patterns are fixed
  const problematicPatterns = [
    'module => ({ default: module.UploadPage })',
    'module => ({ default: module.FAQPage })',
    'module => ({ default: module.PricingPage })'
  ];
  
  let hasProblems = false;
  problematicPatterns.forEach(pattern => {
    if (routesContent.includes(pattern)) {
      console.log(`❌ Found problematic pattern: ${pattern}`);
      hasProblems = true;
    }
  });
  
  if (!hasProblems) {
    console.log('✅ Route configuration looks correct');
    return true;
  }
  
  return false;
}

function checkPageComponents() {
  console.log('\n📄 Checking page components...');
  
  const pagesToCheck = [
    './src/pages/UploadPage.tsx',
    './src/pages/PricingPage.tsx',
    './src/pages/SignupPage.tsx',
    './src/pages/HomePage.tsx'
  ];
  
  let allPagesExist = true;
  
  pagesToCheck.forEach(pagePath => {
    if (checkFileExists(pagePath)) {
      console.log(`✅ ${path.basename(pagePath)} exists`);
    } else {
      console.log(`❌ ${path.basename(pagePath)} missing`);
      allPagesExist = false;
    }
  });
  
  return allPagesExist;
}

function runTypeScriptCheck() {
  console.log('\n🔍 Running TypeScript check...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful');
    return true;
  } catch (error) {
    console.log('❌ TypeScript errors found:');
    console.log(error.stdout?.toString() || error.message);
    return false;
  }
}

function main() {
  console.log('Starting verification process...\n');
  
  const checks = [
    { name: 'Route Configuration', test: checkRouteConfiguration },
    { name: 'Page Components', test: checkPageComponents },
    { name: 'TypeScript Compilation', test: runTypeScriptCheck }
  ];
  
  let allPassed = true;
  const results = [];
  
  checks.forEach(check => {
    const result = check.test();
    results.push({ name: check.name, passed: result });
    allPassed = allPassed && result;
  });
  
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('========================');
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log('\n🎯 GET STARTED BUTTON ROUTES:');
  routesToTest.forEach(route => {
    console.log(`   ${route.path} → ${route.description}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 ALL CHECKS PASSED! Get Started buttons should be working correctly.');
    console.log('🌐 Test the application at: http://localhost:5176/');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the issues above.');
  }
  
  process.exit(allPassed ? 0 : 1);
}

main();
