# Testing PDF Extraction in Browser Environment

This document explains how to test the PDF extraction functionality in a browser environment using PDF.js.

## Setup

1. Make sure you have installed the required dependencies:

```bash
npm install pdfjs-dist
```

2. Import the PDF.js demo utility:

```typescript
import { extractTextFromPdf, getPdfMetadata } from '../utils/pdfjs-demo';
```

## Testing PDF Text Extraction

You can create a simple component to test PDF extraction:

```tsx
import React, { useState } from 'react';
import { extractTextFromPdf, getPdfMetadata } from '../utils/pdfjs-demo';

const PdfExtractorTest: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Extract text
      const extractedText = await extractTextFromPdf(file);
      setText(extractedText);

      // Get metadata
      const pdfMetadata = await getPdfMetadata(file);
      setMetadata(pdfMetadata);
    } catch (err) {
      setError(`Error processing PDF: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Extractor Test</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload a PDF file
        </label>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {isLoading && <p className="text-blue-600">Processing PDF...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {Object.keys(metadata).length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h2 className="text-xl font-semibold mb-2">PDF Metadata</h2>
          <dl className="grid grid-cols-2 gap-2">
            {Object.entries(metadata).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="font-medium text-gray-700">{key}:</dt>
                <dd className="text-gray-900">{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      )}

      {text && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
              {text}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfExtractorTest;
```

3. Add this component to your application for testing:

```tsx
// In App.tsx or a route
import PdfExtractorTest from './components/PdfExtractorTest';

// Then render it in your component tree
<PdfExtractorTest />
```

## Common Issues and Solutions

1. **"Cannot read properties of undefined (reading 'getDocument')"**
   - Make sure you've set the worker source correctly:
   ```typescript
   // Set PDF.js worker source
   const PDFJS_WORKER_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
   pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
   ```

2. **"Module 'fs' has been externalized for browser compatibility"**
   - This error occurs when you try to use Node.js-specific libraries like pdf-parse in a browser environment
   - Use PDF.js instead, which is designed for browsers

3. **Password-protected or encrypted PDFs**
   - PDF.js can handle these with additional parameters:
   ```typescript
   const loadingTask = pdfjsLib.getDocument({
     data: arrayBuffer,
     password: 'your-password', // if needed
   });
   ```
   - You can also implement a password prompt interface:
   ```typescript
   const loadingTask = pdfjsLib.getDocument(arrayBuffer);
   
   loadingTask.onPassword = (updatePassword, reason) => {
     // reason can be pdfjsLib.PasswordResponses.NEED_PASSWORD or INCORRECT_PASSWORD
     const password = promptUserForPassword(); // Implement your UI for this
     updatePassword(password);
   };
   ```

4. **Performance with large PDFs**
   - Consider processing pages in batches
   - Implement a progress indicator for better user experience

## Testing

Use test PDF files of different types to verify extraction works correctly:
- Simple text-based PDFs
- PDFs with complex formatting
- Scanned PDFs (note: these require OCR which PDF.js doesn't provide)
- PDFs with tables and images

## Handling PDF Loading Issues

### Enhanced Error Handling

Our `EnhancedPdfViewer` component provides comprehensive error handling for common PDF issues:

1. **Detecting Password Protection**
   - The viewer now detects password-protected PDFs and shows a password input field
   - Users can enter their password and retry loading the PDF

2. **Handling Corrupted PDFs**
   - Clear error messages for corrupted or invalid PDFs
   - Provides useful troubleshooting steps for users

3. **Error Codes**
   - We now return specific error codes to help with debugging:
     - `PASSWORD_REQUIRED`: PDF requires a password
     - `INCORRECT_PASSWORD`: User provided incorrect password
     - `CORRUPTED_PDF`: The PDF file appears to be corrupted
     - `MISSING_DATA`: The PDF is missing required data
     - `ACCESS_DENIED`: Access to the PDF was denied
     - `UNKNOWN_ERROR`: For unspecified errors

### User Experience Improvements

1. **Retry Mechanism**
   - Users can retry loading PDFs after errors
   - Automatically retries with provided passwords

2. **Informative Error Messages**
   - Clear, user-friendly error messages
   - Troubleshooting tips for common issues

3. **Accessibility**
   - All error messages and input fields are fully accessible
   - Keyboard navigation for the password input form

### Implementation Example

```tsx
// Handling PDF errors
<EnhancedPdfViewer
  file={pdfFile}
  onError={(error, errorCode) => {
    console.error(`PDF Error: ${errorCode}`, error);
    
    // Custom error handling
    switch (errorCode) {
      case 'PASSWORD_REQUIRED':
        // Show custom password prompt
        break;
      case 'CORRUPTED_PDF':
        // Show user-friendly message and alternative options
        break;
      default:
        // Generic error handling
        break;
    }
  }}
  allowRetry={true}
/>
```
