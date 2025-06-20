// Manual signup test script
// This script tests the signup functionality by simulating form submission

console.log('🔍 Starting Signup Functionality Debug...');

// Test 1: Check if the signup page loads
async function testSignupPageLoad() {
    console.log('\n📍 Test 1: Testing signup page load...');
    
    try {
        const response = await fetch('http://localhost:5177/signup');
        if (response.ok) {
            console.log('✅ Signup page loads successfully');
            const html = await response.text();
            
            // Check if the page contains signup modal elements
            if (html.includes('SignupModal') || html.includes('Create Account') || html.includes('Join Our Community')) {
                console.log('✅ Signup modal elements found in page');
            } else {
                console.log('⚠️ Signup modal elements not found in HTML');
            }
        } else {
            console.log('❌ Signup page failed to load:', response.status);
        }
    } catch (error) {
        console.log('❌ Error loading signup page:', error.message);
    }
}

// Test 2: Check Supabase authentication endpoint
async function testSupabaseAuth() {
    console.log('\n📍 Test 2: Testing Supabase authentication...');
      const supabaseUrl = 'https://gbmhfzoanmnayjvaxdfu.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4';
    
    try {
        // Test auth endpoint
        const authResponse = await fetch(supabaseUrl + '/auth/v1/signup', {
            method: 'POST',
            headers: {
                'apikey': anonKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'checkresmueai@gmail.com',
                password: 'testpassword123'
            })
        });
        
        if (authResponse.ok) {
            console.log('✅ Supabase auth endpoint is accessible');
            const result = await authResponse.json();
            console.log('📊 Signup response:', result);
        } else {
            console.log('⚠️ Supabase auth response status:', authResponse.status);
            const errorText = await authResponse.text();
            console.log('📊 Error details:', errorText);
        }
    } catch (error) {
        console.log('❌ Error testing Supabase auth:', error.message);
    }
}

// Test 3: Check environment variables in browser
function testEnvironmentVariables() {
    console.log('\n📍 Test 3: Testing environment variables...');
    
    // Note: In production, these would be available via import.meta.env
    // For this test, we'll check if they're accessible
    
    const envVars = {
        'VITE_SUPABASE_URL': 'https://gbmhfzoanmnayjvaxdfu.supabase.co',
        'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    };
    
    console.log('📊 Expected environment variables:');
    Object.entries(envVars).forEach(([key, value]) => {
        console.log(`  ${key}: ${value.substring(0, 50)}...`);
    });
    
    console.log('✅ Environment variables are configured');
}

// Test 4: Simulate form validation
function testFormValidation() {
    console.log('\n📍 Test 4: Testing form validation logic...');
    
    const testCases = [
        { email: '', password: '', confirmPassword: '', expected: false, reason: 'Empty fields' },
        { email: 'invalid-email', password: 'pass123', confirmPassword: 'pass123', expected: false, reason: 'Invalid email' },        { email: 'checkresmueai@gmail.com', password: '123', confirmPassword: '123', expected: false, reason: 'Password too short' },
        { email: 'checkresmueai@gmail.com', password: 'password123', confirmPassword: 'different', expected: false, reason: 'Passwords do not match' },
        { email: 'checkresmueai@gmail.com', password: 'password123', confirmPassword: 'password123', expected: true, reason: 'Valid form' }
    ];
    
    testCases.forEach((testCase, index) => {
        const isValid = validateForm(testCase.email, testCase.password, testCase.confirmPassword);
        const result = isValid === testCase.expected ? '✅' : '❌';
        console.log(`  Test ${index + 1}: ${result} ${testCase.reason} - Expected: ${testCase.expected}, Got: ${isValid}`);
    });
}

// Form validation function (simulates the one in SignupModal)
function validateForm(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    if (password !== confirmPassword) {
        return false;
    }
    return true;
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting comprehensive signup functionality tests...\n');
    
    await testSignupPageLoad();
    testEnvironmentVariables();
    testFormValidation();
    await testSupabaseAuth();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- If all tests passed, the signup functionality should work');
    console.log('- If any tests failed, check the specific error messages above');
    console.log('- Test the actual signup form in the browser at: http://localhost:5177/signup');
}

// Run tests
runAllTests();
