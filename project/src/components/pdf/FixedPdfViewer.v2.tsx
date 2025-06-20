import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import '../../styles/pdfViewer.css';
import { 
  getSimpleLoadingOptions,
  initializeSimpleWorker,
  ensureWorkerIsRunning
} from '../../utils/pdf-worker-simple';

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
 * Uses enhanced worker management to prevent "Cannot resolve callback" errors
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
        try {
          loadingTaskRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying PDF loading task:', error);
        }
        loadingTaskRef.current = null;
      }
      
      if (pdfDocumentRef.current) {
        try {
          pdfDocumentRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying PDF document:', error);
        }
        pdfDocumentRef.current = null;
      }
    };
  }, []);

  // Initialize PDF worker
  useEffect(() => {
    const initWorker = async () => {
      try {
        await initializeSimpleWorker();
      } catch (error) {
        console.error('Error initializing PDF worker:', error);
        setError({ message: 'Failed to initialize PDF viewer', code: 'WORKER_ERROR' });
      }
    };
    
    initWorker();
  }, []);
  
  // Load PDF function
  const loadPdf = useCallback(async (pdfPassword?: string) => {
    if (!file || !isMountedRef.current) return;
    
    // Make sure worker is running
    try {
      await ensureWorkerIsRunning();
    } catch (error) {
      console.error('Failed to ensure worker is running:', error);
      setError({ message: 'PDF viewer is not ready', code: 'WORKER_ERROR' });
      return;
    }
    
    // Clean up any existing resources
    if (loadingTaskRef.current) {
      try {
        loadingTaskRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying previous loading task:', error);
      }
      loadingTaskRef.current = null;
    }
    
    if (pdfDocumentRef.current) {
      try {
        pdfDocumentRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying previous document:', error);
      }
      pdfDocumentRef.current = null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
        // Get simple loading options
      const loadingOptions = getSimpleLoadingOptions(new Uint8Array(arrayBuffer), pdfPassword);
      
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
      };
      
      // Get the PDF document
      const pdfDocument = await loadingTask.promise;
      
      if (!isMountedRef.current) {
        try {
          pdfDocument.destroy();
        } catch (error) {
          console.warn('Error destroying document after unmount:', error);
        }
        return;
      }
      
      pdfDocumentRef.current = pdfDocument;
      
      // Get page count and render the first page
      const pageCount = pdfDocument.numPages;
      setNumPages(pageCount);
      setCurrentPage(Math.min(page, pageCount));
        // Render the page
      const pageObj = await pdfDocument.getPage(Math.min(page, pageCount));
      
      // Render page inline to avoid dependency issues
      if (canvasRef.current && isMountedRef.current) {
        try {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Canvas context could not be created');
          }
          
          const viewport = pageObj.getViewport({ scale });
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          await pageObj.render(renderContext).promise;
          
          if (isMountedRef.current) {
            setLoading(false);
          }
        } catch (renderError) {
          if (isMountedRef.current) {
            console.error('Error rendering PDF page:', renderError);
            setLoading(false);
            const error = renderError as Error;
            setError({ message: error.message || 'Failed to render PDF page', code: 'RENDER_ERROR' });
            if (onError) {
              onError(error, 'RENDER_ERROR');
            }
          }
        }
      }
      
      if (onLoadComplete && isMountedRef.current) {
        onLoadComplete(pageCount);
      }
      
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error('Error loading PDF:', err);
      setLoading(false);
      
      const error = err as Error;
      const errorCode = error.message?.includes('password') ? 'PASSWORD_ERROR' : 'LOADING_ERROR';
      
      setError({ message: error.message || 'Failed to load PDF', code: errorCode });      if (onError && isMountedRef.current) {
        onError(error, errorCode);
      }
    }
  }, [file, page, scale, onLoadComplete, onError]);
  
  // Load and render PDF when file changes
  useEffect(() => {
    if (!file) {
      setLoading(false);
      return;
    }
    
    loadPdf();
  }, [file, renderAttempts, loadPdf]);
  
  // Handle password changes for password-protected PDFs
  useEffect(() => {
    if (password && isPasswordProtected && !passwordAttempted) {
      setPasswordAttempted(true);
      loadPdf(password);
    }
  }, [password, isPasswordProtected, passwordAttempted, loadPdf]);
  
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
          {allowRetry && error.code !== 'WORKER_ERROR' && (
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
