import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useSubscription } from '../../hooks/useSubscription';

interface PremiumFeatureGateProps {
  featureName: string;
  description: string;
  children: React.ReactNode;
  requiredFeature?: keyof import('../../types/subscription').SubscriptionFeatures;
  showPreview?: boolean;
  previewHeight?: string;
  className?: string;
}

export function PremiumFeatureGate({
  featureName,
  description,
  children,
  requiredFeature,
  showPreview = true,
  previewHeight = '200px',
  className = ''
}: PremiumFeatureGateProps) {
  const { isPremium, hasFeature, openPaymentModal } = useSubscription();

  // Check if user has access to this specific feature
  const hasAccess = isPremium && (!requiredFeature || hasFeature(requiredFeature));

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred Preview */}
      {showPreview && (
        <div 
          className="relative overflow-hidden rounded-lg"
          style={{ height: previewHeight }}
        >
          <div className="absolute inset-0 scale-110 filter blur-sm opacity-30 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        </div>
      )}

      {/* Premium Gate Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center`}
      >
        <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-gradient-to-r from-blue-500 to-purple-600">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center justify-center">
              <Lock className="w-5 h-5 mr-2 text-gray-500" />
              {featureName}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {description}
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-semibold text-gray-800">Premium Feature</span>
              </div>
              <p className="text-sm text-gray-600">
                Unlock this feature and many more with Premium access
              </p>
            </div>

            <Button 
              onClick={() => openPaymentModal('yearly')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>            <p className="text-xs text-gray-500 mt-3">
              All sales are final
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PremiumFeatureGate;
