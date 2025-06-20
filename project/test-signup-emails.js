// Test signup with different email formats
const supabaseUrl = 'https://gbmhfzoanmnayjvaxdfu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4';

async function testSignupWithValidEmail() {
    console.log('🔍 Testing signup with a different email format...');
    
    const testEmails = [        'checkresmueai@gmail.com',
        'checkresmueai@gmail.com',
        'checkresmueai@gmail.com'
    ];
    
    for (const email of testEmails) {
        console.log(`\n📧 Testing email: ${email}`);
        
        try {
            const response = await fetch(supabaseUrl + '/auth/v1/signup', {
                method: 'POST',
                headers: {
                    'apikey': anonKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: 'testpassword123456'
                })
            });
            
            console.log(`📊 Status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Signup successful!');
                console.log('📊 Response:', JSON.stringify(result, null, 2));
                break; // Stop after first successful test
            } else {
                const errorText = await response.text();
                console.log('⚠️ Signup failed:', errorText);
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }
}

// Test auth endpoint accessibility
async function testAuthEndpoint() {
    console.log('\n🔍 Testing Supabase auth endpoint accessibility...');
    
    try {
        const response = await fetch(supabaseUrl + '/auth/v1/health', {
            headers: {
                'apikey': anonKey
            }
        });
        
        console.log(`📊 Health check status: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ Supabase auth service is healthy');
        } else {
            console.log('⚠️ Supabase auth service health check failed');
        }
    } catch (error) {
        console.log('❌ Error accessing Supabase:', error.message);
    }
}

async function runEmailTests() {
    await testAuthEndpoint();
    await testSignupWithValidEmail();
    
    console.log('\n📝 Test Summary:');
    console.log('- If signup worked, the issue might be in the frontend form submission');
    console.log('- If signup failed, there might be Supabase configuration issues');
    console.log('- Check the actual signup form at: http://localhost:5177/signup');
}

runEmailTests();
