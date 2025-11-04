/**
 * Build Health Monitor
 * Monitors build health and provides diagnostics for development issues
 */

interface BuildHealthMetrics {
  buildTime: number;
  bundleSize: number;
  chunkCount: number;
  errors: string[];
  warnings: string[];
  dependencies: {
    total: number;
    outdated: string[];
    vulnerable: string[];
  };
  performance: {
    loadTime: number;
    renderTime: number;
    scriptExecutionTime: number;
  };
}

class BuildHealthMonitor {
  private metrics: Partial<BuildHealthMetrics> = {};
  private startTime = Date.now();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (!import.meta.env.DEV) return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      this.measurePerformance();
    });

    // Monitor for build errors
    window.addEventListener('error', (event) => {
      this.recordError(event.error?.message || event.message);
    });

    // Monitor for console warnings that might indicate build issues
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      if (this.isBuildRelatedWarning(message)) {
        this.recordWarning(message);
      }
      originalWarn.apply(console, args);
    };

    // Start periodic health checks
    this.startPeriodicChecks();
  }

  private isBuildRelatedWarning(message: string): boolean {
    const buildWarnings = [
      'module',
      'import',
      'export',
      'dependency',
      'chunk',
      'bundle',
      'vite',
      'esbuild',
      'typescript'
    ];

    return buildWarnings.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private measurePerformance() {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    this.metrics.performance = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      scriptExecutionTime: navigation.domInteractive - navigation.domContentLoadedEventStart
    };

    this.logHealthStatus();
  }

  private recordError(message: string) {
    if (!this.metrics.errors) this.metrics.errors = [];
    this.metrics.errors.push(message);
    
    // Limit error collection
    if (this.metrics.errors.length > 10) {
      this.metrics.errors = this.metrics.errors.slice(-10);
    }
  }

  private recordWarning(message: string) {
    if (!this.metrics.warnings) this.metrics.warnings = [];
    this.metrics.warnings.push(message);
    
    // Limit warning collection
    if (this.metrics.warnings.length > 20) {
      this.metrics.warnings = this.metrics.warnings.slice(-20);
    }
  }

  private startPeriodicChecks() {
    // Check build health every 30 seconds in development
    setInterval(() => {
      this.checkDependencyHealth();
      this.checkBundleHealth();
    }, 30000);
  }

  private async checkDependencyHealth() {
    try {
      // Check for critical dependencies
      const criticalDeps = [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'pdfjs-dist',
        'framer-motion'
      ];

      const loadedDeps = criticalDeps.filter(dep => {
        try {
          return typeof (window as any)[dep] !== 'undefined' ||
                 document.querySelector(`script[src*="${dep}"]`) !== null;
        } catch {
          return false;
        }
      });

      console.log(`Dependencies loaded: ${loadedDeps.length}/${criticalDeps.length}`);

      this.metrics.dependencies = {
        total: criticalDeps.length,
        outdated: [], // Would require package.json analysis
        vulnerable: [] // Would require security audit
      };

    } catch (error) {
      console.warn('Dependency health check failed:', error);
    }
  }

  private checkBundleHealth() {
    // Estimate bundle size from loaded scripts
    const scripts = Array.from(document.getElementsByTagName('script'));
    const bundleSize = scripts
      .filter(script => script.src && script.src.includes('/src/'))
      .length;

    this.metrics.bundleSize = bundleSize;
    this.metrics.chunkCount = scripts.length;
  }

  getHealthReport(): BuildHealthMetrics {
    const uptime = Date.now() - this.startTime;
    
    return {
      buildTime: uptime,
      bundleSize: this.metrics.bundleSize || 0,
      chunkCount: this.metrics.chunkCount || 0,
      errors: this.metrics.errors || [],
      warnings: this.metrics.warnings || [],
      dependencies: this.metrics.dependencies || {
        total: 0,
        outdated: [],
        vulnerable: []
      },
      performance: this.metrics.performance || {
        loadTime: 0,
        renderTime: 0,
        scriptExecutionTime: 0
      }
    };
  }

  getHealthScore(): number {
    const report = this.getHealthReport();
    let score = 100;

    // Deduct points for errors
    score -= report.errors.length * 10;

    // Deduct points for warnings
    score -= report.warnings.length * 2;

    // Deduct points for poor performance
    if (report.performance.loadTime > 3000) score -= 20;
    if (report.performance.renderTime > 1000) score -= 10;

    return Math.max(0, score);
  }

  logHealthStatus() {
    if (!import.meta.env.DEV) return;

    const report = this.getHealthReport();
    const score = this.getHealthScore();

    console.group('🏥 Build Health Report');
    console.log(`Overall Health Score: ${score}/100`);
    
    if (score >= 90) {
      console.log('✅ Build health is excellent');
    } else if (score >= 70) {
      console.log('⚠️ Build health is good with minor issues');
    } else if (score >= 50) {
      console.log('🟡 Build health needs attention');
    } else {
      console.log('🔴 Build health is poor - immediate action needed');
    }

    if (report.errors.length > 0) {
      console.group('❌ Errors:');
      report.errors.forEach(error => console.error(error));
      console.groupEnd();
    }

    if (report.warnings.length > 0) {
      console.group('⚠️ Warnings:');
      report.warnings.forEach(warning => console.warn(warning));
      console.groupEnd();
    }

    console.log('📊 Performance Metrics:', report.performance);
    console.log('📦 Bundle Info:', {
      size: report.bundleSize,
      chunks: report.chunkCount
    });

    console.groupEnd();
  }

  // Development utilities
  diagnose() {
    console.group('🔍 Build Diagnostics');
    
    // Check for common issues
    const issues: string[] = [];
    
    // Check for missing dependencies
    try {
      if (typeof (window as any).React === 'undefined') issues.push('React not loaded');
      if (typeof (window as any).pdfjsLib === 'undefined') issues.push('PDF.js not loaded');
    } catch (e) {
      issues.push('Dependency check failed');
    }

    // Check for performance issues
    const perf = this.metrics.performance;
    if (perf && perf.loadTime > 5000) {
      issues.push('Slow load time detected');
    }

    if (issues.length === 0) {
      console.log('✅ No issues detected');
    } else {
      console.log('🔍 Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.log('\n🛠️ Quick fixes available:');
    console.log('  - window.buildHealth.clearCaches()');
    console.log('  - window.buildHealth.reloadDependencies()');
    console.log('  - window.buildHealth.optimizeBundle()');

    console.groupEnd();
  }

  // Quick fix utilities
  clearCaches() {
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => 
        Promise.all(names.map(name => caches.delete(name)))
      );
    }
    console.log('✅ Caches cleared');
  }

  reloadDependencies() {
    window.location.reload();
  }

  optimizeBundle() {
    console.log('💡 Bundle optimization suggestions:');
    console.log('  1. Remove unused dependencies');
    console.log('  2. Enable tree shaking');
    console.log('  3. Use dynamic imports for large components');
    console.log('  4. Optimize images and assets');
  }
}

// Global instance
export const buildHealthMonitor = new BuildHealthMonitor();

// Make available in development console
if (import.meta.env.DEV) {
  (window as any).buildHealth = {
    getReport: () => buildHealthMonitor.getHealthReport(),
    getScore: () => buildHealthMonitor.getHealthScore(),
    diagnose: () => buildHealthMonitor.diagnose(),
    clearCaches: () => buildHealthMonitor.clearCaches(),
    reloadDependencies: () => buildHealthMonitor.reloadDependencies(),
    optimizeBundle: () => buildHealthMonitor.optimizeBundle()
  };
  
  console.log('🏥 Build health monitor loaded. Use window.buildHealth for diagnostics.');
}
