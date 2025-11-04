import { getDocument, GlobalWorkerOptions, version, PDFDocumentProxy } from 'pdfjs-dist';
import { initializeSimpleWorker } from './pdf-worker-simple';

/**
 * Initialize the enhanced PDF worker with proper error handling and fallbacks
 * @returns {Promise<boolean>} True if initialization was successful
 */
export const initializeEnhancedWorker = async () => {
  try {
    console.log('Initializing enhanced PDF.js worker...');
      // Try to use the simple worker first (which has better error handling)
    try {
      await initializeSimpleWorker();
      console.log('Simple PDF.js worker initialized successfully');
      return true;
    } catch (simpleError) {
      console.warn('Simple worker initialization failed, falling back to basic worker:', simpleError);
    }

    // Multiple worker paths for better compatibility
    const workerPaths = [
      `/pdf-worker/pdf.worker.min.mjs?v=${version}`,
      `/pdf-worker/pdf.worker.mjs?v=${version}`,
      `/pdf-worker.js?v=${version}`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`,
    ];
    
    // Set the worker source with the first option
    GlobalWorkerOptions.workerSrc = workerPaths[0];
    
    // Basic test with a minimal PDF
    const testPdfBytes = new Uint8Array([
      37, 80, 68, 70, 45, 49, 46, 48, 10, 49, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 
      84, 121, 112, 101, 32, 47, 67, 97, 116, 97, 108, 111, 103, 32, 47, 80, 97, 103, 101, 
      115, 32, 50, 32, 48, 32, 82, 32, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 50, 32, 
      48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 115, 
      32, 47, 75, 105, 100, 115, 32, 91, 51, 32, 48, 32, 82, 93, 32, 47, 67, 111, 117, 110, 
      116, 32, 49, 32, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 51, 32, 48, 32, 111, 98, 
      106, 10, 60, 60, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 32, 47, 77, 101, 100, 
      105, 97, 66, 111, 120, 32, 91, 48, 32, 48, 32, 51, 32, 51, 93, 32, 62, 62, 10, 101, 110, 
      100, 111, 98, 106, 10, 120, 114, 101, 102, 10, 48, 32, 52, 10, 48, 48, 48, 48, 48, 48, 
      48, 48, 48, 48, 32, 54, 53, 53, 51, 53, 32, 102, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 
      49, 55, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 55, 56, 
      32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 49, 52, 52, 32, 48, 
      48, 48, 48, 48, 32, 110, 32, 10, 116, 114, 97, 105, 108, 101, 114, 10, 60, 60, 47, 82, 
      111, 111, 116, 32, 49, 32, 48, 32, 82, 32, 47, 83, 105, 122, 101, 32, 52, 32, 62, 62, 10, 
      115, 116, 97, 114, 116, 120, 114, 101, 102, 10, 49, 57, 53, 10, 37, 37, 69, 79, 70
    ]);

    // Set up robust loading options to avoid connectivity issues
    const loadingOptions = {
      data: testPdfBytes,
      useWorkerFetch: false,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true
    };
      // Add a timeout to avoid hanging if the worker doesn't respond
    const loadingTask = getDocument(loadingOptions);    const doc = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF worker initialization timed out (3s)')), 3000)
      )
    ]) as PDFDocumentProxy;
    
    // Clean up test document
    if (doc && typeof doc.destroy === 'function') {
      doc.destroy();
    }
    
    console.log('Basic PDF.js worker initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing PDF.js worker:', error);
    return false;
  }
};