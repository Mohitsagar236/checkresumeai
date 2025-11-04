/**
 * Core PDF.js worker functionality
 */
import * as pdfjsLib from 'pdfjs-dist';
import { callbackStore } from './pdf-callback-store';

let isWorkerInitialized = false;

interface WorkerConfig {
  workerSrc: string;
  workerPort?: MessagePort;
}

// Global message handler
function setupMessageHandler(port: MessagePort) {
  port.addEventListener('message', (event: MessageEvent) => {
    const data = event.data;
    if (!data?.callbackId) {
      console.debug('Received non-callback message:', data);
      return;
    }

    // Try to resolve the callback using the callback store
    const success = callbackStore.resolveCallback(data.callbackId, data.data || data);
    if (!success) {
      console.debug(`Worker message: Unhandled callback ${data.callbackId}`);
    }
  });
}

// Initialize PDF.js worker
export async function initializeWorker(config: WorkerConfig): Promise<boolean> {
  if (isWorkerInitialized) {
    return true;
  }

  try {
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = config.workerSrc;

    // Create worker instance
    const worker = new pdfjsLib.PDFWorker({ 
      name: 'pdf-worker',
      port: config.workerPort
    });

    // Wait for worker to be ready
    await worker.promise;

    // Set up message handling
    setupMessageHandler(worker.port);

    isWorkerInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize PDF worker:', error);
    return false;
  }
}

// Get loading options for PDF documents
export function getLoadingOptions(data: ArrayBuffer | Uint8Array, password?: string) {
  return {
    data,
    password,
    useWorkerFetch: true,
    standardFontDataUrl: '/pdf-worker/',
    cMapUrl: '/pdf-worker/',
    cMapPacked: true,
  };
}

// Check if worker is initialized
export function checkWorkerInitialized(): boolean {
  return isWorkerInitialized;
}
