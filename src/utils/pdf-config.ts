import * as pdfjsLib from 'pdfjs-dist';
import { setupPdfWorker } from './pdf-worker-fix';
import { isPdfWorkerInitialized, onPdfWorkerInitialized, getWorkerDiagnostics } from './pdf-worker-status';

// Track initialization state
let initialized = false;
let initializationPromise: Promise<void> | null = null;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 3;

/**
 * Initialize PDF.js with worker configuration
 * Returns a promise that resolves when initialization is complete
 */
export function initializePdfJs(): Promise<void> {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Return resolved promise if already initialized
  if (initialized) {
    return Promise.resolve();
  }
  
  console.log(`Initializing PDF.js worker (attempt ${initializationAttempts + 1}/${MAX_INITIALIZATION_ATTEMPTS})...`);
  
  // Create new initialization promise
  initializationPromise = (async () => {
    try {
      // IMPORTANT: Set this property to prevent PDF.js worker cache issues
      // This prevents the worker from being destroyed and recreated when multiple PDFs are loaded
      pdfjsLib.GlobalWorkerOptions.workerPort = null;
      
      // Try to detect if the worker loader script already initialized the worker
      if (isPdfWorkerInitialized()) {
        console.log('PDF.js worker was already initialized via the worker script');
        initialized = true;
        return;
      }
      
      // Set up worker with fallbacks
      const { primaryWorkerSrc } = await setupPdfWorker();
      
      console.log(`PDF.js worker source set to: ${primaryWorkerSrc}`);
      
      // Force-initialize the worker by creating a minimal PDF task
      // This ensures the worker is actually loaded
      try {
        const testBytes = new Uint8Array([
          37, 80, 68, 70, 45, 49, 46, 49, 10, 37, 226, 227, 207, 211, 10, 49, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 67, 97, 116, 97, 108, 111, 103, 10, 47, 80, 97, 103, 101, 115, 32, 50, 32, 48, 32, 82, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 50, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 115, 10, 47, 75, 105, 100, 115, 32, 91, 51, 32, 48, 32, 82, 93, 10, 47, 67, 111, 117, 110, 116, 32, 49, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 51, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 10, 47, 80, 97, 114, 101, 110, 116, 32, 50, 32, 48, 32, 82, 10, 47, 82, 101, 115, 111, 117, 114, 99, 101, 115, 32, 60, 60, 10, 47, 70, 111, 110, 116, 32, 60, 60, 10, 47, 70, 49, 32, 52, 32, 48, 32, 82, 10, 62, 62, 10, 62, 62, 10, 47, 77, 101, 100, 105, 97, 66, 111, 120, 32, 91, 48, 32, 48, 32, 53, 48, 48, 32, 56, 48, 48, 93, 10, 47, 67, 111, 110, 116, 101, 110, 116, 115, 32, 53, 32, 48, 32, 82, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 52, 32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 47, 84, 121, 112, 101, 32, 47, 70, 111, 110, 116, 10, 47, 83, 117, 98, 116, 121, 112, 101, 32, 47, 84, 121, 112, 101, 49, 10, 47, 78, 97, 109, 101, 32, 47, 70, 49, 10, 47, 66, 97, 115, 101, 70, 111, 110, 116, 32, 47, 72, 101, 108, 118, 101, 116, 105, 99, 97, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 53, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 76, 101, 110, 103, 116, 104, 32, 52, 52, 62, 62, 10, 115, 116, 114, 101, 97, 109, 10, 66, 84, 10, 47, 70, 49, 32, 50, 53, 32, 84, 102, 10, 49, 48, 48, 32, 55, 53, 48, 32, 84, 100, 10, 40, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 41, 32, 84, 106, 10, 69, 84, 10, 101, 110, 100, 115, 116, 114, 101, 97, 109, 10, 101, 110, 100, 111, 98, 106, 10, 120, 114, 101, 102, 10, 48, 32, 54, 10, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 32, 54, 53, 53, 51, 53, 32, 102, 10, 48, 48, 48, 48, 48, 48, 48, 48, 49, 48, 32, 48, 48, 48, 48, 48, 32, 110, 10, 48, 48, 48, 48, 48, 48, 48, 48, 55, 57, 32, 48, 48, 48, 48, 48, 32, 110, 10, 48, 48, 48, 48, 48, 48, 48, 49, 55, 51, 32, 48, 48, 48, 48, 48, 32, 110, 10, 48, 48, 48, 48, 48, 48, 51, 48, 49, 32, 48, 48, 48, 48, 48, 32, 110, 10, 48, 48, 48, 48, 48, 48, 51, 56, 48, 32, 48, 48, 48, 48, 48, 32, 110, 10, 116, 114, 97, 105, 108, 101, 114, 10, 60, 60, 10, 47, 83, 105, 122, 101, 32, 54, 10, 47, 82, 111, 111, 116, 32, 49, 32, 48, 32, 82, 10, 62, 62, 10, 115, 116, 97, 114, 116, 120, 114, 101, 102, 10, 52, 57, 50, 10, 37, 37, 69, 79, 70
        ]);
        const testTask = pdfjsLib.getDocument({ data: testBytes });
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Test PDF load timeout')), 3000);
        });
        
        // Race between loading and timeout
        await Promise.race([testTask.promise, timeoutPromise]);
        
        console.log('PDF.js worker verified with test document');
        initialized = true;
        
        // Clean up the test task
        testTask.destroy();
      } catch (e) {
        console.warn('Worker verification failed:', e);
        // Continue anyway - worker source is set but not verified
      }
        console.log('PDF.js initialized successfully');
      initialized = true;
      return;
      
    } catch (error) {
      console.error('Error initializing PDF.js worker:', error);
      initialized = false;
      initializationAttempts++;
      
      // Clear the promise so we can try again
      initializationPromise = null;
      
      // Log diagnostics to help troubleshoot
      console.info(getWorkerDiagnostics ? getWorkerDiagnostics() : 'Diagnostics not available');
        if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
        console.log(`Will retry PDF.js initialization (${initializationAttempts}/${MAX_INITIALIZATION_ATTEMPTS})...`);
        // Return a promise that will automatically retry after a delay
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            initializePdfJs()
              .then(resolve)
              .catch(reject);
          }, 1000 * Math.min(2 ** initializationAttempts, 10));
        });
      }
      
      throw error;
    }
  })();
  
  return initializationPromise;
}

// Export initialization state and version info
export const isPdfJsInitialized = () => initialized || isPdfWorkerInitialized();
export const getPdfJsVersion = () => pdfjsLib.version;
