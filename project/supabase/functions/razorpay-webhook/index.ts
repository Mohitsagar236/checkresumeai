// Supabase Edge Function for handling Razorpay webhooks
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { createHmac } from 'https://deno.land/std@0.131.0/node/crypto.ts';

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
    // Get the raw payload and signature from the request
    const payload = await req.text();
    const razorpaySignature = req.headers.get('x-razorpay-signature');
    
    // Validate webhook request
    if (!razorpaySignature) {
      return new Response(JSON.stringify({ error: 'Missing signature header' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");
      
    // Compare signatures
    if (expectedSignature !== razorpaySignature) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the webhook payload
    const event = JSON.parse(payload);
    const { event: eventType, payload: eventPayload } = event;
    
    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Database configuration missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Handle different event types
    switch (eventType) {
      case 'payment.authorized':
        await handlePaymentAuthorized(supabase, eventPayload);
        break;
        
      case 'payment.captured':
        await handlePaymentCaptured(supabase, eventPayload);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(supabase, eventPayload);
        break;
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Handle payment.authorized event
async function handlePaymentAuthorized(supabase, payload) {
  const { payment } = payload;
  const { entity } = payment;
  
  // Get order details from notes
  const userId = entity.notes?.userId;
  const orderId = entity.order_id;
  
  if (!userId || !orderId) {
    console.error('Missing user ID or order ID in payment notes');
    return;
  }
  
  // Update payment status
  await supabase.from('payments').upsert({
    payment_id: entity.id,
    order_id: orderId,
    user_id: userId,
    amount: entity.amount,
    currency: entity.currency,
    status: entity.status,
    created_at: new Date().toISOString()
  }, { onConflict: 'payment_id' });
}

// Handle payment.captured event
async function handlePaymentCaptured(supabase, payload) {
  const { payment } = payload;
  const { entity } = payment;
  
  // Get order details from notes
  const userId = entity.notes?.userId;
  const orderId = entity.order_id;
  
  if (!userId || !orderId) {
    console.error('Missing user ID or order ID in payment notes');
    return;
  }
  
  // Update payment status
  await supabase.from('payments').upsert({
    payment_id: entity.id,
    order_id: orderId,
    user_id: userId,
    amount: entity.amount,
    currency: entity.currency,
    status: 'captured',
    created_at: new Date().toISOString()
  }, { onConflict: 'payment_id' });
  
  // Update order status
  await supabase.from('payment_orders')
    .update({ status: 'paid' })
    .eq('order_id', orderId);
  
  // Update user subscription status
  await supabase.from('profiles')
    .update({ 
      is_premium: true,
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: (() => {
        const endDate = new Date();
        // Check if yearly plan by amount (assuming yearly plans are > 1000 INR)
        if (entity.amount >= 100000) {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
        return endDate.toISOString();
      })()
    })
    .eq('id', userId);
}

// Handle payment.failed event
async function handlePaymentFailed(supabase, payload) {
  const { payment } = payload;
  const { entity } = payment;
  
  // Get order details from notes
  const userId = entity.notes?.userId;
  const orderId = entity.order_id;
  
  if (!userId || !orderId) {
    console.error('Missing user ID or order ID in payment notes');
    return;
  }
  
  // Update payment status
  await supabase.from('payments').upsert({
    payment_id: entity.id,
    order_id: orderId,
    user_id: userId,
    amount: entity.amount,
    currency: entity.currency,
    status: 'failed',
    created_at: new Date().toISOString()
  }, { onConflict: 'payment_id' });
  
  // Update order status
  await supabase.from('payment_orders')
    .update({ status: 'failed' })
    .eq('order_id', orderId);
}
