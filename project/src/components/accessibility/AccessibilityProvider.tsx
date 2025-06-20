/**
 * Advanced Accessibility Features
 * Implements WCAG 2.1 AA compliance and enhanced keyboard navigation
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (selector: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage or detect system preferences
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      fontSize: 'medium',
      screenReader: false,
      keyboardNavigation: true
    };
  });

  const announcementRef = useRef<HTMLDivElement>(null);

  // Update CSS variables when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize]);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        announceToScreenReader,
        focusElement
      }}
    >
      {children}
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <SkipLinks />
      <KeyboardNavigationHelper />
    </AccessibilityContext.Provider>
  );
}

// Skip links for keyboard navigation
function SkipLinks() {
  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Keyboard navigation helper
function KeyboardNavigationHelper() {
  const { settings } = useAccessibility();
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show focus indicators when Tab is pressed
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }

      // Hide focus indicators on mouse interaction
      const handleMouseDown = () => setFocusVisible(false);
      document.addEventListener('mousedown', handleMouseDown, { once: true });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings.keyboardNavigation]);

  useEffect(() => {
    if (focusVisible) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
  }, [focusVisible]);

  return null;
}

// Accessible button component
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { settings, announceToScreenReader } = useAccessibility();

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
      // Announce action for screen readers
      if (settings.screenReader && ariaLabel) {
        announceToScreenReader(`${ariaLabel} activated`);
      }
    }
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      whileHover={!disabled && !settings.reducedMotion ? { scale: 1.02 } : {}}
      whileTap={!disabled && !settings.reducedMotion ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Accessible form input
export function AccessibleInput({
  label,
  error,
  required = false,
  type = 'text',
  id,
  className = '',
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
  id?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={`
          block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-700 dark:text-white
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible modal
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { settings, announceToScreenReader } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Announce modal opening
      announceToScreenReader(`${title} dialog opened`);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announceToScreenReader]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={settings.reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={settings.reducedMotion ? {} : { opacity: 1, scale: 1 }}
        exit={settings.reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {title}
          </h2>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Hook for using accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Accessibility settings panel
export function AccessibilitySettings() {
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="text-lg font-semibold">Accessibility Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            className="mr-2"
          />
          Reduce motion
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSettings({ highContrast: e.target.checked })}
            className="mr-2"
          />
          High contrast
        </label>
        
        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="x-large">Extra Large</option>
          </select>
        </div>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.screenReader}
            onChange={(e) => updateSettings({ screenReader: e.target.checked })}
            className="mr-2"
          />
          Screen reader announcements
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.keyboardNavigation}
            onChange={(e) => updateSettings({ keyboardNavigation: e.target.checked })}
            className="mr-2"
          />
          Enhanced keyboard navigation
        </label>
      </div>
    </div>
  );
}
