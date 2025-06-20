# PDF.js Worker Setup for Version 5.2.133

## Overview

This document explains the changes made to support PDF.js version 5.2.133, which uses `.mjs` module format files instead of traditional `.js` files for its workers.

## Changes Made

1. **Worker File Format Support**
   
   The latest PDF.js version 5.2.133 ships with `.mjs` files rather than `.js` files:
   - Available: `pdf.worker.mjs` and `pdf.worker.min.mjs`
   - Not found: `pdf.worker.js` and `pdf.worker.min.js`

2. **Worker Loading Script**
   
   Updated `public/pdf-worker.js` to:
   - Prioritize `.mjs` files when available
   - Add proper module type detection (`type="module"` for `.mjs` files)
   - Include CDN fallbacks for both formats
   - Improved error handling and logging

3. **Worker Utility Functions**
   
   Fixed `src/utils/pdf-worker-stable.ts` to:
   - Resolve TypeScript errors with proper typing
   - Maintain worker port persistence to prevent "sendWithPromise" errors
   - Improve error handling for cleanup operations
   - Add support for ESM module workers

4. **Documentation**
   
   Added documentation files:
   - `docs/PDF_WORKER_SETUP_v5.2.133.md` - Setup instructions
   - `docs/PDF_VIEWER_FIXES.md` - PDF viewer component fixes

## Using the PDF Viewer Components

The application uses several PDF viewer components:

1. **FixedPdfViewer** - Core component with the fixes applied
2. **EnhancedPdfViewer** - Extended version with additional features
3. **StablePdfCanvas** - Specialized canvas component for PDF rendering

## Common Issues Fixed

1. **"Cannot read properties of null (reading 'sendWithPromise')"**
   - Fixed by preserving worker port between operations

2. **"Cannot read properties of null (reading 'getContext')"**
   - Fixed with robust canvas context initialization and recovery

3. **"Worker files not found" warnings**
   - Fixed by supporting the new `.mjs` file format

4. **"Loading aborted" errors**
   - Fixed with proper worker initialization and retry logic

## Testing

The PDF rendering components should now work correctly with:
- PDF.js version 5.2.133
- Both ESM and traditional module formats
- Proper error recovery and retry mechanisms

## Future Updates

When updating PDF.js in the future:

1. Run the setup script to copy worker files:
   ```
   node scripts/setup-pdf-worker.js
   ```

2. Check which worker files are available and update the sources if needed
   
3. Test PDF rendering with various PDF files to ensure compatibility
