# Fixed PDF Viewer Implementation Guide

This guide documents the improved PDF viewer implementation that addresses the "Cannot read properties of null" errors in the original implementation.

## Overview of Changes

The improved PDF viewer implementation addresses two primary issues:

1. **Worker Destruction Issue**: Fixed the "Cannot read properties of null (reading 'sendWithPromise')" errors by implementing a stable worker initialization system.

2. **Canvas Context Issue**: Fixed the "Cannot read properties of null (reading 'getContext')" errors by creating a robust canvas implementation with multiple initialization attempts and fallbacks.

## Component Architecture

The solution consists of several specialized components and utilities:

### 1. StablePdfCanvas Component
This component provides a reliable canvas rendering surface that handles context initialization failures and includes fallbacks.

Key features:
- Multiple canvas context initialization attempts with different options
- Canvas drawing test to verify context functionality before PDF rendering
- Automatic recovery from canvas context errors
- Proper error state handling and fallback UI

### 2. FixedPdfViewer Component
The main PDF viewer component that integrates all the fixes and provides a robust PDF viewing experience.

Key features:
- Uses StablePdfCanvas for reliable rendering
- Implements worker initialization that prevents destruction
- Provides comprehensive error handling and retry mechanisms
- Handles password-protected PDFs properly
- Implements timeout protection for various async operations

### 3. pdf-worker-stable Utility
A utility module that handles PDF.js worker initialization and ensures it remains stable throughout the application lifecycle.

Key features:
- Preserves worker port to prevent "sendWithPromise" errors
- Implements fallbacks for worker sources
- Provides robust error handling for initialization failures
- Includes test PDF loading to validate worker functionality

## Usage Guide

Replace the previous `EnhancedPdfViewer` with the new `FixedPdfViewer`:

```tsx
import FixedPdfViewer from '../components/pdf/FixedPdfViewer';

// Usage in a component
function MyComponent() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  return (
    <div>
      {pdfFile && (
        <FixedPdfViewer
          file={pdfFile}
          height={500}
          scale={1.2}
          className="rounded-lg shadow-md"
          onError={(error, errorCode) => {
            console.error(`PDF Error (${errorCode}):`, error);
          }}
          allowRetry={true}
        />
      )}
    </div>
  );
}
```

## Props

The `FixedPdfViewer` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File \| Blob \| null` | Required | The PDF file to display |
| `width` | `number \| string` | `'100%'` | Width of the PDF viewer |
| `height` | `number \| string` | `600` | Height of the PDF viewer |
| `page` | `number` | `1` | Initial page to display |
| `scale` | `number` | `1.2` | Scale factor for the PDF |
| `className` | `string` | `''` | CSS class for styling |
| `onLoadComplete` | `(numPages: number) => void` | `undefined` | Callback when PDF is loaded |
| `onError` | `(error: Error, errorCode?: string) => void` | `undefined` | Callback when an error occurs |
| `allowRetry` | `boolean` | `true` | Whether to show retry button on errors |
| `maxInitRetries` | `number` | `3` | Maximum number of worker init retry attempts |

## Error Handling

The `FixedPdfViewer` component provides robust error handling with specific error codes:

| Error Code | Description |
|------------|-------------|
| `WORKER_ERROR` | Error related to PDF.js worker |
| `CANVAS_ERROR` | Canvas initialization or rendering error |
| `LOAD_ERROR` | Generic PDF loading error |
| `PASSWORD_REQUIRED` | PDF is password protected |
| `INCORRECT_PASSWORD` | Password provided for PDF is incorrect |
| `LOADING_ABORTED` | PDF loading was aborted |
| `LOADING_TIMEOUT` | PDF loading timed out |
| `RENDER_ERROR` | Error rendering PDF page |

## Troubleshooting

If issues still occur with the PDF viewer:

1. Ensure PDF.js worker files are correctly deployed:
   - Check that `/pdf-worker/pdf.worker.min.mjs` is accessible
   - Verify that `pdf-worker.js` is in the public directory

2. For canvas context issues:
   - Try a different browser
   - Update graphics drivers
   - Disable hardware acceleration if needed

3. For worker communication issues:
   - Clear browser cache
   - Check Content Security Policy settings
   - Ensure no network blocking of required resources
