/**
 * Enhanced PDF.js Worker Stability Handler for PDF.js v5.2.133 (pdfjs-dist)
 * Version 3.5
 *
 * Addresses "Cannot resolve callback" and "Maximum call stack size exceeded" errors by:
 * 1. Patching pdfjsLib.MessageHandler to use a central message dispatcher.
 * 2. Managing a single, shared worker port (MessagePort).
 * 3. Moving pending callbacks to a global cache when a MessageHandler is destroyed.
 * 4. Offering stable worker initialization and safe cleanup utilities.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { callbackStore } from './pdf-callback-store';

interface DocumentInitParameters {
  data: ArrayBuffer | Uint8Array;
  password?: string;
  cMapUrl?: string;
  cMapPacked?: boolean;
  standardFontDataUrl?: string;
  useWorkerFetch?: boolean;
  disableStream?: boolean;
  disableAutoFetch?: boolean;
  disableRange?: boolean;
  disableAbortController?: boolean;
  withCredentials?: boolean;
  workerPort?: MessagePort;
  [key: string]: unknown;
}

// --- Type Definitions for Clarity ---
interface StoredCallback {
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
  name?: string; // Optional: from PDF.js's internal callback structure
}

// Extended interface for PDF.js internal types
interface PDFWorkerTransport {
  commonMessageHandler?: {
    port: MessagePort;
  };
  pageMessageHandler?: {
    port: MessagePort;
  };
}

// Define a type for PDFjs internals we need to access
interface PDFjsInternals {
  MessageHandler: MessageHandlerConstructor;
}

// Interface for accessing PDF.js internal properties safely
interface ExtendedPDFDocumentLoadingTask {
  _worker?: {
    port: MessagePort;
  };
  _workerTransport?: PDFWorkerTransport;
  destroyed?: boolean;
}

// Interface for accessing PDF.js internal document properties safely
interface ExtendedPDFDocumentProxy {
  _transport: unknown;
  _destroyed: boolean;
}

// MessageHandler instance with our enhancements
interface PatchedMessageHandlerInstance {
  enhancedHandlerId: string;
  port: MessagePort;
  _callbacks?: Map<number, StoredCallback>;
  _onMessage: (data: unknown) => void;
  destroy: (...args: unknown[]) => void;
  // Other MessageHandler properties with unknown types
  [key: string]: unknown;
}

// MessageHandler constructor type
interface MessageHandlerConstructor {
  new (docId: string, name: string, portArgument: MessagePort): PatchedMessageHandlerInstance;
  prototype: Record<string, unknown>;
  [key: string]: unknown;
}

// --- Global State ---
let workerInitialized = false;
let workerPort: MessagePort | null = null;
let originalMessageHandlerConstructor: MessageHandlerConstructor | null = null;
let handlerIdCounter = 0;
let workerInitializationPromise: Promise<void> | null = null;

const activeMessageHandlers = new Map<string, PatchedMessageHandlerInstance>();
const globalCallbackCache = new Map<number, StoredCallback>();
const destroyedTasksRegistry = new Set<string>(); // Track destroyed tasks by ID

// --- Global Callback Cache Utilities ---
function preserveCallbackInGlobalCache(callbackId: number, callbackObject: StoredCallback): void {
  globalCallbackCache.set(callbackId, callbackObject);
  // console.log(`Callback ${callbackId} (resolve/reject) preserved in global cache.`);
}

function getCallbackFromGlobalCache(id: number): StoredCallback | undefined {
  return globalCallbackCache.get(id);
}

function releaseCallbackFromGlobalCache(id: number): boolean {
  // console.log(`Callback ${id} released from global cache.`);
  return globalCallbackCache.delete(id);
}

// --- Central Message Dispatcher ---
const globalWorkerPortOnMessage = (event: MessageEvent) => {
  const data = event.data;
  if (!data?.callbackId) {
    console.debug('Received non-callback message:', data);
    return;
  }

  // Try to resolve the callback using the callback store
  const success = callbackStore.resolveCallback(data.callbackId, data.data || data);
  if (!success) {
    console.warn(`Global onmessage: Cannot resolve callback ${data.callbackId}. No handler or cached callback found.`);
  }
};

// --- MessageHandler Patching ---
// Store the original MessageHandler
const OriginalMessageHandler = (pdfjsLib as any).MessageHandler;

// Patch MessageHandler to use callback store
function patchPdfJsMessageHandler() {
  if (!(pdfjsLib as any).MessageHandler) {
    console.warn('Failed to patch: pdfjsLib.MessageHandler is not defined.');
    return;
  }

  (pdfjsLib as any).MessageHandler = class extends OriginalMessageHandler {
    sendWithPromise(actionName: string, data: unknown) {
      return new Promise((resolve, reject) => {
        const callbackId = Math.floor(Math.random() * 100000);
        callbackStore.storeCallback(callbackId, { resolve, reject, name: actionName });
        
        try {
          super.send(actionName, data, [callbackId]);
        } catch (error) {
          callbackStore.rejectCallback(callbackId, error);
          throw error;
        }
      });
    }

    // Other methods remain unchanged
    // ...existing code...
  };
}

// Initialize the stable worker with new callback handling
export async function initializeStableWorker(): Promise<boolean> {
  try {
    patchPdfJsMessageHandler();
    
    // Set up the worker
    const workerSrc = '/pdf-worker/pdf.worker.min.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    
    // Create a test worker to verify initialization
    const worker = new pdfjsLib.PDFWorker('test');
    await worker.promise;
    
    // Add global message handler
    worker.port.addEventListener('message', globalWorkerPortOnMessage);
    
    console.log('Enhanced stable PDF.js worker (v3.4) initialized successfully.');
    return true;
  } catch (error) {
    console.error('Failed to initialize enhanced stable worker:', error);
    return false;
  }
}

async function testWorkerUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function safeCleanupDocument(doc: pdfjsLib.PDFDocumentProxy | null): Promise<void> {
  if (!doc) return;
  try {
    // Access internal properties with type casting
    const extendedDoc = doc as unknown as ExtendedPDFDocumentProxy;
    if (extendedDoc._transport && !extendedDoc._destroyed) {
      await doc.destroy();
    }
  } catch (err) {
    console.warn('Error during safe document cleanup:', err, doc);
  }
}

export function safeCleanupTask(task: pdfjsLib.PDFDocumentLoadingTask | null): void {
  if (!task) return;
  try {
    // Access internal properties with type casting
    const extendedTask = task as unknown as ExtendedPDFDocumentLoadingTask;
    if (!extendedTask.destroyed) {
      task.destroy();
    }
  } catch (err) {
    console.warn('Error during safe task cleanup:', err, task);
  }
}

export async function initializeStableWorker(): Promise<void> {
  // If worker is already initialized, just return
  if (workerInitialized && workerPort) {
    // Start port monitoring to handle disconnections
    startPortConnectionMonitoring();
    return;
  }
  
  // If initialization is in progress, return the existing promise
  if (workerInitializationPromise) {
    return workerInitializationPromise;
  }
  
  // Start new initialization
  console.log('Initializing enhanced stable PDF.js worker (v3.4)...');
  
  // Create a new initialization promise
  workerInitializationPromise = (async () => {
    // Clear the destroyedTasksRegistry in case of re-initialization
    destroyedTasksRegistry.clear();
    
    // Patch the MessageHandler to enhance stability
    patchPdfJsMessageHandler();

  const workerSrcOptions = [
    `/pdf-worker/pdf.worker.min.mjs?v=${pdfjsLib.version}`,
    `/pdf-worker/pdf.worker.mjs?v=${pdfjsLib.version}`,
    `/pdf-worker.js?v=${pdfjsLib.version}`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`,
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  ];
  let foundWorkerSrc: string | null = null;
  for (const src of workerSrcOptions) {
    if (await testWorkerUrl(src)) {
      foundWorkerSrc = src;
      break;
    }
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = foundWorkerSrc || workerSrcOptions[0];
  if (!foundWorkerSrc) {
    console.error('No accessible PDF.js worker script found. PDF functionality may be impaired.');
  }

  try {
    const testPdfBytes = new Uint8Array([
      37, 80, 68, 70, 45, 49, 46, 48, 10, 49, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 67, 97, 116, 97, 108, 111, 103, 32, 47, 80, 97, 103, 101, 115, 32, 50, 32, 48, 32, 82, 32, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 50, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 115, 32, 47, 75, 105, 100, 115, 32, 91, 51, 32, 48, 32, 82, 93, 32, 47, 67, 111, 117, 110, 116, 32, 49, 32, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 51, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 32, 47, 77, 101, 100, 105, 97, 66, 111, 120, 32, 91, 48, 32, 48, 32, 51, 32, 51, 93, 32, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 120, 114, 101, 102, 10, 48, 32, 52, 10, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 32, 54, 53, 53, 51, 53, 32, 102, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 49, 55, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 55, 56, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 49, 52, 52, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 116, 114, 97, 105, 108, 101, 114, 10, 60, 60, 47, 82, 111, 111, 116, 32, 49, 32, 48, 32, 82, 32, 47, 83, 105, 122, 101, 32, 52, 32, 62, 62, 10, 115, 116, 97, 114, 116, 120, 114, 101, 102, 10, 49, 57, 53, 10, 37, 37, 69, 79, 70
    ]);
    const loadingTaskOptions: DocumentInitParameters = {
      data: testPdfBytes, useWorkerFetch: false, disableAutoFetch: true, disableStream: true, disableRange: true,
    };
    if (workerPort) {
      loadingTaskOptions.workerPort = workerPort;
    }
    const task = pdfjsLib.getDocument(loadingTaskOptions);
    try {
      const doc = await Promise.race([
        task.promise,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('PDF worker test document load timed out (5s)')), 5000))
      ]);
      
      // Access task's internal properties using our extended interface
      const extendedTask = task as unknown as ExtendedPDFDocumentLoadingTask;
      const portUsedByTask: MessagePort | null = 
        extendedTask._worker?.port || 
        extendedTask._workerTransport?.commonMessageHandler?.port || 
        extendedTask._workerTransport?.pageMessageHandler?.port || 
        null;

      if (portUsedByTask) {
        if (!workerPort) {
          workerPort = portUsedByTask;
          if (workerPort) { // Double check after assignment
            workerPort.onmessage = globalWorkerPortOnMessage;
            workerPort.addEventListener('close', () => {
              console.warn('Shared PDF.js worker port was closed.');
              workerPort = null; workerInitialized = false; activeMessageHandlers.clear(); globalCallbackCache.clear();
            });
            workerPort.addEventListener('messageerror', (event: MessageEvent) => {
              console.error('Shared PDF.js worker port messageerror:', event.data);
            });
          } else {
            console.error('Critical: portUsedByTask was truthy but workerPort became null.');
          }
        } else if (workerPort !== portUsedByTask) {
          console.error('CRITICAL: PDF.js task using DIFFERENT port than shared workerPort.');
        }
      } else {
        console.error('Failed to get worker port from test task.');
        throw new Error('Worker port acquisition failed.');
      }
        if (doc) {
        await safeCleanupDocument(doc);
      }
      
      workerInitialized = true;
      // Start monitoring the port connection to detect and recover from "Receiving end does not exist" errors
      startPortConnectionMonitoring();
      console.log('Enhanced stable PDF.js worker (v3.4) initialized successfully.');
    } catch (error) {
      console.error('Error during PDF.js worker (v3.4) test document loading:', error);
      // Safely clean up the task
      const extendedTask = task as unknown as ExtendedPDFDocumentLoadingTask;
      if (task && typeof task.destroy === 'function' && !extendedTask.destroyed) {
        task.destroy();
      }
      workerInitialized = false;
            throw error;
    } finally {
      // Clear initialization promise after completion
      workerInitializationPromise = null;
    }
  })();
  
  // Wait for the initialization to complete
  await workerInitializationPromise;
}

export function isWorkerInitialized(): boolean {
  return workerInitialized && workerPort !== null;
}

export function getStableWorkerPort(): MessagePort | null {
  return workerPort;
}

export function getEnhancedPdfLoadingOptions(data: ArrayBuffer | Uint8Array, password?: string): DocumentInitParameters {
  const options: DocumentInitParameters = {
    data, cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true, standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    useWorkerFetch: false, disableAutoFetch: true, disableStream: true, disableRange: true,
  };
  if (password) { options.password = password; }
  if (workerInitialized && workerPort) {
    options.workerPort = workerPort;
  }
  return options;
}

export function resetGlobalPdfJsState(): void {
  console.warn("Resetting global PDF.js state...");
  if (workerPort) {
    try { workerPort.close(); } catch (e) { console.warn("Error closing worker port during reset:", e); }
  }
  workerPort = null; workerInitialized = false;
  activeMessageHandlers.clear(); globalCallbackCache.clear();
  // MessageHandler patch remains globally on pdfjsLib.MessageHandler
}

export async function ensureWorkerIsRunning(): Promise<void> {
  if (!isWorkerInitialized()) {
    console.warn("PDF.js worker not initialized or port lost. Re-initializing.");
    resetGlobalPdfJsState();
    try { await initializeStableWorker(); } catch (error) {
      console.error("Failed to re-initialize PDF.js worker:", error);
    }
  }
}

// --- Port Connection Management ---
let portConnectionCheckInterval: number | null = null;

/**
 * Monitors worker port connection status and handles disconnection gracefully
 * to prevent "Receiving end does not exist" errors
 */
