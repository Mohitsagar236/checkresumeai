/**
 * Bundle Optimization Utilities
 * Implements code splitting, lazy loading, and tree shaking improvements
 */

import React, { lazy, Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Dynamic import wrapper with error handling
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return function WrappedComponent(props: React.ComponentProps<T>) {
    const FallbackComponent = fallback || (() => (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    ));

    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload utilities for better performance
export const preloadComponent = (importFunc: () => Promise<any>) => {
  // Start loading the component
  importFunc().catch(err => {
    console.warn('Failed to preload component:', err);
  });
};

// Route-based code splitting
export const LazyRoutes = {
  HomePage: createLazyComponent(() => import('../pages/HomePage')),
  UploadPage: createLazyComponent(() => import('../pages/UploadPage')),
  ResultsPage: createLazyComponent(() => import('../pages/ResultsPage')),
  PricingPage: createLazyComponent(() => import('../pages/PricingPage')),
  ProfilePage: createLazyComponent(() => import('../pages/ProfilePage')),
  AnalyticsPage: createLazyComponent(() => import('../pages/AnalyticsPage')),
  FAQPage: createLazyComponent(() => import('../pages/FAQPage')),
  LoginPage: createLazyComponent(() => import('../pages/LoginPage')),
  SignupPage: createLazyComponent(() => import('../pages/SignupPage')),
  ResumeCheckPage: createLazyComponent(() => import('../pages/ResumeCheckPage')),
  ResumeAnalysisPage: createLazyComponent(() => import('../pages/ResumeAnalysisPage')),
};

// Feature-based code splitting
export const LazyComponents = {
  AnalyticsDashboard: createLazyComponent(() => import('../components/analytics/AnalyticsDashboard')),
  RealTimeFeedbackViz: createLazyComponent(() => import('../components/premium/RealTimeFeedbackViz')),
  ImprovedPdfViewer: createLazyComponent(() => import('../components/pdf/ImprovedPdfViewer')),
  ComparisonChart: createLazyComponent(() => import('../components/comparison/ComparisonChart')),
  AdminDashboard: createLazyComponent(() => import('../components/admin/AdminDashboard')),
};

// Resource preloading for critical assets
export function preloadCriticalResources() {
  // Preload critical CSS
  const criticalCss = [
    '/src/index.css'
  ];

  criticalCss.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
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
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations in development
    if (import.meta.env.DEV && duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureComponentRender<T extends ComponentType<any>>(
    Component: T,
    name: string
  ): T {
    return function MeasuredComponent(props: React.ComponentProps<T>) {
      const monitor = PerformanceMonitor.getInstance();
      
      React.useEffect(() => {
        monitor.startTiming(`${name}-render`);
        return () => {
          monitor.endTiming(`${name}-render`);
        };
      });

      return React.createElement(Component, props);
    } as T;
  }

  getMetrics() {
    return {
      // Web Vitals
      cls: this.getCLS(),
      fid: this.getFID(),
      lcp: this.getLCP(),
      // Custom metrics
      bundleSize: this.getBundleSize(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  private getCLS(): number {
    // Cumulative Layout Shift
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        resolve(cls);
      }).observe({ type: 'layout-shift', buffered: true });
    }) as any;
  }

  private getFID(): number {
    // First Input Delay
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          resolve((entry as any).processingStart - entry.startTime);
        }
      }).observe({ type: 'first-input', buffered: true });
    }) as any;
  }

  private getLCP(): number {
    // Largest Contentful Paint
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    }) as any;
  }

  private getBundleSize(): number {
    // Estimate bundle size from network resources
    const resources = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
  }

  private getMemoryUsage(): any {
    // Memory usage (Chrome only)
    return (performance as any).memory || {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    };
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (import.meta.env.DEV) {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analysis available in production build');
    }).catch(() => {
      console.log('Bundle analyzer not available in development');
    });
  }
}
