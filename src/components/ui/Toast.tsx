import React from 'react';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// This is a function that uses the ToastContext from the application
export const toast = ({ 
  title = '',
  description = '', 
  variant = 'default'
}: ToastProps) => {
  // Directly use the existing toast context's functionality
  const type = variant === 'default' ? 'info' : 
               variant === 'success' ? 'success' : 
               variant === 'error' ? 'error' :
               variant === 'warning' ? 'warning' : 'info';
  
  // Access the window object to get the toast function that will be set in ToastContext
  if (typeof window !== 'undefined' && (window as any)._showToast) {
    (window as any)._showToast(description || title, type);
  } else {
    console.log(`Toast: ${title} - ${description} (${variant})`);
  }
  
  // Return an object that mimics a toast library's return value
  return {
    id: Date.now(),
    dismiss: () => {} // No-op
  };
};

// Toast component for direct use in components
export const Toast: React.FC<ToastProps & { onClose?: () => void }> = ({
  title,
  description,
  variant = 'default',
  onClose
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600';
      case 'error':
        return 'bg-red-500 dark:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-800 dark:bg-gray-700';
    }
  };

  return (
    <div className={`rounded-md p-4 max-w-sm w-full shadow-lg text-white ${getVariantClasses()}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
