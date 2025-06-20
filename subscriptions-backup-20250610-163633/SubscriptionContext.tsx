import { useState, ReactNode, useEffect, useCallback } from 'react';
import { SubscriptionData, TIER_FEATURES } from '../types/subscription';
import { getSubscriptionData, saveSubscriptionData, getFormattedExpiryDate, getDaysRemaining, isCurrentUserSubscriptionOwner } from './subscriptionHelpers';
import { SubscriptionContext } from './SubscriptionContextDefs';
import { PaymentModal } from '../components/premium/PaymentModal';
import { useAuth } from '../hooks/useAuth';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Get the current authenticated user
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>(getSubscriptionData);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  // This state is used by the PaymentModal component via setProcessingPayment
  const [processingPayment, setProcessingPayment] = useState(false);

  const features = TIER_FEATURES[subscriptionData.tier];
  const isPremium = subscriptionData.tier !== 'free';
  
  // Check if current user is the subscription owner
  const currentUserEmail = user?.email;
  const isCurrentUserSubscriber = isCurrentUserSubscriptionOwner(currentUserEmail, subscriptionData);

  const hasFeature = useCallback((feature: keyof typeof features) => {
    // Only allow premium features if the current user is the subscriber
    if (subscriptionData.tier !== 'free' && !isCurrentUserSubscriber) {
      return TIER_FEATURES.free[feature] || false;
    }
    return Boolean(features[feature]);
  }, [features, subscriptionData.tier, isCurrentUserSubscriber]);const openPaymentModal = useCallback((plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  }, []);
  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
    setProcessingPayment(false);
  }, []);  const onPaymentSuccess = useCallback(() => {
    // Ensure we have the user's email before proceeding
    if (!currentUserEmail) {
      console.error('No user email available for subscription');
      return;
    }

    // Get current date as the start date
    const startDate = new Date();
    // Calculate expiration based on plan type - 30 days for monthly, 365 days for yearly
    const expiryDays = selectedPlan === 'yearly' ? 365 : 30;
    const expiryDate = new Date(startDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    
    const newData: SubscriptionData = {
      tier: 'premium',
      startDate: startDate.toISOString(), // Add start date
      expiresAt: expiryDate.toISOString(),
      features: TIER_FEATURES.premium,
      subscriberEmail: currentUserEmail, // Required - must have an email to purchase
    };
    
    console.log(`Updating subscription with email ${currentUserEmail} and expiry date ${expiryDate.toLocaleDateString()}`);
    setSubscriptionData(newData);
    saveSubscriptionData(newData);
    setIsPaymentModalOpen(false);
  }, [selectedPlan, currentUserEmail]);
  const handlePayment = useCallback(async () => {
    setProcessingPayment(true);
    try {
      // This is now handled by individual PaymentModal components  
      // The actual payment processing happens in the PaymentModal component
      console.log('Processing payment, status:', processingPayment);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessingPayment(false);
    }
  }, [processingPayment]);

  const updateSubscription = useCallback((newData: SubscriptionData) => {
    setSubscriptionData(newData);
    saveSubscriptionData(newData);
  }, []);

  // Sync subscription data to localStorage whenever it changes
  useEffect(() => {
    saveSubscriptionData(subscriptionData);
  }, [subscriptionData]);  // Calculate subscription expiry information
  const expiryDate = subscriptionData.expiresAt;
  const formattedExpiryDate = getFormattedExpiryDate(subscriptionData);
  const daysRemaining = getDaysRemaining(subscriptionData);
  const subscriberEmail = subscriptionData.subscriberEmail;

  return (
    <SubscriptionContext.Provider
      value={{
        tier: subscriptionData.tier,
        isPremium,
        features,
        hasFeature,
        openPaymentModal,
        closePaymentModal,
        handlePayment,
        updateSubscription,
        setProcessingPayment,
        expiryDate,
        formattedExpiryDate,
        daysRemaining,
        subscriberEmail,
        isCurrentUserSubscriber,
      }}
    >
      {children}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onSuccess={onPaymentSuccess}
          planType={selectedPlan}
        />
      )}
    </SubscriptionContext.Provider>
  );
}