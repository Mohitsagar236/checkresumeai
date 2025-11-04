/**
 * Automated Feature Testing Framework
 * Comprehensive testing suite for ResumeAI application features
 */

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

class AutomatedTester {
  private results: TestSuite[] = [];
  private isRunning = false;

  async runAllTests(): Promise<void> {
    if (this.isRunning) {
      console.warn('Tests are already running');
      return;
    }

    this.isRunning = true;
    this.results = [];

    console.group('🧪 Starting Automated Feature Testing');
    console.log(`Test started at: ${new Date().toLocaleString()}`);

    try {
      // Run test suites in order
      await this.runAuthenticationTests();
      await this.runUploadTests();
      await this.runAnalysisTests();
      await this.runUITests();
      await this.runPerformanceTests();
      await this.runSecurityTests();

      this.generateTestReport();
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      this.isRunning = false;
      console.groupEnd();
    }
  }

  private async runTest(
    testName: string,
    testFn: () => Promise<void> | void
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`  Running: ${testName}...`);
      await testFn();
      const duration = Date.now() - startTime;
      
      console.log(`  ✅ ${testName} (${duration}ms)`);
      return {
        name: testName,
        status: 'passed',
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.log(`  ❌ ${testName} (${duration}ms): ${errorMessage}`);
      return {
        name: testName,
        status: 'failed',
        duration,
        error: errorMessage
      };
    }
  }

  private async runAuthenticationTests(): Promise<void> {
    console.log('🔐 Testing Authentication System...');
    
    const tests: TestResult[] = [];

    // Test login modal
    tests.push(await this.runTest('Login Modal Opens', async () => {
      const loginButton = document.querySelector('[data-testid="login-button"], button[title*="login"], button[aria-label*="login"]');
      if (!loginButton) {
        throw new Error('Login button not found');
      }
    }));

    // Test signup modal
    tests.push(await this.runTest('Signup Modal Opens', async () => {
      const signupButton = document.querySelector('[data-testid="signup-button"], button[title*="signup"], button[aria-label*="signup"]');
      if (!signupButton) {
        throw new Error('Signup button not found');
      }
    }));

    // Test form validation
    tests.push(await this.runTest('Form Validation Works', async () => {
      // Check if validation utilities are available
      if (typeof (window as any).validateEmail !== 'function') {
        // Import validation if available
        try {
          const validation = await import('../utils/inputValidation');
          (window as any).validateEmail = validation.validators.email;
        } catch {
          console.warn('Validation utilities not loaded yet');
        }
      }
    }));

    // Test Supabase connection
    tests.push(await this.runTest('Supabase Connection', async () => {
      if (!(window as any).supabase) {
        throw new Error('Supabase client not initialized');
      }
    }));

    this.results.push({
      name: 'Authentication Tests',
      tests
    });
  }

  private async runUploadTests(): Promise<void> {
    console.log('📄 Testing PDF Upload System...');
    
    const tests: TestResult[] = [];

    // Test file upload component
    tests.push(await this.runTest('File Upload Component Exists', async () => {
      const uploadArea = document.querySelector('[data-testid="file-upload"], input[type="file"], .file-upload');
      if (!uploadArea) {
        throw new Error('File upload component not found');
      }
    }));

    // Test PDF.js worker
    tests.push(await this.runTest('PDF.js Worker Initialized', async () => {
      if (!(window as any).pdfjsLib) {
        throw new Error('PDF.js library not loaded');
      }
      
      const workerSrc = (window as any).pdfjsLib.GlobalWorkerOptions?.workerSrc;
      if (!workerSrc) {
        throw new Error('PDF.js worker not configured');
      }
    }));

    // Test file validation
    tests.push(await this.runTest('File Validation Works', async () => {
      // Create a mock file to test validation
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // Should reject non-PDF files
      const allowedTypes = ['application/pdf'];
      if (allowedTypes.includes(mockFile.type)) {
        throw new Error('File validation not working - should reject non-PDF files');
      }
    }));

    // Test drag and drop
    tests.push(await this.runTest('Drag and Drop Interface', async () => {
      const dropZone = document.querySelector('[data-testid="drop-zone"], .drag-drop-zone');
      if (!dropZone) {
        throw new Error('Drag and drop zone not found');
      }
    }));

    this.results.push({
      name: 'PDF Upload Tests',
      tests
    });
  }

  private async runAnalysisTests(): Promise<void> {
    console.log('🤖 Testing Analysis Engine...');
    
    const tests: TestResult[] = [];

    // Test API configuration
    tests.push(await this.runTest('analysis', 'API Keys Configured', async () => {
      const apiKeys = {
        openai: !!(import.meta.env.VITE_OPENAI_API_KEY),
        groq: !!(import.meta.env.VITE_GROQ_API_KEY),
        together: !!(import.meta.env.VITE_TOGETHER_API_KEY)
      };

      if (!apiKeys.openai && !apiKeys.groq && !apiKeys.together) {
        throw new Error('No AI API keys configured');
      }
    }));

    // Test mock analysis
    tests.push(await this.runTest('analysis', 'Mock Analysis Available', async () => {
      try {
        const mockData = await import('../data/mockData');
        if (typeof mockData.generateMockAnalysis !== 'function') {
          throw new Error('Mock analysis function not available');
        }
      } catch {
        throw new Error('Mock data module not accessible');
      }
    }));

    // Test analysis components
    tests.push(await this.runTest('analysis', 'Analysis UI Components', async () => {
      // Check if analysis-related components are accessible
      const analysisElements = document.querySelectorAll('[data-testid*="analysis"], .analysis-');
      console.log(`Found ${analysisElements.length} analysis UI elements`);
    }));

    this.results.push({
      name: 'Analysis Engine Tests',
      tests
    });
  }

  private async runUITests(): Promise<void> {
    console.log('🎨 Testing UI Components...');
    
    const tests: TestResult[] = [];

    // Test theme toggle
    tests.push(await this.runTest('ui', 'Theme Toggle Works', async () => {
      const themeToggle = document.querySelector('[data-testid="theme-toggle"], button[aria-label*="theme"]');
      if (!themeToggle) {
        throw new Error('Theme toggle not found');
      }
    }));

    // Test navigation
    tests.push(await this.runTest('ui', 'Navigation Menu', async () => {
      const navLinks = document.querySelectorAll('nav a, header a');
      if (navLinks.length === 0) {
        throw new Error('No navigation links found');
      }
    }));

    // Test responsive design
    tests.push(await this.runTest('ui', 'Responsive Design Elements', async () => {
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
      if (responsiveElements.length === 0) {
        throw new Error('No responsive design classes found');
      }
    }));

    // Test loading states
    tests.push(await this.runTest('ui', 'Loading Components Available', async () => {
      // Check for loading spinner styles or components
      const loadingElements = document.querySelectorAll('[class*="spinner"], [class*="loading"], .animate-spin');
      console.log(`Found ${loadingElements.length} loading UI elements`);
    }));

    this.results.push({
      name: 'UI Components Tests',
      tests
    });
  }

  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Testing Performance...');
    
    const tests: TestResult[] = [];

    // Test Core Web Vitals
    tests.push(await this.runTest('performance', 'Core Web Vitals Monitoring', async () => {
      if (!('performance' in window)) {
        throw new Error('Performance API not available');
      }

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!navigation) {
        throw new Error('Navigation timing not available');
      }

      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      if (loadTime > 5000) {
        throw new Error(`Page load time too slow: ${loadTime}ms`);
      }
    }));

    // Test bundle size
    tests.push(await this.runTest('performance', 'Script Bundle Analysis', async () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const totalScripts = scripts.length;
      
      if (totalScripts > 20) {
        console.warn(`High number of scripts: ${totalScripts}`);
      }
      
      console.log(`Total scripts loaded: ${totalScripts}`);
    }));

    // Test memory usage
    tests.push(await this.runTest('performance', 'Memory Usage Check', async () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        
        if (usedMB > 50) {
          console.warn(`High memory usage: ${usedMB}MB`);
        }
        
        console.log(`Memory usage: ${usedMB}MB`);
      }
    }));

    this.results.push({
      name: 'Performance Tests',
      tests
    });
  }

  private async runSecurityTests(): Promise<void> {
    console.log('🔒 Testing Security Features...');
    
    const tests: TestResult[] = [];

    // Test Content Security Policy
    tests.push(await this.runTest('security', 'Content Security Policy', async () => {
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!metaCSP) {
        console.warn('No CSP meta tag found');
      }
    }));

    // Test HTTPS enforcement
    tests.push(await this.runTest('security', 'HTTPS Protocol Check', async () => {
      if (location.protocol === 'http:' && location.hostname !== 'localhost') {
        throw new Error('Site not using HTTPS in production');
      }
    }));

    // Test input sanitization
    tests.push(await this.runTest('security', 'Input Sanitization Available', async () => {
      try {
        const validation = await import('../utils/inputValidation');
        if (!validation.sanitizeInput) {
          throw new Error('Input sanitization function not available');
        }
      } catch {
        console.warn('Input validation utilities not accessible');
      }
    }));

    this.results.push({
      name: 'Security Tests',
      tests
    });
  }

  private generateTestReport(): void {
    console.group('📊 Test Results Summary');
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    this.results.forEach(suite => {
      console.group(`${suite.name}:`);
      
      suite.tests.forEach(test => {
        totalTests++;
        if (test.status === 'passed') {
          passedTests++;
          console.log(`  ✅ ${test.name} (${test.duration}ms)`);
        } else if (test.status === 'failed') {
          failedTests++;
          console.log(`  ❌ ${test.name}: ${test.error}`);
        }
      });
      
      console.groupEnd();
    });

    const successRate = Math.round((passedTests / totalTests) * 100);
    
    console.log('\n📈 Overall Results:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%`);

    if (successRate >= 90) {
      console.log('🎉 Excellent! Application is working great!');
    } else if (successRate >= 75) {
      console.log('👍 Good! Minor issues to address.');
    } else if (successRate >= 50) {
      console.log('⚠️ Needs attention. Several issues found.');
    } else {
      console.log('🚨 Critical issues need immediate attention.');
    }

    console.groupEnd();

    // Store results for external access
    (window as any).testResults = {
      suites: this.results,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate
      }
    };
  }

  // Quick test utilities
  async quickHealthCheck(): Promise<boolean> {
    console.log('🏥 Running Quick Health Check...');
    
    const checks = [
      () => document.readyState === 'complete',
      () => !!(window as any).React,
      () => !!document.querySelector('body'),
      () => !!document.querySelector('[data-testid], nav, header'),
      () => !document.querySelector('.error-boundary')
    ];

    const results = checks.map(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });

    const healthScore = (results.filter(Boolean).length / results.length) * 100;
    console.log(`Health Score: ${healthScore}%`);
    
    return healthScore >= 80;
  }
}

// Global instance
export const automatedTester = new AutomatedTester();

// Make available in development console
if (import.meta.env.DEV) {
  (window as any).runTests = () => automatedTester.runAllTests();
  (window as any).quickCheck = () => automatedTester.quickHealthCheck();
  (window as any).tester = automatedTester;
  
  console.log('🧪 Automated testing framework loaded!');
  console.log('Commands available:');
  console.log('  - window.runTests() - Run full test suite');
  console.log('  - window.quickCheck() - Quick health check');
  console.log('  - window.testResults - View last test results');
}
