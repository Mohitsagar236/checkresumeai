/**
 * PDF Worker Manager
 * Provides centralized PDF.js worker management with error handling and retries
 */
import * as pdfjsLib from 'pdfjs-dist';
import {
  initializeWorker,
  getLoadingOptions,
  isWorkerInitialized,
  cleanupWorker
} from './pdf-worker';

const MAX_RETRIES = 3;
let initializationRetries = 0;
let isInitializing = false;

// Main initialization function
export async function ensurePdfWorkerInitialized(): Promise<boolean> {
  // Check if already initialized
  if (isWorkerInitialized()) {
    return true;
  }

  // Handle concurrent initialization
  if (isInitializing) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return isWorkerInitialized();
  }

  // Check retry limit
  if (initializationRetries >= MAX_RETRIES) {
    console.error('Maximum PDF worker initialization retries reached');
    return false;
  }

  isInitializing = true;
  initializationRetries++;

  try {
    console.log(`Initializing PDF.js worker (attempt ${initializationRetries}/${MAX_RETRIES})...`);
    
    const success = await initializeWorker({
      workerSrc: '/pdf-worker/pdf.worker.min.mjs'
    });

    if (success) {
      console.log('✓ PDF.js worker initialized successfully');
      return true;
    }

    throw new Error('Worker initialization failed');
  } catch (error) {
    console.error('PDF worker initialization error:', error);
    
    if (initializationRetries < MAX_RETRIES) {
      // Wait before retrying
      const delay = Math.min(1000 * Math.pow(2, initializationRetries), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Clean up and try again
      await cleanupWorker();
      isInitializing = false;
      return ensurePdfWorkerInitialized();
    }
    
    return false;
  } finally {
    isInitializing = false;
  }
}

// Load a PDF document
export async function loadPdfDocument(data: ArrayBuffer | Uint8Array, password?: string) {
  const workerReady = await ensurePdfWorkerInitialized();
  if (!workerReady) {
    throw new Error('PDF worker not available');
  }

  const options = getLoadingOptions(data, password);
  return pdfjsLib.getDocument(options).promise;
}

// Reset worker for recovery
export async function resetPdfWorker(): Promise<boolean> {
  await cleanupWorker();
  initializationRetries = 0;
  isInitializing = false;
  return ensurePdfWorkerInitialized();
}
