import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Check, Zap, Star, BarChart3, Download, Globe, 
  Users, Sparkles, TrendingUp, Shield, Award, Brain,
  FileText, Target, Briefcase, DollarSign, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useSubscription } from '../../hooks/useSubscription';

interface PremiumFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  category: 'analysis' | 'insights' | 'tools' | 'support';
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics Dashboard',
    description: 'Comprehensive performance tracking and historical analysis',
    category: 'insights'
  },
  {
    icon: Target,
    title: 'ATS Optimization Engine',
    description: 'AI-powered keyword optimization for Applicant Tracking Systems',
    category: 'analysis'
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights & Benchmarking',
    description: 'Compare your resume against industry standards and top performers',
    category: 'insights'
  },
  {
    icon: FileText,
    title: 'Cover Letter Generator',
    description: 'AI-generated cover letters tailored to specific job postings',
    category: 'tools'
  },
  {
    icon: Globe,
    title: 'LinkedIn Profile Optimization',
    description: 'Optimize your LinkedIn profile for maximum visibility',
    category: 'tools'
  },
  {
    icon: Brain,
    title: 'Career Path Suggestions',
    description: 'Personalized career recommendations based on your skills and experience',
    category: 'insights'
  },
  {
    icon: DollarSign,
    title: 'Salary Insights & Negotiation Tips',
    description: 'Market-based salary data and negotiation strategies',
    category: 'insights'
  },
  {
    icon: Sparkles,
    title: 'Skill Trend Analysis',
    description: 'Identify emerging skills and market demands in your field',
    category: 'analysis'
  },
  {
    icon: Download,
    title: 'Professional Export Options',
    description: 'Export optimized resumes in multiple formats with custom branding',
    category: 'tools'
  },
  {
    icon: Users,
    title: 'Resume Comparison Tool',
    description: 'Compare multiple resumes and track improvements over time',
    category: 'analysis'
  },
  {
    icon: Briefcase,
    title: 'Bulk Analysis for Teams',
    description: 'Analyze multiple resumes simultaneously for HR and recruitment',
    category: 'tools'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 priority customer support with dedicated account management',
    category: 'support'
  }
];

const categoryColors = {
  analysis: 'bg-blue-50 text-blue-700 border-blue-200',
  insights: 'bg-purple-50 text-purple-700 border-purple-200',
  tools: 'bg-green-50 text-green-700 border-green-200',
  support: 'bg-orange-50 text-orange-700 border-orange-200'
};

interface PremiumUpgradeCardProps {
  variant?: 'compact' | 'full';
  showComparison?: boolean;
  className?: string;
}

export function PremiumUpgradeCard({ 
  variant = 'full', 
  showComparison = true,
  className = '' 
}: PremiumUpgradeCardProps) {
  const { isPremium, openPaymentModal } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (isPremium) {
    return null; // Don't show upgrade card to premium users
  }

  const compactView = variant === 'compact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
    >
      <Card className="overflow-hidden border-2 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
        {/* Premium Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <CardTitle className="flex items-center text-2xl font-bold">
              <Crown className="w-8 h-8 mr-3 text-yellow-300" />
              Upgrade to Premium
              <div className="ml-auto">
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Save 40%
                </span>
              </div>
            </CardTitle>
            <p className="text-blue-100 mt-2">
              Unlock the full power of AI-driven career optimization
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6">          {/* Pricing Options */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`py-3 px-4 rounded-md font-semibold transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
                <div className="text-sm font-normal">₹99/month</div>
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`py-3 px-4 rounded-md font-semibold transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <div className="text-sm font-normal">₹499/year</div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  58% OFF
                </div>
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          {!compactView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${categoryColors[feature.category]}`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Compact Feature List */}
          {compactView && (
            <div className="mb-6">
              <div className="grid grid-cols-1 gap-2">
                {premiumFeatures.slice(0, 6).map((feature) => (
                  <div key={feature.title} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature.title}</span>
                  </div>
                ))}
                <div className="flex items-center space-x-2 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">+ {premiumFeatures.length - 6} more premium features</span>
                </div>
              </div>
            </div>
          )}

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Premium Value</h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">10x</div>
                <div className="text-sm text-gray-600">Better Job Match</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">3x</div>
                <div className="text-sm text-gray-600">Interview Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">50%</div>
                <div className="text-sm text-gray-600">Faster Hiring</div>
              </div>
            </div>
          </div>

          {/* Free vs Premium Comparison */}
          {showComparison && !compactView && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Free vs Premium</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-semibold text-gray-700">Feature</div>
                <div className="font-semibold text-gray-700 text-center">Free</div>
                <div className="font-semibold text-blue-600 text-center">Premium</div>
                
                <div className="text-gray-600">Resume Analyses</div>
                <div className="text-center text-gray-500">3/month</div>
                <div className="text-center text-green-600 font-semibold">Unlimited</div>
                
                <div className="text-gray-600">ATS Score</div>
                <div className="text-center text-green-600">✓</div>
                <div className="text-center text-green-600">✓</div>
                
                <div className="text-gray-600">Advanced Analytics</div>
                <div className="text-center text-red-500">✗</div>
                <div className="text-center text-green-600">✓</div>
                
                <div className="text-gray-600">Industry Insights</div>
                <div className="text-center text-red-500">✗</div>
                <div className="text-center text-green-600">✓</div>
                
                <div className="text-gray-600">Support</div>
                <div className="text-center text-gray-500">Community</div>
                <div className="text-center text-green-600">Priority</div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button 
            onClick={() => openPaymentModal(selectedPlan)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Crown className="w-5 h-5 mr-2" />
            Start Your Premium Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              All sales are final • Cancel anytime • Secure payment
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PremiumUpgradeCard;
