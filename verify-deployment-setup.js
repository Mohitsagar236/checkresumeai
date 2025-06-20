// Script to verify the deployment setup is correct
// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = __dirname;
const projectDir = path.join(rootDir, 'project');
const scriptsDir = path.join(projectDir, 'scripts');

console.log('🔍 Verifying deployment setup...');

// Check if necessary files exist
const requiredFiles = [
  { path: path.join(rootDir, 'vercel.json'), name: 'Root vercel.json' },
  { path: path.join(projectDir, 'vercel.json'), name: 'Project vercel.json' },
  { path: path.join(rootDir, 'package.json'), name: 'Root package.json' },
  { path: path.join(projectDir, 'package.json'), name: 'Project package.json' },
  { path: path.join(scriptsDir, 'simple-vercel-build.js'), name: 'Simple Vercel build script' },
  { path: path.join(projectDir, 'public', '_redirects'), name: 'SPA redirect file' },
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file.path)) {
    console.error(`❌ ${file.name} does not exist at ${file.path}`);
    allFilesExist = false;
  } else {
    console.log(`✅ ${file.name} exists`);
  }
}

// Verify build commands in package.json are correct
const rootPackageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const projectPackageJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));

// Check root package.json scripts
const requiredRootScripts = ['build', 'vercel-build', 'setup-pdf-worker'];
for (const script of requiredRootScripts) {
  if (!rootPackageJson.scripts || !rootPackageJson.scripts[script]) {
    console.error(`❌ Root package.json is missing the "${script}" script`);
    allFilesExist = false;
  } else {
    console.log(`✅ Root package.json has "${script}" script: ${rootPackageJson.scripts[script]}`);
  }
}

// Check project package.json scripts
const requiredProjectScripts = ['build', 'setup-pdf-worker'];
for (const script of requiredProjectScripts) {
  if (!projectPackageJson.scripts || !projectPackageJson.scripts[script]) {
    console.error(`❌ Project package.json is missing the "${script}" script`);
    allFilesExist = false;
  } else {
    console.log(`✅ Project package.json has "${script}" script: ${projectPackageJson.scripts[script]}`);
  }
}

// Verify vercel.json configurations
const rootVercelJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
const projectVercelJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'vercel.json'), 'utf8'));

// Check buildCommand in both vercel.json files
console.log(`✅ Root vercel.json buildCommand: ${rootVercelJson.buildCommand}`);
console.log(`✅ Project vercel.json buildCommand: ${projectVercelJson.buildCommand}`);

// Verify SPA routing configurations
if (rootVercelJson.rewrites && rootVercelJson.rewrites.some(r => r.source === '/(.*)')){
  console.log('✅ Root vercel.json has SPA routing configuration');
} else {
  console.error('❌ Root vercel.json is missing SPA routing configuration');
  allFilesExist = false;
}

if (projectVercelJson.rewrites && projectVercelJson.rewrites.some(r => r.source === '/(.*)')){
  console.log('✅ Project vercel.json has SPA routing configuration');
} else {
  console.error('❌ Project vercel.json is missing SPA routing configuration');
  allFilesExist = false;
}

// Check _redirects file
const redirectsPath = path.join(projectDir, 'public', '_redirects');
if (fs.existsSync(redirectsPath)) {
  const content = fs.readFileSync(redirectsPath, 'utf8');
  if (content.includes('/* /index.html 200')) {
    console.log('✅ _redirects file has correct SPA routing rule');
  } else {
    console.error('❌ _redirects file is missing the SPA routing rule');
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ All deployment files verified successfully!');
  console.log('🚀 Your project is ready to be deployed to Vercel.');
} else {
  console.error('❌ Some required files are missing or misconfigured.');
  console.error('Please fix the issues above before deploying to Vercel.');
  process.exit(1);
}
