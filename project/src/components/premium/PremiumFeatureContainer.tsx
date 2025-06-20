import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { PremiumBadge } from './PremiumBadge';
import { PremiumFeatureOverlay } from './PremiumFeatureOverlay';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useSubscription } from '../../hooks/useSubscription';
import { UpgradePrompt } from './UpgradePrompt';

interface PremiumFeatureContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Determines if the feature is unlocked (premium) */
  isActive?: boolean;
  /** Optional plan type to display in payment modal */
  planType?: 'monthly' | 'yearly';
  /** Use enhanced upgrade prompt */
  useEnhancedPrompt?: boolean;
}

export function PremiumFeatureContainer({
  title,
  description,
  children,
  isActive = false,
  planType = 'monthly',
  useEnhancedPrompt = true
}: PremiumFeatureContainerProps) {  
  const { openPaymentModal } = useSubscription();
  
  const handleUpgradeClick = () => {
    openPaymentModal(planType);
  };
  
  return (
    <Card className={cn(
      'border-0 transition-all duration-300 relative', 
      isActive 
        ? 'shadow-card hover:shadow-card-hover dark:shadow-card-dark bg-white dark:bg-slate-800/80 dark:border-premium-500/30 dark:border' 
        : 'opacity-90 shadow-sm dark:bg-slate-900/90'
    )}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className={cn(
          "font-heading tracking-tight",
          isActive 
            ? "text-gradient-brand dark:text-gradient-gold font-semibold" 
            : "text-gray-700 dark:text-neutral-300"
        )}>
          {title}
        </CardTitle>
        {isActive && <PremiumBadge />}
      </CardHeader>
      <CardContent>        {isActive ? (
          <div className="text-gray-800 dark:text-neutral-100 font-sans leading-relaxed">{children}</div>
        ) : (
          <div className="relative">
            <div
              className="filter blur-lg pointer-events-none dark:blur-md dark:opacity-50 dark:text-gray-400"
              aria-hidden="true"
            >
              {children}
            </div>
            {useEnhancedPrompt ? (
              <UpgradePrompt 
                variant="overlay" 
                title="Upgrade to Premium" 
                description="Get access to this premium feature and more with our premium subscription."
              />
            ) : (
              <PremiumFeatureOverlay 
                title={title} 
                description={description} 
                onUpgrade={handleUpgradeClick}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
