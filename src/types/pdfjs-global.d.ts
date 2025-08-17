/**
 * TypeScript declarations for global PDF.js properties and enhancements
 */

// Extended PDFDocumentProxy for internal PDF.js methods
interface PDFDocumentProxy {
  _transport?: unknown;
  _destroyed?: boolean;
  destroy: () => Promise<void>;
  getPage: (pageNumber: number) => Promise<unknown>;
  getMetadata: () => Promise<unknown>;
  numPages: number;
}

// Required to safely clean up PDF.js resources
interface PDFDocumentLoadingTask {
  _worker?: unknown;
  destroy: () => void;
  promise: Promise<PDFDocumentProxy>;
}

// PDF.js loading options
interface DocumentInitParameters {
  url?: string;
  data?: ArrayBuffer | Uint8Array;
  password?: string;
  cMapUrl?: string;
  cMapPacked?: boolean;
  useWorkerFetch?: boolean;
  disableStream?: boolean;
  disableAutoFetch?: boolean;
  disableRange?: boolean;
  withCredentials?: boolean;
}

// Enhanced window interface for PDF.js
interface Window {
  pdfjsLib?: {
    version: string;
    GlobalWorkerOptions: {
      workerSrc: string;
      workerPort: MessagePort | null;
    };
    getDocument: (options: string | DocumentInitParameters) => PDFDocumentLoadingTask;
    _isEnhancedInitialized?: boolean;
    _enhancedInitializationFailed?: boolean;
    _pdfWorkerReady?: boolean;
  };
}
