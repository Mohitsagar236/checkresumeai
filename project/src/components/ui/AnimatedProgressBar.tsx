import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  progress: number;
  colorClass?: 'blue' | 'green' | 'purple' | 'indigo' | 'amber' | 'red' | 'cyan' | 'teal';
  height?: number;
  showAnimation?: boolean;
  showMarker?: boolean;
  indicatorPosition?: number;
  isPremium?: boolean;
  markerLabel?: string;
  showMultipleMarkers?: boolean;
  additionalMarkers?: {position: number; label: string; color?: string;}[];
  className?: string;
}

export function AnimatedProgressBar({
  progress,
  colorClass = 'blue',
  height = 3,
  showAnimation = true,
  showMarker = false,
  indicatorPosition,
  isPremium = false
}: AnimatedProgressBarProps) {
  // Define gradient classes based on color
  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    indigo: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
    cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
    teal: 'bg-gradient-to-r from-teal-400 to-teal-600'
  };
  
  // Define background classes based on color
  const bgClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    indigo: 'bg-indigo-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
    cyan: 'bg-cyan-50',
    teal: 'bg-teal-50'
  };

  // Define marker color classes
  const markerClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600',
    cyan: 'bg-cyan-600',
    teal: 'bg-teal-600'
  };

  const heightClass = height === 2 ? 'h-2' : height === 3 ? 'h-3' : height === 4 ? 'h-4' : 'h-2.5';
  
  // Enhance with premium effects when user is premium
  const premiumEffects = isPremium ? 'shadow-sm' : '';
  const shimmerEffect = isPremium ? 'premium-shimmer' : '';
  
  return (
    <div className={`${bgClasses[colorClass]} rounded-full ${heightClass} w-full relative ${premiumEffects}`}>
      <motion.div 
        className={`${heightClass} rounded-full ${gradientClasses[colorClass]} ${shimmerEffect}`}
        initial={showAnimation ? { width: 0 } : { width: `${progress}%` }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
      />      {/* Industry average marker or other indicators */}
      {showMarker && indicatorPosition !== undefined && (
        <div 
          className={`absolute top-0 bottom-0 w-0.5 ${markerClasses[colorClass]} z-10 opacity-80 marker-position-${indicatorPosition}`}
        >
          <div className={`w-2 h-2 ${markerClasses[colorClass]} rounded-full absolute -top-1 -ml-0.5`}></div>
          <div className="absolute -bottom-5 text-xs text-gray-500 -ml-3">{indicatorPosition}%</div>
        </div>
      )}
    </div>
  );
}
