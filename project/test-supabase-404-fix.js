/**
 * Supabase 404 Error Diagnostic and Fix Script
 * This script will help diagnose and fix 404 errors when fetching from the profiles table
 */

// Your Supabase configuration
const SUPABASE_URL = 'https://gbmhfzoanmnayjvaxdfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4';

// Test ID (replace with actual user ID you want to test)
const TEST_USER_ID = '2aeec78a-a7d0-42b2-8e8e-166f19fbc19f';

console.log('🔍 Starting Supabase 404 Error Diagnosis...\n');

// Test 1: Check if profiles table exists and has data
async function testTableAccess() {
    console.log('📋 Test 1: Checking profiles table access...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=5`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });

        console.log(`   Status: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ Table accessible! Found ${data.length} records`);
            console.log(`   Sample data:`, data.slice(0, 2));
            return true;
        } else {
            const error = await response.text();
            console.log(`   ❌ Error accessing table: ${error}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
        return false;
    }
}

// Test 2: Check if specific record exists
async function testSpecificRecord() {
    console.log('\n🎯 Test 2: Checking if specific record exists...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${TEST_USER_ID}`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`   Status: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                console.log(`   ✅ Record found:`, data[0]);
                return true;
            } else {
                console.log(`   ⚠️  Record with ID ${TEST_USER_ID} not found in table`);
                return false;
            }
        } else {
            const error = await response.text();
            console.log(`   ❌ Error: ${error}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
        return false;
    }
}

// Test 3: Check RLS policies by testing with different approaches
async function testRLSPolicies() {
    console.log('\n🔐 Test 3: Testing RLS policies...');
    
    // Test without authentication first
    console.log('   Testing without authentication...');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=count`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ Count query succeeded: ${JSON.stringify(data)}`);
        } else {
            console.log(`   ❌ Count query failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`   ❌ Count query error: ${error.message}`);
    }
}

// Test 4: Test correct REST API usage patterns
async function demonstrateCorrectUsage() {
    console.log('\n📝 Test 4: Demonstrating correct API usage patterns...');
    
    // Pattern 1: Fetch all profiles (with limit)
    console.log('   Pattern 1: Fetch all profiles with limit...');
    const allProfilesUrl = `${SUPABASE_URL}/rest/v1/profiles?select=*&limit=10`;
    console.log(`   URL: ${allProfilesUrl}`);
    
    // Pattern 2: Fetch specific profile by ID
    console.log('   Pattern 2: Fetch by ID...');
    const specificProfileUrl = `${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${TEST_USER_ID}`;
    console.log(`   URL: ${specificProfileUrl}`);
    
    // Pattern 3: Check if profile exists (count)
    console.log('   Pattern 3: Check existence with count...');
    const countUrl = `${SUPABASE_URL}/rest/v1/profiles?select=count&id=eq.${TEST_USER_ID}`;
    console.log(`   URL: ${countUrl}`);
    
    // Show headers
    console.log('   Required headers:');
    console.log('   - apikey: [your-anon-key]');
    console.log('   - Authorization: Bearer [your-anon-key]');
    console.log('   - Content-Type: application/json');
}

// Test 5: Generate working JavaScript code
function generateWorkingCode() {
    console.log('\n💻 Test 5: Here\'s the correct JavaScript code to use:');
    
    const code = `
// Method 1: Using fetch with proper headers
async function fetchProfileByIdFetch(userId) {
    try {
        const response = await fetch('${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.' + userId, {
            method: 'GET',
            headers: {
                'apikey': '${SUPABASE_ANON_KEY}',
                'Authorization': 'Bearer ${SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            console.log('No profile found for this ID');
            return null;
        }
        
        return data[0]; // Return first (and should be only) result
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

// Method 2: Using Supabase client (recommended)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

async function fetchProfileByIdSupabase(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single(); // Use .single() if you expect only one result

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('No profile found for this ID');
                return null;
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

// Method 3: Check if record exists first
async function checkIfProfileExists(userId) {
    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('id', userId);

        if (error) throw error;
        
        return count > 0;
    } catch (error) {
        console.error('Error checking profile existence:', error);
        throw error;
    }
}

// Usage example:
// const userId = '${TEST_USER_ID}';
// const profile = await fetchProfileByIdSupabase(userId);
// console.log('Profile:', profile);
`;

    console.log(code);
}

// Test 6: Show how to handle common errors
function showErrorHandling() {
    console.log('\n🚨 Test 6: Common error handling patterns:');
    
    const errorHandlingCode = `
// Comprehensive error handling
async function safeProfileFetch(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId);

        if (error) {
            switch(error.code) {
                case 'PGRST116':
                    console.log('Profile not found');
                    return null;
                case '42P01':
                    console.error('Table does not exist');
                    break;
                case '42501':
                    console.error('Permission denied - check RLS policies');
                    break;
                default:
                    console.error('Database error:', error.message);
            }
            throw error;
        }

        return data;
    } catch (networkError) {
        console.error('Network or other error:', networkError);
        throw networkError;
    }
}

// Handle 404 specifically
async function fetchProfileWith404Handling(userId) {
    try {
        const response = await fetch(\`${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.\${userId}\`, {
            headers: {
                'apikey': '${SUPABASE_ANON_KEY}',
                'Authorization': 'Bearer ${SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            console.log('Endpoint not found - check table name and URL');
            return null;
        }

        if (response.status === 401) {
            console.log('Unauthorized - check API key');
            return null;
        }

        if (response.status === 403) {
            console.log('Forbidden - check RLS policies');
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(\`HTTP \${response.status}: \${errorText}\`);
            return null;
        }

        const data = await response.json();
        return data.length > 0 ? data[0] : null;

    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}
`;

    console.log(errorHandlingCode);
}

// Main execution
async function runDiagnostics() {
    await testTableAccess();
    await testSpecificRecord();
    await testRLSPolicies();
    demonstrateCorrectUsage();
    generateWorkingCode();
    showErrorHandling();
    
    console.log('\n🎯 Summary of Common 404 Causes and Solutions:');
    console.log('1. ❌ Wrong table name → ✅ Verify table name is "profiles"');
    console.log('2. ❌ Wrong URL format → ✅ Use proper PostgREST syntax');
    console.log('3. ❌ Missing headers → ✅ Include apikey and Authorization');
    console.log('4. ❌ Record doesn\'t exist → ✅ Check if ID exists in table');
    console.log('5. ❌ RLS blocking access → ✅ Check Row Level Security policies');
    console.log('6. ❌ Wrong project URL → ✅ Verify Supabase project URL');
    
    console.log('\n🔧 Quick Fix Checklist:');
    console.log('□ Verify table exists in Supabase dashboard');
    console.log('□ Check if record with that ID exists');
    console.log('□ Verify API key is correct');
    console.log('□ Check RLS policies allow access');
    console.log('□ Test with browser network tab for exact error');
    
    console.log('\n✨ Diagnosis complete! Run this script to test your fixes.');
}

// Run the diagnostics
runDiagnostics().catch(console.error);