// PDF.js Worker Loader (auto-generated)
// Version: 5.2.133
// Generated: 2025-05-29T06:34:54.701Z

(function() {
  const version = '5.2.133';
  
  // Try to use local worker files first, then fall back to CDN
  const workerSources = [    // Local paths (relative to public directory)
    '/pdf-worker/pdf.worker.mjs',
    
    // CDN fallbacks
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.mjs`,
    `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.mjs`
  ];
  
  // Helper to load script
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load worker from ${url}`));
      document.head.appendChild(script);
    });
  }
  
  // Try each source in sequence
  async function loadWorker() {
    for (const url of workerSources) {
      try {
        console.log(`Trying to load PDF.js worker from: ${url}`);
        await loadScript(url);
        console.log(`✓ PDF.js worker loaded successfully from ${url}`);
        return;
      } catch (error) {
        console.warn(`Could not load PDF.js worker from ${url}`);
      }
    }
    console.error('Failed to load PDF.js worker from any source');
  }
  
  // Start loading
  loadWorker().catch(console.error);
})();
