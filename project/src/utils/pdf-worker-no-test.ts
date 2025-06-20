/**
 * PDF.js Worker Initialization Without Test Document
 * Version 1.0
 * 
 * This approach initializes the PDF.js worker without attempting to parse any test PDF,
 * thereby avoiding InvalidPDFException errors during initialization.
 */

import * as pdfjsLib from 'pdfjs-dist';

// State Management
let workerInitialized = false;
let workerInitializationPromise: Promise<void> | null = null;

// Get worker source based on environment
function getWorkerSource(): string {
  // Development environment with Vite
  if (import.meta.env.DEV) {
    return '/pdf-worker/pdf.worker.mjs';
  }
  
  // Production environment
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}pdf-worker/pdf.worker.min.mjs`;
}

/**
 * Verify that the worker files exist in the public directory
 */
export async function verifyWorkerFiles(): Promise<boolean> {
  try {
    const workerPath = getWorkerSource();
    const response = await fetch(workerPath, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new Error(`Worker file not found at ${workerPath}`);
    }
    
    return true;
  } catch (err) {
    console.error('PDF.js worker verification failed:', err);
    return false;
  }
}

/**
 * Initialize PDF.js worker without test document parsing
 * This avoids InvalidPDFException errors during initialization
 */
export async function initializePdfWorkerSimple(): Promise<void> {
  // If worker is already initialized, just return
  if (workerInitialized) {
    return;
  }

  // If initialization is in progress, return the existing promise
  if (workerInitializationPromise) {
    return workerInitializationPromise;
  }

  console.log('Initializing PDF.js worker (simple method)...');
  
  workerInitializationPromise = (async () => {
    try {
      const workerSrc = getWorkerSource();
      console.log('Using worker source:', workerSrc);

      // Verify worker file exists
      const workerAvailable = await verifyWorkerFiles();
      if (!workerAvailable) {
        throw new Error('PDF.js worker file is not available');
      }

      // Set worker options
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      }

      // Mark as initialized without testing with a document
      workerInitialized = true;
      console.log('PDF.js worker initialized successfully (simple method)');

    } catch (error) {
      console.error('Simple PDF.js worker initialization failed:', error);
      workerInitialized = false;
      throw error;
    }
  })();

  await workerInitializationPromise;
  workerInitializationPromise = null;
}

/**
 * Check if the PDF.js worker is initialized
 */
export function isWorkerInitialized(): boolean {
  return workerInitialized;
}

/**
 * Get enhanced PDF loading options
 */
export function getSimplePdfLoadingOptions(data: ArrayBuffer | Uint8Array, password?: string) {
  const options = {
    data,
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    useWorkerFetch: false,
    disableAutoFetch: true,
    disableStream: true,
    disableRange: true
  };

  if (password) {
    (options as any).password = password;
  }

  return options;
}

/**
 * Reset worker state
 */
export function resetWorkerState(): void {
  console.warn('Resetting simple PDF.js worker state...');
  workerInitialized = false;
  workerInitializationPromise = null;
}

/**
 * Ensure the worker is running and ready
 */
export async function ensureWorkerIsRunning(): Promise<void> {
  if (!isWorkerInitialized()) {
    console.warn("PDF.js worker not initialized. Initializing...");
    resetWorkerState();
    await initializePdfWorkerSimple();
  }
}
