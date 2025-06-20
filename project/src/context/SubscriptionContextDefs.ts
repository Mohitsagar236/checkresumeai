import { createContext } from 'react';
import { 
  SubscriptionContextType, 
  TIER_FEATURES, 
  DEFAULT_USAGE_DATA, 
  SUBSCRIPTION_LIMITS 
} from '../types/subscription';

const defaultContext: SubscriptionContextType = {
  tier: 'free',
  isPremium: false,
  features: TIER_FEATURES.free,
  planPeriod: null,
  hasFeature: () => false,
  openPaymentModal: () => {},
  closePaymentModal: () => {},
  handlePayment: async () => {},
  updateSubscription: () => {},
  setProcessingPayment: () => {},
  expiryDate: null,
  formattedExpiryDate: 'No subscription',
  daysRemaining: null,
  subscriberEmail: null,
  isCurrentUserSubscriber: true,
  // Usage tracking
  usageLimits: SUBSCRIPTION_LIMITS.free,
  usageData: DEFAULT_USAGE_DATA,
  incrementResumeCount: () => false,
  canAnalyzeResume: () => false,
  remainingMonthlyResumes: 0,
  remainingTotalResumes: 0,
  isPlanFull: () => true,
};

export const SubscriptionContext = createContext<SubscriptionContextType>(defaultContext);
