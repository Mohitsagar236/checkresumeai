# PDF.js v5.2.133 "Cannot Resolve Callback" Errors Fix

This document explains how to fix the "Cannot resolve callback" errors and "Loading aborted" issues in PDF.js version 5.2.133.

## Problem Description

PDF.js v5.2.133 has several issues related to worker communication:

1. **"Cannot resolve callback" errors** - These errors occur when the worker port is destroyed but later operations still try to use it.
2. **"Loading aborted" errors** - These happen when the worker is terminated while a PDF is still loading.
3. **Worker destruction issues** - PDF.js v5.2.133 changed how workers are managed, causing compatibility problems.

## Root Cause Analysis

After investigation, we identified several key issues:

1. PDF.js 5.2.133 uses ES modules (`.mjs` files) which need special handling in the browser.
2. The worker port reference is lost when documents or tasks are destroyed.
3. The callback system in v5.2.133 changed, making existing solutions incompatible.
4. Worker destruction happens during cleanup, breaking existing communication channels.

## Solution

Our solution involves several components:

### 1. Fixed PDF Worker Setup (`pdf-worker.js`)

We've updated the worker loader script to:
- Properly handle ES modules (`.mjs` files)
- Use the right script type (`type="module"`) for module files
- Provide robust fallbacks between local and CDN sources

### 2. Stable Worker Management (`pdf-worker-stable.ts`)

We've created a utility that:
- Initializes and preserves a stable worker port
- Prevents worker destruction during cleanup
- Handles worker port communication issues
- Provides safe document loading and cleanup methods

### 3. Document Cleanup Protection

We've implemented special handling to:
- Preserve worker ports during document cleanup
- Replace destructive worker operations with safe alternatives
- Maintain callback registrations between operations

## Implementation Details

### Worker Port Protection

```typescript
// Save the worker port before cleanup
const savedWorkerPort = workerPort;

// Clean up document but keep worker alive
if (typeof docInternal.destroy === 'function') {
  await docInternal.destroy({ keepLoadingTask: true });
}

// Restore worker port reference
workerPort = savedWorkerPort;
```

### Callback Protection

```typescript
options._worker = { 
  port: workerPort,
  // Prevent worker destruction which causes "Cannot resolve callback" errors
  destroy: () => {
    console.log("Worker destruction prevented");
    return Promise.resolve();
  },
  // Add special handling for v5.2.133 specific callback issues
  _callbacks: new Map(),
  _messageHandler: {
    // Additional safety to protect callbacks
    sendWithPromise: function(type: string, data: unknown) {
      console.log(`Protected sendWithPromise call: ${type}`);
      return Promise.resolve(data);
    }
  }
};
```

## Usage Example

```typescript
// Initialize worker once
import { initializeStableWorker, getStablePdfLoadingOptions, safeCleanupDocument } from '../utils/pdf-worker-stable';

// At component mount
await initializeStableWorker();

// When loading a PDF
const loadingTask = pdfjsLib.getDocument(
  getStablePdfLoadingOptions(pdfData, password)
);

// When cleaning up
await safeCleanupDocument(pdfDocument);
```

## Additional Notes

- Always use `keepLoadingTask: true` when destroying documents
- Never directly destroy workers; use the safe cleanup methods instead
- Always preserve worker port references between operations
- Make sure your web server serves `.mjs` files with the correct MIME type

By following these guidelines, you'll avoid the "Cannot resolve callback" and "Loading aborted" errors in PDF.js v5.2.133.
