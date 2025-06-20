// Railway start script for CheckResumeAI
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const backendPath = join(projectRoot, 'backend');

console.log('🚀 Starting CheckResumeAI...');

try {
  // Change to backend directory
  process.chdir(backendPath);
  
  // Check if dist directory exists
  const distPath = join(backendPath, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('❌ Backend dist directory not found!');
    console.log('📦 Installing dependencies and building...');
    
    try {
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
      execSync('npm run build', { stdio: 'inherit' });
    } catch (buildError) {
      console.error('💥 Failed to build backend:', buildError.message);
      process.exit(1);
    }
  }
  
  // Check if server.js exists
  const serverPath = join(distPath, 'server.js');
  if (!fs.existsSync(serverPath)) {
    console.error('❌ Server file not found at:', serverPath);
    process.exit(1);
  }
  
  console.log('✅ Starting Node.js server...');
  
  // Start the server
  execSync('node dist/server.js', { stdio: 'inherit' });
  
} catch (error) {
  console.error('💥 Failed to start server:', error.message);
  process.exit(1);
}
