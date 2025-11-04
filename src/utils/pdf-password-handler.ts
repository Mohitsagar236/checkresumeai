/**
 * PDF Password Handler
 * 
 * Helper functions to handle PDF password protection in a way that's compatible
 * with PDF.js v5.2.133 and prevents the "Cannot set properties of null (setting 'onPassword')" error.
 */

import * as pdfjsLib from 'pdfjs-dist';

/**
 * Safe password handler that prevents "Cannot set properties of null" errors
 * by wrapping the onPassword handler in a try-catch block
 * 
 * @param loadingTask The PDF loading task
 * @param onPasswordNeeded Callback when a password is needed
 * @param onIncorrectPassword Callback when a password is incorrect
 */
export function safelySetPasswordHandler(
  loadingTask: pdfjsLib.PDFDocumentLoadingTask | null,
  onPasswordNeeded: () => void,
  onIncorrectPassword: () => void
): void {
  if (!loadingTask) return;
  
  try {
    const handler = (updateCallback: (password: string) => void, reason: number) => {
      if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
        onPasswordNeeded();
      } else if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
        onIncorrectPassword();
      }
    };
    
    // Use Object.defineProperty to set the handler safely
    Object.defineProperty(loadingTask, 'onPassword', {
      value: handler,
      writable: true,
      configurable: true
    });
  } catch (err) {
    console.error('Error setting password handler:', err);
    // We'll handle password errors through the error event
  }
}

/**
 * Create a PDF loading task with a safe password handler
 * @param options PDF document loading options
 * @param onPasswordNeeded Callback when a password is needed
 * @param onIncorrectPassword Callback when a password is incorrect
 */
export function createSafePasswordHandlingTask(
  options: pdfjsLib.DocumentInitParameters,
  onPasswordNeeded: () => void,
  onIncorrectPassword: () => void
): pdfjsLib.PDFDocumentLoadingTask {
  // Create the task first
  const task = pdfjsLib.getDocument(options);
  
  // Then safely set the password handler
  safelySetPasswordHandler(task, onPasswordNeeded, onIncorrectPassword);
  
  return task;
}
