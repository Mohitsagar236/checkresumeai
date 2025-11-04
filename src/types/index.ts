export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
  uploadDate: Date;
  jobRole: string;
  industry: string;
}

export interface ErrorInfo {
  occurred: boolean;
  message: string;
  fallbackUsed: boolean;
  timestamp: string;
}

export interface AnalysisResult {
  id: string;
  resumeId: string;
  atsScore: number;
  formatAnalysis: FormatAnalysis;
  contentAnalysis: ContentAnalysis;
  skillsGap: SkillsGap;
  suggestions: Suggestion[];
  createdAt: Date;
  analysis?: {
    errorInfo?: ErrorInfo;
    [key: string]: unknown;
  };
  courseSuggestions?: Array<{ 
    title: string; 
    platform: string; 
    link: string; 
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    price?: 'Free' | 'Paid' | 'Freemium';
    duration?: string;
  }>; // Enhanced course suggestions
}

export interface FormatAnalysis {
  score: number;
  layout: {
    score: number;
    feedback: string;
  };
  readability: {
    score: number;
    feedback: string;
  };
  organization: {
    score: number;
    feedback: string;
  };
}

export interface ContentAnalysis {
  score: number;
  keywords: {
    score: number;
    matched: string[];
    missing: string[];
    feedback: string;
  };
  actionVerbs: {
    score: number;
    strong: string[];
    weak: string[];
    feedback: string;
  };
  experience: {
    score: number;
    feedback: string;
  };
}

export interface SkillsGap {
  score: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
}

export interface Suggestion {
  section: string;
  priority: 'high' | 'medium' | 'low';
  current: string;
  suggested: string;
  reason: string;
}

export interface JobRole {
  id: string;
  title: string;
  requiredSkills: string[];
  keyResponsibilities: string[];
  keywords: string[];
}

export interface Industry {
  id: string;
  name: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  realTimeFeatures?: string[];
  bonusFeatures?: string[];
  limitations?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
  relatedQuestions?: string[];
  helpfulVotes?: number;
  unhelpfulVotes?: number;
}

// Export subscription types
export type {
  SubscriptionTier,
  SubscriptionPlanPeriod,
  SubscriptionFeatures,
  SubscriptionLimits,
  SubscriptionData,
  SubscriptionContextType
} from './subscription';

// Export subscription values/functions
export {
  TIER_FEATURES,
  SUBSCRIPTION_LIMITS,
  DEFAULT_USAGE_DATA,
  getResumeLimits
} from './subscription';

// Legacy Premium subscription limits (for backward compatibility)
export const PREMIUM_SUBSCRIPTION_LIMITS = {
  monthly: {
    monthlyLimit: 10,  // 10 resumes per month
    totalLimit: 10     // 10 resumes total for monthly plan
  },
  yearly: {
    monthlyLimit: 10,  // 10 resumes per month
    totalLimit: 50     // 50 resumes total for yearly plan
  }
};