/**
 * Development Server Recovery Script
 * Automatically detects and fixes common development server issues
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);
const NODE_MODULES = path.join(PROJECT_ROOT, 'node_modules');
const VITE_CACHE = path.join(NODE_MODULES, '.vite');
const PACKAGE_JSON = path.join(PROJECT_ROOT, 'package.json');

class DevServerRecovery {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async diagnoseAndFix() {
    console.log('🔍 Diagnosing development server issues...\n');

    // Check 1: Package.json exists
    await this.checkPackageJson();

    // Check 2: Node modules installed
    await this.checkNodeModules();

    // Check 3: Clear problematic caches
    await this.clearCaches();

    // Check 4: Check for port conflicts
    await this.checkPortConflicts();

    // Check 5: Validate TypeScript configuration
    await this.validateTypeScript();

    // Report findings
    this.reportFindings();

    // Apply fixes
    await this.applyFixes();
  }

  async checkPackageJson() {
    if (!fs.existsSync(PACKAGE_JSON)) {
      this.issues.push('package.json not found');
      return;
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
      if (!pkg.scripts || !pkg.scripts.dev) {
        this.issues.push('dev script not found in package.json');
      }
      console.log('✅ package.json found and valid');
    } catch (error) {
      this.issues.push(`package.json is invalid: ${error.message}`);
    }
  }

  async checkNodeModules() {
    if (!fs.existsSync(NODE_MODULES)) {
      this.issues.push('node_modules not found');
      this.fixes.push('npm install');
      return;
    }

    // Check critical dependencies
    const criticalDeps = ['vite', 'react', 'react-dom', '@vitejs/plugin-react'];
    const missingDeps = criticalDeps.filter(dep => 
      !fs.existsSync(path.join(NODE_MODULES, dep))
    );

    if (missingDeps.length > 0) {
      this.issues.push(`Missing dependencies: ${missingDeps.join(', ')}`);
      this.fixes.push('npm install --force');
    } else {
      console.log('✅ Node modules present');
    }
  }

  async clearCaches() {
    const cacheDirs = [
      VITE_CACHE,
      path.join(NODE_MODULES, '.cache'),
      path.join(PROJECT_ROOT, 'dist'),
      path.join(PROJECT_ROOT, '.vite')
    ];

    for (const cacheDir of cacheDirs) {
      if (fs.existsSync(cacheDir)) {
        try {
          fs.rmSync(cacheDir, { recursive: true, force: true });
          console.log(`🗑️ Cleared cache: ${path.basename(cacheDir)}`);
        } catch (error) {
          console.warn(`⚠️ Could not clear ${cacheDir}: ${error.message}`);
        }
      }
    }
  }

  async checkPortConflicts() {
    return new Promise((resolve) => {
      exec('netstat -an | findstr :5174', (error, stdout) => {
        if (stdout && stdout.includes('5174')) {
          this.issues.push('Port 5174 may be in use');
          this.fixes.push('Kill process on port 5174');
        } else {
          console.log('✅ Port 5174 appears to be available');
        }
        resolve();
      });
    });
  }

  async validateTypeScript() {
    const tsConfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
    if (!fs.existsSync(tsConfigPath)) {
      this.issues.push('tsconfig.json not found');
      return;
    }

    try {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      if (!tsConfig.compilerOptions) {
        this.issues.push('Invalid TypeScript configuration');
      } else {
        console.log('✅ TypeScript configuration valid');
      }
    } catch (error) {
      this.issues.push(`TypeScript config error: ${error.message}`);
    }
  }

  reportFindings() {
    console.log('\n📊 Diagnosis Complete');
    console.log('===================');

    if (this.issues.length === 0) {
      console.log('🎉 No issues found! Server should work properly.');
      return;
    }

    console.log('❌ Issues found:');
    this.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });

    console.log('\n🔧 Recommended fixes:');
    this.fixes.forEach((fix, index) => {
      console.log(`  ${index + 1}. ${fix}`);
    });
  }

  async applyFixes() {
    if (this.fixes.length === 0) {
      return;
    }

    console.log('\n🛠️ Applying fixes...');

    for (const fix of this.fixes) {
      console.log(`Executing: ${fix}`);
      
      try {
        await this.executeCommand(fix);
        console.log(`✅ ${fix} completed`);
      } catch (error) {
        console.error(`❌ ${fix} failed: ${error.message}`);
      }
    }
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          if (stdout) console.log(stdout);
          if (stderr) console.warn(stderr);
          resolve(stdout);
        }
      });
    });
  }

  async startServer() {
    console.log('\n🚀 Starting development server...');
    
    try {
      const child = exec('npm run dev', { 
        cwd: PROJECT_ROOT,
        stdio: 'inherit'
      });

      child.stdout?.on('data', (data) => {
        console.log(data.toString());
      });

      child.stderr?.on('data', (data) => {
        console.error(data.toString());
      });

      console.log('Development server started. Check output above for status.');
    } catch (error) {
      console.error('Failed to start development server:', error.message);
    }
  }
}

// Run recovery
const recovery = new DevServerRecovery();
recovery.diagnoseAndFix()
  .then(() => {
    console.log('\n🎯 Recovery complete! Try starting the server now.');
  })
  .catch(error => {
    console.error('Recovery failed:', error);
  });