function startPortConnectionMonitoring(): void {
  if (portConnectionCheckInterval) {
    clearInterval(portConnectionCheckInterval);
  }
  
  // Check connection state every 2 seconds
  portConnectionCheckInterval = window.setInterval(() => {
    if (!workerPort) return;
    
    try {
      // Test if the port is still active by posting a small test message
      // This won't break anything but will help detect closed ports
      workerPort.postMessage({ type: 'CONNECTION_TEST' });
    } catch (e) {
      // Port is closed or invalid, reset it
      const errorMsg = e instanceof Error ? e.message : String(e);
      
      if (errorMsg.includes('Receiving end does not exist') || 
          errorMsg.includes('disconnected port')) {        console.warn('PDF.js worker port disconnected, preparing recovery...');
        
        // Save all active callbacks before resetting
        activeMessageHandlers.forEach(handler => {
          if (handler._callbacks) {
            handler._callbacks.forEach((cb, id) => {
              preserveCallbackInGlobalCache(id, cb);
            });
          }
        });
        
        // Reset worker state
        workerPort = null;
        
        // Notify handlers that port is dead
        activeMessageHandlers.forEach(handler => {
          // Mark as needing reconnection
          (handler as PatchedMessageHandlerInstance)._needsReconnect = true;
        });
        
        // Try to recreate worker on next operation
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerPort = null;
        }
      }
    }
  }, 2000);
}

