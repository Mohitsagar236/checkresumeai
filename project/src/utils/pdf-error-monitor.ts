/**
 * PDF.js Error Monitor for handling "Cannot resolve callback" errors
 * 
 * This utility provides real-time error monitoring and automatic repair for
 * PDF.js worker communication errors in v5.2.133
 */

import { resetGlobalPdfJsState, ensureWorkerIsRunning } from "./pdf-worker-stable.enhanced.v2";
import { callbackStore } from "./pdf-callback-store";
import * as pdfjsLib from "pdfjs-dist";

// Store active PDF tasks for monitoring
const activePdfTasks = new Set<pdfjsLib.PDFDocumentLoadingTask>();

/**
 * Add a PDF task to be monitored for callback errors
 */
export function monitorPdfTask(task: pdfjsLib.PDFDocumentLoadingTask): void {
  activePdfTasks.add(task);
}

/**
 * Remove a PDF task from monitoring when it is no longer needed
 */
export function stopMonitoringPdfTask(task: pdfjsLib.PDFDocumentLoadingTask): void {
  activePdfTasks.delete(task);
}

/**
 * Install global error handler for PDF.js callback errors
 */
export function installPdfErrorMonitor(): void {
  // Do not reinstall if already installed
  if ((window as Window & { __pdfErrorMonitorInstalled?: boolean }).__pdfErrorMonitorInstalled) {
    return;
  }

  const originalConsoleError = console.error;

  // Override console.error to detect PDF.js errors
  console.error = function(...args: unknown[]) {
    const errorMessage = args.map(arg => String(arg)).join(" ");
    
    // Check for known PDF.js worker errors
    if (errorMessage.includes("Cannot resolve callback") || 
        errorMessage.includes("sendWithPromise") ||
        errorMessage.includes("Worker was destroyed") ||
        errorMessage.includes("Cannot read properties of null") ||
        errorMessage.includes("Receiving end does not exist") ||
        errorMessage.includes("disconnected port")) {
      
      console.log("PDF.js error detected, attempting automatic recovery...");
      
      try {
        // Extract callback ID if present for error reporting
        const callbackIdMatch = errorMessage.match(/callback (\d+)/);
        if (callbackIdMatch) {
          const callbackId = parseInt(callbackIdMatch[1], 10);
          console.warn(`PDF.js error involved callback ID: ${callbackId}`);
          
          // Try to resolve the callback to prevent hanging
          try {
            const autoResolveSuccess = callbackStore.resolveCallback(callbackId, null);
            if (autoResolveSuccess) {
              console.log(`Auto-resolved hanging callback ${callbackId}`);
            }
          } catch (autoResolveError) {
            console.warn(`Failed to auto-resolve callback ${callbackId}:`, autoResolveError);
          }
        }
        
        // Reset global state and attempt recovery
        resetGlobalPdfJsState();
        
        // Attempt to re-initialize the worker
        setTimeout(async () => {
          try {
            await ensureWorkerIsRunning();
            console.log("PDF.js worker recovered successfully");
          } catch (e) {
            console.error('Failed to recover PDF worker:', e);
          }
        }, 1000);
      } catch (err) {
        console.error("Could not recover PDF worker:", err);
      }
    }
    
    // Suppress browser extension connection errors that are unrelated to our app
    if (errorMessage.includes("Unchecked runtime.lastError") && 
        errorMessage.includes("Could not establish connection")) {
      console.debug("Browser extension connection error (not related to app):", errorMessage);
      return; // Don't call originalConsoleError for these
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };

  // Listen for unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const errorMessage = event.reason?.message || String(event.reason);
    
    if (errorMessage.includes("Cannot resolve callback") || 
        errorMessage.includes("sendWithPromise") ||
        errorMessage.includes("Worker was destroyed") ||
        errorMessage.includes("Cannot read properties of null") ||
        errorMessage.includes("Receiving end does not exist")) {
      
      console.log("Unhandled PDF.js error detected, attempting automatic recovery...");
      
      try {
        // Reset global state and attempt recovery
        resetGlobalPdfJsState();
        // Attempt to re-initialize the worker
        setTimeout(async () => {
          try {
            await ensureWorkerIsRunning();
          } catch (e) {
            console.error('Failed to recover PDF worker:', e);
          }
        }, 1000);

        // Prevent the error from propagating further since we're handling it
        event.preventDefault();
      } catch (err) {
        console.error("Could not recover PDF worker:", err);
      }
    }
  });
  
  // Mark as installed
  (window as Window & { __pdfErrorMonitorInstalled?: boolean }).__pdfErrorMonitorInstalled = true;
  console.log("PDF.js error monitor installed");
}

/**
 * Initialize the PDF error monitor
 * This should be called early in the application lifecycle
 */
export function initPdfErrorMonitoring(): void {
  installPdfErrorMonitor();
}
