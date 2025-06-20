import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { useToast } from '../context/ToastContext';
import { PaymentStep, ValidPromoCode, RazorpayResponse } from '../types/payment';
import { TIER_FEATURES, SubscriptionData } from '../types/subscription';
import { validatePromoCode, calculateDiscountedAmount } from '../utils/promoCodeHelpers';
import { getSubscriptionData } from '../context/subscriptionHelpers';
import { 
  RAZORPAY_KEY_ID, 
  RAZORPAY_PLANS,
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../utils/razorpayService';

// For TypeScript to recognize window.Razorpay
declare global {
  interface Window {
    // Using unknown instead of any to satisfy the linter
    Razorpay: unknown;
  }
}

export const usePayment = (planType: keyof typeof RAZORPAY_PLANS, onSuccess?: () => void) => {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('details');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
    const { user } = useAuth();
  const { setProcessingPayment, updateSubscription } = useSubscription();
  const { showToast } = useToast();

  const plan = RAZORPAY_PLANS[planType];
  const planPrice = `${plan.currency} ${(plan.amount / 100).toFixed(2)}`;
  const planPeriod = planType === 'monthly' ? 'month' : 'year';

  const handlePromoCodeValidation = useCallback(async (code: string) => {
    setPromoError('');
    
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      const discountPercent = validatePromoCode(code as ValidPromoCode);
      
      if (discountPercent > 0) {
        setPromoDiscount(discountPercent);
        showToast(`Promo code applied! ${discountPercent}% off`, 'success');
      } else {
        setPromoError('Invalid promo code');
        setPromoDiscount(0);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoError('Error validating promo code');
      setPromoDiscount(0);
    }
  }, [showToast]);
  const handlePayment = useCallback(async () => {
    if (!user) {
      showToast('Please login to continue', 'error');
      return;
    }

    // Get current subscription data
    const currentSubscription = getSubscriptionData();
    
    // If there's an active premium subscription linked to a different email, prevent purchase
    if (
      currentSubscription.tier === 'premium' && 
      currentSubscription.subscriberEmail && 
      currentSubscription.subscriberEmail.toLowerCase() !== user.email?.toLowerCase() &&
      currentSubscription.expiresAt && 
      new Date(currentSubscription.expiresAt) > new Date()
    ) {
      showToast(`This subscription is already owned by ${currentSubscription.subscriberEmail}. Please contact them or sign in with that account.`, 'error');
      return;
    }
    try {
      setPaymentStep('processing');
      setProcessingPayment(true);
      
      const discountedAmount = calculateDiscountedAmount(plan.amount, promoDiscount);
      const order = await createRazorpayOrder(planType, user.id, discountedAmount);
      
      if (!order) {
        throw new Error('Failed to create order');
      }
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Payment options including UPI
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: discountedAmount,
        currency: plan.currency,
        name: 'ResumeAI',
        description: `${plan.name} Subscription`,
        order_id: order.id,
        // Enable UPI methods
        prefill: {
          name: user.user_metadata?.name || '',
          email: user.email || '',
        },
        // Support for showing UPI first
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay with UPI',
                instruments: [
                  { 
                    method: 'upi',
                    apps: ['google_pay', 'phonepe', 'paytm', 'bhim']
                  }
                ]
              }
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true
            }
          }
        },        handler: function(response: RazorpayResponse) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            // Verify payment
          verifyRazorpayPayment(
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            user.id
          ).then((verified) => {
            if (verified) {              // Update subscription to premium when payment is verified              
              const startDate = new Date();
              const expiryDays = planType === 'yearly' ? 365 : 30;
              const expiryDate = new Date(startDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
              
              const newSubscriptionData: SubscriptionData = {
                tier: 'premium',
                startDate: startDate.toISOString(), // Add start date for tracking purchase date
                expiresAt: expiryDate.toISOString(),
                features: TIER_FEATURES.premium,
                subscriberEmail: user?.email || null, // Link subscription to the user's email
              };
              
              updateSubscription(newSubscriptionData);
              setPaymentStep('success');
              showToast('Payment successful! Premium features unlocked!', 'success');
              onSuccess?.();
            } else {
              setPaymentStep('error');
              setErrorMessage('Payment verification failed. Please contact support.');
            }
          });
        },
        modal: {
          ondismiss: function() {
            setPaymentStep('details');
            setProcessingPayment(false);
          }
        },
        // Tell Razorpay to show UPI methods
        method: {
          upi: true,
          card: true,
          netbanking: true
        }
      };
      
      // Create checkout instance and open payment modal
      // @ts-expect-error - Razorpay is dynamically loaded
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error: unknown) {
      console.error('Razorpay payment error:', error);
      setPaymentStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  }, [user, planType, plan, promoDiscount, onSuccess, showToast, setProcessingPayment]);
  const resetPayment = useCallback(() => {
    setPaymentStep('details');
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError('');
    setErrorMessage('');
    setProcessingPayment(false);
  }, [setProcessingPayment, updateSubscription]);

  return {
    paymentStep,
    setPaymentStep,
    promoCode,
    setPromoCode,
    promoDiscount,
    promoError,
    errorMessage,
    planPrice,
    planPeriod,
    handlePromoCodeValidation,
    handlePayment,
    resetPayment,
  };
};
