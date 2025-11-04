// Supabase Edge Function for creating a Razorpay order
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { planId, amount, currency, userId } = await req.json();
    
    // Validate required parameters
    if (!planId || !amount || !currency || !userId) {
      return new Response(JSON.stringify({
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({
        error: 'Razorpay API keys not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Create a receipt ID
    const receiptId = `order_rcptid_${userId}_${Date.now()}`;
    
    // Create the order with Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: receiptId,
        notes: {
          planId: planId,
          userId: userId
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'Failed to create Razorpay order',
        details: data
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Store the order in Supabase (optional but recommended for record keeping)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from('payment_orders').insert({
        order_id: data.id,
        user_id: userId,
        plan_id: planId,
        amount: amount,
        currency: currency,
        status: data.status,
        created_at: new Date().toISOString()
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
