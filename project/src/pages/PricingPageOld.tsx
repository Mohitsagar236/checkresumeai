import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import BrandButton from '../components/ui/BrandButton';
import { BrandCard, BrandCardContent, BrandCardHeader } from '../components/ui/BrandCard';
import { Check, Crown, X, Zap } from 'lucide-react';
import { mockPricingPlans } from '../data/mockData';
import { RealTimeFeatureList } from '../components/premium/RealTimeFeatureList';
import { useSubscription } from '../hooks/useSubscription';

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const { tier, upgradeToFreemium, openPaymentModal } = useSubscription();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-brand text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative z-10 text-center mb-16">
            {/* Abstract background shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-10 right-0 w-40 h-40 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl -z-10"></div>

            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium font-brand-body text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 rounded-brand-full">
              Pricing Plans
            </span>
            <h1 className="text-4xl md:text-5xl font-brand-display font-bold text-gradient-primary mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg font-brand-body text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Choose the plan that suits your needs, upgrade or downgrade anytime
            </p>

            <div className="flex items-center justify-center mt-10">
              <div className="relative bg-white dark:bg-slate-800 p-1 rounded-brand-lg inline-flex shadow-brand-md">
                {/* Animated highlight pill */}
                <div className={`absolute inset-0 h-full rounded-brand-lg transition-all duration-300 ease-out ${billingCycle === 'monthly'
                  ? 'transform translate-x-0 w-1/2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10'
                  : 'transform translate-x-full w-1/2 -translate-x-full bg-gradient-to-r from-brand-accent/10 to-brand-primary/10'
                  }`}></div>
                <button
                  className={`relative z-10 px-6 py-3 rounded-brand-md text-sm font-medium font-brand-body transition-all duration-300 ${billingCycle === 'monthly'
                    ? 'text-brand-primary dark:text-brand-primary-light'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-neutral-100'
                    }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`relative z-10 px-6 py-3 rounded-brand-md text-sm font-medium font-brand-body transition-all duration-300 ${billingCycle === 'yearly'
                    ? 'text-brand-primary dark:text-brand-primary-light'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-neutral-100'
                    }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                  <span className="ml-2 px-2 py-0.5 text-xs bg-brand-success/10 text-brand-success dark:bg-brand-success/20 dark:text-green-400 font-semibold rounded-brand-full">Save 58%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blurred backgrounds */}
            <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
            <div className="hidden md:block absolute bottom-0 left-0 -translate-x-1/3 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

            {mockPricingPlans
              .filter(plan =>
                plan.id === 'free' ||
                (billingCycle === 'monthly' && plan.id === 'premium-monthly') ||
                (billingCycle === 'yearly' && plan.id === 'premium-yearly')
              )
              .map(plan => (
                <Card
                  key={plan.id}
                  className={`group relative border-0 overflow-hidden transition-all duration-500 ease-out ${plan.id.includes('premium')
                    ? 'shadow-luxury-xl hover:shadow-luxury-xl card-premium bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/90 md:scale-105 z-10 border-gradient-luxury'
                    : 'shadow-luxury hover:shadow-luxury-lg hover:-translate-y-2 bg-white/90 dark:bg-slate-800/70 backdrop-blur-md border border-gray-100/50 dark:border-gray-700/50'
                    }`}
                >
                  {plan.id.includes('premium') && (
                    <div className="absolute top-2 right-2 bg-gradient-luxury-purple text-white px-3 py-1 text-xs font-semibold shadow-md rounded-md z-10">
                      RECOMMENDED
                    </div>
                  )}


                  <CardHeader className={`pb-0 ${plan.id.includes('premium') ? 'pt-8' : 'pt-6'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className={`text-xl font-luxury ${plan.id.includes('premium') ? 'text-gradient-premium-blue' : 'text-gray-900 dark:text-white'}`}>
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {plan.billingCycle === 'monthly' ? 'Monthly billing' : 'Yearly billing'}
                        </CardDescription>
                      </div>
                      {plan.id.includes('premium') && (
                        <div className="status-premium text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Most Popular
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-baseline">
                      <span className={`font-premium-display ${plan.id.includes('premium')
                        ? 'text-5xl text-gradient-premium-multi'
                        : 'text-5xl font-extrabold text-gray-900 dark:text-white'
                        }`}>
                        ₹{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2 text-lg font-medium">
                          /{plan.billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>

                    {plan.id.includes('premium') && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                          {plan.billingCycle === 'monthly' ? 'No commitment required' : 'Best value'}
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-6"></div>

                    {/* Current Plan Indicator */}
                    {((plan.id === 'free' && tier === 'free') ||
                      (plan.id === 'freemium' && tier === 'freemium') ||
                      (plan.id.includes('premium') && tier === 'premium')) && (
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                          <p className="text-sm text-blue-700 dark:text-blue-300 text-center font-medium">
                            Your Current Plan
                          </p>
                        </div>
                      )}

                    {/* Features List */}
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`flex-shrink-0 rounded-full p-1 mr-3 mt-0.5 ${plan.id === 'freemium'
                            ? 'bg-purple-50 dark:bg-purple-900/30'
                            : plan.id.includes('premium')
                              ? 'bg-blue-50 dark:bg-blue-900/30'
                              : 'bg-gray-50 dark:bg-gray-800/50'
                            }`}>
                            <Check className={`h-4 w-4 ${plan.id === 'freemium'
                              ? 'text-purple-600 dark:text-purple-400'
                              : plan.id.includes('premium')
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-green-500'
                              }`} />
                          </div>
                          <span className={`text-gray-600 dark:text-gray-300 ${plan.id !== 'free' ? 'font-medium' : ''}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Limitations List */}
                    {plan.limitations && (
                      <div className="mt-6">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-6"></div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Limitations</h4>
                        <ul className="space-y-4">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="flex-shrink-0 rounded-full p-1 mr-3 mt-0.5 bg-gray-50 dark:bg-gray-800/50">
                                <X className="h-4 w-4 text-gray-400" />
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">
                                {limitation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.realTimeFeatures && (
                      <div className="mt-6 mb-2">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-6"></div>
                        <div className="flex items-center mb-4">
                          <Zap className="w-5 h-5 text-premium-500 mr-2" />
                          <h4 className="font-heading font-medium text-gray-800 dark:text-gray-200">Real-Time Features</h4>
                        </div>
                        <RealTimeFeatureList features={plan.realTimeFeatures} isActive={true} />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button
                      variant={plan.id.includes('premium') ? 'premium' : 'outline'}
                      fullWidth
                      className={`${plan.id.includes('premium')
                        ? 'h-12 text-sm font-medium shadow-md group-hover:shadow-lg transition-all'
                        : 'h-11'
                        }`}
                      onClick={() => {
                        if (plan.id === 'freemium') {
                          // Upgrade to freemium tier
                          upgradeToFreemium();
                          window.location.href = '/upload';
                        } else if (plan.price > 0) {
                          // Open payment modal for premium plans
                          openPaymentModal(plan.id.includes('yearly') ? 'yearly' : 'monthly');
                        } else {
                          // Navigate to upload page for free plan
                          window.location.href = '/upload';
                        }
                      }}
                    >
                      {plan.id === 'freemium' ? (
                        tier === 'free' ? (
                          <>Upgrade to Freemium</>
                        ) : (
                          <>Current Plan</>
                        )
                      ) : plan.id.includes('premium') ? (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          {tier === 'premium' ? 'Current Plan' : 'Get Premium'}
                        </>
                      ) : (
                        tier === 'free' ? 'Start Free' : 'Switch to Free'
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                      {plan.id.includes('premium')
                        ? '7-day money-back guarantee'
                        : 'No credit card required'}
                    </p>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {/* Feature Comparison */}
          <div className="mt-24 bg-gradient-premium dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/30 relative overflow-hidden border dark:border-slate-700/30">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white dark:bg-grid-gray-900 opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent dark:shadow-glow">Feature Comparison</h2>

              <button
                onClick={() => setShowPlanComparison(!showPlanComparison)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {showPlanComparison ? 'Show Less' : 'Show All Features'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-2 h-5 w-5 transition-transform duration-300 ${showPlanComparison ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm dark:shadow-slate-900/30">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"></th>
                    <th className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg dark:text-neutral-200">Free</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">₹0/month</span>
                      </div>
                    </th>
                    <th className="p-4 text-center font-semibold border-b border-gray-200 dark:border-gray-700">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg text-blue-700 dark:text-blue-400 dark:shadow-glow">Premium</span>
                        <span className="text-sm text-blue-600/70 dark:text-blue-400/70">
                          ₹{billingCycle === 'monthly' ? '99' : '499'}/{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">ATS Compatibility Score</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">Basic Format Analysis</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">Resume Scans per Month</td>
                    <td className="p-4 text-center font-medium">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-800 dark:text-gray-300 text-sm">2</span>
                    </td>
                    <td className="p-4 text-center font-medium">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-300 text-sm">Unlimited</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Detailed Content Analysis</span>                          <div className="ml-2 group relative">
                          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 cursor-help shadow-sm dark:shadow-slate-900/50">?</div>
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg dark:shadow-slate-900/50 text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                            In-depth evaluation of your resume content with AI-powered recommendations
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Skills Gap Analysis</span>
                        <div className="ml-2 group relative">
                          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 cursor-help">?</div>
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg text-xs text-gray-600 dark:text-gray-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                            Identifies missing skills required for your target job positions
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-800 dark:text-gray-300 text-sm">Basic</span>
                    </td>
                    <td className="p-4 text-center font-medium">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-300 text-sm">Advanced</span>
                    </td>
                  </tr>

                  {/* Collapsible rows - only shown when showPlanComparison is true */}
                  <tr className={`border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Improvement Suggestions</span>
                        <div className="ml-2 group relative">
                          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 cursor-help">?</div>
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg text-xs text-gray-600 dark:text-gray-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                            Actionable recommendations to improve your resume effectiveness
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">
                      <div className="flex items-center justify-center">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-800 dark:text-gray-300 text-sm">Limited (3)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">
                      <div className="flex items-center justify-center">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-300 text-sm">Comprehensive (10+)</span>
                      </div>
                    </td>
                  </tr>
                  <tr className={`border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Downloadable Reports</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded shadow-sm dark:shadow-blue-900/40 border border-blue-200/20 dark:border-blue-700/30">Premium</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={`border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>LinkedIn Profile Optimization</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded">New</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={`border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">Cover Letter Analyzer</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={`border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">Job Application Tracker</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={`border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent transition-opacity duration-300 ${showPlanComparison ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">Priority Support</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Real-Time Features Section Header */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20">
                    <td colSpan={3} className="p-4 text-blue-700 dark:text-blue-300 font-bold">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Real-Time Features
                      </div>
                    </td>
                  </tr>

                  {/* Live ATS score monitoring */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Live ATS score monitoring during analysis</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">Real-time</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Real-time keyword match detection */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Real-time keyword match detection</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">Real-time</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Instant feedback */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Instant feedback as you edit your resume</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">Real-time</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Live coaching */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-transparent">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Live coaching on improving resume sections</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">Real-time</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Continuous scoring */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-neutral-100 font-medium">
                      <div className="flex items-center">
                        <span>Continuous scoring trend visualization</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">Real-time</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-white bg-white/20 rounded-full backdrop-blur-sm shadow-sm dark:shadow-white/20">
                Got Questions?
              </span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent mb-3 dark:shadow-glow">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about our plans and services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FaqCard
                question="Can I cancel my subscription anytime?"
                answer="Yes, you can cancel your premium subscription at any time. Your access will continue until the end of your current billing period, after which you'll be downgraded to the free plan."
                icon="calendar"
              />

              <FaqCard
                question="Do you offer refunds?"
                answer="We offer a 7-day money-back guarantee for all new premium subscriptions. If you're not satisfied with our service, simply contact our support team within 7 days of your purchase for a full refund."
                icon="shield"
              />

              <FaqCard
                question="Do you have a student discount?"
                answer="Yes! We offer a 40% discount for students. Please contact our support team with a valid student ID or .edu email address to get your discount code."
                icon="academic"
              />

              <FaqCard
                question="How secure is my resume data?"
                answer="We take data security very seriously. All resume data is encrypted both in transit and at rest. We never share your data with third parties without your explicit consent."
                icon="lock"
              />

              <FaqCard
                question="Can I use the service on mobile devices?"
                answer="Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can analyze your resume on the go!"
                icon="device"
              />

              <FaqCard
                question="How do I get help if I have an issue?"
                answer="Free users can access our knowledge base and community forums. Premium users get priority email support with responses within 24 hours, plus access to live chat during business hours."
                icon="help"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 py-12 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-md dark:shadow-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent dark:shadow-glow">10K+</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">95%</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Success Rate</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">2.5M+</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Resumes Analyzed</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">4.9/5</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Average Rating</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 relative overflow-hidden rounded-2xl shadow-lg dark:shadow-slate-900/40">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-700 dark:via-indigo-800 dark:to-violet-900"></div>
            <div className="absolute inset-0 bg-grid-white opacity-10"></div>
            <div className="absolute -right-20 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 p-12 text-center">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-white bg-white/20 rounded-full backdrop-blur-sm shadow-sm dark:shadow-white/20">
                Level Up Your Career
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">Ready to Boost Your Job Search?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of job seekers who improved their interview chances with ResumeAI
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/upload">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="!bg-white !text-blue-700 hover:!bg-blue-50 hover:!text-blue-800 w-full sm:w-auto shadow-lg hover:shadow-xl dark:shadow-blue-900/30 dark:hover:shadow-blue-900/40 transition-all transform hover:-translate-y-1 !border-blue-200 dark:!bg-slate-800 dark:!text-blue-400 dark:hover:!bg-slate-700 dark:!border-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Try Free Analysis
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="premium"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl dark:shadow-amber-900/30 dark:hover:shadow-amber-900/40 transition-all transform hover:-translate-y-1 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-500 dark:to-blue-400 border-0 dark:premium-glow"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Get Premium
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center text-sm text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secured with 256-bit encryption. 100% satisfaction guarantee.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Card Component
function FaqCard({ question, answer, icon }: { question: string; answer: string; icon: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'shield':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'academic':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      case 'lock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'device':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'help':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <Card className="border-0 shadow-md dark:shadow-slate-900/40 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all overflow-hidden bg-white dark:bg-slate-800/90 faq-item-shadow">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400 shadow-sm dark:shadow-blue-500/20">
              {getIcon()}
            </div>
            <CardTitle className="text-lg dark:text-neutral-100">{question}</CardTitle>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/80 flex items-center justify-center shadow-sm dark:shadow-slate-900/30"
            aria-label={isOpen ? "Collapse question" : "Expand question"}
            title={isOpen ? "Collapse question" : "Expand question"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </CardHeader>
      <CardContent className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0 p-0'}`}>
        <p className="text-gray-600 dark:text-gray-300">
          {answer}
        </p>
      </CardContent>
    </Card>
  );
}

export default PricingPage;