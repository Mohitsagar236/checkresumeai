/**
 * This script ensures the PDF.js worker files are properly set up in the public directory
 * It copies the necessary files from node_modules to the public/pdf-worker directory
 */

// Get the version of pdfjs-dist from package.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// PDF.js version from package.json
const pdfjsVersion = packageJson.dependencies['pdfjs-dist'].replace('^', '');
console.log(`Setting up PDF.js worker files for version ${pdfjsVersion}...`);

const sourceDir = path.resolve(__dirname, '../node_modules/pdfjs-dist/build');
const targetDir = path.resolve(__dirname, '../public/pdf-worker');

// Create the directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Files to copy - prioritize .mjs files for newer versions
const filesToCopy = [
  'pdf.worker.mjs',
  'pdf.worker.mjs.map'
];

// Copy each file
filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
    try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied ${file} to public/pdf-worker`);
    } else {
      // Skip warning for .js files in newer versions that only use .mjs
      if (file.endsWith('.mjs') || file.endsWith('.mjs.map')) {
        console.error(`Error: Required file ${file} not found in node_modules`);
      }
    }
  } catch (err) {
    console.error(`Error copying ${file}:`, err);
  }
});

// Create a version file for easy checking
fs.writeFileSync(
  path.join(targetDir, 'version.txt'), 
  pdfjsVersion,
  'utf8'
);

// Update the pdf-worker.js file
const workerProxyPath = path.resolve(__dirname, '../public/pdf-worker.js');
const workerProxyContent = `// PDF.js Worker Loader (auto-generated)
// Version: ${pdfjsVersion}
// Generated: ${new Date().toISOString()}

(function() {
  const version = '${pdfjsVersion}';
  
  // Try to use local worker files first, then fall back to CDN
  const workerSources = [    // Local paths (relative to public directory)
    '/pdf-worker/pdf.worker.mjs',
    
    // CDN fallbacks
    \`https://cdn.jsdelivr.net/npm/pdfjs-dist@\${version}/build/pdf.worker.mjs\`,
    \`https://unpkg.com/pdfjs-dist@\${version}/build/pdf.worker.mjs\`
  ];
  
  // Helper to load script
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error(\`Failed to load worker from \${url}\`));
      document.head.appendChild(script);
    });
  }
  
  // Try each source in sequence
  async function loadWorker() {
    for (const url of workerSources) {
      try {
        console.log(\`Trying to load PDF.js worker from: \${url}\`);
        await loadScript(url);
        console.log(\`✓ PDF.js worker loaded successfully from \${url}\`);
        return;
      } catch (error) {
        console.warn(\`Could not load PDF.js worker from \${url}\`);
      }
    }
    console.error('Failed to load PDF.js worker from any source');
  }
  
  // Start loading
  loadWorker().catch(console.error);
})();
`;

fs.writeFileSync(workerProxyPath, workerProxyContent);
console.log(`Updated ${workerProxyPath}`);

console.log('PDF.js worker setup complete!');
