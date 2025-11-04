// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\utils\pdf-worker-stable.ts
/**
 * PDF.js Worker Stability Handler for PDF.js v5.2.133 (pdfjs-dist)
 * 
 * Provides utilities to:
 * 1. Initialize and manage the PDF.js worker
 * 2. Create enhanced PDF loading options
 * 3. Safely clean up PDF resources
 */

import * as pdfjsLib from 'pdfjs-dist';

// Track worker initialization
let isWorkerInit = false;

/**
 * Check if the PDF.js worker is initialized
 */
export function isWorkerInitialized(): boolean {
  return isWorkerInit;
}

/**
 * Initialize the PDF.js worker with proper error handling
 */
export function initializeStableWorker(): void {
  if (isWorkerInit) return;
  
  try {
    // Try multiple worker paths for better compatibility
    const possibleWorkerPaths = [
      `/pdf-worker/pdf.worker.min.mjs?v=${pdfjsLib.version}`,
      `/pdf-worker/pdf.worker.mjs?v=${pdfjsLib.version}`,
      `/pdf-worker.js?v=${pdfjsLib.version}`,
      `/pdf-worker.js`,
    ];
    
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = possibleWorkerPaths[0];
    
    isWorkerInit = true;
    console.log('PDF.js worker initialized successfully');
  } catch (err) {
    console.error('Failed to initialize PDF.js worker:', err);
    throw err;
  }
}

/**
 * Get enhanced PDF loading options with error handlers
 */
export function getEnhancedPdfLoadingOptions(): any {
  return {
    cMapUrl: '/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/standard_fonts/',
    disableAutoFetch: true,
  };
}

/**
 * Safely clean up a PDF document
 */
export function safeCleanupDocument(pdfDocument: pdfjsLib.PDFDocumentProxy | null): void {
  if (!pdfDocument) return;
  
  try {
    pdfDocument.cleanup();
    pdfDocument.destroy();
  } catch (err) {
    console.warn('Error during PDF document cleanup:', err);
  }
}

/**
 * Safely clean up a PDF loading task
 */
export function safeCleanupTask(loadingTask: pdfjsLib.PDFDocumentLoadingTask | null): void {
  if (!loadingTask) return;
  
  try {
    loadingTask.destroy();
  } catch (err) {
    console.warn('Error during PDF loading task cleanup:', err);
  }
}

/**
 * Load a PDF file with error handling
 */
export async function loadPdfWithErrorHandling(
  fileSource: string | URL | ArrayBuffer | Uint8Array, 
  options: any = {}
): Promise<pdfjsLib.PDFDocumentProxy> {
  if (!isWorkerInitialized()) {
    initializeStableWorker();
  }
  
  const loadingTask = pdfjsLib.getDocument({
    ...getEnhancedPdfLoadingOptions(),
    ...options,
    url: fileSource
  });
  
  try {
    return await loadingTask.promise;
  } catch (err) {
    // Clean up the loading task on error
    safeCleanupTask(loadingTask);
    throw err;
  }
}

/**
 * Convert an ArrayBuffer to a base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}
