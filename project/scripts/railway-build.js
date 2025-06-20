// Railway build script for CheckResumeAI
// This script handles the build process for both frontend and backend

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Function to execute commands with proper error handling
function executeCommand(command, cwd = projectRoot) {
  try {
    console.log(`🔄 Executing: ${command}`);
    const result = execSync(command, { 
      cwd, 
      stdio: 'inherit',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    console.log(`✅ Command completed: ${command}`);
    return result;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function buildProject() {
  console.log('🚀 Starting Railway build process...');
  
  try {    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    executeCommand('npm install --legacy-peer-deps', projectRoot);
    
    // Build frontend
    console.log('🏗️ Building frontend...');
    executeCommand('npm run build:frontend', projectRoot);
    
    // Build backend
    console.log('🏗️ Building backend...');
    const backendPath = join(projectRoot, 'backend');
      // Install backend dependencies
    console.log('📦 Installing backend dependencies...');
    executeCommand('npm install --legacy-peer-deps', backendPath);
    
    // Compile TypeScript
    console.log('🔧 Compiling TypeScript...');
    executeCommand('npm run build', backendPath);
    
    console.log('✨ Railway build process completed successfully!');
    
  } catch (error) {
    console.error('💥 Build process failed:', error.message);
    process.exit(1);
  }
}

// Run the build process
buildProject();
