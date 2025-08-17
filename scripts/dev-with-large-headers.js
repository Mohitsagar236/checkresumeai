#!/usr/bin/env node

// Script to start Vite dev server with increased header size limit
const { spawn } = require('child_process');
const path = require('path');

// Start Vite with increased max header size
const viteProcess = spawn('node', [
  '--max-http-header-size=32768',
  './node_modules/vite/bin/vite.js'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-http-header-size=32768'
  }
});

viteProcess.on('close', (code) => {
  process.exit(code);
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});
