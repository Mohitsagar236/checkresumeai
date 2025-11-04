import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Check, Star, Zap, BarChart3, Users, Globe, 
  Shield, Award, TrendingUp, Brain, FileText, DollarSign,
  ArrowRight, Sparkles, Target, Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { PremiumUpgradeCard } from '../components/premium/PremiumUpgradeCard';
import { PremiumDashboard } from '../components/premium/PremiumDashboard';

interface PremiumFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  category: 'analysis' | 'insights' | 'tools' | 'support';
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: Target,
    title: 'Advanced ATS Optimization',
    description: 'AI-powered keyword optimization for maximum ATS compatibility',
    benefits: [
      'Real-time keyword analysis',
      'Industry-specific optimization',
      'ATS compatibility scoring',
      'Keyword density optimization'
    ],
    category: 'analysis'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics Dashboard',
    description: 'Deep insights into your resume performance and career trajectory',
    benefits: [
      'Performance tracking over time',
      'Industry benchmarking',
      'Skills gap analysis',
      'Career path recommendations'
    ],
    category: 'insights'
  },
  {
    icon: FileText,
    title: 'AI Cover Letter Generator',
    description: 'Create compelling cover letters tailored to specific job postings',
    benefits: [
      'Job-specific customization',
      'Industry best practices',
      'Multiple writing styles',
      'Professional templates'
    ],
    category: 'tools'
  },
  {
    icon: Globe,
    title: 'LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile for maximum visibility and engagement',
    benefits: [
      'Headline optimization',
      'Summary enhancement',
      'Skills prioritization',
      'Visibility scoring'
    ],
    category: 'tools'
  },
  {
    icon: Brain,
    title: 'Career Path Intelligence',
    description: 'AI-driven career recommendations based on your skills and market trends',
    benefits: [
      'Personalized career paths',
      'Skill development roadmap',
      'Market opportunity analysis',
      'Growth projections'
    ],
    category: 'insights'
  },
  {
    icon: DollarSign,
    title: 'Salary Insights & Negotiation',
    description: 'Market-based salary data and negotiation strategies',
    benefits: [
      'Real-time salary data',
      'Negotiation templates',
      'Market positioning',
      'Compensation benchmarking'
    ],
    category: 'insights'
  },
  {
    icon: Users,
    title: 'Resume Comparison & Benchmarking',
    description: 'Compare your resume against industry leaders and track improvements',
    benefits: [
      'Anonymous peer comparison',
      'Industry leader benchmarks',
      'Improvement tracking',
      'Competitive analysis'
    ],
    category: 'analysis'
  },
  {
    icon: Shield,
    title: 'Priority Support & Coaching',
    description: '24/7 priority support with access to career coaching experts',
    benefits: [
      '24/7 priority support',
      'One-on-one career coaching',
      'Resume review sessions',
      'Interview preparation'
    ],
    category: 'support'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    image: '/images/testimonials/sarah.jpg',
    quote: 'Premium features helped me land my dream job at Google. The ATS optimization was a game-changer!',
    improvement: '3x more interviews'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Marketing Director',
    company: 'Netflix',
    image: '/images/testimonials/michael.jpg',
    quote: 'The career path intelligence showed me opportunities I never considered. Truly transformative.',
    improvement: '40% salary increase'
  },
  {
    name: 'Emily Watson',
    role: 'Data Scientist',
    company: 'Microsoft',
    image: '/images/testimonials/emily.jpg',
    quote: 'The analytics dashboard helped me track my progress and optimize my job search strategy.',
    improvement: '50% faster hiring'
  }
];

export function PremiumPage() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'analysis' | 'insights' | 'tools' | 'support'>('all');

  const filteredFeatures = selectedCategory === 'all' 
    ? premiumFeatures 
    : premiumFeatures.filter(feature => feature.category === selectedCategory);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold mb-4">Premium Career Optimization</h1>
                  <p className="text-gray-600 mb-8">
                    Sign in to unlock premium features and accelerate your career growth.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    Sign In to Access Premium
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PremiumDashboard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
                <h1 className="text-5xl font-bold mb-6">
                  Unlock Your Career Potential
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Transform your job search with AI-powered insights, industry benchmarks, 
                  and personalized career optimization tools designed by experts.
                </p>
                <div className="flex items-center justify-center space-x-8 text-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold">10x</div>
                    <div className="text-sm">Better Job Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">3x</div>
                    <div className="text-sm">More Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50%</div>
                    <div className="text-sm">Faster Hiring</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <div className="flex space-x-2">
                  {['all', 'analysis', 'insights', 'tools', 'support'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <feature.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {feature.description}
                          </p>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-gray-600">See how premium members transformed their careers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gradient-to-br from-white to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full w-fit">
                      {testimonial.improvement}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Upgrade Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <PremiumUpgradeCard variant="full" showComparison={true} />
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                    <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
                  </div>                  <div>
                    <h4 className="font-semibold mb-2">What is your refund policy?</h4>
                    <p className="text-gray-600 text-sm">All sales are final. Please carefully review our subscription options before completing your purchase.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How does the ATS optimization work?</h4>
                    <p className="text-gray-600 text-sm">Our AI analyzes your resume against hundreds of ATS systems and provides specific recommendations to improve compatibility.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What kind of support is included?</h4>
                    <p className="text-gray-600 text-sm">Premium members get 24/7 priority support, including one-on-one career coaching sessions and resume review consultations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PremiumPage;
