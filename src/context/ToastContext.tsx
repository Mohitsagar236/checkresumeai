import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextId, setNextId] = useState(1);

  const addToast = (message: string, type: ToastType = 'info') => {
    const toast: Toast = {
      id: nextId,
      message,
      type,
    };
    setToasts(prev => [...prev, toast]);
    setNextId(prev => prev + 1);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Attach the addToast function to the window object for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any)._showToast = addToast;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any)._showToast;
      }
    };
  }, []);
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast notifications container */}      <div className="fixed right-4 top-[calc(100vh-6rem)] z-50">
        <div className="space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 backdrop-blur-sm ${
                toast.type === 'success'
                  ? 'bg-green-500/90 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-500/90 text-white'
                  : toast.type === 'warning'
                  ? 'bg-yellow-500/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}
              role="alert"
            >
              <div className="flex">
                <div className="flex-1">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    showToast: context.addToast,
    toasts: context.toasts,
    removeToast: context.removeToast,
  };
}