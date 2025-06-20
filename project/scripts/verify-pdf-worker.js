import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to check
const targetDir = path.resolve(__dirname, '../public/pdf-worker');
const workerFiles = [
  'pdf.worker.mjs',
  'pdf.worker.min.mjs',
  'pdf.worker.mjs.map'
];

console.log('Verifying PDF.js worker files...');

// Check directory exists
if (!fs.existsSync(targetDir)) {
  console.error(`❌ PDF worker directory not found at ${targetDir}`);
  process.exit(1);
}

// Check each required file
let missingFiles = false;
workerFiles.forEach(file => {
  const filePath = path.join(targetDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    missingFiles = true;
  } else {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.error(`❌ File is empty: ${file}`);
      missingFiles = true;
    } else {
      console.log(`✓ Found ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }
});

if (missingFiles) {
  console.log('\nSome PDF.js worker files are missing or invalid.');
  console.log('Please run: npm run setup-pdf-worker');
  process.exit(1);
} else {
  console.log('\n✓ All PDF.js worker files are present and valid!');
}
