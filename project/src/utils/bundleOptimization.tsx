/**
 * Bundle Optimization Utilities
 * Implements code splitting, lazy loading, and tree shaking improvements
 */

import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Dynamic import wrapper with error handling
export function createLazyComponent<T extends React.ComponentType>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return function WrappedComponent(props: Record<string, unknown>) {
    const FallbackComponent = fallback || (() => (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    ));    return (
      <Suspense fallback={<FallbackComponent />}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

// Preload utilities for better performance
export const preloadComponent = (importFunc: () => Promise<{ default: React.ComponentType }>) => {
  // Start loading the component
  importFunc().catch(err => {
    console.warn('Failed to preload component:', err);
  });
};

// Route-based code splitting - removed to avoid conflicts with static imports
// The routes are already statically imported in routes.tsx
export const LazyRoutes = {
  // Note: For proper code splitting, update routes.tsx to use lazy imports instead
};

// Feature-based code splitting - removed problematic lazy components
export const LazyComponents = {
  // Note: These components use named exports, not default exports
  // They can be imported directly when needed instead of lazy loading
};

// Resource preloading for critical assets
export function preloadCriticalResources() {
  // Use requestIdleCallback to avoid blocking main thread
  const schedulePreload = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  };
  schedulePreload(() => {
    // Preload critical CSS with performance optimization
    const criticalCss = [
      '/src/index.css'
    ];

    criticalCss.forEach(href => {
      // Check if already preloaded to avoid duplicates
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
          // Convert to stylesheet after load
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      }
    });
  });

  // Font preloading handled in HTML to avoid CORS issues
  // No need to duplicate font preloading here
}

// Image optimization utilities
export function createOptimizedImage(
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    className?: string;
  } = {}
) {
  const { width, height, loading = 'lazy', className = '' } = options;

  return {
    src,
    alt,
    width,
    height,
    loading,
    className,
    // Generate srcSet for responsive images
    srcSet: width ? [
      `${src}?w=${Math.round(width * 0.5)} ${Math.round(width * 0.5)}w`,
      `${src}?w=${width} ${width}w`,
      `${src}?w=${Math.round(width * 1.5)} ${Math.round(width * 1.5)}w`,
      `${src}?w=${Math.round(width * 2)} ${Math.round(width * 2)}w`
    ].join(', ') : undefined,
    sizes: width ? `(max-width: ${width}px) 100vw, ${width}px` : undefined
  };
}

// Tree shaking helper - only import what's needed
export const OptimizedLibraries = {
  // Import only specific Lucide icons to reduce bundle size
  icons: () => import('lucide-react').then(module => ({
    CheckCircle: module.CheckCircle,
    AlertCircle: module.AlertCircle,
    User: module.User,
    FileText: module.FileText,
    Download: module.Download,
    Upload: module.Upload,
    Settings: module.Settings,
    Home: module.Home,
    BarChart: module.BarChart,
    TrendingUp: module.TrendingUp,
    Zap: module.Zap,
    Lock: module.Lock,
    Unlock: module.Unlock
  })),

  // Import only specific Framer Motion components
  motion: () => import('framer-motion').then(module => ({
    motion: module.motion,
    AnimatePresence: module.AnimatePresence,
    useAnimation: module.useAnimation,
    useInView: module.useInView
  })),

  // Import only specific Recharts components
  charts: () => import('recharts').then(module => ({
    LineChart: module.LineChart,
    Line: module.Line,
    AreaChart: module.AreaChart,
    Area: module.Area,
    BarChart: module.BarChart,
    Bar: module.Bar,
    XAxis: module.XAxis,
    YAxis: module.YAxis,
    CartesianGrid: module.CartesianGrid,
    Tooltip: module.Tooltip,
    ResponsiveContainer: module.ResponsiveContainer
  }))
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string) {
    this.metrics.set(label, performance.now());
  }  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      // Only warn in development and make it more informative
      if (import.meta.env.DEV) {
        console.warn(`⚠️ Performance Monitor: No start time found for "${label}". Make sure startTiming("${label}") was called before endTiming("${label}").`);
      }
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Only log operations longer than 16ms (one frame) to reduce noise
    // Use requestIdleCallback for logging to avoid blocking
    if (import.meta.env.DEV && duration > 16) {
      const logMessage = `✅ Performance: ${label} completed in ${duration.toFixed(2)}ms`;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => console.log(logMessage));
      } else {
        setTimeout(() => console.log(logMessage), 0);
      }
    }

    return duration;
  }measureComponentRender<T extends React.ComponentType>(
    Component: T,
    name: string
  ): T {
    return function MeasuredComponent(props: Record<string, unknown>) {
      const monitor = PerformanceMonitor.getInstance();
      
      React.useEffect(() => {
        monitor.startTiming(`${name}-render`);
        return () => {
          monitor.endTiming(`${name}-render`);
        };
      });

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      return React.createElement(Component, props as any);
    } as T;
  }
  getMetrics() {
    return {
      // Custom metrics only to avoid TypeScript issues
      bundleSize: this.getBundleSize(),
      memoryUsage: this.getMemoryUsage(),
      activeTimings: Array.from(this.metrics.keys())
    };
  }

  private getBundleSize(): number {
    try {
      // Estimate bundle size from network resources
      const resources = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
    } catch (error) {
      console.warn('Failed to get bundle size:', error);
      return 0;
    }
  }

  private getMemoryUsage(): { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } {
    try {      // Memory usage (Chrome only)
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } })?.memory;
      return memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      };
    } catch (error) {
      console.warn('Failed to get memory usage:', error);
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      };
    }
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (import.meta.env.DEV) {
    console.log('Bundle analysis available in production build');
  }
}
