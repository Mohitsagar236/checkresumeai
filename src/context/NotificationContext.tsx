/**
 * Advanced Notification System with multiple types and animations
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X, 
  Zap,
  TrendingUp,
  Download,
  Bell
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'premium' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  progress?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (title: string, message: string, options?: Partial<Notification>) => string;
  showError: (title: string, message: string, options?: Partial<Notification>) => string;
  showWarning: (title: string, message: string, options?: Partial<Notification>) => string;
  showInfo: (title: string, message: string, options?: Partial<Notification>) => string;
  showPremium: (title: string, message: string, options?: Partial<Notification>) => string;
  showAchievement: (title: string, message: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.persistent ? undefined : 5000)
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove if not persistent
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, ...options });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);

  const showPremium = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'premium', title, message, ...options });
  }, [addNotification]);

  const showAchievement = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'achievement', title, message, ...options });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showPremium,
        showAchievement
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ 
  notification, 
  onRemove 
}: { 
  notification: Notification; 
  onRemove: (id: string) => void;
}) {
  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          iconClass: 'text-green-600 dark:text-green-400',
          Icon: CheckCircle
        };
      case 'error':
        return {
          bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconClass: 'text-red-600 dark:text-red-400',
          Icon: XCircle
        };
      case 'warning':
        return {
          bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          iconClass: 'text-amber-600 dark:text-amber-400',
          Icon: AlertCircle
        };
      case 'info':
        return {
          bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconClass: 'text-blue-600 dark:text-blue-400',
          Icon: Info
        };
      case 'premium':
        return {
          bgClass: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800',
          iconClass: 'text-amber-600 dark:text-amber-400',
          Icon: Zap
        };
      case 'achievement':
        return {
          bgClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
          iconClass: 'text-purple-600 dark:text-purple-400',
          Icon: TrendingUp
        };
      default:
        return {
          bgClass: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          iconClass: 'text-gray-600 dark:text-gray-400',
          Icon: Bell
        };
    }
  };

  const { bgClass, iconClass, Icon } = getNotificationStyles(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative p-4 rounded-lg border shadow-lg backdrop-blur-sm ${bgClass}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          
          {notification.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{notification.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-600 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${notification.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Auto-dismiss progress bar */}
      {!notification.persistent && notification.duration && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gray-300 dark:bg-gray-600 rounded-bl-lg"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: notification.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Predefined notification templates
export const NotificationTemplates = {
  resumeAnalysisComplete: (score: number) => ({
    type: 'success' as const,
    title: 'Analysis Complete!',
    message: `Your resume scored ${score}% - check out the detailed insights.`,
    action: {
      label: 'View Results',
      onClick: () => window.location.href = '/results'
    }
  }),

  premiumUpgrade: () => ({
    type: 'premium' as const,
    title: 'Upgrade to Premium',
    message: 'Unlock advanced analytics and real-time feedback.',
    action: {
      label: 'Upgrade Now',
      onClick: () => window.location.href = '/pricing'
    },
    persistent: true
  }),

  achievementUnlocked: (achievement: string) => ({
    type: 'achievement' as const,
    title: 'Achievement Unlocked!',
    message: achievement,
    duration: 8000
  }),

  uploadProgress: (progress: number) => ({
    type: 'info' as const,
    title: 'Uploading Resume',
    message: 'Please wait while we process your file...',
    progress,
    persistent: true
  }),

  errorOccurred: (error: string) => ({
    type: 'error' as const,
    title: 'Something went wrong',
    message: error,
    duration: 7000
  })
};
