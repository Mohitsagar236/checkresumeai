// Create Sample Profile for Testing
// Run this to add test data to your profiles table

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbmhfzoanmnayjvaxdfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleProfile() {
    console.log('🚀 Creating sample profile...');
    
    try {
        // Create a sample profile
        const sampleProfile = {
            id: '2aeec78a-a7d0-42b2-8e8e-166f19fbc19f', // The ID you were testing with
            email: 'checkresmueai@gmail.com',
            name: 'Test User',
            is_premium: false
        };
        
        const { data, error } = await supabase
            .from('profiles')
            .insert([sampleProfile])
            .select();
            
        if (error) {
            console.error('❌ Error creating profile:', error);
            return;
        }
        
        console.log('✅ Sample profile created successfully!');
        console.log('📋 Profile data:', data[0]);
        
        // Now test fetching it
        console.log('\n🔍 Testing fetch with the sample data...');
        const { data: fetchedProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', '2aeec78a-a7d0-42b2-8e8e-166f19fbc19f')
            .single();
            
        if (fetchError) {
            console.error('❌ Error fetching profile:', fetchError);
            return;
        }
        
        console.log('✅ Profile fetched successfully!');
        console.log('📋 Fetched data:', fetchedProfile);
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

// Run the function
createSampleProfile();