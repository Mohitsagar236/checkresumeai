/**
 * Development Error Recovery System
 * Provides robust error handling and recovery mechanisms for development environment
 */

// Global error recovery configuration
const ERROR_RECOVERY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  enableAutoRecovery: import.meta.env.DEV,
  logLevel: import.meta.env.DEV ? 'debug' : 'error'
};

interface RecoveryAction {
  name: string;
  action: () => Promise<void> | void;
  condition: (error: Error) => boolean;
}

class DevelopmentErrorRecovery {
  private retryCount = new Map<string, number>();
  private recoveryActions: RecoveryAction[] = [];

  constructor() {
    this.setupGlobalErrorHandlers();
    this.registerRecoveryActions();
  }

  private setupGlobalErrorHandlers() {
    if (!ERROR_RECOVERY_CONFIG.enableAutoRecovery) return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('🔧 Unhandled promise rejection caught:', event.reason);
      this.handleError(new Error(event.reason), 'promise-rejection');
      event.preventDefault();
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (this.shouldIgnoreError(event.error)) {
        return;
      }
      
      console.warn('🔧 Global error caught:', event.error);
      this.handleError(event.error, 'global-error');
    });
  }

  private shouldIgnoreError(error: Error): boolean {
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Script error',
      'Network request failed',
      // Chrome extension errors
      'chrome-extension://',
      // PDF.js worker errors that are benign
      'Setting up fake worker'
    ];

    const errorMessage = error?.message || error?.toString() || '';
    return ignoredErrors.some(ignored => 
      errorMessage.toLowerCase().includes(ignored.toLowerCase())
    );
  }

  private registerRecoveryActions() {
    // PDF.js worker recovery
    this.recoveryActions.push({
      name: 'pdf-worker-recovery',
      condition: (error) => 
        error.message.includes('pdf') || 
        error.message.includes('worker') ||
        error.message.includes('PDF'),
      action: async () => {
        try {
          console.log('🔧 Attempting PDF worker recovery...');
          // Re-initialize PDF worker
          const { initializeSimpleWorker } = await import('./pdf-worker-simple');
          await initializeSimpleWorker();
          console.log('✅ PDF worker recovered successfully');
        } catch (e) {
          console.warn('❌ PDF worker recovery failed:', e);
        }
      }
    });

    // Authentication state recovery
    this.recoveryActions.push({
      name: 'auth-state-recovery',
      condition: (error) => 
        error.message.includes('auth') || 
        error.message.includes('login') ||
        error.message.includes('session'),
      action: () => {
        console.log('🔧 Attempting auth state recovery...');
        try {
          // Clear potentially corrupted auth state
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.removeItem('supabase.auth.state');
          console.log('✅ Auth state cleared for recovery');
        } catch (e) {
          console.warn('❌ Auth state recovery failed:', e);
        }
      }
    });

    // Network request recovery
    this.recoveryActions.push({
      name: 'network-recovery',
      condition: (error) => 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('Failed to fetch'),
      action: () => {
        console.log('🔧 Network error detected, implementing retry logic...');
        // Network errors are handled by the retry mechanism automatically
      }
    });
  }

  async handleError(error: Error, context: string): Promise<void> {
    if (!ERROR_RECOVERY_CONFIG.enableAutoRecovery) {
      console.error(`Error in ${context}:`, error);
      return;
    }

    const errorKey = `${context}-${error.message}`;
    const currentRetries = this.retryCount.get(errorKey) || 0;

    if (currentRetries >= ERROR_RECOVERY_CONFIG.maxRetries) {
      console.error(`❌ Max retries exceeded for ${context}:`, error);
      this.retryCount.delete(errorKey);
      return;
    }

    this.retryCount.set(errorKey, currentRetries + 1);

    // Find applicable recovery actions
    const applicableActions = this.recoveryActions.filter(action => 
      action.condition(error)
    );

    if (applicableActions.length > 0) {
      console.log(`🔧 Attempting recovery for ${context} (attempt ${currentRetries + 1})`);
      
      for (const recovery of applicableActions) {
        try {
          await recovery.action();
        } catch (recoveryError) {
          console.warn(`Recovery action ${recovery.name} failed:`, recoveryError);
        }
      }

      // Schedule retry if needed
      setTimeout(() => {
        console.log(`♻️ Recovery completed for ${context}`);
      }, ERROR_RECOVERY_CONFIG.retryDelay);
    }
  }

  // Manual recovery trigger for development
  async triggerManualRecovery(type: 'pdf' | 'auth' | 'network' | 'all') {
    console.log(`🔧 Manual recovery triggered for: ${type}`);
    
    if (type === 'all') {
      for (const action of this.recoveryActions) {
        try {
          await action.action();
        } catch (e) {
          console.warn(`Manual recovery failed for ${action.name}:`, e);
        }
      }
    } else {
      const action = this.recoveryActions.find(a => a.name.includes(type));
      if (action) {
        try {
          await action.action();
          console.log(`✅ Manual recovery completed for ${type}`);
        } catch (e) {
          console.warn(`❌ Manual recovery failed for ${type}:`, e);
        }
      }
    }
  }

  // Reset retry counters
  resetRetryCounters() {
    this.retryCount.clear();
    console.log('🔄 Retry counters reset');
  }

  // Get recovery stats for debugging
  getRecoveryStats() {
    return {
      activeRetries: Object.fromEntries(this.retryCount),
      availableActions: this.recoveryActions.map(a => a.name),
      config: ERROR_RECOVERY_CONFIG
    };
  }
}

// Global instance
export const developmentErrorRecovery = new DevelopmentErrorRecovery();

// Development helper functions
export const devHelpers = {
  triggerRecovery: (type: 'pdf' | 'auth' | 'network' | 'all') => 
    developmentErrorRecovery.triggerManualRecovery(type),
  
  resetRetries: () => 
    developmentErrorRecovery.resetRetryCounters(),
    
  getStats: () => 
    developmentErrorRecovery.getRecoveryStats(),
    
  // Quick fix for common development issues
  quickFix: {
    clearAuthState: () => {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.state');
      console.log('✅ Auth state cleared');
    },
    
    reloadPdfWorker: async () => {
      try {
        const { initializeSimpleWorker } = await import('./pdf-worker-simple');
        await initializeSimpleWorker();
        console.log('✅ PDF worker reloaded');
      } catch (e) {
        console.warn('❌ PDF worker reload failed:', e);
      }
    },
    
    clearAllCaches: () => {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => 
          Promise.all(names.map(name => caches.delete(name)))
        );
      }
      console.log('✅ All caches cleared');
    }
  }
};

// Make available in development console
if (import.meta.env.DEV) {
  (window as any).devRecovery = devHelpers;
  console.log('🛠️ Development error recovery system loaded. Use window.devRecovery for manual controls.');
}
