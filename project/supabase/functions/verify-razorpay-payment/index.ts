// Supabase Edge Function for verifying a Razorpay payment
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
    const { paymentId, orderId, signature, userId } = await req.json();
    
    // Validate required parameters
    if (!paymentId || !orderId || !signature || !userId) {
      return new Response(JSON.stringify({
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeySecret) {
      return new Response(JSON.stringify({
        error: 'Razorpay API keys not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verify the signature
    const payload = orderId + "|" + paymentId;
    const expectedSignature = createHmac("sha256", razorpayKeySecret)
      .update(payload)
      .digest("hex");
      
    const isValid = expectedSignature === signature;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (isValid && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Get the payment details from Razorpay
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      
      const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
        }
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.status === 'captured' || paymentData.status === 'authorized') {
        // Update order status
        await supabase.from('payment_orders')
          .update({ status: 'paid' })
          .eq('order_id', orderId);
          
        // Update user subscription
        await supabase.from('profiles')
          .update({ 
            is_premium: true,
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: (() => {
              const endDate = new Date();
              // Check if yearly plan by amount
              if (paymentData.amount >= 100000) { // Assuming yearly plans are > 1000 INR
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else {
                endDate.setMonth(endDate.getMonth() + 1);
              }
              return endDate.toISOString();
            })()
          })
          .eq('id', userId);
          
        // Store payment record
        await supabase.from('payments').insert({
          payment_id: paymentId,
          order_id: orderId,
          user_id: userId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          created_at: new Date().toISOString()
        });
      }
    }
    
    return new Response(JSON.stringify({
      verified: isValid
    }), {
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
