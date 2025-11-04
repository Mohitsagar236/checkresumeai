/**
 * Post-build script to fix modulepreload order in index.html
 * Ensures react-vendor loads BEFORE any other vendor chunks
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = resolve(__dirname, '../frontend-build/index.html');

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
  
  // Sort preloads: react-vendor first, then everything else
  const sortedPreloads = preloads.sort((a, b) => {
    const aIsReact = a.includes('react-vendor');
    const bIsReact = b.includes('react-vendor');
    
    if (aIsReact && !bIsReact) return -1;
    if (!aIsReact && bIsReact) return 1;
    
    // After react-vendor, prioritize: vendor, ui-components, api-auth, then rest
    const getOrder = (path) => {
      if (path.includes('react-vendor')) return 0;
      if (path.includes('vendor') && !path.includes('ui') && !path.includes('react')) return 1;
      if (path.includes('ui-components')) return 2;
      if (path.includes('api-auth')) return 3;
      return 4;
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
