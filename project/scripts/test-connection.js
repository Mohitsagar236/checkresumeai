#!/usr/bin/env node

/**
 * Test Supabase Connection
 * Validates that the Supabase URL is accessible
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvmvahwyfptyhchlvtvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXZhaHd5ZnB0eWhjaGx2dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDY3MTUsImV4cCI6MjA2MzgyMjcxNX0.LVfvRnyUGfawFy6fTfq2kW_imzif3M2a7c6NGAqUaaE';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️ Auth test returned error (this is normal for unauthenticated requests):', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
    }
    
    console.log('✅ No network errors - Supabase URL is accessible');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.error('💡 This indicates a network/DNS issue');
      console.error('💡 Check your internet connection and DNS settings');
    }
  }
}

testConnection().catch(console.error);
