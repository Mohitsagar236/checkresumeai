// Railway deployment helper script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking directory structure...');
console.log(`Current directory: ${process.cwd()}`);
console.log(`Files in current directory: ${fs.readdirSync('.')}`);

// Check if we're in the project directory or need to navigate to it
const isProjectDir = fs.existsSync('./package.json') && 
                    JSON.parse(fs.readFileSync('./package.json', 'utf8')).name === 'checkresumeai';

if (!isProjectDir) {
    console.log('Not in project directory, navigating to project directory...');
    if (fs.existsSync('./project')) {
        process.chdir('./project');
        console.log(`Moved to project directory: ${process.cwd()}`);
    } else {
        console.error('❌ Project directory not found!');
        process.exit(1);
    }
}

try {
    // Run the build script
    console.log('🚀 Running build script...');
    execSync('node scripts/railway-build.js', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}
