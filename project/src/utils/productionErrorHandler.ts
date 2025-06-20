// Production Error Handler for Vercel Deployment
// This helps catch and handle errors that cause blank screens

export const initProductionErrorHandling = () => {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default handling (which would log to console)
    event.preventDefault();
    
    // Log to your error reporting service
    if (import.meta.env.PROD) {
      console.error('Production Promise Rejection:', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  });

  // Catch global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });

    // Log to your error reporting service
    if (import.meta.env.PROD) {
      console.error('Production JS Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  });

  // Check for common deployment issues
  const checkDeploymentHealth = () => {
    // Check if critical elements exist
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Critical Error: Root element not found!');
      return false;
    }

    return true;
  };

  // Run health check after a short delay
  setTimeout(() => {
    const isHealthy = checkDeploymentHealth();
    if (!isHealthy) {
      console.error('Deployment health check failed!');
      
      // Show a user-friendly error message
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center; max-width: 400px; padding: 20px;">
              <h1 style="color: #ef4444; margin-bottom: 16px;">Loading Error</h1>
              <p style="color: #6b7280; margin-bottom: 20px;">The application failed to load properly. This is usually a temporary issue.</p>
              <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">
                Refresh Page
              </button>
            </div>
          </div>
        `;
      }
    }
  }, 3000);
};

// Initialize error handling immediately
if (typeof window !== 'undefined') {
  initProductionErrorHandling();
}
