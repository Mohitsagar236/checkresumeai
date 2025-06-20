import { supabase } from './supabaseClient';

// Razorpay key ID (public key)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_LOXRGg0tuOTABB';

// Define plan details
export const RAZORPAY_PLANS = {  'monthly': {
    id: 'plan_premium_monthly',
    name: 'Premium Monthly',
    amount: 9900, // ₹99
    currency: 'INR',
    interval: 'monthly'
  },
  'yearly': {
    id: 'plan_premium_yearly',
    name: 'Premium Yearly',
    amount: 49900, // ₹499
    currency: 'INR',
    interval: 'yearly'
  }
};

// Interface for order creation response
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

// Create a Razorpay order using Supabase Edge Function
export const createRazorpayOrder = async (
  planType: 'monthly' | 'yearly', 
  userId: string,
  discountedAmount?: number
): Promise<RazorpayOrderResponse | null> => {
  try {
    const plan = RAZORPAY_PLANS[planType];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    // This should be a call to your Supabase Edge Function
    // For now, let's simulate a response
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        planId: plan.id,
        amount: discountedAmount || plan.amount,
        currency: plan.currency,
        userId
      }
    });

    if (error) {
      console.error('Error creating Razorpay order:', error);
      return null;
    }

    return data as RazorpayOrderResponse;
  } catch (error) {
    console.error('Error in createRazorpayOrder:', error);
    return null;
  }
};

// Verify a Razorpay payment
export const verifyRazorpayPayment = async (
  paymentId: string, 
  orderId: string, 
  signature: string, 
  userId: string
): Promise<boolean> => {
  try {
    // Call your Supabase Edge Function to verify the payment
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        paymentId,
        orderId,
        signature,
        userId
      }
    });

    if (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }

    return data.verified as boolean;
  } catch (error) {
    console.error('Error in verifyRazorpayPayment:', error);
    return false;
  }
};

// Load Razorpay SDK dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
