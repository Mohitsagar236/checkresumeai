// Fallback Railway build script for CheckResumeAI
// This script provides a simpler build process with better error handling

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Function to execute commands with proper error handling
function executeCommand(command, cwd = projectRoot, options = {}) {
  try {
    console.log(`🔄 Executing: ${command}`);
    const result = execSync(command, { 
      cwd, 
      stdio: 'inherit',
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' },
      ...options
    });
    console.log(`✅ Command completed: ${command}`);
    return result;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(`Error: ${error.message}`);
    
    // If frontend build fails, try alternate approach
    if (command.includes('build:frontend')) {
      console.log('🔄 Trying alternate frontend build...');
      try {
        executeCommand('npx vite build --mode production --minify esbuild --force', cwd, options);
        return true;
      } catch (altError) {
        console.error('❌ Alternate frontend build also failed');
        throw altError;
      }
    }
    
    throw error;
  }
}

// Ensure dist directory exists
function ensureDistDirectory() {
  const distPath = join(projectRoot, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
    console.log('📁 Created dist directory');
  }
}

async function buildProject() {
  console.log('🚀 Starting Railway build process...');
  
  try {
    // Clean up existing build directories
    console.log('🧹 Cleaning up build directories...');
    try {
      if (fs.existsSync(join(projectRoot, 'dist'))) {
        fs.rmSync(join(projectRoot, 'dist'), { recursive: true, force: true });
      }
      if (fs.existsSync(join(projectRoot, 'backend', 'dist'))) {
        fs.rmSync(join(projectRoot, 'backend', 'dist'), { recursive: true, force: true });
      }
      console.log('✅ Build directories cleaned');
    } catch (cleanupError) {
      console.log('⚠️ Cleanup warning (continuing):', cleanupError.message);
    }
    
    // Ensure dist directory exists
    ensureDistDirectory();
    
    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    executeCommand('npm install --legacy-peer-deps --no-audit --no-fund', projectRoot);
    
    // Try to build frontend
    console.log('🏗️ Building frontend...');
    try {
      executeCommand('npm run build:frontend', projectRoot);
    } catch (frontendError) {
      console.log('⚠️ Frontend build failed, trying simple static copy...');
      // Copy static files if build fails
      const publicDir = join(projectRoot, 'public');
      const distDir = join(projectRoot, 'dist');
      
      if (fs.existsSync(publicDir)) {
        executeCommand(`cp -r ${publicDir}/* ${distDir}/`, projectRoot);
      }
    }
    
    // Build backend
    console.log('🏗️ Building backend...');
    const backendPath = join(projectRoot, 'backend');
    
    // Install backend dependencies
    console.log('📦 Installing backend dependencies...');
    executeCommand('npm install --legacy-peer-deps --no-audit --no-fund', backendPath);
    
    // Compile TypeScript
    console.log('🔧 Compiling TypeScript...');
    executeCommand('npm run build', backendPath);
    
    console.log('✨ Railway build process completed successfully!');
    
  } catch (error) {
    console.error('💥 Build process failed:', error.message);
    console.log('🔧 Attempting recovery build...');
    
    // Recovery build - just ensure backend is built
    try {
      const backendPath = join(projectRoot, 'backend');
      executeCommand('npm install --legacy-peer-deps --force', backendPath);
      executeCommand('npm run build', backendPath);
      console.log('✅ Recovery build completed - backend ready');
    } catch (recoveryError) {
      console.error('💥 Recovery build also failed:', recoveryError.message);
      process.exit(1);
    }
  }
}

// Run the build process
buildProject();
