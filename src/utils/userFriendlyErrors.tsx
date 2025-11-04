/**
 * User-Friendly Error Message System
 * Provides contextual, helpful error messages to users
 */

import React from 'react';
import { AlertCircle, RefreshCw, Mail, Home, ExternalLink } from 'lucide-react';

export interface UserError {
  code: string;
  title: string;
  message: string;
  suggestion?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  supportInfo?: {
    email?: string;
    docs?: string;
  };
}

// Error code mappings for user-friendly messages
export const ERROR_MESSAGES: Record<string, Omit<UserError, 'code'>> = {
  // Authentication Errors
  AUTH_FAILED: {
    title: 'Sign In Failed',
    message: 'We couldn\'t sign you in with the provided credentials.',
    suggestion: 'Please check your email and password, or try signing in with Google.',
    supportInfo: {
      docs: '/help/authentication'
    }
  },
  
  AUTH_SESSION_EXPIRED: {
    title: 'Session Expired',
    message: 'Your session has expired for security reasons.',
    suggestion: 'Please sign in again to continue using the service.',
  },
  
  AUTH_EMAIL_NOT_VERIFIED: {
    title: 'Email Not Verified',
    message: 'Please verify your email address to continue.',
    suggestion: 'Check your inbox for a verification email, or request a new one.',
  },

  // PDF Processing Errors
  PDF_UPLOAD_FAILED: {
    title: 'Upload Failed',
    message: 'We couldn\'t process your resume file.',
    suggestion: 'Please ensure your file is a valid PDF under 10MB and try again.',
  },
  
  PDF_PARSING_ERROR: {
    title: 'Resume Analysis Failed',
    message: 'We encountered an issue while analyzing your resume.',
    suggestion: 'Try uploading a different version of your resume or contact support.',
    supportInfo: {
      email: 'support@checkresumeai.com'
    }
  },
  
  PDF_PASSWORD_PROTECTED: {
    title: 'Password Protected PDF',
    message: 'Your PDF is password protected.',
    suggestion: 'Please remove the password protection or provide the password to continue.',
  },

  // Network Errors
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'We\'re having trouble connecting to our servers.',
    suggestion: 'Please check your internet connection and try again.',
  },
  
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Our servers are experiencing issues.',
    suggestion: 'We\'re working to fix this. Please try again in a few minutes.',
    supportInfo: {
      email: 'support@checkresumeai.com'
    }
  },

  // Payment Errors
  PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: 'We couldn\'t process your payment.',
    suggestion: 'Please check your payment information and try again, or contact your bank.',
    supportInfo: {
      email: 'billing@checkresumeai.com'
    }
  },
  
  SUBSCRIPTION_EXPIRED: {
    title: 'Subscription Expired',
    message: 'Your premium subscription has expired.',
    suggestion: 'Renew your subscription to continue using premium features.',
  },

  // File Errors
  FILE_TOO_LARGE: {
    title: 'File Too Large',
    message: 'Your file exceeds the maximum size limit.',
    suggestion: 'Please upload a file smaller than 10MB.',
  },
  
  UNSUPPORTED_FILE_TYPE: {
    title: 'Unsupported File Type',
    message: 'This file type is not supported.',
    suggestion: 'Please upload a PDF file containing your resume.',
  },

  // Generic Errors
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    suggestion: 'Please try again or contact support if the problem persists.',
    supportInfo: {
      email: 'support@checkresumeai.com'
    }
  },
};

// Error message component
export const UserErrorMessage: React.FC<{
  error: UserError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}> = ({ error, onRetry, onDismiss, className = '' }) => {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {error.title}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {error.message}
          </p>
          {error.suggestion && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
              💡 {error.suggestion}
            </p>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </button>
            )}
            
            {error.action && (
              <button
                onClick={error.action.onClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {error.action.label}
              </button>
            )}
            
            {error.supportInfo?.email && (
              <a
                href={`mailto:${error.supportInfo.email}?subject=Error Report: ${error.code}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Mail className="h-3 w-3 mr-1" />
                Contact Support
              </a>
            )}
            
            {error.supportInfo?.docs && (
              <a
                href={error.supportInfo.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Learn More
              </a>
            )}
            
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Home className="h-3 w-3 mr-1" />
              Go Home
            </button>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for user-friendly error handling
export const useUserFriendlyError = () => {
  const createUserError = (
    errorCode: string,
    _originalError?: Error,
    customMessage?: Partial<UserError>
  ): UserError => {
    const baseError = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
    
    return {
      code: errorCode,
      ...baseError,
      ...customMessage,
    };
  };

  const handleError = (
    error: Error | string,
    _context?: string,
    customAction?: UserError['action']
  ): UserError => {
    const errorString = typeof error === 'string' ? error : error.message;
    
    // Map common error patterns to user-friendly codes
    let errorCode = 'UNKNOWN_ERROR';
    
    if (errorString.includes('network') || errorString.includes('fetch')) {
      errorCode = 'NETWORK_ERROR';
    } else if (errorString.includes('auth') || errorString.includes('unauthorized')) {
      errorCode = 'AUTH_FAILED';
    } else if (errorString.includes('pdf') || errorString.includes('file')) {
      errorCode = 'PDF_PARSING_ERROR';
    } else if (errorString.includes('payment') || errorString.includes('subscription')) {
      errorCode = 'PAYMENT_FAILED';
    } else if (errorString.includes('server') || errorString.includes('500')) {
      errorCode = 'SERVER_ERROR';
    }

    return createUserError(errorCode, typeof error === 'object' ? error : undefined, {
      action: customAction,
    });
  };

  return {
    createUserError,
    handleError,
  };
};

// Error toast notification system
export const showErrorToast = (error: UserError, _duration = 5000) => {
  // This would integrate with your toast system
  console.error('User Error:', error);
  
  // For now, we'll create a simple toast
  if (typeof window !== 'undefined' && 'Notification' in window) {
    new Notification(error.title, {
      body: error.message,
      icon: '/favicon.ico',
    });
  }
};

// Error boundary integration
export const createErrorBoundaryFallback = (errorCode: string) => {
  return (_error: Error, _errorInfo: React.ErrorInfo) => {
    const userError = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
    
    return (
      <UserErrorMessage
        error={{
          code: errorCode,
          ...userError,
        }}
        onRetry={() => window.location.reload()}
        className="m-4"
      />
    );
  };
};

export default {
  ERROR_MESSAGES,
  UserErrorMessage,
  useUserFriendlyError,
  showErrorToast,
  createErrorBoundaryFallback,
};
