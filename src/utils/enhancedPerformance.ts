/**
 * Enhanced Performance Monitoring
 * Provides detailed performance insights and optimizations
 */

import { PerformanceMonitor } from './bundleOptimization.tsx';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  bundleSize?: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

class EnhancedPerformanceMonitor extends PerformanceMonitor {
  private static enhancedInstance: EnhancedPerformanceMonitor;
  private resourceTimings: ResourceTiming[] = [];
  private userInteractions: { type: string; timestamp: number; duration?: number }[] = [];

  static getInstance(): EnhancedPerformanceMonitor {
    if (!EnhancedPerformanceMonitor.enhancedInstance) {
      EnhancedPerformanceMonitor.enhancedInstance = new EnhancedPerformanceMonitor();
    }
    return EnhancedPerformanceMonitor.enhancedInstance;
  }

  // Enhanced metrics collection
  collectAllMetrics(): PerformanceMetrics {
    const baseMetrics = this.getMetrics();
    return {
      ...baseMetrics,
      fcp: this.getFirstContentfulPaint(),
      ttfb: this.getTimeToFirstByte(),
    };
  }

  // Web Vitals implementation
  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByType('paint') as PerformanceEntry[];
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry?.startTime || 0;
  }

  private getTimeToFirstByte(): number {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigationEntry = entries[0];
    return navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;
  }

  // Resource performance tracking
  trackResourceLoading(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.resourceTimings.push({
            name: resourceEntry.name,
            duration: resourceEntry.duration,
            size: resourceEntry.transferSize || 0,
            type: this.getResourceType(resourceEntry.name),
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  // User interaction tracking
  trackUserInteractions(): void {
    const interactions = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactions.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.userInteractions.push({
          type: eventType,
          timestamp: performance.now(),
        });
      }, { passive: true });
    });
  }

  // Performance recommendations
  getPerformanceRecommendations(): string[] {
    const metrics = this.collectAllMetrics();
    const recommendations: string[] = [];

    // Bundle size recommendations
    if (metrics.bundleSize && metrics.bundleSize > 500000) { // 500KB
      recommendations.push('Consider code splitting - bundle size is larger than recommended');
    }

    // Memory usage recommendations
    if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > 50000000) { // 50MB
      recommendations.push('High memory usage detected - check for memory leaks');
    }

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > 2500) { // 2.5s
      recommendations.push('Largest Contentful Paint is slow - optimize critical resources');
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > 100) { // 100ms
      recommendations.push('First Input Delay is high - reduce JavaScript execution time');
    }

    // CLS recommendations
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Cumulative Layout Shift is high - avoid layout shifts');
    }

    // Resource recommendations
    const slowResources = this.resourceTimings.filter(r => r.duration > 1000);
    if (slowResources.length > 0) {
      recommendations.push(`${slowResources.length} slow resources detected - consider optimization`);
    }

    return recommendations;
  }

  // Resource optimization insights
  getResourceInsights(): { slow: ResourceTiming[]; large: ResourceTiming[]; total: number } {
    const slow = this.resourceTimings.filter(r => r.duration > 1000);
    const large = this.resourceTimings.filter(r => r.size > 100000); // 100KB
    
    return {
      slow,
      large,
      total: this.resourceTimings.length,
    };
  }

  // Performance score calculation
  calculatePerformanceScore(): number {
    const metrics = this.collectAllMetrics();
    let score = 100;

    // Deduct points based on metrics
    if (metrics.lcp && metrics.lcp > 2500) score -= 20;
    if (metrics.fid && metrics.fid > 100) score -= 15;
    if (metrics.cls && metrics.cls > 0.1) score -= 15;
    if (metrics.fcp && metrics.fcp > 1800) score -= 10;
    if (metrics.ttfb && metrics.ttfb > 600) score -= 10;

    // Bundle size penalty
    if (metrics.bundleSize && metrics.bundleSize > 500000) score -= 15;

    // Memory usage penalty
    if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > 50000000) score -= 15;

    return Math.max(0, score);
  }

  // Export performance report
  exportPerformanceReport(): {
    score: number;
    metrics: PerformanceMetrics;
    recommendations: string[];
    resources: { slow: ResourceTiming[]; large: ResourceTiming[]; total: number };
    timestamp: string;
  } {
    return {
      score: this.calculatePerformanceScore(),
      metrics: this.collectAllMetrics(),
      recommendations: this.getPerformanceRecommendations(),
      resources: this.getResourceInsights(),
      timestamp: new Date().toISOString(),
    };
  }

  // Helper methods
  private getResourceType(url: string): string {
    if (url.includes('.js') || url.includes('.mjs')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp')) return 'image';
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  // Start comprehensive monitoring
  startComprehensiveMonitoring(): void {
    this.trackResourceLoading();
    this.trackUserInteractions();
    
    // Log performance report every 30 seconds in development
    if (import.meta.env.DEV) {
      setInterval(() => {
        const report = this.exportPerformanceReport();
        if (report.score < 80) {
          console.warn('Performance Report:', report);
        }
      }, 30000);
    }
  }
}

// Export singleton instance
export const enhancedPerformanceMonitor = EnhancedPerformanceMonitor.getInstance();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  enhancedPerformanceMonitor.startComprehensiveMonitoring();
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function for performance optimization
  debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // Throttle function for performance optimization
  throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    }) as T;
  },

  // Optimize images for better performance
  optimizeImage(src: string, quality = 0.8): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const optimized = canvas.toDataURL('image/jpeg', quality);
        resolve(optimized);
      };
      img.src = src;
    });
  },

  // Memory cleanup utility
  cleanupMemory(): void {
    // Force garbage collection if available (Chrome DevTools)
    if ('gc' in window && typeof (window as unknown as { gc: () => void }).gc === 'function') {
      (window as unknown as { gc: () => void }).gc();
    }
  },
};

export default EnhancedPerformanceMonitor;
