import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult } from '../types';
import { generateMockAnalysis } from '../data/mockData';
import { useRealTimeFeatures } from './useRealTimeFeatures';

interface AnalysisStage {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface UseRealtimeAnalysisOptions {
  isPremium?: boolean;
  jobDescription?: string;
  realTimeUpdates?: boolean;
  analysisInterval?: number;
}

export function useRealtimeAnalysis(file: File | null, jobRoleId: string, options: UseRealtimeAnalysisOptions = {}) {
  const { 
    isPremium = false, 
    jobDescription, 
    realTimeUpdates = false,
    analysisInterval = 5000 
  } = options;
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resumeText, setResumeText] = useState<string>('');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [stages, setStages] = useState<AnalysisStage[]>([
    { id: 'format', name: 'Format Analysis', progress: 0, status: 'pending' },
    { id: 'content', name: 'Content Analysis', progress: 0, status: 'pending' },
    { id: 'skills', name: 'Skills Analysis', progress: 0, status: 'pending' },
    { id: 'recommendations', name: 'Generating Recommendations', progress: 0, status: 'pending' },
  ]);

  // Use the real-time features hook to get advanced real-time analytics
  const { 
    realTimeData, 
    isActive: isRealTimeActive,
    clearRealTimeData 
  } = useRealTimeFeatures(resumeText, {
    isPremium,
    jobDescription,
    enabled: isAnalyzing && realTimeUpdates && isPremium,
    updateInterval: analysisInterval / 2
  });

  const calculateTotalProgress = useCallback((currentStages: AnalysisStage[]) => {
    const total = currentStages.reduce((acc, stage) => acc + stage.progress, 0);
    return Math.round(total / currentStages.length);
  }, []);

  // Extract text from PDF when file changes
  useEffect(() => {
    if (!file) {
      setResumeText('');
      setPdfError(null);
      setIsLoadingPDF(false);
      return;
    }

    setIsLoadingPDF(true);
    setPdfError(null);

    // In development mode, simulate PDF loading with mock data
    if (process.env.NODE_ENV === 'development') {
      const mockPdfLoadTime = Math.random() * 1000 + 500; // Random time between 500-1500ms
      const simulatePdfLoad = async () => {
        try {
          // Simulate PDF processing delay
          await new Promise(resolve => setTimeout(resolve, mockPdfLoadTime));

          // Mock resume text based on file name patterns
          const mockText = file.name.toLowerCase().includes('developer') 
            ? `Resume for Software Developer position\nExperience: 5 years\nSkills: React, TypeScript, Node.js`
            : `Professional Resume\nCareer Summary: Experienced professional with proven track record\nSkills: Leadership, Communication, Project Management`;

          setResumeText(mockText);
          setIsLoadingPDF(false);
        } catch (error) {
          setPdfError('Error loading PDF in development mode');
          setIsLoadingPDF(false);
        }
      };

      simulatePdfLoad();
      return;
    }

    // Production PDF handling
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // This would be replaced with actual PDF text extraction logic
        const text = await extractPdfText(e.target?.result as ArrayBuffer);
        setResumeText(text);
      } catch (error) {
        setPdfError(error instanceof Error ? error.message : 'Error extracting PDF text');
      } finally {
        setIsLoadingPDF(false);
      }
    };
    reader.onerror = () => {
      setPdfError('Error reading PDF file');
      setIsLoadingPDF(false);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  useEffect(() => {
    // Reset or initiate analysis
    if (!file || !jobRoleId) {
      setAnalysis(null);
      setProgress(0);
      setStages(prev => prev.map(s => ({ ...s, progress: 0, status: 'pending' })));
      setIsAnalyzing(false);
      clearRealTimeData();
      return;
    }

    if (isLoadingPDF) {
      return; // Wait for PDF to load before starting analysis
    }

    if (pdfError) {
      setStages(prev => prev.map(s => ({ ...s, status: 'error' })));
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setStages(prev => prev.map(s => ({ ...s, progress: 0, status: 'pending' })));

    const stageDelays = {
      format: 1000,
      content: 1500,
      skills: 1200,
      recommendations: 800,
    };

    const intervals: number[] = [];

    // Schedule progress updates for each stage
    Object.entries(stageDelays).forEach(([stageId, delay], idx, arr) => {
      const startDelay = arr.slice(0, idx).reduce((sum, [, d]) => sum + d, 0);
      
      const timeoutId = window.setTimeout(() => {
        const interval = window.setInterval(() => {
          setStages(prevStages =>
            prevStages.map(st => {
              if (st.id === stageId) {
                const newProg = Math.min(st.progress + 10, 100);
                return { 
                  ...st, 
                  progress: newProg, 
                  status: newProg === 100 ? 'completed' : 'processing' 
                };
              }
              return st;
            })
          );
        }, delay / 10);
        intervals.push(interval);
      }, startDelay);

      intervals.push(timeoutId);
    });

    // Track overall progress
    const progressInterval = window.setInterval(() => {
      setStages(currentStages => {
        const total = calculateTotalProgress(currentStages);
        setProgress(total);
        return currentStages;
      });
    }, 100);

    // Finalize analysis
    const totalTime = Object.values(stageDelays).reduce((sum, d) => sum + d, 0) + 500;
    const finishTimeout = window.setTimeout(() => {
      setAnalysis(generateMockAnalysis(jobRoleId));
      setIsAnalyzing(false);
      setProgress(100);
      intervals.forEach(id => window.clearInterval(id));
      window.clearInterval(progressInterval);
    }, totalTime);

    return () => {
      intervals.forEach(id => window.clearInterval(id));
      window.clearInterval(progressInterval);
      window.clearTimeout(finishTimeout);
    };
  }, [file, jobRoleId, calculateTotalProgress, clearRealTimeData, isLoadingPDF, pdfError]);

  return { 
    analysis, 
    isAnalyzing, 
    progress, 
    stages, 
    realTimeData,
    isRealTimeActive,
    isLoadingPDF,
    pdfError
  };
}

// Mock PDF text extraction function - would be replaced with actual implementation
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  // In production, this would use a PDF parsing library
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Sample PDF text extracted from buffer');
    }, 1000);
  });
}