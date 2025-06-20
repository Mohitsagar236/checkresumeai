import React from 'react';
import { Zap, Activity, Gauge, Clock, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface RealTimeFeatureProps {
  feature: string;
  delay: number;
}

const RealTimeFeature = ({ feature, delay }: RealTimeFeatureProps) => {
  // Determine which icon to use based on the feature text
  const getIcon = () => {
    if (feature.toLowerCase().includes('monitor')) return Gauge;
    if (feature.toLowerCase().includes('coach')) return Users;
    if (feature.toLowerCase().includes('instant')) return Clock;
    if (feature.toLowerCase().includes('trend')) return TrendingUp;
    if (feature.toLowerCase().includes('live')) return Activity;
    // Default icon
    return Zap;
  };

  const Icon = getIcon();

  return (
    <motion.div 
      className="flex items-center gap-3 bg-gradient-brand-subtle dark:bg-gradient-premium-dark p-3 rounded-lg shadow-sm mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.15, duration: 0.5 }}
    >
      <div className="flex-shrink-0">
        <div className="p-1.5 bg-brand-500 dark:bg-premium-500 rounded-md shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{feature}</div>
      <div className="ml-auto">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Real-time
        </span>
      </div>
    </motion.div>
  );
};

interface RealTimeFeatureListProps {
  features: string[];
  className?: string;
  isActive?: boolean;
}

export function RealTimeFeatureList({ features, className, isActive = true }: RealTimeFeatureListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3 mt-4", className)}>
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full mr-2"></div>
        <h4 className="text-md font-heading font-semibold text-gradient-brand dark:text-gradient-gold">Real-Time Features</h4>
      </div>
      <div className={cn(
        "transition-opacity duration-500",
        !isActive && "opacity-50 pointer-events-none filter blur-[1px]"
      )}>
        {features.map((feature, index) => (
          <RealTimeFeature key={index} feature={feature} delay={index} />
        ))}
      </div>
    </div>
  );
}
