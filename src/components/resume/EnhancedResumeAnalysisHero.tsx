// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\components\resume\EnhancedResumeAnalysisHero.tsx
import React from 'react';
import { ResumeAnalysisHero } from './ResumeAnalysisHero';
import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { Badge } from '../ui/Badge';
import { Zap } from 'lucide-react';

interface EnhancedResumeAnalysisHeroProps {
  onResumeUpload?: (file: File, processedResume?: ProcessedResume) => void;
  onJobRoleSelect?: (jobRole: string) => void;
  onSubmit?: () => void;
  jobRoles?: Array<{id: string, title: string}>;
  isPremium?: boolean;
}

export const EnhancedResumeAnalysisHero: React.FC<EnhancedResumeAnalysisHeroProps> = (props) => {
  const { isPremium, ...restProps } = props;
    // Ensure PDF worker is initialized before rendering
  React.useEffect(() => {
    // Import dynamically to prevent circular dependencies
    import('../../utils/pdf-worker-manager').then(module => {
      // Initialize worker if needed
      module.ensurePdfWorkerInitialized().catch((error: Error) => {
        console.error("Error initializing PDF worker in EnhancedResumeAnalysisHero:", error);
      });
    }).catch((importError: Error) => {
      console.error("Failed to import PDF worker manager:", importError);
    });
  }, []);
  
  return (
    <div className="relative">
      {isPremium && (
        <div className="absolute -top-4 right-4 z-10">
          <Badge variant="premium" className="px-3 py-1 flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Premium Analysis
          </Badge>
        </div>
      )}
      
      <div className={isPremium ? "border-2 border-purple-500 rounded-lg shadow-purple-100 dark:shadow-purple-900/20 p-1" : ""}>
        <ResumeAnalysisHero {...restProps} isPremium={isPremium} />
      </div>
      
      {isPremium && (
        <div className="mt-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Premium Features Enabled
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
            You have access to enhanced analytics, real-time scoring, and advanced ATS recommendations.
          </p>
        </div>
      )}
    </div>
  );
};
