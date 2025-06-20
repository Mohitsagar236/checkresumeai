// Fix Git Submodule Error
// This script removes any .git files in the project directory that might cause submodule errors

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log('🔍 Checking for git submodule issues...');

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check if project/.git file exists (this causes the submodule error)
const projectGitPath = path.join(rootDir, 'project', '.git');

try {
  // Check if the .git file or directory exists in the project folder
  if (fs.existsSync(projectGitPath)) {
    const stats = fs.statSync(projectGitPath);
    
    if (stats.isFile()) {
      console.log('🔧 Found .git file in project directory. Removing to fix submodule error...');
      fs.unlinkSync(projectGitPath);
      console.log('✅ Removed .git file in project directory. Submodule error should be fixed!');
    } else if (stats.isDirectory()) {
      console.log('🔧 Found .git directory in project directory. This might cause submodule errors.');
      // We don't automatically delete git directories for safety
      console.log('⚠️ If you continue having submodule issues, consider manually removing the project/.git directory.');
    }
  } else {
    console.log('✅ No .git file found in project directory. No submodule issues detected.');
  }
} catch (error) {
  console.error('❌ Error checking for git submodule issues:', error);
}

// Also check if project is correctly set up for Vercel deployment
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
  console.log('⚠️ vercel.json not found in root directory. This might cause deployment issues.');
  console.log('   Run the fix-vercel-deploy.ps1 script to fix this issue.');
}

console.log('🚀 Git submodule check completed.');
