/**
 * Simple PDF Worker Implementation
 * This version focuses on stability and proper error handling
 */
import * as pdfjsLib from 'pdfjs-dist';
import { PdfWorkerConfig, PdfLoadingOptions } from './pdf-worker.types';
import { callbackStore } from './pdf-callback-store';

// Worker state
let isInitialized = false;
let activeWorker: pdfjsLib.PDFWorker | null = null;

// Error handling setup
function setupErrorHandler(): () => void {
  const originalOnError = window.onerror;
  
  window.onerror = (message, source, lineno, colno, error) => {
    const errorMsg = message?.toString() || '';
    if (
      errorMsg.includes('Receiving end does not exist') ||
      errorMsg.includes('Could not establish connection') ||
      errorMsg.includes('runtime.lastError')
    ) {
      return true; // Suppress expected worker errors
    }
    return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
  };

  return () => {
    window.onerror = originalOnError;
  };
}

// Initialize worker
export async function initializeWorker(config: PdfWorkerConfig): Promise<boolean> {
  if (isInitialized && activeWorker) {
    return true;
  }

  try {
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = config.workerSrc;

    // Create worker
    activeWorker = new pdfjsLib.PDFWorker('pdf-worker');
    await activeWorker.promise;

    // Set up message handling
    activeWorker.port.addEventListener('message', (event: MessageEvent) => {
      const data = event.data;
      if (!data?.callbackId) return;

      callbackStore.resolveCallback(data.callbackId, data.data || data);
    });

    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize PDF worker:', error);
    return false;
  }
}

// Get PDF loading options
export function getLoadingOptions(data: ArrayBuffer | Uint8Array, password?: string): PdfLoadingOptions {
  return {
    data,
    password,
    useWorkerFetch: true,
    standardFontDataUrl: '/pdf-worker/',
    cMapUrl: '/pdf-worker/',
    cMapPacked: true,
  };
}

// Check initialization status
export function isWorkerInitialized(): boolean {
  return isInitialized && !!activeWorker;
}

// Clean up worker
export async function cleanupWorker(): Promise<void> {
  if (activeWorker) {
    await activeWorker.destroy();
    activeWorker = null;
  }
  isInitialized = false;
}
