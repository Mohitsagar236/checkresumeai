import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// Import main CSS files
import './index.css';
// Import performance monitoring utilities
import { performanceMonitor, preloadCriticalResources } from './utils/bundleOptimization.tsx';

// Start timing immediately to ensure it's always available before endTiming is called
performanceMonitor.startTiming('app-initialization');

// Initialize production error handling inline to avoid import issues
const initProductionErrorHandling = () => {
  if (typeof window === 'undefined') return;
  
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
    
    if (import.meta.env.PROD) {
      console.error('Production Promise Rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    }
  });

  // Catch global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
};

// Initialize error handling first
initProductionErrorHandling();

// Initialize performance monitoring using requestIdleCallback to avoid blocking
const initializePerformanceMonitoring = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Additional initialization can go here if needed
      console.log('Performance monitoring initialized');
    });
  } else {
    setTimeout(() => {
      console.log('Performance monitoring initialized');
    }, 0);
  }
};

// Preload critical resources using requestIdleCallback for better performance
const initializeResourcePreloading = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadCriticalResources();
    }, { timeout: 1000 });
  } else {
    setTimeout(() => {
      preloadCriticalResources();
    }, 50);
  }
};

// Initialize both functions
initializePerformanceMonitoring();
initializeResourcePreloading();

// Monitor Web Vitals and log metrics in development
if (import.meta.env.DEV) {
  // Use requestIdleCallback for better performance
  const scheduleMetricsLogging = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const metrics = performanceMonitor.getMetrics();
        console.log('Performance Metrics:', metrics);
        performanceMonitor.endTiming('app-initialization');
      }, { timeout: 3000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
        console.log('Performance Metrics:', metrics);
        performanceMonitor.endTiming('app-initialization');
      }, 1000);
    }
  };

  window.addEventListener('load', scheduleMetricsLogging);

  // Monitor long tasks with better debouncing and reduced threshold
  if ('PerformanceObserver' in window) {
    let longTaskTimeout: number;
    const observer = new PerformanceObserver((list) => {
      clearTimeout(longTaskTimeout);
      longTaskTimeout = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            for (const entry of list.getEntries()) {
              // Only log tasks longer than 50ms and batch them to reduce console spam
              if (entry.duration > 50) {
                console.log(`Long task: ${entry.duration.toFixed(2)}ms`);
              }
            }
          });
        }
      }, 200); // Increased debounce time
    });
    
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      console.log('Long task monitoring not supported');
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
