/**
 * Enhanced Error Boundary with better error handling and user experience
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log to external service
    this.logErrorToService(error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send to error tracking service like Sentry
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    }
  };

  handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    
    // Could also open email client or support form
    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`Error Details:\n${JSON.stringify(errorReport, null, 2)}`);
    window.open(`mailto:checkresmueai@gmail.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </motion.div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Our team has been notified and we're working on a fix.
            </p>

            <div className="space-y-3 mb-6">
              <Button 
                onClick={this.handleRetry}
                disabled={this.retryCount >= this.maxRetries}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {this.retryCount >= this.maxRetries ? 'Max retries reached' : 'Try Again'}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>

              <Button 
                variant="outline" 
                onClick={this.handleReportError}
                className="w-full"
              >
                <Bug className="h-4 w-4 mr-2" />
                Report Error
              </Button>
            </div>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Error Details (Dev Mode)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Error ID: {this.state.errorId}
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Handled error:', error, errorInfo);
    // Could trigger error boundary or show toast notification
  };
}
