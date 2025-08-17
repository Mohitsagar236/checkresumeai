import { SubscriptionData, TIER_FEATURES } from '../types/subscription';

const STORAGE_KEY = 'subscription_data';

const DEFAULT_SUBSCRIPTION: SubscriptionData = {
  tier: 'free',
  startDate: null,
  expiresAt: null,
  features: TIER_FEATURES.free,
  subscriberEmail: null,
};

// Helper function to save subscription data to local storage
export const saveSubscriptionData = (data: SubscriptionData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving subscription data:', error);
  }
};

// Helper function to get subscription data from local storage
export const getSubscriptionData = (): SubscriptionData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SUBSCRIPTION;
    
    const data = JSON.parse(stored) as SubscriptionData;
    // Validate tier
    if (!Object.keys(TIER_FEATURES).includes(data.tier)) {
      return DEFAULT_SUBSCRIPTION;
    }
      // Check expiration
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      console.log('Subscription expired:', data.expiresAt);
      // Log which subscription is being downgraded
      console.log('Downgrading subscription from tier:', data.tier, 'for email:', data.subscriberEmail);
      return DEFAULT_SUBSCRIPTION;
    }

    // Validate that subscription has required email if it's a premium tier
    if (data.tier !== 'free' && !data.subscriberEmail) {
      console.error('Premium subscription missing required email address');
      return DEFAULT_SUBSCRIPTION;
    }

    return data;
  } catch (error) {
    console.error('Error reading subscription data:', error);
    return DEFAULT_SUBSCRIPTION;
  }
};

// Helper function to check if the current user is the subscription owner
export const isCurrentUserSubscriptionOwner = (currentUserEmail: string | null | undefined, subscription: SubscriptionData): boolean => {
  // Free tier is accessible to everyone
  if (!subscription || subscription.tier === 'free') {
    return true;
  }
  
  // For premium subscriptions, strictly require email match
  if (!currentUserEmail || !subscription.subscriberEmail) {
    console.log('Subscription validation failed: Missing email', { 
      userEmail: currentUserEmail, 
      subscriptionEmail: subscription.subscriberEmail 
    });
    return false;
  }
  
  // Compare normalized emails (case insensitive)
  const isOwner = subscription.subscriberEmail.toLowerCase() === currentUserEmail.toLowerCase();
  
  if (!isOwner) {
    console.log('Subscription email mismatch:', { 
      userEmail: currentUserEmail, 
      subscriptionEmail: subscription.subscriberEmail 
    });
  }
  
  // Additional validation for subscription dates
  if (isOwner && subscription.expiresAt) {
    const now = new Date();
    const expiryDate = new Date(subscription.expiresAt);
    
    // If subscription has expired, return false
    if (expiryDate < now) {
      console.log('Subscription expired:', {
        expiryDate: subscription.expiresAt,
        email: subscription.subscriberEmail,
        tier: subscription.tier
      });
      return false;
    }
  }
  
  return isOwner;
};

// Helper function to get formatted subscription expiration date
export const getFormattedExpiryDate = (data: SubscriptionData): string => {
  if (!data.expiresAt) return 'No expiration date';
  
  const expiryDate = new Date(data.expiresAt);
  const now = new Date();
  
  // Check if expired
  if (expiryDate < now) {
    return 'Expired';
  }
  
  // Format the date as "Month DD, YYYY"
  return expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get days remaining until expiration
export const getDaysRemaining = (data: SubscriptionData): number | null => {
  if (!data.expiresAt) return null;
  
  const expiryDate = new Date(data.expiresAt);
  const now = new Date();
  
  // If expired, return 0
  if (expiryDate < now) {
    return 0;
  }
  
  // Calculate days remaining
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Helper function to verify subscription is valid and handle expiration
export const verifySubscriptionValidity = (
  subscriptionData: SubscriptionData, 
  currentUserEmail: string | null | undefined
): SubscriptionData => {
  // If subscription is not premium, no validation needed
  if (subscriptionData.tier === 'free') {
    return subscriptionData;
  }
  
  // Check if the subscription has expired
  if (subscriptionData.expiresAt) {
    const now = new Date();
    const expiryDate = new Date(subscriptionData.expiresAt);
    
    if (expiryDate < now) {
      console.log('Subscription expired during validation check:', {
        expiryDate: subscriptionData.expiresAt,
        email: subscriptionData.subscriberEmail,
        tier: subscriptionData.tier
      });
      
      // Return the default free subscription when expired
      return DEFAULT_SUBSCRIPTION;
    }
  }
  
  // Check if subscription email matches current user email
  if (currentUserEmail && subscriptionData.subscriberEmail) {
    if (subscriptionData.subscriberEmail.toLowerCase() !== currentUserEmail.toLowerCase()) {
      console.log('User email does not match subscription email:', {
        userEmail: currentUserEmail,
        subscriptionEmail: subscriptionData.subscriberEmail
      });
      
      // For mismatched emails, user should not have access to premium features
      return DEFAULT_SUBSCRIPTION;
    }
  }
  
  // If subscription is missing required email field
  if (!subscriptionData.subscriberEmail) {
    console.error('Premium subscription missing required email address');
    return DEFAULT_SUBSCRIPTION;
  }
  
  // All checks passed, subscription is valid
  return subscriptionData;
};
