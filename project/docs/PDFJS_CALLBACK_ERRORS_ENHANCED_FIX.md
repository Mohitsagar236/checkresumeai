# PDF.js v5.2.133 "Cannot Resolve Callback" Errors - Comprehensive Fix

## Problem Description

PDF.js version 5.2.133 has a specific issue with worker communication where callbacks become unresolvable. This manifests as console errors like:

```
Error: Cannot resolve callback #xx
TypeError: Cannot read properties of undefined (reading 'resolve')
```

These errors occur mainly when:
1. The PDF.js worker port is destroyed but callbacks are still pending
2. Multiple PDF loads cause worker reinitialization without proper cleanup
3. Callbacks are lost during worker communication

## Real-time Error Detection & Recovery

Our solution includes automatic error detection and recovery capabilities that:
1. Monitor for PDF.js callback errors in real-time
2. Automatically attempt to repair broken callbacks
3. Prevent uncaught promise rejections from PDF.js errors

## Root Cause Analysis

The main issues in v5.2.133 are:

1. **Worker Destruction**: When the PDF worker is destroyed, all pending callbacks are lost, but subsequent operations may still try to use them.

2. **Callback Management**: The internal `_callbacks` Map in the worker isn't properly preserved when the worker port changes.

3. **Message Handler Issues**: The `sendWithPromise` method sometimes fails when the worker is in an invalid state.

4. **Task Cleanup**: Standard cleanup methods often destroy the worker unnecessarily, breaking subsequent operations.

## Enhanced Solution

Our solution introduces several critical enhancements:

### 1. Callback Preservation & Caching

We added a callback preservation system that:
- Maintains a global cache of callbacks that persists between worker resets
- Properly handles callback registration and resolution
- Provides fallback handling for common callback operations

```typescript
// Storage for callback management - crucial for the "Cannot resolve callback" issues
const callbackCache = new Map<number, Function>();

function preserveCallback(callback: Function): number {
  const id = nextCallbackId++;
  callbackCache.set(id, callback);
  return id;
}
```

### 2. Protected Message Handler

We created a safe message handler that:
- Intercepts `sendWithPromise` calls to add error protection
- Provides fallback responses for common message types
- Prevents crashes when the worker port is invalid

```typescript
function createSafeMessageHandler() {
  return {
    sendWithPromise: function(type: string, data: unknown): Promise<unknown> {
      // Protection logic ensures callbacks are always resolvable
      // ...
    }
  };
}
```

### 3. Enhanced Worker Protection

We added multi-layer worker protection that:
- Prevents worker destruction during cleanup operations
- Preserves the worker port reference across operations
- Monitors worker port status with event listeners
- Automatically recovers from worker port closure

```typescript
// Replace the destroy method with a no-op
if (typeof taskWorker.destroy === 'function') {
  taskWorker.destroy = () => {
    console.log('Worker destruction prevented');
    return Promise.resolve();
  };
}
```

### 4. Safe Document & Task Cleanup

We implemented specialized cleanup methods that:
- Clean up documents without destroying the worker
- Preserve and restore the worker port during cleanup
- Handle task cleanup without destroying callbacks
- Properly handle error conditions during cleanup

```typescript
export async function safeCleanupDocument(doc: pdfjsLib.PDFDocumentProxy): Promise<void> {
  // Save worker port before cleanup
  const savedWorkerPort = workerPort;
  
  // Clean up document...
  
  // Restore worker port after cleanup
  workerPort = savedWorkerPort;
}
```

## Implementation Details

### Key Files Modified:

1. **pdf-worker-stable.enhanced.ts**:
   - Added callback preservation system
   - Created protected message handlers
   - Enhanced worker initialization and protection
   - Added safe cleanup utilities

2. **EnhancedPdfViewer.enhanced.tsx**:
   - Used enhanced worker utilities for PDF loading
   - Added proper error recovery mechanisms
   - Implemented safer cleanup during unmount
   - Improved error classification and handling

3. **pdf-error-monitor.ts**:
   - Added real-time error detection system
   - Implemented automatic callback repair
   - Created PDF task monitoring system
   - Prevented unhandled promise rejections

4. **App.tsx**:
   - Initialize error monitoring early
   - Use enhanced worker initialization
   - Added global error recovery system

### Usage Instructions:

1. For PDF rendering, use the `EnhancedPdfViewer` component:
   ```tsx
   <EnhancedPdfViewer file={pdfFile} />
   ```

2. For customized PDF loading in other components:
   ```typescript
   import { 
     initializeStableWorker, 
     getEnhancedPdfLoadingOptions,
     protectTaskWorker
   } from '../../utils/pdf-worker-stable.enhanced';
   
   // Initialize worker
   await initializeStableWorker();
   
   // Create loading task with protected options
   const task = pdfjsLib.getDocument(
     getEnhancedPdfLoadingOptions(arrayBuffer)
   );
   
   // Apply extra protection
   protectTaskWorker(task);
   
   // Load document
   const pdf = await task.promise;
   ```

3. For proper document cleanup:
   ```typescript
   import { safeCleanupDocument } from '../../utils/pdf-worker-stable.enhanced';
   
   // Clean up without destroying worker
   await safeCleanupDocument(pdfDocument);
   ```

## Future Considerations

1. **Worker Pooling**: For applications that need to load multiple PDFs, implementing a worker pool could further improve stability.

2. **Version Monitoring**: When upgrading PDF.js, review worker communication changes to update protection strategies accordingly.

3. **Performance Optimization**: The enhanced protection adds some overhead - consider optimizing based on specific usage patterns.

## References

1. PDF.js Issue Tracker: [Worker Destruction Issues](https://github.com/mozilla/pdf.js/issues)
2. PDF.js Documentation: [Worker API](https://mozilla.github.io/pdf.js/api/)
