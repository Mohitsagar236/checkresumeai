/**
 * Comprehensive test script to verify all PDF worker and authentication fixes
 */

// Test 1: PDF Worker Initialization
async function testPdfWorkerInitialization() {
  console.log('🔧 Testing PDF Worker Initialization...');
  
  try {
    // Import the worker functions
    const { initializeStableWorker, isWorkerInitialized, verifyWorkerFiles } = await import('./utils/pdf-worker-stable.enhanced.v2.ts');
    
    console.log('✅ PDF worker module imported successfully');
    
    // Test worker file verification
    const workerFileCheck = await verifyWorkerFiles();
    if (workerFileCheck) {
      console.log('✅ PDF worker files verified:', workerFileCheck);
    } else {
      console.error('❌ PDF worker files not found');
      return false;
    }
    
    // Test worker initialization
    await initializeStableWorker();
    
    if (isWorkerInitialized()) {
      console.log('✅ PDF worker initialized successfully');
      return true;
    } else {
      console.error('❌ PDF worker initialization failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ PDF worker test failed:', error);
    return false;
  }
}

// Test 2: PDF Processing
async function testPdfProcessing() {
  console.log('📄 Testing PDF Processing...');
  
  try {
    // Create a test PDF file (minimal valid PDF)
    const minimalPdfBase64 = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA5NDQKL0ZpbHRlciBbL0ZsYXRlRGVjb2RlXQo+PgpzdHJlYW0KeJx9kstuwjAQRfd8xZQ9duI4D7MsVVGBSl0UtYiuKsdxwK3jWM5Ain9v3A5KH3Q1957rzMw4Y+KlpZRzyJJU8jyTRZZnJU8UlaVa5qUqklTljCRKZprnWS5LneZJwUu+JVvQQFEkmRKyaI7YRJJEySgZE2LKdMZkrplWQiglV0rIreSKSq3aRq2DUXAUHZ8gVOBpOL4eN1Tih+gx+GvGPBGDGNaStUqy8Y8zdvpS7U4dVJNBfL0JvRaRAVXz4NZcLvZX9nYlKWcb1AzIV3J1IY1KD6Ll6FvLUjfF2a9j+7A8YZtA8E+iM9s8k6xFD2wT3d6dBl8QDNpGkMaV1PaLbS8QHHJ8LjNJOv/+LnBXwqhfnIlmyLKkqSo7UrXe/DLyKHu7d+fKBr8LjTFCqA==';
    
    // Convert to blob
    const binaryString = atob(minimalPdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const testFile = new File([bytes], 'test.pdf', { type: 'application/pdf' });
    
    // Import PDF processor
    const { ResumeProcessor } = await import('./utils/pdfProcessor.ts');
    const processor = await ResumeProcessor.getInstance();
    
    // Test PDF text extraction
    const extractedText = await processor.extractTextFromFile(testFile);
    
    if (extractedText && extractedText.length > 0) {
      console.log('✅ PDF text extraction successful');
      console.log('📝 Extracted text preview:', extractedText.substring(0, 100) + '...');
      return true;
    } else {
      console.error('❌ PDF text extraction failed - no text returned');
      return false;
    }
    
  } catch (error) {
    console.error('❌ PDF processing test failed:', error);
    return false;
  }
}

// Test 3: Authentication State
async function testAuthenticationState() {
  console.log('🔐 Testing Authentication State...');
  
  try {
    // Check if auth context is properly initialized
    const authElements = document.querySelectorAll('[data-auth-state]');
    console.log('🔍 Found auth elements:', authElements.length);
    
    // Check for duplicate auth state messages in console
    const originalConsoleLog = console.log;
    let authStateChangeCount = 0;
    
    console.log = function(...args) {
      if (args[0] && args[0].includes('Auth State Change')) {
        authStateChangeCount++;
      }
      originalConsoleLog.apply(console, args);
    };
    
    // Wait a bit to see if there are excessive auth state changes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    if (authStateChangeCount <= 2) {
      console.log('✅ Auth state changes are properly controlled:', authStateChangeCount);
      return true;
    } else {
      console.log('⚠️ Excessive auth state changes detected:', authStateChangeCount);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Authentication state test failed:', error);
    return false;
  }
}

// Test 4: Route Navigation
async function testRouteNavigation() {
  console.log('🧭 Testing Route Navigation...');
  
  try {
    // Test signup route
    const signupResponse = await fetch('/signup');
    if (signupResponse.ok) {
      console.log('✅ Signup route accessible');
    } else {
      console.error('❌ Signup route failed:', signupResponse.status);
      return false;
    }
    
    // Test login route  
    const loginResponse = await fetch('/login');
    if (loginResponse.ok) {
      console.log('✅ Login route accessible');
    } else {
      console.error('❌ Login route failed:', loginResponse.status);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Route navigation test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive system tests...\n');
  
  const results = [];
  
  results.push({ test: 'PDF Worker Initialization', passed: await testPdfWorkerInitialization() });
  results.push({ test: 'PDF Processing', passed: await testPdfProcessing() });
  results.push({ test: 'Authentication State', passed: await testAuthenticationState() });
  results.push({ test: 'Route Navigation', passed: await testRouteNavigation() });
  
  console.log('\n📊 Test Results Summary:');
  console.log('═══════════════════════════');
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.test}`);
  });
  
  console.log('═══════════════════════════');
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! System is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runSystemTests = runAllTests;
  console.log('💡 Run "runSystemTests()" in the browser console to test all fixes');
}

export { runAllTests };
