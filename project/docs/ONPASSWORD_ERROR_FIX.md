# Fixing "Cannot set properties of null (setting 'onPassword')" Error in PDF.js

## Issue Description

When using PDF.js v5.2.133, users encounter an error when attempting to load PDF files:

```
Failed to load PDF: Cannot set properties of null (setting 'onPassword')
```

This error occurs when:

1. The PDF.js worker is not properly initialized 
2. The PDF loading task is created before the worker port is ready
3. There's a race condition between task creation and setting handlers
4. Multiple PDF tasks are created and destroyed in quick succession

## Our Solution

We've implemented a comprehensive fix with multiple layers of protection:

### 1. ImprovedPdfViewer Component

This new component includes:

- Safe onPassword handling that prevents the "Cannot set properties of null" error
- Enhanced worker initialization and error recovery
- Proper cleanup and resource management
- Better type safety with TypeScript

### 2. Safe Password Handler Utility 

The `pdf-password-handler.ts` utility provides:

- A safe way to set the onPassword handler that won't throw errors
- Object property descriptor-based handler registration
- Fallback mechanisms when handler setting fails

### 3. Enhanced Worker Implementation

Our enhanced PDF.js worker implementation:

- Manages a global worker port for stability
- Preserves callbacks between worker resets
- Provides proper error recovery for callback-related issues
- Monitors and repairs broken callbacks automatically

## How to Use the Fix

Replace any instance of `PdfViewer` or `FixedPdfViewer` with our new `ImprovedPdfViewer`:

```tsx
import ImprovedPdfViewer from '../components/pdf/ImprovedPdfViewer';

// Then in your component:
<ImprovedPdfViewer
  file={pdfFile}
  height={500}
  onError={(err, code) => console.error('PDF error:', err, code)}
/>
```

## Implementation Details

1. Added `pdf-password-handler.ts` utility that provides safe password handler registration
2. Created `ImprovedPdfViewer` component with enhanced error handling
3. Updated the error monitor to detect and fix this specific error type
4. Added automatic recovery for broken worker states

## Testing the Fix

The fix has been tested with:

- Password-protected PDFs
- Multiple PDFs loaded in sequence
- Parallel PDF loading
- Worker reinitialization scenarios
- Error recovery in various edge cases

Visit the `/pdf-worker-test` route to run comprehensive tests of the fix.
