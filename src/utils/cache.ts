/**
 * API Response Caching Utility
 * 
 * This utility provides caching functionality for expensive API operations
 * to improve performance and reduce API calls.
 */

// Define types for cache entries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  // Cache duration in milliseconds (default: 1 hour)
  defaultTTL: number;
  
  // Maximum number of entries in the cache (default: 50)
  maxEntries: number;
  
  // Whether to enable cache in development mode (default: true)
  enableInDev: boolean;
  
  // Whether to log cache operations (default: false)
  debug: boolean;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  
  constructor(config?: Partial<CacheConfig>) {
    // Default cache configuration
    this.config = {
      defaultTTL: 60 * 60 * 1000, // 1 hour
      maxEntries: 50,
      enableInDev: true,
      debug: false,
      ...config
    };
    
    // Log cache creation if debug is enabled
    this.logDebug('API Cache initialized', this.config);
  }
  
  /**
   * Get data from cache if available, otherwise fetch using the provided function
   * and cache the result
   */
  async get<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options?: { ttl?: number; skipCache?: boolean }
  ): Promise<T> {
    const { ttl = this.config.defaultTTL, skipCache = false } = options || {};
    
    // Skip cache in production mode if disabled
    if (!this.isCacheEnabled() || skipCache) {
      const data = await fetchFunction();
      this.logDebug(`Cache bypassed for key: ${key}`);
      return data;
    }
    
    // Check if data is in cache and not expired
    const cachedData = this.cache.get(key);
    const now = Date.now();
    
    if (cachedData && cachedData.expiresAt > now) {
      this.logDebug(`Cache HIT for key: ${key}`);
      return cachedData.data as T;
    }
    
    // If not in cache or expired, fetch new data
    this.logDebug(`Cache MISS for key: ${key}`);
    const data = await fetchFunction();
    
    // Store in cache
    this.set(key, data, ttl);
    
    return data;
  }
  
  /**
   * Store data in cache with expiration
   */
  set<T>(key: string, data: T, ttl = this.config.defaultTTL): void {
    // Ensure cache is enabled
    if (!this.isCacheEnabled()) return;
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxEntries) {
      this.removeOldestEntry();
    }
    
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
    
    this.logDebug(`Cached data for key: ${key} (expires in ${ttl / 1000}s)`);
  }
  
  /**
   * Clear the entire cache or a specific key
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
      this.logDebug(`Cleared cache for key: ${key}`);
    } else {
      this.cache.clear();
      this.logDebug('Cleared entire cache');
    }
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    if (!this.isCacheEnabled()) return false;
    
    const cachedData = this.cache.get(key);
    if (!cachedData) return false;
    
    return cachedData.expiresAt > Date.now();
  }
  
  /**
   * Get stats about the cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
  
  /**
   * Remove expired entries from the cache
   */
  cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      this.logDebug(`Removed ${expiredCount} expired entries from cache`);
    }
  }
  
  /**
   * Check if caching is enabled based on environment
   */
  private isCacheEnabled(): boolean {
    // In development, check the config
    if (import.meta.env.DEV) {
      return this.config.enableInDev;
    }
    
    // Always enable in production
    return true;
  }
  
  /**
   * Remove the oldest entry from the cache
   */
  private removeOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestKey = key;
        oldestTimestamp = entry.timestamp;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.logDebug(`Removed oldest entry from cache: ${oldestKey}`);
    }
  }
  
  /**
   * Log debug messages if debug is enabled
   */
  private logDebug(message: string, data?: any): void {
    if (!this.config.debug) return;
    
    if (data) {
      console.log(`[ApiCache] ${message}`, data);
    } else {
      console.log(`[ApiCache] ${message}`);
    }
  }
}

// Create a singleton instance
export const apiCache = new ApiCache({
  debug: import.meta.env.DEV,
  // Enable more verbose debugging in development
  enableInDev: true
});

// Helper function to create a cache key from function arguments
export function createCacheKey(prefix: string, ...args: any[]): string {
  const serializedArgs = args.map(arg => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }
    return String(arg);
  }).join(':');
  
  return `${prefix}:${serializedArgs}`;
}

export default apiCache;
