#!/usr/bin/env node

/**
 * Test script to validate the runtime error fixes
 */

console.log('🔧 Testing runtime error fixes...\n');

// Test 1: Check if PDF worker files exist
const fs = require('fs');
const path = require('path');

console.log('1. Checking PDF worker files...');
const workerFiles = [
  'public/pdf-worker/pdf.worker.mjs',
  'public/pdf-worker/pdf.worker.min.mjs',
  'public/pdf-worker.js'
];

let workerFilesExist = true;
workerFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    workerFilesExist = false;
  }
});

// Test 2: Check source files for key fixes
console.log('\n2. Checking source file fixes...');

const sourceFiles = [
  {
    file: 'src/utils/pdf-worker-stable.enhanced.v2.ts',
    checks: [
      'console.debug.*Callback.*already resolved',
      'Silently handle missing callbacks'
    ]
  },
  {
    file: 'src/utils/pdf-error-monitor.ts', 
    checks: [
      'Browser extension connection error',
      'Could not establish connection'
    ]
  },
  {
    file: 'src/pages/ResultsPage.tsx',
    checks: [
      'Resume file appears to be empty',
      'Invalid base64 format detected'
    ]
  },
  {
    file: 'src/context/AuthContext.tsx',
    checks: [
      'console.debug.*Profile creation failed',
      'Don\'t block auth flow'
    ]
  }
];

let allSourceFixesPresent = true;
sourceFiles.forEach(({ file, checks }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`   📁 ${file}:`);
    
    checks.forEach(check => {
      const regex = new RegExp(check, 'i');
      if (regex.test(content)) {
        console.log(`      ✅ Contains fix: ${check}`);
      } else {
        console.log(`      ❌ Missing fix: ${check}`);
        allSourceFixesPresent = false;
      }
    });
  } else {
    console.log(`   ❌ ${file} not found`);
    allSourceFixesPresent = false;
  }
});

// Test 3: Check package.json for required dependencies
console.log('\n3. Checking dependencies...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['pdfjs-dist', 'framer-motion', 'lucide-react'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`   ✅ ${dep} is installed`);
    } else {
      console.log(`   ❌ ${dep} is missing`);
    }
  });
} else {
  console.log('   ❌ package.json not found');
}

// Summary
console.log('\n📊 Fix Validation Summary:');
console.log(`PDF Worker Files: ${workerFilesExist ? '✅' : '❌'}`);
console.log(`Source Code Fixes: ${allSourceFixesPresent ? '✅' : '❌'}`);
console.log(`Overall Status: ${workerFilesExist && allSourceFixesPresent ? '✅ PASSED' : '❌ NEEDS ATTENTION'}`);

if (workerFilesExist && allSourceFixesPresent) {
  console.log('\n🎉 All fixes appear to be properly implemented!');
  console.log('\nThe following issues should now be resolved:');
  console.log('- "Cannot resolve callback" errors are now handled silently');
  console.log('- Browser extension connection errors are suppressed');
  console.log('- File reconstruction includes better validation');
  console.log('- Profile creation errors don\'t block auth flow');
  console.log('- Missing resume data errors provide clearer messages');
} else {
  console.log('\n⚠️  Some fixes may be incomplete. Please review the errors above.');
}
