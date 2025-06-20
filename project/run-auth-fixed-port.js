// Run this script to start the dev server with a fixed port (3000)
// This ensures OAuth redirects work as expected
// Usage: node run-auth-fixed-port.js

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = 3000;
const command = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
const args = ['run', 'dev', '--', '--port', PORT.toString()];

console.log(`Starting development server on port ${PORT}...`);

// Spawn the process
const child = spawn(command, args, {
  cwd: __dirname,
  stdio: 'inherit', // Pass all stdio to the parent process
  shell: true
});

// Handle exit
child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle errors
child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
  child.kill('SIGINT');
});
