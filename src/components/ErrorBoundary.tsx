import React from 'react';

// Simple error page component
const ErrorPage: React.FC<{
  error: Error | null;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Oops!</h1>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          Sorry, an unexpected error has occurred.
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {error?.message || "Something went wrong"}
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
        <a
          href="/"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go back home
        </a>
      </div>
    </div>
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo): void => {
    // Enhanced error logging for production
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(), // Add user context if available
    };
    
    console.error('Production Error Report:', errorReport);
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // this.sendToErrorTrackingService(errorReport);
  };

  private getCurrentUserId = (): string | null => {
    // Get user ID from auth context or localStorage if available
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user?.id || null;
    } catch {
      return null;
    }
  };

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorPage
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}
