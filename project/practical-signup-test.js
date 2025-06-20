// Practical signup test - simulates the complete signup flow
// Run this in the browser console while on http://localhost:5177/signup

console.log('🔍 Starting practical signup test...');

// Function to wait for elements to load
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            } else {
                setTimeout(check, 100);
            }
        }
        
        check();
    });
}

// Test 1: Check if signup modal is rendered
async function testModalRendering() {
    console.log('\n📍 Test 1: Checking if signup modal is rendered...');
    
    try {
        // Check for dialog/modal elements
        const modal = await waitForElement('[role="dialog"], .modal, [data-testid="signup-modal"]');
        console.log('✅ Signup modal found:', modal);
        
        // Check for form elements
        const emailInput = await waitForElement('input[type="email"]');
        console.log('✅ Email input found:', emailInput);
        
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        console.log(`✅ Password inputs found: ${passwordInputs.length}`);
        
        const submitButton = await waitForElement('button[type="submit"], button:has-text("Create Account")');
        console.log('✅ Submit button found:', submitButton);
        
        return true;
    } catch (error) {
        console.log('❌ Modal rendering test failed:', error.message);
        return false;
    }
}

// Test 2: Test form submission
async function testFormSubmission() {
    console.log('\n📍 Test 2: Testing form submission...');
    
    try {
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        const submitButton = document.querySelector('button[type="submit"]');
        
        if (!emailInput || passwordInputs.length < 2 || !submitButton) {
            throw new Error('Required form elements not found');
        }
        
        // Fill the form
        const testEmail = 'checkresmueai@gmail.com';
        const testPassword = 'testpassword123';
        
        emailInput.value = testEmail;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        passwordInputs[0].value = testPassword;
        passwordInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        
        passwordInputs[1].value = testPassword;
        passwordInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log(`📝 Form filled with email: ${testEmail}`);
        
        // Monitor for loading states
        const originalButtonText = submitButton.textContent;
        console.log(`🔘 Original button text: "${originalButtonText}"`);
        
        // Submit the form
        console.log('🚀 Submitting form...');
        submitButton.click();
        
        // Wait and check for changes
        setTimeout(() => {
            const newButtonText = submitButton.textContent;
            const isLoading = submitButton.disabled;
            
            console.log(`🔘 Button text after submit: "${newButtonText}"`);
            console.log(`⏸️ Button disabled: ${isLoading}`);
            
            // Check for any error messages
            const errorElements = document.querySelectorAll('[class*="error"], .text-red-500, [class*="text-red"]');
            if (errorElements.length > 0) {
                console.log(`⚠️ Error messages found: ${errorElements.length}`);
                errorElements.forEach((el, i) => {
                    if (el.textContent.trim()) {
                        console.log(`❌ Error ${i + 1}: ${el.textContent.trim()}`);
                    }
                });
            } else {
                console.log('✅ No error messages visible');
            }
            
            // Check for success messages
            const successElements = document.querySelectorAll('[class*="success"], .text-green-500, [class*="text-green"]');
            if (successElements.length > 0) {
                console.log(`🎉 Success messages found: ${successElements.length}`);
                successElements.forEach((el, i) => {
                    if (el.textContent.trim()) {
                        console.log(`✅ Success ${i + 1}: ${el.textContent.trim()}`);
                    }
                });
            }
        }, 2000);
        
        // Wait longer to see final result
        setTimeout(() => {
            const finalButtonText = submitButton.textContent;
            const finalIsLoading = submitButton.disabled;
            
            console.log(`\n📊 Final status after 5 seconds:`);
            console.log(`🔘 Button text: "${finalButtonText}"`);
            console.log(`⏸️ Button disabled: ${finalIsLoading}`);
            
            if (finalButtonText === originalButtonText && !finalIsLoading) {
                console.log('✅ Form submission completed successfully');
            } else if (finalIsLoading) {
                console.log('⚠️ Form still in loading state - possible timeout or network issue');
            } else {
                console.log('📊 Form in unknown state - check for errors');
            }
        }, 5000);
        
        return true;
    } catch (error) {
        console.log('❌ Form submission test failed:', error.message);
        return false;
    }
}

// Test 3: Check console errors
function testConsoleErrors() {
    console.log('\n📍 Test 3: Monitoring console for errors...');
    
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const errors = [];
    const warnings = [];
    
    // Override console methods to capture messages
    console.error = function(...args) {
        const message = args.join(' ');
        errors.push(message);
        console.log(`❌ Console Error: ${message}`);
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        warnings.push(message);
        console.log(`⚠️ Console Warning: ${message}`);
        originalWarn.apply(console, args);
    };
    
    // Restore after 10 seconds
    setTimeout(() => {
        console.error = originalError;
        console.warn = originalWarn;
        
        console.log(`\n📊 Console monitoring results:`);
        console.log(`❌ Errors: ${errors.length}`);
        console.log(`⚠️ Warnings: ${warnings.length}`);
        
        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ No console errors or warnings detected');
        }
    }, 10000);
}

// Run all tests
async function runPracticalTests() {
    console.log('🚀 Starting practical signup tests...\n');
    
    // Start monitoring console errors
    testConsoleErrors();
    
    // Test modal rendering
    const modalWorks = await testModalRendering();
    
    if (modalWorks) {
        // Wait a bit then test form submission
        setTimeout(async () => {
            await testFormSubmission();
        }, 1000);
    } else {
        console.log('❌ Cannot proceed with form tests - modal not rendering properly');
    }
    
    console.log('\n📝 Test Instructions:');
    console.log('1. Open browser console on http://localhost:5177/signup');
    console.log('2. Paste this entire script and run it');
    console.log('3. Watch the test results in the console');
    console.log('4. Check if signup form works or shows specific errors');
}

// Execute tests
runPracticalTests();
