import { useState, useEffect } from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSubscription } from '../../hooks/useSubscription';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A floating button that appears in the corner of the app to promote premium upgrades
 */
export function FloatingPremiumButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPremium, openPaymentModal } = useSubscription();
  
  // Don't show for premium users
  useEffect(() => {
    if (isPremium) return;
    
    // Show after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isPremium]);
  
  const handleUpgradeClick = () => {
    openPaymentModal('monthly');
  };
  
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };
  
  if (!isVisible || isPremium) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="flex flex-col items-end">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-slate-800 shadow-lg mb-2 rounded-lg p-4 max-w-xs"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Upgrade to Premium
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Get real-time resume analysis, ATS optimization, and more premium features.
              </p>
              <Button 
                variant="premium" 
                size="sm" 
                className="w-full"
                onClick={handleUpgradeClick}
              >
                <Sparkles className="w-3 h-3 mr-1" /> Upgrade Now
              </Button>
            </motion.div>
          )}
          
          <Button
            size="sm"
            variant="premium"
            onClick={toggleExpanded}
            className="rounded-full shadow-premium-glow h-10 w-10 p-0 flex items-center justify-center"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
