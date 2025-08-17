import { ArrowRight, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { PremiumBadge } from "./PremiumBadge";
import { PremiumFeedbackCard } from "../resume/PremiumFeedbackCard";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  showBadge?: boolean;
  variant?: "card" | "overlay" | "inline";
  className?: string;
}

export function UpgradePrompt({ 
  title = "Upgrade to Premium", 
  description = "Unlock advanced features and get more from your resume analysis",
  showBadge = true,
  variant = "card",
  className = ""
}: UpgradePromptProps) {
  const features = [
    "Comprehensive Resume Score Analysis",
    "Advanced ATS Compatibility Analysis",
    "In-depth Skills Gap Assessment",
    "Professional Formatting Guidelines"
  ];  const dummyResults = [
    {
      id: 'skill-section',
      type: 'error' as const,
      priority: 'high' as const,
      message: 'Missing key skills section',
      description: 'Your resume lacks a dedicated skills section, which is crucial for ATS scanning and recruiter review.',
      impact: 'High impact on ATS compatibility and recruiter screening'
    },
    {
      id: 'bullet-points',
      type: 'warning' as const,
      priority: 'medium' as const,
      message: 'Too many bullet points under one job role',
      description: 'Limit bullet points to 3-5 key achievements per role to maintain readability and impact.',
      impact: 'Medium impact on readability and recruiter engagement'
    },
    {
      id: 'education',
      type: 'success' as const,
      priority: 'low' as const,
      message: 'Education section is complete',
      description: 'Well-formatted education section with proper degree, institution, and graduation details.',
      impact: 'Positive contribution to overall resume completeness'
    }
  ];

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 rounded-xl">
        <div className="max-w-md p-6 text-center">
          <div className="flex justify-center mb-4">
            {showBadge && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium">
                <Star className="h-4 w-4 mr-1.5 text-yellow-300 fill-yellow-300" />
                Premium Resume Check
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Check your resume before it gets rejected
          </p>          {/* Premium Sample Results */}
          <div className="mb-6">
            <PremiumFeedbackCard 
              items={dummyResults}
              title="Resume Analysis Preview"
              showPriorityIndicator={true}
              showImpactScore={true}
            />
          </div>

          {/* Features List */}
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Unlock Premium Features:</h4>
          <ul className="space-y-2 mb-6 text-left">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <Link to="/pricing">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <span>Upgrade Now</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 ${className}`}>
        <div className="flex-1">          <div className="flex items-center mb-1">
            {showBadge && <PremiumBadge />}
            <h3 className="font-semibold text-gray-900 dark:text-white ml-2">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <Link to="/pricing">
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white whitespace-nowrap">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white relative">
        <div className="absolute inset-0 bg-white/10 background-pattern-grid"></div>
        <div className="relative z-10 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {title}
          </h3>
          {showBadge && (
            <div className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              <Star className="h-4 w-4 inline mr-1 text-yellow-300 fill-yellow-300" />
              <span>Premium</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link to="/pricing">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <span>Unlock Premium Features</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
