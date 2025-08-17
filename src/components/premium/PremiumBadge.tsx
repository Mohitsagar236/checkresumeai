import React from 'react';
import { Star } from 'lucide-react';

export function PremiumBadge() {  return (
    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-gold shadow-premium-sm dark:shadow-premium-dark border border-premium-300/30 dark:border-premium-600/30 backdrop-blur-sm">
      <Star className="w-4 h-4 text-white mr-1.5 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" fill="currentColor" />
      <span className="text-xs uppercase tracking-wider text-white font-heading font-bold drop-shadow-sm">Premium</span>
    </div>
  );
}
