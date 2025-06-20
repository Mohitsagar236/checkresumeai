# PDF Worker Setup Guide for Version 5.2.133

This guide documents the proper configuration of PDF.js worker files for version 5.2.133 in the Resume Analyzer SaaS application.

## Issue Summary

When setting up PDF.js worker files, the following warnings were encountered:
```
Setting up PDF.js worker files for version 5.2.133...
Warning: pdf.worker.js not found in node_modules
Warning: pdf.worker.js.map not found in node_modules
Warning: pdf.worker.min.js not found in node_modules
Warning: pdf.worker.min.js.map not found in node_modules
```

The PDF.js library version 5.2.133 uses `.mjs` file format instead of the traditional `.js` format for its worker files, which causes these warnings.

## Solution Implemented

1. **Updated Worker File Discovery**
   
   The PDF worker loading script has been modified to prioritize the available `.mjs` files and fall back to traditional `.js` files if needed:

   ```javascript
   const workerSources = [
     // Local paths first - prioritize mjs formats
     '/pdf-worker/pdf.worker.min.mjs',
     '/pdf-worker/pdf.worker.mjs',
     '/pdf-worker/pdf.worker.min.js',
     '/pdf-worker/pdf.worker.js',
     
     // CDN fallbacks with both mjs and js formats
     // ...CDN URLs
   ];
   ```

2. **Script Type Detection**
   
   Added script type detection to properly load `.mjs` modules:

   ```javascript
   function loadScript(url) {
     return new Promise((resolve, reject) => {
       const script = document.createElement('script');
       script.src = url;
       
       // Set type="module" for .mjs files
       if (url.endsWith('.mjs')) {
         script.type = 'module';
       }
       
       script.onload = resolve;
       script.onerror = () => reject(new Error(`Failed to load worker from ${url}`));
       document.head.appendChild(script);
     });
   }
   ```

3. **TypeScript Fixes for Worker Stability**
   
   Fixed TypeScript errors in the `pdf-worker-stable.ts` utility:
   
   - Defined a proper `DocumentInitParameters` type
   - Used `@ts-expect-error` where necessary for internal PDF.js properties
   - Fixed error handling and port detection

## Files Modified

1. `public/pdf-worker.js` - Updated worker source prioritization and script loading logic
2. `src/utils/pdf-worker-stable.ts` - Fixed TypeScript errors and worker initialization

## Verification

The worker setup can be verified by:

1. Loading a PDF in the application
2. Checking browser console for worker loading messages
3. Confirming no "sendWithPromise" errors occur during PDF operations
4. Ensuring PDFs render correctly without canvas context errors

## Best Practices for Future Updates

1. When updating PDF.js, check the available worker file formats in your npm package
2. Update the worker source options in both `public/pdf-worker.js` and `src/utils/pdf-worker-stable.ts`
3. If using ESM format (.mjs), ensure script type is set to "module" during loading
4. Maintain the worker port persistence strategy to prevent "sendWithPromise" errors
5. Always run the setup script after updating PDF.js version
