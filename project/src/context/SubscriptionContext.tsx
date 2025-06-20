import { useState, ReactNode, useEffect, useCallback } from 'react';
import { 
  SubscriptionData, 
  TIER_FEATURES, 
  SUBSCRIPTION_LIMITS,
  DEFAULT_USAGE_DATA,
  getResumeLimits
} from '../types/subscription';
import { 
  getSubscriptionData, 
  saveSubscriptionData, 
  getFormattedExpiryDate, 
  getDaysRemaining, 
  isCurrentUserSubscriptionOwner, 
  verifySubscriptionValidity 
} from './subscriptionHelpers';
import { SubscriptionContext } from './SubscriptionContextDefs';
import { PaymentModal } from '../components/premium/PaymentModal';
import { useAuth } from '../hooks/useAuth';
import { profileAPI } from '../utils/profileAPI';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Get the current authenticated user
  const currentUserEmail = user?.email;
  const userId = user?.id;
  
  // Initialize with validated subscription data
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>(() => {
    // Get initial data and verify it's valid for current user
    const initialData = getSubscriptionData();
    return verifySubscriptionValidity(initialData, currentUserEmail);
  });
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  // This state is used by the PaymentModal component via setProcessingPayment
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch profile data on initial load to get resume usage if available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const profile = await profileAPI.fetchById(userId);
        
        if (profile && profile.resume_usage) {
          // If profile has resume usage data, sync it with subscription
          const updatedData = { ...subscriptionData };

          // Initialize usageData if it doesn't exist
          if (!updatedData.usageData) {
            updatedData.usageData = DEFAULT_USAGE_DATA;
          }
          
          // Update usageData from profile
          updatedData.usageData.resumeCount = profile.resume_usage.total_count;
          updatedData.usageData.monthlyResumeCount = profile.resume_usage.monthly_count;
          
          if (profile.resume_usage.last_reset_date) {
            updatedData.usageData.lastResetDate = profile.resume_usage.last_reset_date;
          }

          // Update plan period if available
          if (profile.subscription_plan_period) {
            updatedData.planPeriod = profile.subscription_plan_period;
          }

          setSubscriptionData(updatedData);
          saveSubscriptionData(updatedData);
        }
      } catch (error) {
        console.error('Error fetching profile data for usage sync:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Re-validate subscription whenever user changes
  useEffect(() => {
    setSubscriptionData(prevData => 
      verifySubscriptionValidity(prevData, currentUserEmail)
    );
  }, [currentUserEmail]);

  // Periodically check subscription status to handle expiry
  useEffect(() => {
    // Check subscription validity every minute
    const intervalId = setInterval(() => {
      setSubscriptionData(prevData => 
        verifySubscriptionValidity(prevData, currentUserEmail)
      );
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [currentUserEmail]);

  const features = TIER_FEATURES[subscriptionData.tier];
  const isPremium = subscriptionData.tier !== 'free';
  
  // Check if current user is the subscription owner
  const isCurrentUserSubscriber = isCurrentUserSubscriptionOwner(currentUserEmail, subscriptionData);
  
  // Get usage limits based on subscription tier and plan period
  const usageLimits = SUBSCRIPTION_LIMITS[subscriptionData.tier];

  // Initialize usageData if needed
  if (!subscriptionData.usageData) {
    subscriptionData.usageData = DEFAULT_USAGE_DATA;
  }

  // Calculate remaining usage
  const exactLimits = getResumeLimits(subscriptionData.tier, subscriptionData.planPeriod);
  const remainingMonthlyResumes = Math.max(0, exactLimits.monthlyLimit - subscriptionData.usageData.monthlyResumeCount);
  const remainingTotalResumes = Math.max(0, exactLimits.totalLimit - subscriptionData.usageData.resumeCount);

  // Check if plan limits are reached
  const isPlanFull = useCallback(() => {
    const exactLimits = getResumeLimits(subscriptionData.tier, subscriptionData.planPeriod);
    return (
      subscriptionData.usageData.monthlyResumeCount >= exactLimits.monthlyLimit ||
      subscriptionData.usageData.resumeCount >= exactLimits.totalLimit
    );
  }, [subscriptionData.tier, subscriptionData.planPeriod, subscriptionData.usageData]);

  // Check if user can analyze more resumes
  const canAnalyzeResume = useCallback(() => {
    // Free tier users and non-subscribers should be limited by the free tier
    if (!isPremium || !isCurrentUserSubscriber) {
      const freeLimits = getResumeLimits('free');
      return (
        subscriptionData.usageData.monthlyResumeCount < freeLimits.monthlyLimit &&
        subscriptionData.usageData.resumeCount < freeLimits.totalLimit
      );
    }
    
    // For premium subscribers
    const exactLimits = getResumeLimits(subscriptionData.tier, subscriptionData.planPeriod);
    return (
      subscriptionData.usageData.monthlyResumeCount < exactLimits.monthlyLimit &&
      subscriptionData.usageData.resumeCount < exactLimits.totalLimit
    );
  }, [isPremium, isCurrentUserSubscriber, subscriptionData.tier, subscriptionData.planPeriod, subscriptionData.usageData]);
  // Increment resume count after analysis
  const incrementResumeCount = useCallback(() => {
    // Check if we're at the limit already
    if (!canAnalyzeResume()) {
      return false;
    }

    // Update usage data
    const updatedData = { ...subscriptionData };
    updatedData.usageData.resumeCount += 1;
    updatedData.usageData.monthlyResumeCount += 1;
    
    // Save to subscription
    setSubscriptionData(updatedData);
    saveSubscriptionData(updatedData);

    // Update profile if user is logged in (fire and forget)
    if (userId) {
      profileAPI.updateResumeUsage(
        userId, 
        {
          total_count: updatedData.usageData.resumeCount,
          monthly_count: updatedData.usageData.monthlyResumeCount,
          last_reset_date: updatedData.usageData.lastResetDate || undefined
        },
        updatedData.planPeriod
      ).catch(error => {
        console.error('Failed to update profile with resume usage:', error);
      });
    }

    return true;
  }, [canAnalyzeResume, subscriptionData, userId]);

  // Check if monthly reset is needed
  useEffect(() => {
    // Skip if no lastResetDate
    if (!subscriptionData.usageData?.lastResetDate) return;
    
    const lastReset = new Date(subscriptionData.usageData.lastResetDate);
    const now = new Date();
    
    // Check if it's been a month since last reset
    const monthHasPassed = 
      now.getMonth() > lastReset.getMonth() || 
      (now.getMonth() === 0 && lastReset.getMonth() === 11) || // December to January case
      now.getFullYear() > lastReset.getFullYear();
      
    if (monthHasPassed) {
      // Reset monthly count
      const updatedData = { ...subscriptionData };
      updatedData.usageData.monthlyResumeCount = 0;
      updatedData.usageData.lastResetDate = now.toISOString();
      
      // Save to subscription
      setSubscriptionData(updatedData);
      saveSubscriptionData(updatedData);
        // Update profile if user is logged in (fire and forget)
      if (userId) {
        profileAPI.updateResumeUsage(
          userId, 
          {
            total_count: updatedData.usageData.resumeCount,
            monthly_count: 0, // Reset to 0
            last_reset_date: now.toISOString()
          },
          updatedData.planPeriod
        ).catch(error => {
          console.error('Failed to update profile with monthly usage reset:', error);
        });
      }
    }
  }, [subscriptionData, userId]);

  const hasFeature = useCallback((feature: keyof typeof features) => {
    // For premium features, verify subscription validity and user ownership
    if (subscriptionData.tier !== 'free') {
      // If the current user is not the subscriber, return the free tier features
      if (!isCurrentUserSubscriber) {
        return TIER_FEATURES.free[feature] || false;
      }
      
      // Check if subscription has expired (additional safeguard)
      if (subscriptionData.expiresAt) {
        const now = new Date();
        const expiryDate = new Date(subscriptionData.expiresAt);
        
        if (expiryDate < now) {
          console.log('Feature access denied - subscription expired:', {
            feature,
            expiryDate: subscriptionData.expiresAt
          });
          return TIER_FEATURES.free[feature] || false;
        }
      }
    }
    
    return Boolean(features[feature]);
  }, [features, subscriptionData.tier, isCurrentUserSubscriber, subscriptionData.expiresAt]);
  
  const openPaymentModal = useCallback((plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  }, []);
  
  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
    setProcessingPayment(false);
  }, []);
  
  const onPaymentSuccess = useCallback(() => {
    // Strict validation of user's email before proceeding with subscription
    if (!currentUserEmail) {
      console.error('No user email available for subscription');
      alert('Please log in with a valid email address before purchasing a subscription');
      return;
    }

    // Get current date as the start date
    const startDate = new Date();
    // Calculate expiration based on plan type - 30 days for monthly, 365 days for yearly
    const expiryDays = selectedPlan === 'yearly' ? 365 : 30;
    const expiryDate = new Date(startDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    
    const newData: SubscriptionData = {
      tier: 'premium',
      startDate: startDate.toISOString(),
      expiresAt: expiryDate.toISOString(),
      features: TIER_FEATURES.premium,
      subscriberEmail: currentUserEmail,
      planPeriod: selectedPlan,
      usageData: {
        resumeCount: 0,
        monthlyResumeCount: 0,
        lastResetDate: new Date().toISOString()
      }
    };
    
    console.log(`Updating subscription with email ${currentUserEmail}, plan ${selectedPlan} and expiry date ${expiryDate.toLocaleDateString()}`);
    
    // Verify the subscription data is valid before saving
    const validatedData = verifySubscriptionValidity(newData, currentUserEmail);
      // Only proceed if the validation returns a premium subscription
    if (validatedData.tier === 'premium') {
      setSubscriptionData(validatedData);
      saveSubscriptionData(validatedData);
      
      // Broadcast subscription change immediately
      window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
        detail: validatedData 
      }));
      
      // Also update the profile in the database (fire and forget)
      if (userId) {
        profileAPI.updateResumeUsage(
          userId,
          {
            total_count: 0,
            monthly_count: 0,
            last_reset_date: new Date().toISOString()
          },
          selectedPlan
        ).catch(error => {
          console.error('Failed to update profile with new subscription data:', error);
        });
      }
      
      // Force refresh to ensure UI updates immediately
      setTimeout(() => {
        const refreshedData = getSubscriptionData();
        const revalidatedData = verifySubscriptionValidity(refreshedData, currentUserEmail);
        setSubscriptionData(revalidatedData);
        
        // Broadcast again after refresh
        window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
          detail: revalidatedData 
        }));
      }, 100);
      
      setIsPaymentModalOpen(false);
    } else {
      console.error('Subscription validation failed during payment process', {
        originalTier: newData.tier,
        validatedTier: validatedData.tier
      });
      alert('There was an issue with your subscription. Please try again or contact support.');
    }
  }, [selectedPlan, currentUserEmail, userId]);
  
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
    console.log('updateSubscription called with:', newData);
    // Always validate subscription data before updating
    const validatedData = verifySubscriptionValidity(newData, currentUserEmail);
    console.log('Validated subscription data:', validatedData);
    
    // Ensure usageData exists
    if (!validatedData.usageData) {
      validatedData.usageData = DEFAULT_USAGE_DATA;
    }
    
    setSubscriptionData(validatedData);
    saveSubscriptionData(validatedData);
    
    // Broadcast subscription change to all components
    window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
      detail: validatedData 
    }));
    
    // Update profile if user is logged in
    if (userId && validatedData.usageData) {
      profileAPI.updateResumeUsage(
        userId, 
        {
          total_count: validatedData.usageData.resumeCount,
          monthly_count: validatedData.usageData.monthlyResumeCount,
          last_reset_date: validatedData.usageData.lastResetDate || undefined
        },
        validatedData.planPeriod
      ).catch(error => {
        console.error('Failed to update profile with subscription data:', error);
      });
    }
    
    // Log if validation downgraded the subscription
    if (validatedData.tier !== newData.tier) {
      console.log('Subscription downgraded during update:', {
        requestedTier: newData.tier,
        actualTier: validatedData.tier,
        reason: newData.expiresAt ? 'Likely expired or email mismatch' : 'Unknown'
      });
    }
  }, [currentUserEmail, userId]);

  // Sync subscription data to localStorage whenever it changes
  useEffect(() => {
    saveSubscriptionData(subscriptionData);
  }, [subscriptionData]);
  
  // Calculate subscription expiry information
  const expiryDate = subscriptionData.expiresAt;
  const formattedExpiryDate = getFormattedExpiryDate(subscriptionData);
  const daysRemaining = getDaysRemaining(subscriptionData);
  const subscriberEmail = subscriptionData.subscriberEmail;
  const planPeriod = subscriptionData.planPeriod || null;

  return (
    <SubscriptionContext.Provider
      value={{
        tier: subscriptionData.tier,
        isPremium,
        features,
        planPeriod,
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
        // Usage tracking
        usageLimits,
        usageData: subscriptionData.usageData || DEFAULT_USAGE_DATA,
        incrementResumeCount,
        canAnalyzeResume,
        remainingMonthlyResumes,
        remainingTotalResumes,
        isPlanFull,
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