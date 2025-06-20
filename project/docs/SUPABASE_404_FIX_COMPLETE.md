# Supabase 404 Error Fix - Complete Solution

## 🔍 Problem Diagnosed

**Root Cause:** The `profiles` table does not exist in your Supabase database.

**Error Details:**
- HTTP Status: 404
- Error Code: `42P01`
- Message: `"relation \"public.profiles\" does not exist"`
- API Endpoint: `https://gbmhfzoanmnayjvaxdfu.supabase.co/rest/v1/profiles`

## ✅ Complete Solution

### Step 1: Create the Profiles Table

1. **Go to your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/gbmhfzoanmnayjvaxdfu
   ```

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Run this SQL script:**
   ```sql
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
   ```

4. **Verify the table was created:**
   - Go to "Table Editor" in the left sidebar
   - You should see a "profiles" table listed

### Step 2: Use the Correct JavaScript Code

#### Method 1: Using Supabase Client (Recommended)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://gbmhfzoanmnayjvaxdfu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4'
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
```

#### Method 2: Using Fetch API

```javascript
async function fetchProfileByIdFetch(userId) {
    try {
        const response = await fetch(`https://gbmhfzoanmnayjvaxdfu.supabase.co/rest/v1/profiles?select=*&id=eq.${userId}`, {
            method: 'GET',
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
```

#### Method 3: Check if Profile Exists

```javascript
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
```

#### Method 4: Create a New Profile

```javascript
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
```

### Step 3: Handle Common Errors

```javascript
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
                    console.error('Table does not exist - run database setup');
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
```

## 🧪 Testing the Fix

### Option 1: Run the diagnostic script
```bash
cd "E:\Downloads\AI-Powered Resume Analyzer SaaS\project"
node test-supabase-404-fix.js
```

### Option 2: Test in browser console
```javascript
// Test the API directly in browser console
fetch('https://gbmhfzoanmnayjvaxdfu.supabase.co/rest/v1/profiles?select=count', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE',
        'Content-Type': 'application/json'
    }
}).then(r => r.json()).then(console.log);
```

## 🎯 What Changed After the Fix

### Before Fix:
- ❌ 404 Error: `"relation \"public.profiles\" does not exist"`
- ❌ All profile API calls failed
- ❌ No user profile data available

### After Fix:
- ✅ Profiles table exists and is accessible
- ✅ API calls return proper responses (empty array if no data)
- ✅ Users can create, read, update profiles
- ✅ Row Level Security protects user data

## 🔐 Row Level Security (RLS) Explained

The profiles table includes these security policies:

1. **Users can view own profile**: Users can only see their own profile data
2. **Users can update own profile**: Users can only modify their own profile
3. **Users can create their own profile**: Users can create a profile during signup
4. **Service role has full access**: Backend services can manage all profiles

## 📋 Quick Checklist

- [ ] Copy SQL script from above
- [ ] Go to Supabase Dashboard
- [ ] Paste in SQL Editor and run
- [ ] Verify "profiles" table exists
- [ ] Test API calls using corrected code
- [ ] Create profiles for your users

## 🚨 Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Error | Table doesn't exist | Run the SQL script above |
| 401 Unauthorized | Wrong API key | Verify `VITE_SUPABASE_ANON_KEY` |
| 403 Forbidden | RLS blocking access | Check user authentication |
| Empty results | No data in table | Create profile records |
| PGRST116 Error | Record not found | Normal - handle gracefully |

## 🎉 Success Criteria

After implementing this fix, you should be able to:

1. ✅ Access `https://gbmhfzoanmnayjvaxdfu.supabase.co/rest/v1/profiles` without 404
2. ✅ Fetch profiles by ID without errors
3. ✅ Create new profile records
4. ✅ Update existing profiles
5. ✅ Check if profiles exist

## 📁 Files Created/Modified

- `test-supabase-404-fix.js` - Diagnostic script
- `fix-supabase-404-complete.js` - Complete fix instructions  
- `src/components/ProfileManager.tsx` - React component example
- This documentation file

The 404 error will be completely resolved once you run the SQL script in your Supabase dashboard!
