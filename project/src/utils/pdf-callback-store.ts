/**
 * Centralized callback store for PDF.js message handling
 * Helps prevent "Cannot resolve callback" errors
 */

interface StoredCallback {
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
  name?: string;
  timestamp: number;
}

class PdfCallbackStore {
  private static instance: PdfCallbackStore;
  private callbacks: Map<number, StoredCallback> = new Map();
  private readonly CALLBACK_TIMEOUT = 30000; // 30 seconds

  private constructor() {
    // Start periodic cleanup of stale callbacks
    setInterval(() => this.cleanupStaleCallbacks(), 60000);
  }

  static getInstance(): PdfCallbackStore {
    if (!PdfCallbackStore.instance) {
      PdfCallbackStore.instance = new PdfCallbackStore();
    }
    return PdfCallbackStore.instance;
  }

  clear(): void {
    this.callbacks.clear();
  }

  storeCallback(id: number, callback: Omit<StoredCallback, 'timestamp'>): void {
    this.callbacks.set(id, {
      ...callback,
      timestamp: Date.now()
    });
  }

  getCallback(id: number): StoredCallback | undefined {
    return this.callbacks.get(id);
  }

  resolveCallback(id: number, data: unknown): boolean {
    const callback = this.callbacks.get(id);
    if (callback) {
      callback.resolve(data);
      this.callbacks.delete(id);
      return true;
    }
    return false;
  }

  rejectCallback(id: number, error: unknown): boolean {
    const callback = this.callbacks.get(id);
    if (callback) {
      callback.reject(error);
      this.callbacks.delete(id);
      return true;
    }
    return false;
  }

  private cleanupStaleCallbacks(): void {
    const now = Date.now();
    for (const [id, callback] of this.callbacks.entries()) {
      if (now - callback.timestamp > this.CALLBACK_TIMEOUT) {
        callback.reject(new Error('Callback timed out'));
        this.callbacks.delete(id);
      }
    }
  }
}

export const callbackStore = PdfCallbackStore.getInstance();
