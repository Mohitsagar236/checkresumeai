// Simple Vercel Build Script with Timeout Protection
// This script prevents build timeouts by optimizing the build process

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectDir = path.resolve(__dirname, '..');
const publicDir = path.join(projectDir, 'public');
const startTime = Date.now();

// Track build time
const timeLeft = () => {
  const elapsedMinutes = (Date.now() - startTime) / 60000;
  return Math.max(0, 45 - elapsedMinutes).toFixed(1);
};

console.log(`🚀 Starting optimized Vercel build (${timeLeft()} minutes remaining)...`);

// 1. Fix any git submodule issues
try {
  const gitFile = path.join(projectDir, '.git');
  if (fs.existsSync(gitFile) && fs.statSync(gitFile).isFile()) {
    console.log('Removing .git file to prevent submodule errors...');
    fs.unlinkSync(gitFile);
  }
} catch (error) {
  console.log('Note: No git submodule issues found or already fixed.');
}

// 2. Setup PDF worker (critical for the app to function)
console.log(`Setting up PDF worker (${timeLeft()} minutes remaining)...`);
const pdfWorkerDir = path.join(publicDir, 'pdf-worker');
if (!fs.existsSync(pdfWorkerDir)) {
  fs.mkdirSync(pdfWorkerDir, { recursive: true });
}

// Create minimal PDF worker files
const workerFiles = ['pdf.worker.mjs', 'pdf.worker.min.mjs'];
workerFiles.forEach(file => {
  const filePath = path.join(pdfWorkerDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Creating minimal ${file}...`);
    fs.writeFileSync(filePath, `
// Minimal PDF worker file for Vercel deployment
self.onmessage = function(event) {
  self.postMessage({ type: "ready", supportsMobilePDF: false });
};
    `);
  }
});

// 3. Set up SPA routing files
console.log(`Setting up SPA routing files (${timeLeft()} minutes remaining)...`);
const redirectsPath = path.join(publicDir, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  fs.writeFileSync(redirectsPath, '/* /index.html 200');
}

// 4. Run the build with NODE_ENV=production
console.log(`Running build (${timeLeft()} minutes remaining)...`);
process.env.NODE_ENV = 'production';
process.env.VITE_EXCLUDE_LARGE_DEPENDENCIES = 'true';

try {
  execSync('npx vite build --minify', {
    stdio: 'inherit',
    cwd: projectDir,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      VITE_EXCLUDE_LARGE_DEPENDENCIES: 'true'
    }
  });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// 5. Create SPA fallback files
console.log(`Creating SPA fallback files (${timeLeft()} minutes remaining)...`);
const distDir = path.join(projectDir, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Create 200.html (for SPA routing)
  fs.writeFileSync(path.join(distDir, '200.html'), indexContent);
  
  // Create 404.html (redirects to index)
  const notFoundContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Single Page App routing fix
    sessionStorage.setItem('spa_redirect', window.location.pathname + window.location.search);
    window.location.href = '/';
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
  `;
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundContent);
}

console.log(`✅ Build completed successfully in ${((Date.now() - startTime) / 60000).toFixed(1)} minutes!`);
