// Simple Vercel Build Script
// This script handles the build process for Vercel deployments
// It ensures proper environment setup and PDF worker configuration
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Starting simplified Vercel build process');
console.log(`Project root: ${projectRoot}`);

// Ensure we're in the project directory
process.chdir(projectRoot);

// Create or update necessary files for deployment
function setupDeploymentFiles() {
  // 1. Create the _redirects file for SPA routing
  const redirectsContent = `/* /index.html 200`;
  const redirectsPath = path.join(projectRoot, 'public', '_redirects');
  
  fs.writeFileSync(redirectsPath, redirectsContent, 'utf8');
  console.log('✅ Created _redirects file for SPA routing');
  
  // 2. Ensure the PDF worker directory exists
  const pdfWorkerDir = path.join(projectRoot, 'public', 'pdf-worker');
  if (!fs.existsSync(pdfWorkerDir)) {
    fs.mkdirSync(pdfWorkerDir, { recursive: true });
    console.log('✅ Created PDF worker directory');
  }
  
  // 3. Create minimal PDF worker files if they don't exist
  const pdfWorkerPath = path.join(pdfWorkerDir, 'pdf.worker.min.js');
  if (!fs.existsSync(pdfWorkerPath)) {
    // Create a minimal placeholder worker file
    fs.writeFileSync(pdfWorkerPath, '// Minimal PDF Worker File', 'utf8');
    console.log('✅ Created minimal PDF worker file');
  }
  
  // 4. Create Vercel configuration file
  const vercelConfig = {
    "version": 2,
    "rewrites": [
      { "source": "/assets/(.*)", "destination": "/assets/$1" },
      { "source": "/api/(.*)", "destination": "/api/$1" },
      { "source": "/static/(.*)", "destination": "/static/$1" },
      { "source": "/(.*\\.[a-z0-9]+)", "destination": "/$1" },
      { "source": "/(.*)", "destination": "/index.html" }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  };
  
  fs.writeFileSync(path.join(projectRoot, 'vercel.json'), JSON.stringify(vercelConfig, null, 2), 'utf8');
  console.log('✅ Created vercel.json configuration');
  
  // 5. Create fallback HTML files for error handling
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(projectRoot, '200.html'), indexHtml, 'utf8');
  fs.writeFileSync(path.join(projectRoot, '404.html'), indexHtml, 'utf8');
  console.log('✅ Created fallback HTML files');
}

// Main build process
try {
  // Setup deployment files
  setupDeploymentFiles();
  
  // Run the Vite build
  console.log('🔨 Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy necessary files to the dist directory after build
  const distDir = path.join(projectRoot, 'dist');
  
  // Copy _redirects to dist
  fs.copyFileSync(
    path.join(projectRoot, 'public', '_redirects'), 
    path.join(distDir, '_redirects')
  );
  
  // Copy fallback files to dist
  fs.copyFileSync(path.join(projectRoot, '200.html'), path.join(distDir, '200.html'));
  fs.copyFileSync(path.join(projectRoot, '404.html'), path.join(distDir, '404.html'));
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
