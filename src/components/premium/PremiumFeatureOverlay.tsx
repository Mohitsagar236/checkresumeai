import { Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface PremiumFeatureOverlayProps {
  title?: string;
  description: string;
  /** Optional callback when user clicks upgrade; falls back to /pricing link */
  onUpgrade?: () => void;
}

export function PremiumFeatureOverlay({ 
  title = 'Premium Feature',
  description 
  ,onUpgrade
}: PremiumFeatureOverlayProps) {  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/90 backdrop-blur-md rounded-lg z-10 shadow-inner dark:shadow-slate-900/50"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="premium-overlay-title"
      aria-describedby="premium-overlay-desc"
    >
      <div className="text-center px-6 py-8 bg-gradient-brand-subtle dark:bg-gradient-premium-dark rounded-xl max-w-md mx-auto backdrop-blur-md border border-brand-200/50 dark:border-premium-600/30 shadow-card dark:shadow-premium-dark">
        <div className="bg-gradient-gold p-3.5 rounded-full inline-flex items-center justify-center mb-5 shadow-premium">
          <Lock className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
        </div>
        <h3 id="premium-overlay-title" className="text-2xl font-heading font-bold mb-3 text-gradient-brand dark:text-gradient-gold">{title}</h3>
        <p id="premium-overlay-desc" className="text-gray-700 dark:text-gray-200 mb-6 max-w-md font-sans leading-relaxed">
          {description}
        </p>
        <Button 
          variant="premium" 
          size="lg" 
          onClick={onUpgrade || (() => window.location.href = '/pricing')} 
          className="font-heading font-semibold tracking-wide shadow-premium dark:shadow-premium-dark"
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
}
