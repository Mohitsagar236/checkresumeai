// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\components\pdf\FixedPdfViewer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import '../../styles/pdfViewer.css';
import { 
  getSimplePdfLoadingOptions,
  isWorkerInitialized,
  initializePdfWorkerSimple,
  ensureWorkerIsRunning
} from '../../utils/pdf-worker-no-test';

interface FixedPdfViewerProps {
  file: File | Blob | null;
  width?: number | string;
  height?: number | string;
  page?: number;
  scale?: number;
  className?: string;
  onLoadComplete?: (numPages: number) => void;
  onError?: (error: Error, errorCode?: string) => void;
  allowRetry?: boolean;
}

/**
 * FixedPdfViewer component for stable PDF rendering
 * Includes fixes for common PDF.js errors and callback issues
 */
const FixedPdfViewer: React.FC<FixedPdfViewerProps> = ({
  file,
  width = '100%',
  height = 600,
  page = 1,
  scale = 1.2,
  className = '',
  onLoadComplete,
  onError,
  allowRetry = true
}) => {
  // Refs to track component state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const pdfDocumentRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Component state
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{message: string, code?: string} | null>(null);
  const [renderAttempts, setRenderAttempts] = useState<number>(0);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [passwordAttempted, setPasswordAttempted] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
        // Clean up PDF.js resources
      if (loadingTaskRef.current) {
        safeCleanupTask(loadingTaskRef.current);
        loadingTaskRef.current = null;
      }
      
      if (pdfDocumentRef.current) {
        cleanupPdfDocument(pdfDocumentRef.current);
        pdfDocumentRef.current = null;
      }
    };
  }, []);
  // Initialize PDF worker
  useEffect(() => {
    const initWorker = async () => {
      await ensureWorkerIsRunning();
    };
    
    initWorker();
  }, []);
  
  // Load and render PDF when file changes
  useEffect(() => {
    if (!file) {
      setLoading(false);
      return;
    }
    
    loadPdf();
    
    // Cleanup function
    return () => {
      if (loadingTaskRef.current) {
        safeCleanupTask(loadingTaskRef.current);
        loadingTaskRef.current = null;
      }
        if (pdfDocumentRef.current) {
        cleanupPdfDocument(pdfDocumentRef.current);
        pdfDocumentRef.current = null;
      }
    };
  }, [file, renderAttempts]);
  
  // Handle password changes for password-protected PDFs
  useEffect(() => {
    if (password && isPasswordProtected && !passwordAttempted) {
      setPasswordAttempted(true);
      loadPdf(password);
    }
  }, [password, isPasswordProtected, passwordAttempted]);
    // Load PDF function
  const loadPdf = useCallback(async (pdfPassword?: string) => {
    if (!file || !isMountedRef.current) return;
    
    // Clean up any existing task
    if (loadingTaskRef.current) {
      safeCleanupTask(loadingTaskRef.current);
      loadingTaskRef.current = null;
    }
    
    if (pdfDocumentRef.current) {
      cleanupPdfDocument(pdfDocumentRef.current);
      pdfDocumentRef.current = null;
    }
    
    setLoading(true);
    setError(null);
      try {
      // Convert file to ArrayBuffer for the new approach
      let fileData: ArrayBuffer;
      if (file instanceof File) {
        fileData = await file.arrayBuffer();
      } else {
        // Handle Blob case
        fileData = await file.arrayBuffer();
      }
      
      // Get simple loading options
      const loadingOptions = getSimplePdfLoadingOptions(new Uint8Array(fileData), pdfPassword);
      
      // Create loading task
      const loadingTask = pdfjsLib.getDocument(loadingOptions);
      loadingTaskRef.current = loadingTask;
      
      // Handle password errors
      loadingTask.onPassword = (updatePassword, reason) => {
        if (!isMountedRef.current) return;
        
        setIsPasswordProtected(true);
        setLoading(false);
        
        if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
          setError({ message: 'Incorrect password', code: 'PASSWORD_INCORRECT' });
          setPasswordAttempted(false);
        } else {
          setError({ message: 'This PDF is password protected', code: 'PASSWORD_REQUIRED' });
        }
        
        // Password handler will be triggered when user inputs a password
        // The updatePassword function won't be called here to prevent errors
      };
      
      // Get the PDF document
      const pdfDocument = await loadingTask.promise;
        if (!isMountedRef.current) {
        // Cleanup if component unmounted during loading
        cleanupPdfDocument(pdfDocument);
        return;
      }
      
      pdfDocumentRef.current = pdfDocument;
      
      // Get page count and render the first page
      const pageCount = pdfDocument.numPages;
      setNumPages(pageCount);
      setCurrentPage(Math.min(page, pageCount));
      
      // Render the page
      const pageObj = await pdfDocument.getPage(Math.min(page, pageCount));
      renderPage(pageObj);
      
      if (onLoadComplete && isMountedRef.current) {
        onLoadComplete(pageCount);
      }
      
      // Clean up the object URL
      if (file instanceof File) {
        URL.revokeObjectURL(fileUrl);
      }
      
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error('Error loading PDF:', err);
      setLoading(false);
      
      const error = err as Error;
      const errorCode = error.message?.includes('password') ? 'PASSWORD_ERROR' : 'LOADING_ERROR';
      
      setError({ message: error.message || 'Failed to load PDF', code: errorCode });
      
      if (onError && isMountedRef.current) {
        onError(error, errorCode);
      }
    }
  }, [file, page, onLoadComplete, onError]);
  
  // Render PDF page
  const renderPage = useCallback(async (pdfPage: pdfjsLib.PDFPageProxy) => {
    if (!canvasRef.current || !isMountedRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Canvas context could not be created');
      }
      
      const viewport = pdfPage.getViewport({ scale });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await pdfPage.render(renderContext).promise;
      
      if (isMountedRef.current) {
        setLoading(false);
      }
      
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error('Error rendering PDF page:', err);
      setLoading(false);
      
      const error = err as Error;
      setError({ message: error.message || 'Failed to render PDF page', code: 'RENDER_ERROR' });
      
      if (onError && isMountedRef.current) {
        onError(error, 'RENDER_ERROR');
      }
    }
  }, [scale, onError]);
  
  // Retry loading PDF
  const handleRetry = useCallback(() => {
    setRenderAttempts(prev => prev + 1);
    setError(null);
    setIsPasswordProtected(false);
    setPasswordAttempted(false);
    setPassword('');
  }, []);
  
  // Handle password input
  const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAttempted(false); // Reset to trigger effect
  }, []);
  
  // Render loading state
  if (loading) {
    return (
      <div 
        className={`pdf-viewer-container ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <div className="pdf-loading-indicator">
          <RefreshCw size={24} className="animate-spin" />
          <span>Loading PDF...</span>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div 
        className={`pdf-viewer-container pdf-error ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <div className="pdf-error-message">
          <AlertTriangle size={24} className="text-red-500" />
          <span>{error.message}</span>
          {allowRetry && (
            <button 
              onClick={handleRetry}
              className="pdf-retry-button"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Render password prompt
  if (isPasswordProtected) {
    return (
      <div 
        className={`pdf-viewer-container pdf-password ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <div className="pdf-password-form">
          <div className="pdf-password-header">
            <Lock size={24} className="text-amber-500" />
            <h3>Password Protected PDF</h3>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="pdf-password-input"
              autoFocus
            />
            <button 
              type="submit"
              className="pdf-password-submit"
            >
              Unlock PDF
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Render PDF canvas
  return (
    <div 
      className={`pdf-viewer-container ${className}`}
      style={{ width, height, overflow: 'auto' }}
    >
      <canvas ref={canvasRef} className="pdf-canvas" />
    </div>
  );
};

export default FixedPdfViewer;
