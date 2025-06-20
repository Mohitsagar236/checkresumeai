// Fix Root Package.json
// This file ensures we have the correct package.json in the root directory

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory (should be the root of the project)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;

// Create a basic package.json with the necessary scripts
const rootPackageJson = {
  "name": "checkresumeai-root",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "cd project && npm run build",
    "vercel-build": "cd project && node scripts/simple-vercel-build.js",
    "optimized-vercel-build": "cd project && node scripts/simple-vercel-build.js",
    "setup-pdf-worker": "cd project && npm run setup-pdf-worker",
    "start": "cd project && npm start",
    "dev": "cd project && npm run dev",
    "postinstall": "node scripts/fix-git-submodule.js || true"
  }
};

// Write the package.json file
console.log('Creating root package.json...');
fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify(rootPackageJson, null, 2));
console.log('✅ Root package.json created successfully!');
