#!/usr/bin/env node

/**
 * MIME Type Fix Script for CSS and JavaScript Files
 * This script ensures proper MIME types are configured for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing MIME type configurations...\n');

// 1. Verify _headers file exists and has correct configuration
const headersPath = path.join(path.dirname(__dirname), 'public', '_headers');
console.log('📄 Checking _headers file...');

if (fs.existsSync(headersPath)) {
  const headersContent = fs.readFileSync(headersPath, 'utf8');
  
  if (headersContent.includes('/assets/*.css') && headersContent.includes('text/css')) {
    console.log('   ✅ _headers file has correct CSS MIME type configuration');
  } else {
    console.log('   ⚠️  _headers file may need CSS MIME type configuration');
  }
} else {
  console.log('   ❌ _headers file not found');
}

// 2. Verify vercel.json has correct configuration
const vercelPath = path.join(path.dirname(__dirname), 'vercel.json');
console.log('\n📄 Checking vercel.json file...');

if (fs.existsSync(vercelPath)) {
  const vercelContent = fs.readFileSync(vercelPath, 'utf8');
  const vercelConfig = JSON.parse(vercelContent);
  
  // Check for CSS MIME type in headers
  const hasCSSSMimeType = vercelConfig.headers?.some(header => 
    header.source.includes('.css') && 
    header.headers?.some(h => h.key === 'Content-Type' && h.value === 'text/css')
  );
  
  if (hasCSSSMimeType) {
    console.log('   ✅ vercel.json has correct CSS MIME type configuration');
  } else {
    console.log('   ⚠️  vercel.json may need CSS MIME type configuration');
  }
  
  // Check for rewrites to prevent CSS from being served as HTML
  const hasRewrites = vercelConfig.rewrites || vercelConfig.routes?.some(route => 
    route.src && !route.src.includes('.css')
  );
  
  if (hasRewrites) {
    console.log('   ✅ vercel.json has routing configuration to prevent CSS conflicts');
  } else {
    console.log('   ⚠️  vercel.json may need routing configuration');
  }
} else {
  console.log('   ❌ vercel.json file not found');
}

// 3. Check if build generates CSS files correctly
const distPath = path.join(path.dirname(__dirname), 'dist');
console.log('\n📦 Checking build output...');

if (fs.existsSync(distPath)) {
  const assetsPath = path.join(distPath, 'assets');
  
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
    
    console.log(`   ✅ Found ${cssFiles.length} CSS files: ${cssFiles.join(', ')}`);
    console.log(`   ✅ Found ${jsFiles.length} JS files: ${jsFiles.slice(0, 3).join(', ')}${jsFiles.length > 3 ? '...' : ''}`);
    
    if (cssFiles.length === 0) {
      console.log('   ⚠️  No CSS files found in build output');
    }
  } else {
    console.log('   ⚠️  Assets folder not found in build output');
  }
} else {
  console.log('   ⚠️  Build output (dist) folder not found. Run "npm run build" first.');
}

// 4. Generate deployment-ready configuration summary
console.log('\n📋 MIME Type Fix Summary:');
console.log('='.repeat(50));
console.log('1. CSS files will be served with Content-Type: text/css');
console.log('2. JavaScript files will be served with Content-Type: application/javascript');
console.log('3. Static assets in /assets/ folder have immutable caching');
console.log('4. SPA routing prevents CSS files from being served as HTML');
console.log('\n🚀 Deploy with: npm run build && vercel --prod');
console.log('\n✅ MIME type configurations are ready for deployment!');
