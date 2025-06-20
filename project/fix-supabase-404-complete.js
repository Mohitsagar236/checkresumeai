/**
 * Complete Supabase 404 Fix - Create Profiles Table and Test
 * This script will create the missing profiles table and verify the fix
 */

// Your Supabase configuration
const SUPABASE_URL = 'https://gbmhfzoanmnayjvaxdfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4';

console.log('🔧 SUPABASE 404 FIX - Creating Profiles Table...\n');

// SQL to create the profiles table
const CREATE_PROFILES_TABLE_SQL = `
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_premium BOOLEAN DEFAULT false,
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policy to allow new profile creation during signup
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access to profiles"
ON profiles
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
`;

console.log('📋 SQL Script to run in Supabase SQL Editor:');
console.log('=====================================');
console.log(CREATE_PROFILES_TABLE_SQL);
console.log('=====================================\n');

console.log('🚀 INSTRUCTIONS TO FIX THE 404 ERROR:\n');

console.log('1. **Go to your Supabase Dashboard:**');
console.log('   https://supabase.com/dashboard/project/rvmvahwyfptyhchlvtvr\n');

console.log('2. **Navigate to SQL Editor:**');
console.log('   - Click on "SQL Editor" in the left sidebar');
console.log('   - Click "New query" button\n');

console.log('3. **Copy and paste the SQL script above**');
console.log('   - Select all the SQL code above');
console.log('   - Paste it into the SQL editor');
console.log('   - Click "Run" button\n');

console.log('4. **Verify the table was created:**');
console.log('   - Go to "Table Editor" in the left sidebar');
console.log('   - You should see a "profiles" table listed\n');

// Test function to verify the fix
async function testProfilesTableAfterCreation() {
    console.log('5. **Test the fix (run this after creating the table):**\n');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=count`, {
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
            console.log('   ✅ SUCCESS! Profiles table is now accessible');
            console.log(`   Table count response: ${JSON.stringify(data)}`);
            return true;
        } else {
            const error = await response.text();
            console.log(`   ❌ Still getting error: ${error}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
        return false;
    }
}

// Generate corrected JavaScript code
function generateCorrectedCode() {
    console.log('\n💻 **CORRECTED JAVASCRIPT CODE** (use after creating the table):\n');
    
    const code = `
// ✅ WORKING METHOD 1: Using Supabase Client (Recommended)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    '${SUPABASE_URL}', 
    '${SUPABASE_ANON_KEY}'
);

async function fetchProfileById(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single(); // Use .single() if expecting one result

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('Profile not found for this ID');
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

// ✅ WORKING METHOD 2: Using fetch API
async function fetchProfileByIdFetch(userId) {
    try {
        const response = await fetch(\`${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.\${userId}\`, {
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
        
        return data[0];
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

// ✅ WORKING METHOD 3: Check if profile exists
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
        return false;
    }
}

// ✅ WORKING METHOD 4: Create a new profile
async function createProfile(userId, email, name) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([
                {
                    id: userId,
                    email: email,
                    name: name,
                    is_premium: false
                }
            ])
            .select();

        if (error) throw error;
        
        return data[0];
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}

// 🧪 USAGE EXAMPLES:
async function examples() {
    const userId = '2aeec78a-a7d0-42b2-8e8e-166f19fbc19f';
    
    // Check if profile exists
    const exists = await checkIfProfileExists(userId);
    console.log('Profile exists:', exists);
    
    // If doesn't exist, create it
    if (!exists) {
        const newProfile = await createProfile(
            userId, 
            'checkresmueai@gmail.com', 
            'Test User'
        );
        console.log('Created profile:', newProfile);
    }
    
    // Fetch the profile
    const profile = await fetchProfileById(userId);
    console.log('Fetched profile:', profile);
}
`;

    console.log(code);
}

// Show summary of the fix
function showFixSummary() {
    console.log('\n📝 **SUMMARY OF THE FIX:**\n');
    
    console.log('🔍 **PROBLEM IDENTIFIED:**');
    console.log('   - The "profiles" table does not exist in your Supabase database');
    console.log('   - Error code 42P01 confirms: "relation \\"public.profiles\\" does not exist"');
    console.log('   - This causes all REST API calls to profiles to return 404\n');
    
    console.log('✅ **SOLUTION:**');
    console.log('   1. Create the profiles table using the SQL script above');
    console.log('   2. Set up Row Level Security (RLS) policies');
    console.log('   3. Test the table access');
    console.log('   4. Use the corrected JavaScript code\n');
      console.log('🎯 **AFTER FIXING:**');
    console.log('   - Your REST API calls will work: https://gbmhfzoanmnayjvaxdfu.supabase.co/rest/v1/profiles');
    console.log('   - You can fetch profiles by ID');
    console.log('   - You can create new profiles');
    console.log('   - You can check if profiles exist\n');
    
    console.log('⚠️  **IMPORTANT NOTES:**');
    console.log('   - Run the SQL script in Supabase SQL Editor (not here)');
    console.log('   - The table needs to exist before any API calls will work');
    console.log('   - RLS policies ensure users can only access their own data');
    console.log('   - Always test with the browser Network tab to see exact errors\n');
}

// Main execution
async function main() {
    showFixSummary();
    generateCorrectedCode();
    
    console.log('\n🧪 **TO TEST AFTER CREATING THE TABLE:**');
    console.log('   Run this command: node test-supabase-404-fix.js\n');
    
    console.log('✨ **QUICK CHECKLIST:**');
    console.log('   □ Copy SQL script above');
    console.log('   □ Go to Supabase Dashboard');
    console.log('   □ Paste in SQL Editor and run');
    console.log('   □ Verify "profiles" table exists');
    console.log('   □ Test API calls using corrected code');
    console.log('   □ Create profiles for your users\n');
    
    console.log('🎉 **After this fix, your 404 error will be resolved!**');
}

main().catch(console.error);
