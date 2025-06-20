/**
 * PDF Worker Manager
 * 
 * Provides centralized management of PDF.js worker initialization and monitoring:
 * - Singleton pattern to prevent duplicate initialization
 * - Proper worker cleanup on errors
 * - Auto-recovery from known PDF.js errors
 * - Integration with callback store for reliable messaging
 */
import * as pdfjsLib from 'pdfjs-dist';
import { callbackStore } from './pdf-callback-store';
import { PdfWorkerConfig } from './pdf-worker.types';
import { initializeWorker } from './pdf-worker';

// Configuration constants
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Base delay in ms

// State management
class WorkerState {
  private static instance: WorkerState;
  private initializationRetries = 0;
  private isInitializing = false;
  private isInitialized = false;
  private initializationFailed = false;

  private constructor() {}

  static getInstance(): WorkerState {
    if (!WorkerState.instance) {
      WorkerState.instance = new WorkerState();
    }
    return WorkerState.instance;
  }

  reset(): void {
    this.initializationRetries = 0;
    this.isInitializing = false;
    this.isInitialized = false;
    this.initializationFailed = false;
  }

  incrementRetries(): number {
    return ++this.initializationRetries;
  }

  get retries(): number {
    return this.initializationRetries;
  }

  setInitializing(value: boolean): void {
    this.isInitializing = value;
  }

  get initializing(): boolean {
    return this.isInitializing;
  }

  setInitialized(value: boolean): void {
    this.isInitialized = value;
  }

  get initialized(): boolean {
    return this.isInitialized;
  }

  setFailed(value: boolean): void {
    this.initializationFailed = value;
  }

  get failed(): boolean {
    return this.initializationFailed;
  }
}

/**
 * Setup error handling for worker communication
 */
function setupErrorHandling(): () => void {
  const originalOnError = window.onerror;
  
  window.onerror = (message, source, lineno, colno, error) => {
    // Suppress expected worker communication errors
    if (message?.toString().includes('Receiving end does not exist')) {
      return true;
    }
    // Pass through other errors
    return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
  };

  // Return cleanup function
  return () => {
    window.onerror = originalOnError;
  };
}

/**
 * Reset global PDF.js state for clean retry
 */
async function resetPdfState(): Promise<void> {
  try {
    // Cleanup any existing worker
    if (pdfjsLib.GlobalWorkerOptions.workerPort) {
      pdfjsLib.GlobalWorkerOptions.workerPort.terminate();
    }
    
    // Reset worker options
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
      // Clear callback store
    callbackStore.clear();
    
    // Allow garbage collection
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.warn('Error during PDF state reset:', error);
  }
}

/**
 * Initialize the PDF worker with retry logic and proper state management
 */
export async function ensurePdfWorkerInitialized(config?: PdfWorkerConfig): Promise<boolean> {
  const state = WorkerState.getInstance();
  
  // Return immediately if already initialized
  if (state.initialized) {
    return true;
  }

  // Prevent concurrent initialization
  if (state.initializing) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return state.initialized;
  }

  // Check if we've failed too many times
  if (state.failed || state.retries >= MAX_RETRIES) {
    console.error('Maximum PDF worker initialization retries reached');
    return false;
  }

  state.setInitializing(true);

  try {
    // Setup error handling
    const cleanupErrorHandler = setupErrorHandling();

    // Attempt initialization
    const workerConfig: PdfWorkerConfig = config || {
      workerSrc: '/pdf-worker/pdf.worker.min.mjs'
    };

    const success = await initializeWorker(workerConfig);

    if (success) {
      state.setInitialized(true);
      state.setInitializing(false);
      cleanupErrorHandler();
      return true;
    }

    throw new Error('Worker initialization failed');

  } catch (error) {
    console.warn(`PDF worker initialization attempt ${state.retries + 1} failed:`, error);
    
    state.incrementRetries();
    
    if (state.retries >= MAX_RETRIES) {
      state.setFailed(true);
      console.error('❌ PDF.js worker initialization failed after all attempts');
      return false;
    }

    // Reset state for retry
    await resetPdfState();
    
    // Wait with exponential backoff
    const retryDelay = RETRY_DELAY_BASE * Math.pow(2, state.retries - 1);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    // Recursive retry
    state.setInitializing(false);
    return ensurePdfWorkerInitialized(config);
  }
}
