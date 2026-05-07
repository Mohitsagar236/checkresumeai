/**
 * Post-build script to fix modulepreload order in index.html
 * Ensures react-vendor loads BEFORE any other vendor chunks
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = resolve(__dirname, '../dist/index.html');

console.log('Fixing modulepreload order in index.html...');

try {
  let html = readFileSync(indexPath, 'utf-8');
  
  // Extract all modulepreload links
  const preloadRegex = /<link\s+rel="modulepreload"\s+crossorigin\s+href="([^"]+)">/g;
  const preloads = [];
  let match;
  
  while ((match = preloadRegex.exec(html)) !== null) {
    preloads.push(match[1]);
  }
  
  // Sort preloads: react-vendor FIRST, then other chunks in safe order
  const sortedPreloads = preloads.sort((a, b) => {
    const aIsReact = a.includes('react-vendor');
    const bIsReact = b.includes('react-vendor');
    
    if (aIsReact && !bIsReact) return -1;
    if (!aIsReact && bIsReact) return 1;
    
    // After react-vendor, prioritize safe non-React chunks first
    const getOrder = (path) => {
      if (path.includes('react-vendor')) return 0;  // MUST be first
      if (path.includes('vendor') && !path.includes('ui') && !path.includes('react') && !path.includes('misc')) return 1;  // Safe vendor
      if (path.includes('vendor-misc')) return 2;  // Other safe vendors
      if (path.includes('state-management')) return 3;  // Zustand needs React
      if (path.includes('ui-components')) return 4;
      if (path.includes('routing')) return 5;
      if (path.includes('api-auth')) return 6;
      if (path.includes('react-deps')) return 7;
      return 10;  // Everything else
    };
    
    return getOrder(a) - getOrder(b);
  });
  
  // Remove all existing modulepreload links
  html = html.replace(preloadRegex, '');
  
  // Find the main script tag
  const scriptRegex = /<script\s+type="module"[^>]*><\/script>/;
  const scriptMatch = html.match(scriptRegex);
  
  if (scriptMatch) {
    const newPreloads = sortedPreloads
      .map(href => `  <link rel="modulepreload" crossorigin href="${href}">`)
      .join('\n');
    
    // Insert preloads after the script tag
    html = html.replace(
      scriptMatch[0],
      `${scriptMatch[0]}\n${newPreloads}`
    );
  }
  
  writeFileSync(indexPath, html);
  console.log('✓ Fixed modulepreload order - react-vendor will load first');
  console.log('  Order:', sortedPreloads.map(p => p.split('/').pop()).join(' → '));
} catch (error) {
  console.error('✗ Failed to fix modulepreload order:', error.message);
  process.exit(1);
}
