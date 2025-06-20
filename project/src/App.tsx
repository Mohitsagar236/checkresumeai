import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { NotificationProvider } from './context/NotificationContext';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { StructuredData } from './components/StructuredData';
import { initializeSimpleWorker } from './utils/pdf-worker-simple';
import { initPdfErrorMonitoring } from './utils/pdf-error-monitor';
import { runFixValidation } from './utils/fix-validator';
import { initializeAllAnalytics } from './utils/analytics';
import { useCoreWebVitals } from './hooks/useSEO';

function App() {
  // Initialize Core Web Vitals monitoring for SEO
  useCoreWebVitals();

  useEffect(() => {
    // Initialize analytics and SEO tracking
    initializeAllAnalytics();

    // Initialize PDF worker and error monitoring
    const setupPdfWorker = async () => {
      try {
        // Initialize PDF error monitoring first
        initPdfErrorMonitoring();

        // Initialize PDF worker with enhanced callback handling
        await initializeSimpleWorker();
        console.log('Enhanced PDF.js worker initialized successfully');

        // Run fix validation in development mode
        if (import.meta.env.DEV) {
          runFixValidation().catch(console.error);
        }        // Install a global error listener for PDF.js-related errors and Chrome extension warnings
        const originalOnError = window.onerror;
        window.onerror = function (
          message: string | Event,
          source?: string,
          lineno?: number,
          colno?: number,
          error?: Error
        ) {
          const errorMsg = message?.toString() || '';
          if (
            errorMsg.includes('Receiving end does not exist') ||
            errorMsg.includes('Could not establish connection') ||
            errorMsg.includes('runtime.lastError') ||
            errorMsg.includes('Extension context invalidated') ||
            (source && source.includes('pdf.worker'))
          ) {
            // Suppress Chrome extension and PDF worker errors in production
            if (import.meta.env.PROD) {
              return true; // Silently suppress in production
            }
            console.warn('🔧 Suppressed Chrome extension/PDF worker error (this is normal):', errorMsg);
            
            // Only attempt PDF worker recovery for PDF-related errors
            if (errorMsg.includes('pdf') || (source && source.includes('pdf.worker'))) {
              try {
                initializeSimpleWorker().catch(console.error);
              } catch (e) {
                console.error('Worker recovery failed:', e);
              }
            }
            return true; // Prevent error propagation
          }
          // Call original error handler if it exists
          if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
          }
          return false;
        };
      } catch (err) {
        console.error('Failed to initialize PDF.js worker:', err);
      }
    };

    setupPdfWorker();
  }, []);  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            <NotificationProvider>
              <AuthProvider>
                <SubscriptionProvider>
                  <AccessibilityProvider>
                    {/* Global Structured Data for SEO */}
                    <StructuredData type="website" />
                    <RouterProvider router={router} />
                  </AccessibilityProvider>
                </SubscriptionProvider>
              </AuthProvider>
            </NotificationProvider>
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
