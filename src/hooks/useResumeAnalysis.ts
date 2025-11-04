import { useMutation } from '@tanstack/react-query';
import { analyzeResume, ResumeAnalysisResult } from '../services/api/groqService';
import { ProcessedResume } from '../utils/pdf/pdfProcessor';
import { useState } from 'react';

interface UseResumeAnalysisOptions {
  onSuccess?: (data: ResumeAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useResumeAnalysis(options: UseResumeAnalysisOptions = {}) {
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ 
      resumeData, 
      jobRole 
    }: { 
      resumeData: ProcessedResume; 
      jobRole: string 
    }) => {
      return await analyzeResume(resumeData, jobRole);
    },
    onSuccess: (data) => {
      setResult(data);
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error('Resume analysis error:', error);
      if (options.onError) {
        options.onError(error);
      }
    }
  });

  return {
    analyzeResume: mutation.mutate,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    }
  };
}