import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
export function initializePdfWorker() {
  if (typeof window !== 'undefined') {
    // Check if running in browser environment
    const pdfjsWorkerPath = '/pdf-worker/pdf.worker.mjs';
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerPath;
    console.log('PDF.js worker initialized');
    return true;
  }
  return false;
}

// Call this function when importing this module
initializePdfWorker();
