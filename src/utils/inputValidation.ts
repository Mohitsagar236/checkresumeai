/**
 * Enhanced Input Validation and Security Utilities
 * Provides comprehensive validation for forms and file uploads
 */

// File validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
} as const;

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Common validation functions
export const validators = {
  email: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push('Please enter a valid email address');
    } else if (value.length > 254) {
      errors.push('Email is too long');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  password: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Password is required');
    } else {
      if (value.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (value.length > 128) {
        errors.push('Password is too long');
      }
      if (!/[A-Z]/.test(value)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(value)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        errors.push('Password must contain at least one special character');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  name: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Name is required');
    } else if (value.length > 100) {
      errors.push('Name is too long');
    } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  phoneNumber: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (value && !/^\+?[\d\s-()]+$/.test(value)) {
      errors.push('Please enter a valid phone number');
    } else if (value && value.length < 10) {
      errors.push('Phone number is too short');
    } else if (value && value.length > 20) {
      errors.push('Phone number is too long');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  url: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (value && !/^https?:\/\/.+\..+/.test(value)) {
      errors.push('Please enter a valid URL');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  required: (value: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!value || value.trim().length === 0) {
      errors.push('This field is required');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  maxLength: (value: string, max: number): ValidationResult => {
    const errors: string[] = [];
    
    if (value && value.length > max) {
      errors.push(`Must be ${max} characters or less`);
    }
    
    return { isValid: errors.length === 0, errors };
  },
};

// File validation function
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  // Check file size
  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    errors.push(`File size must be less than ${FILE_VALIDATION.MAX_SIZE / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type as 'application/pdf')) {
    errors.push('Only PDF files are allowed');
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_VALIDATION.ALLOWED_EXTENSIONS.includes(fileExtension as '.pdf')) {
    errors.push('File must have a .pdf extension');
  }

  // Check for potentially malicious file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('File name contains invalid characters');
  }

  // Check file name length
  if (file.name.length > 255) {
    errors.push('File name is too long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize input function
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};

// Rate limiting for client-side operations
export class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  getRemainingTime(key: string, windowMs: number): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeElapsed = Date.now() - oldestAttempt;
    
    return Math.max(0, windowMs - timeElapsed);
  }
}

// Form validation hook
export const useFormValidation = () => {
  const validateField = (type: string, value: string, options?: unknown): string | null => {
    if (type === 'email') {
      const result = validators.email(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'password') {
      const result = validators.password(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'name') {
      const result = validators.name(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'phoneNumber') {
      const result = validators.phoneNumber(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'url') {
      const result = validators.url(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'required') {
      const result = validators.required(value);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    } else if (type === 'maxLength' && typeof options === 'number') {
      const result = validators.maxLength(value, options);
      return result.isValid ? null : result.errors[0] || 'Invalid input';
    }
    
    return null;
  };

  const validateForm = (fields: Record<string, { value: string; type: string; options?: unknown }>): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};
    
    Object.entries(fields).forEach(([fieldName, { value, type, options }]) => {
      const error = validateField(type, value, options);
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    validateField,
    validateForm,
  };
};

// Security utilities
export const securityUtils = {
  // Generate a secure random string
  generateSecureToken: (length = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const randomArray = new Uint8Array(length);
      window.crypto.getRandomValues(randomArray);
      
      for (let i = 0; i < length; i++) {
        result += chars[randomArray[i] % chars.length];
      }
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  },

  // Check if URL is safe for redirects
  isSafeRedirectUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      
      // Only allow same-origin redirects or specific trusted domains
      const trustedDomains = [
        window.location.origin,
        'https://checkresumeai.com',
        'https://www.checkresumeai.com',
      ];
      
      return trustedDomains.some(domain => parsedUrl.origin === domain);
    } catch {
      return false;
    }
  },

  // Escape HTML to prevent XSS
  escapeHtml: (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Validate and sanitize file content
  validateFileContent: async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    try {
      // Read first few bytes to check for PDF signature
      const firstBytes = await file.slice(0, 8).arrayBuffer();
      const bytes = new Uint8Array(firstBytes);
      
      // PDF files should start with %PDF
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
      const startsWithPdf = pdfSignature.every((byte, index) => bytes[index] === byte);
      
      if (!startsWithPdf) {
        return { isValid: false, error: 'File does not appear to be a valid PDF' };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Failed to validate file content' };
    }
  },
};

// Create rate limiter instances for different operations
export const rateLimiters = {
  fileUpload: new ClientRateLimiter(),
  apiRequest: new ClientRateLimiter(),
  formSubmission: new ClientRateLimiter(),
};

export default {
  validators,
  validateFile,
  sanitizeInput,
  ClientRateLimiter,
  useFormValidation,
  securityUtils,
  rateLimiters,
};
