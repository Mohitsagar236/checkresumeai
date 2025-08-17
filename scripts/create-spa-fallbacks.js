// Creates 200.html fallback for SPA routing
// This script runs after the build process completes

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const distDir = path.resolve(__dirname, '../dist');

// Check if dist directory exists
if (fs.existsSync(distDir)) {
  // Copy index.html to 200.html
  fs.copyFileSync(
    path.join(distDir, 'index.html'),
    path.join(distDir, '200.html')
  );
  console.log('✅ Created 200.html fallback file for SPA routing');
} else {
  console.error('❌ Dist directory not found. Build may not have completed successfully.');
}
