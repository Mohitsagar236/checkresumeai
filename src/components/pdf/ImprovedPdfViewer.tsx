// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\components\pdf\ImprovedPdfViewer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import '../../styles/pdfViewer.css';
import '../../styles/pdf-viewer.css';
import { 
  initializeSimpleWorker, 
  getSimpleLoadingOptions
} from '../../utils/pdf-worker-simple';
import { monitorPdfTask, stopMonitoringPdfTask } from '../../utils/pdf-error-monitor';
import { safelySetPasswordHandler } from '../../utils/pdf-password-handler';

interface PdfViewerProps {
  file: File | Blob | null;
  width?: number | string;
  height?: number | string;
  page?: number;
  scale?: number;
  className?: string;
  onLoadComplete?: (numPages: number) => void;
  onError?: (error: Error, errorCode?: string) => void;
  allowRetry?: boolean;
  maxInitRetries?: number;
}

/**
 * ImprovedPdfViewer - Fixes the "Cannot set properties of null (setting 'onPassword')" error
 * and other PDF.js callback issues
 */
export default function ImprovedPdfViewer({
  file,
  width = '100%',
  height = 600,
  page = 1,
  scale = 1.2,
  className = '',
  onLoadComplete,
  onError,
  allowRetry = true
}: PdfViewerProps) {
  // Refs to track component state and resources
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // State management
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  // Error handling
  const handleError = useCallback((error: Error, code: string) => {
    if (!isMountedRef.current) return;
    
    setError(error.message);
    setLoading(false);
    
    if (onError) {
      onError(error, code);
    }
  }, [onError]);

  // Load the PDF document with enhanced error handling
  const loadPdf = useCallback(async () => {
    if (!isMountedRef.current || !file) {
      return;
    }
      // Clean up previous task and document
    if (loadingTaskRef.current) {
      try {
        loadingTaskRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying loading task:', error);
      }
      loadingTaskRef.current = null;
    }
    
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
      } catch (error) {
        console.warn('Error destroying PDF document:', error);
      }
      setPdfDocument(null);
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get file data
      const arrayBuffer = await file.arrayBuffer();
        // Create loading task with simple options
      const options = getSimpleLoadingOptions(new Uint8Array(arrayBuffer), password || undefined);
      const loadingTask = pdfjsLib.getDocument(options);
      
      // Monitor task for errors
      monitorPdfTask(loadingTask);
      loadingTaskRef.current = loadingTask;

      // Handle password protection safely
      safelySetPasswordHandler(
        loadingTask,
        () => {
          if (!isMountedRef.current) return;
          setIsPasswordProtected(true);
          setLoading(false);
          handleError(new Error('This PDF is password-protected. Please enter the password.'), 'PASSWORD_REQUIRED');
        },
        () => {
          if (!isMountedRef.current) return;
          setIsPasswordProtected(true);
          setLoading(false);
          handleError(new Error('Incorrect password. Please try again.'), 'INCORRECT_PASSWORD');
        }
      );
      
      const pdf = await loadingTask.promise;
        if (!isMountedRef.current) {
        // Component unmounted while loading
        try {
          pdf.destroy();
        } catch (error) {
          console.warn('Error destroying PDF document:', error);
        }
        return;
      }
      
      // Success! Update state
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
      setLoading(false);
      setIsPasswordProtected(false);
      
      if (onLoadComplete) {
        onLoadComplete(pdf.numPages);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      
      if (err instanceof Error) {
        console.error('PDF loading error:', err);
        
        // Handle the specific "Cannot set properties of null" error
        if (err.message.includes('Cannot set properties of null') && 
            err.message.includes('onPassword')) {
          
          console.warn('Detected onPassword error - attempting to recover...');
            try {
            // Initialize simple worker
            await initializeSimpleWorker();
            
            if (isMountedRef.current) {
              setError('PDF viewer is recovering from a communication error. Please wait...');
              
              setTimeout(() => {
                if (isMountedRef.current) {
                  setLoading(true);
                  loadPdf().catch(console.error);
                }
              }, 1200);
              return;
            }
          } catch (recoveryErr) {
            console.error('Recovery failed:', recoveryErr);
            handleError(new Error('PDF viewer could not recover. Please try again or refresh the page.'), 'RECOVERY_FAILED');
          }
        } else {
          // Handle other errors
          handleError(err, 'LOAD_ERROR');
        }
      }
    } finally {
      // Remove task from monitoring if it exists
      if (loadingTaskRef.current) {
        stopMonitoringPdfTask(loadingTaskRef.current);
      }
    }
  }, [file, password, onLoadComplete, handleError, pdfDocument]);

  // Render page function
  const renderPage = useCallback(async () => {
    if (!pdfDocument || !canvasRef.current) return;

    try {
      const pageToRender = await pdfDocument.getPage(currentPage);
      const viewport = pageToRender.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error("Canvas context not available");
        return;
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await pageToRender.render({
        canvasContext: context,
        viewport
      }).promise;
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error("PDF render error:", err);
      if (err instanceof Error) {
        handleError(err, 'RENDER_ERROR');
      }
    }
  }, [pdfDocument, currentPage, scale, handleError]);

  // Update rendered page when currentPage or pdf changes
  useEffect(() => {
    if (pdfDocument && canvasRef.current) {
      renderPage().catch(console.error);
    }
  }, [pdfDocument, currentPage, renderPage]);

  // Load PDF when file changes
  useEffect(() => {
    if (file) {
      loadPdf().catch(console.error);
    }
  }, [file, loadPdf]);

  // Password submission handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loadPdf().catch(console.error);
  };

  // Retry loading handler
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadPdf().catch(console.error);
  };
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying loading task:', error);
        }
      }
      if (pdfDocument) {
        try {
          pdfDocument.destroy();
        } catch (error) {
          console.warn('Error destroying PDF document:', error);
        }
      }
    };
  }, [pdfDocument]);

  // Page navigation
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Render the viewer
  return (
    <div 
      className={`pdf-viewer-container ${className}`}
      style={{ width, height: typeof height === 'number' ? `${height}px` : height }}
    >
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      )}
      
      {error && !isPasswordProtected && (
        <div className="error-container">
          <AlertTriangle className="error-icon" />
          <p className="error-message">{error}</p>
          {allowRetry && (
            <button onClick={handleRetry} className="retry-button">
              <RefreshCw className="retry-icon" />
              Try again
            </button>
          )}
        </div>
      )}
      
      {isPasswordProtected && (
        <div className="password-container">
          <Lock className="lock-icon" />
          <p className="password-message">{error}</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <canvas ref={canvasRef} className="pdf-canvas"></canvas>
          {numPages > 1 && (
            <div className="page-controls">
              <button onClick={goToPrevPage} disabled={currentPage <= 1}>
                Previous
              </button>
              <span>Page {currentPage} of {numPages}</span>
              <button onClick={goToNextPage} disabled={currentPage >= numPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
