/**
 * Enhanced setup-pdf-worker.js - More robust version for Vercel deployment
 * This script ensures the PDF.js worker files are properly set up in the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// Enhanced error handling and logging
const logInfo = (message) => console.log(`[PDF-Worker] INFO: ${message}`);
const logWarning = (message) => console.warn(`[PDF-Worker] WARNING: ${message}`);
const logError = (message) => console.error(`[PDF-Worker] ERROR: ${message}`);
const logSuccess = (message) => console.log(`[PDF-Worker] SUCCESS: ${message}`);

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const require = createRequire(import.meta.url);
  
  logInfo('Starting PDF worker setup...');
  
  // Safely load package.json
  let packageJson;
  try {
    packageJson = require('../package.json');
    logInfo('Successfully loaded package.json');
  } catch (err) {
    logError(`Failed to load package.json: ${err.message}`);
    logInfo('Attempting to read package.json directly as fallback');
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      logInfo('Successfully loaded package.json using direct file read');
    } else {
      throw new Error('Cannot locate package.json');
    }
  }
  
  // Get PDF.js version
  const pdfjsVersion = packageJson.dependencies['pdfjs-dist']?.replace('^', '') || '5.2.133';
  logInfo(`Setting up PDF.js worker files for version ${pdfjsVersion}...`);
  
  // Setup directories
  const sourceDir = path.resolve(__dirname, '../node_modules/pdfjs-dist/build');
  const targetDir = path.resolve(__dirname, '../public/pdf-worker');
  
  logInfo(`Source directory: ${sourceDir}`);
  logInfo(`Target directory: ${targetDir}`);
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    logError(`Source directory not found: ${sourceDir}`);
    logInfo('Checking alternative source paths...');
    
    const altSourceDirs = [
      path.resolve(__dirname, '../node_modules/pdfjs-dist/legacy/build'),
      path.resolve(__dirname, '../node_modules/pdfjs-dist/es5/build')
    ];
    
    for (const altDir of altSourceDirs) {
      if (fs.existsSync(altDir)) {
        logInfo(`Found alternative source directory: ${altDir}`);
        sourceDir = altDir;
        break;
      }
    }
    
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Cannot find PDF.js source directory. Make sure pdfjs-dist is installed correctly.`);
    }
  }
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    logInfo(`Creating target directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
    logSuccess(`Created directory: ${targetDir}`);
  }
  
  // Files to copy - try different file extensions based on version
  const possibleWorkerFiles = [
    'pdf.worker.mjs',
    'pdf.worker.js',
    'pdf.worker.min.js'
  ];
  
  // Find available worker files
  const availableFiles = [];
  possibleWorkerFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    if (fs.existsSync(sourcePath)) {
      availableFiles.push(file);
      if (file.endsWith('.map')) {
        const mapFile = `${file}.map`;
        const mapSourcePath = path.join(sourceDir, mapFile);
        if (fs.existsSync(mapSourcePath)) {
          availableFiles.push(mapFile);
        }
      }
    }
  });
  
  if (availableFiles.length === 0) {
    logError('No PDF worker files found. List of files in source directory:');
    try {
      const files = fs.readdirSync(sourceDir);
      files.forEach(file => logInfo(` - ${file}`));
      
      // If we find any pdf worker file with any name, copy it
      const pdfWorkerFile = files.find(file => file.includes('pdf.worker'));
      if (pdfWorkerFile) {
        logInfo(`Found alternative worker file: ${pdfWorkerFile}`);
        availableFiles.push(pdfWorkerFile);
      }
    } catch (err) {
      logError(`Failed to list directory: ${err.message}`);
    }
  }
  
  // Copy each available file
  let copiedFiles = 0;
  for (const file of availableFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    try {
      fs.copyFileSync(sourcePath, targetPath);
      logSuccess(`Copied ${file} to public/pdf-worker`);
      copiedFiles++;
    } catch (err) {
      logError(`Failed to copy ${file}: ${err.message}`);
    }
  }
  
  // Create fallback if no files were copied
  if (copiedFiles === 0) {
    logWarning('No files were copied. Creating a placeholder worker file.');
    const placeholderPath = path.join(targetDir, 'pdf.worker.js');
    fs.writeFileSync(placeholderPath, `
      // Fallback PDF worker file created during build
      // This is a placeholder and may cause PDF viewing issues
      self.onmessage = function(event) {
        self.postMessage({
          error: true,
          message: 'This is a fallback PDF worker. PDF viewing may not work correctly.'
        });
      };
    `);
    logInfo('Created placeholder worker file. PDFs may not render correctly.');
  }
  
  // Final summary
  logSuccess(`PDF worker setup complete. Copied ${copiedFiles} files.`);
  
} catch (error) {
  logError(`PDF worker setup failed: ${error.message}`);
  logError(error.stack);
  // Don't exit with error to allow build to continue
  logWarning('Continuing build process despite PDF worker setup failure.');
}