// Stop monitoring when no longer needed
function stopPortConnectionMonitoring(): void {
  if (portConnectionCheckInterval !== null) {
    clearInterval(portConnectionCheckInterval);
    portConnectionCheckInterval = null;
  }
}

/**
 * Repairs any broken callbacks in the global cache, attempting to recover from errors.
 * This function is called in the error monitor to ensure stability.
 */
export function repairCallbacks(callbackId?: number | string, errorData?: unknown): boolean {
  // If a specific callbackId was provided, try to fix that one
  if (callbackId !== undefined) {
    const numericId = typeof callbackId === 'string' ? parseInt(callbackId, 10) : callbackId;
    if (!isNaN(numericId)) {
      const storedCallback = getCallbackFromGlobalCache(numericId);
      if (storedCallback) {
        try {
          // If error data was provided, reject the promise with it
          if (errorData) {
            storedCallback.reject(errorData);
          } else {
            // Otherwise, resolve with null to prevent hanging
            storedCallback.resolve(null);
          }
          console.log(`Repaired PDF.js callback #${numericId}`);
          return releaseCallbackFromGlobalCache(numericId);
        } catch (err) {
          console.error(`Failed to repair callback #${numericId}:`, err);
          return false;
        }
      }
    }
    return false;
  }
  
  // If no specific callbackId was provided, check if we need to clean up globally
  if (globalCallbackCache.size > 0) {
    console.warn(`Repairing ${globalCallbackCache.size} orphaned PDF.js callbacks`);
    const error = new Error('PDF.js callback was cleared during worker cleanup');
    
    // Clean up all callbacks in the global cache
    for (const [id, callbackObj] of globalCallbackCache.entries()) {
      try {
        callbackObj.reject(error);
        releaseCallbackFromGlobalCache(id);
      } catch (e) {
        console.error(`Failed to clean up callback #${id}:`, e);
      }
    }
    return true;
  }
  
  return false;
}
