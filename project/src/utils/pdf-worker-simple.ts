/**
 * Simplified PDF.js Worker Handler - Production Fix
 * Version 1.0
 * 
 * This simplified version addresses the production errors:
 * - "Worker port mismatch detected"
 * - "tr.close is not a function"
 * - Worker initialization failures
 */

import * as pdfjsLib from 'pdfjs-dist';

// Simple state management
let isWorkerReady = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Get worker source with fallback
 */
function getWorkerSource(): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  if (import.meta.env.DEV) {
    return '/pdf-worker/pdf.worker.min.mjs';
  } else {
    return `${baseUrl}pdf-worker/pdf.worker.min.mjs`;
  }
}

/**
 * Simple worker initialization without complex port management
 */
export async function initializeSimpleWorker(): Promise<void> {
  // Return immediately if already initialized
  if (isWorkerReady) {
    return;
  }

  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  console.log('Initializing simplified PDF.js worker...');

  initializationPromise = (async () => {
    try {
      // Set worker source once
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        const workerSrc = getWorkerSource();
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        console.log('Set PDF.js worker source:', workerSrc);
      }

      // Mark as ready without complex port management
      isWorkerReady = true;
      console.log('✅ Simplified PDF.js worker initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize simplified PDF.js worker:', error);
      isWorkerReady = false;
      throw error;
    }
  })();

  try {
    await initializationPromise;
  } finally {
    initializationPromise = null;
  }
}

/**
 * Check if worker is ready
 */
export function isWorkerInitialized(): boolean {
  return isWorkerReady;
}

/**
 * Get PDF loading options without complex worker port management
 */
export function getSimpleLoadingOptions(data: ArrayBuffer | Uint8Array, password?: string) {
  const options: any = {
    data,
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    useWorkerFetch: false,
    disableAutoFetch: true,
    disableStream: true,
    disableRange: true,
    stopAtErrors: false
  };

  if (password) {
    options.password = password;
  }

  return options;
}

/**
 * Safe cleanup for PDF documents
 */
export async function safeCleanupDocument(doc: pdfjsLib.PDFDocumentProxy | null): Promise<void> {
  if (!doc) return;
  
  try {
    // Check if document has destroy method and hasn't been destroyed
    if (typeof doc.destroy === 'function') {
      await doc.destroy();
    }
  } catch (error) {
    console.warn('Error during document cleanup (this is usually safe to ignore):', error);
  }
}

/**
 * Safe cleanup for loading tasks
 */
export function safeCleanupTask(task: pdfjsLib.PDFDocumentLoadingTask | null): void {
  if (!task) return;
  
  try {
    // Check if task has destroy method and hasn't been destroyed
    if (typeof task.destroy === 'function' && !task.destroyed) {
      task.destroy();
    }
  } catch (error) {
    console.warn('Error during task cleanup (this is usually safe to ignore):', error);
  }
}

/**
 * Reset worker state (simple version)
 */
export function resetWorkerState(): void {
  console.warn('Resetting simple PDF.js worker state...');
  isWorkerReady = false;
  initializationPromise = null;
}

/**
 * Ensure worker is running with simple recovery
 */
export async function ensureWorkerIsRunning(): Promise<void> {
  if (!isWorkerInitialized()) {
    console.warn('PDF.js worker not ready, initializing...');
    resetWorkerState();
    await initializeSimpleWorker();
  }
}

/**
 * Load PDF with simplified error handling
 */
export async function loadPdfSimple(data: ArrayBuffer | Uint8Array, password?: string): Promise<pdfjsLib.PDFDocumentProxy> {
  // Ensure worker is ready
  await ensureWorkerIsRunning();
  
  // Get loading options
  const options = getSimpleLoadingOptions(data, password);
  
  // Create loading task
  const loadingTask = pdfjsLib.getDocument(options);
  
  try {
    // Load the document
    const document = await loadingTask.promise;
    return document;
  } catch (error) {
    // Clean up on error
    safeCleanupTask(loadingTask);
    throw error;
  }
}
