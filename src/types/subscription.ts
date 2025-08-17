// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\types\subscription.ts
import React from 'react';

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';
export type SubscriptionPlanPeriod = 'monthly' | 'yearly';

export interface SubscriptionFeatures {
  realtimeAnalysis: boolean;
  batchProcessing: boolean;
  customTemplates: boolean;
  api: boolean;
  priority: boolean;
  courseRecommendations: boolean;
  advancedAnalytics: boolean;
  resumeComparison: boolean;
  industryInsights: boolean;
  coverLetterGenerator: boolean;
  linkedinOptimization: boolean;
  unlimitedAnalyses: boolean;
  exportToPdf: boolean;
  careerPathSuggestions: boolean;
  salaryInsights: boolean;
  skillTrendAnalysis: boolean;
  atsOptimization: boolean;
  personalizedCoaching: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  teamCollaboration: boolean;
  bulkAnalysis: boolean;
  whiteLabel: boolean;
}

// Premium plan usage limits
export interface SubscriptionLimits {
  monthlyResumeLimit: number; // Number of resumes allowed per month
  totalResumeLimit: number;   // Total number of resumes for the plan duration
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    monthlyResumeLimit: 2,
    totalResumeLimit: 2,
  },
  premium: {
    monthlyResumeLimit: 10,
    totalResumeLimit: 50,
  },
  enterprise: {
    monthlyResumeLimit: 1000,
    totalResumeLimit: 10000,
  },
};

export const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {  free: {
    realtimeAnalysis: false,
    batchProcessing: false,
    customTemplates: false,
    api: false,
    priority: false,
    courseRecommendations: true, // Changed to true to enable course recommendations for free users
    advancedAnalytics: false,
    resumeComparison: false,
    industryInsights: false,
    coverLetterGenerator: false,
    linkedinOptimization: false,
    unlimitedAnalyses: false,
    exportToPdf: false,
    careerPathSuggestions: false,
    salaryInsights: false,
    skillTrendAnalysis: false,
    atsOptimization: false,
    personalizedCoaching: false,
    prioritySupport: false,
    customBranding: false,
    teamCollaboration: false,
    bulkAnalysis: false,
    whiteLabel: false,
  },
  premium: {
    realtimeAnalysis: true,
    batchProcessing: true,
    customTemplates: true,
    api: false,
    priority: false,
    courseRecommendations: true,
    advancedAnalytics: true,
    resumeComparison: true,
    industryInsights: true,
    coverLetterGenerator: true,
    linkedinOptimization: true,
    unlimitedAnalyses: true,
    exportToPdf: true,
    careerPathSuggestions: true,
    salaryInsights: true,
    skillTrendAnalysis: true,
    atsOptimization: true,
    personalizedCoaching: false,
    prioritySupport: true,
    customBranding: false,
    teamCollaboration: false,
    bulkAnalysis: true,
    whiteLabel: false,
  },
  enterprise: {
    realtimeAnalysis: true,
    batchProcessing: true,
    customTemplates: true,
    api: true,
    priority: true,
    courseRecommendations: true,
    advancedAnalytics: true,
    resumeComparison: true,
    industryInsights: true,
    coverLetterGenerator: true,
    linkedinOptimization: true,
    unlimitedAnalyses: true,
    exportToPdf: true,
    careerPathSuggestions: true,
    salaryInsights: true,
    skillTrendAnalysis: true,
    atsOptimization: true,
    personalizedCoaching: true,
    prioritySupport: true,
    customBranding: true,
    teamCollaboration: true,
    bulkAnalysis: true,
    whiteLabel: true,
  },
};

export interface SubscriptionData {
  tier: SubscriptionTier;
  startDate: string | null; // Date when subscription was purchased
  expiresAt: string | null;
  features: SubscriptionFeatures;
  subscriberEmail: string | null; // Email associated with the subscription
  planPeriod?: SubscriptionPlanPeriod; // 'monthly' or 'yearly' for premium subscriptions
  usageData: {
    resumeCount: number;        // Total resumes analyzed during the subscription period
    monthlyResumeCount: number; // Resumes analyzed in the current month
    lastResetDate: string | null; // Date when the monthly count was last reset
  };
}

export interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPremium: boolean;
  features: SubscriptionFeatures;
  planPeriod: SubscriptionPlanPeriod | null; // 'monthly' or 'yearly' for premium plans
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  openPaymentModal: (plan: SubscriptionPlanPeriod) => void;
  closePaymentModal: () => void;
  handlePayment: () => Promise<void>;
  updateSubscription: (newData: SubscriptionData) => void;
  setProcessingPayment: React.Dispatch<React.SetStateAction<boolean>>;
  expiryDate: string | null;
  formattedExpiryDate: string;
  daysRemaining: number | null;
  subscriberEmail: string | null; // Email associated with the subscription
  isCurrentUserSubscriber: boolean; // Whether current user is the subscription owner
  
  // Usage tracking
  usageLimits: SubscriptionLimits;
  usageData: {
    resumeCount: number;
    monthlyResumeCount: number;
    lastResetDate: string | null;
  };
  incrementResumeCount: () => boolean; // Returns true if increment was successful, false if limit reached
  canAnalyzeResume: () => boolean; // Returns whether user can analyze more resumes
  remainingMonthlyResumes: number; // Number of resumes left for the month
  remainingTotalResumes: number; // Number of resumes left for the subscription period
  isPlanFull: () => boolean; // Whether the user has reached their plan limits
}

// Default values for new subscriptions
export const DEFAULT_USAGE_DATA = {
  resumeCount: 0,
  monthlyResumeCount: 0,
  lastResetDate: new Date().toISOString()
};

// Helper function to get exact resume limits based on subscription tier and plan period
export function getResumeLimits(tier: SubscriptionTier, planPeriod?: SubscriptionPlanPeriod): { monthlyLimit: number, totalLimit: number } {
  const baseLimits = SUBSCRIPTION_LIMITS[tier];
  
  if (tier === 'premium' && planPeriod) {
    if (planPeriod === 'monthly') {
      return {
        monthlyLimit: 10,  // 10 resumes per month for monthly plan
        totalLimit: 10     // Same as monthly for monthly plan
      };
    } else {
      return {
        monthlyLimit: 10,  // Still 10 resumes per month even on yearly plan
        totalLimit: 50     // 50 resumes total for yearly plan
      };
    }
  }
  
  return {
    monthlyLimit: baseLimits.monthlyResumeLimit,
    totalLimit: baseLimits.totalResumeLimit
  };
}
