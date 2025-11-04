/**
 * Vite plugin to ensure React vendor chunk loads FIRST
 * This is critical because other vendor libraries depend on React being available
 */
export function reactFirstPlugin() {
  return {
    name: 'react-first-plugin',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      // Only run during build
      if (!ctx.bundle) return html;

      // Find all script and modulepreload tags
      const scripts = [];
      const preloads = [];
      
      for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
        if (chunk.type === 'chunk') {
          if (fileName.includes('react-vendor')) {
            // React vendor should be FIRST
            scripts.unshift({ fileName, isEntry: chunk.isEntry });
            preloads.unshift(fileName);
          } else if (fileName.includes('main')) {
            // Main entry point comes after React but before other vendors
            scripts.splice(1, 0, { fileName, isEntry: chunk.isEntry });
          } else if (chunk.isEntry || fileName.match(/(vendor|ui-components|api-auth)/)) {
            // Other chunks come last
            scripts.push({ fileName, isEntry: chunk.isEntry });
            if (!fileName.includes('main')) {
              preloads.push(fileName);
            }
          }
        }
      }

      // Build the new HTML with correct order
      const preloadTags = preloads
        .map(file => `<link rel="modulepreload" crossorigin href="/assets/${file}">`)
        .join('\n  ');
      
      const scriptTag = scripts.find(s => s.isEntry)?.fileName || scripts[1]?.fileName;
      const scriptHtml = scriptTag 
        ? `<script type="module" crossorigin src="/assets/${scriptTag}"></script>`
        : '';

      // Replace existing script tags
      let newHtml = html
        .replace(/<script[^>]*type="module"[^>]*>.*?<\/script>/gs, scriptHtml)
        .replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');

      // Insert preloads after the module script
      newHtml = newHtml.replace(
        scriptHtml,
        `${scriptHtml}\n  ${preloadTags}`
      );

      return newHtml;
    }
  };
}
