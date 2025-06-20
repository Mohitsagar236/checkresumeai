import { useState, useEffect, useCallback } from 'react';

interface RealtimeKeywordMatch {
  keyword: string;
  matched: boolean;
  timestamp: number;
}

interface RealtimeFeedback {
  id: string;
  message: string;
  type: 'suggestion' | 'warning' | 'improvement';
  timestamp: number;
}

interface RealTimeData {
  keywordMatches: {
    matched: string[];
    missing: string[];
    realtimeMatches: RealtimeKeywordMatch[];
  };
  atsScoreTrend: {
    timestamp: number;
    score: number;
  }[];
  jobDescriptionSimilarity: number;
  liveFeedback: RealtimeFeedback[];
}

interface UseRealTimeFeaturesOptions {
  tier?: 'free' | 'freemium' | 'premium';
  jobDescription?: string;
  enabled?: boolean;
  updateInterval?: number;
}

/**
 * Hook for real-time resume analysis features available in premium and freemium plans
 */
export function useRealTimeFeatures(resumeText: string = '', options: UseRealTimeFeaturesOptions = {}) {
  const {
    tier = 'free',
    jobDescription = '',
    enabled = false,
    updateInterval = 3000
  } = options;

  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    keywordMatches: {
      matched: [],
      missing: [],
      realtimeMatches: []
    },
    atsScoreTrend: [],
    jobDescriptionSimilarity: 0,
    liveFeedback: []
  });
  
  const [isActive, setIsActive] = useState(false);

  // Generate mock real-time feedback
  const generateRealtimeFeedback = useCallback(() => {
    const feedbackMessages = [
      "Consider adding more specific technical skills related to your target role",
      "Your experience section could benefit from more quantifiable achievements",
      "The summary section is too long; consider condensing it",
      "Add more keywords related to project management for better ATS matching",
      "Consider restructuring your education section for better visibility",
      "Your resume could benefit from a clearer hierarchy of information",
      "Try using more active voice in your achievement descriptions",
      "Consider adding certifications relevant to this job role",
      "Your skills section could be more prominently positioned",
      "Add more industry-specific terminology to improve keyword matching"
    ];
    
    const randomIndex = Math.floor(Math.random() * feedbackMessages.length);
    const feedbackType = Math.random() > 0.7 ? 'warning' : Math.random() > 0.5 ? 'suggestion' : 'improvement';
    
    return {
      id: `feedback-${Date.now()}`,
      message: feedbackMessages[randomIndex],
      type: feedbackType as 'suggestion' | 'warning' | 'improvement',
      timestamp: Date.now()
    };
  }, []);

  // Callback to simulate real-time updates
  const simulateRealtimeUpdates = useCallback(() => {
    if (tier === 'free' || !enabled || !resumeText) return;

    // For freemium, we update less frequently and with basic stats
    const updateFrequency = tier === 'freemium' ? 2 : 1; // Update every other cycle for freemium
    const shouldUpdate = Math.floor(Date.now() / updateInterval) % updateFrequency === 0;
    if (!shouldUpdate) return;

    setRealTimeData(prev => {
      const allPossibleKeywords = [
        'project management', 'strategic planning', 'team leadership', 
        'agile methodology', 'data analysis', 'problem solving',
        'customer service', 'javascript', 'react', 'node.js',
        'communication skills', 'stakeholder management'
      ];
      
      const randomKeyword = allPossibleKeywords[Math.floor(Math.random() * allPossibleKeywords.length)];
      const isMatched = Math.random() > 0.3;
      
      let matched = [...prev.keywordMatches.matched];
      let missing = [...prev.keywordMatches.missing];
      
      if (isMatched && !matched.includes(randomKeyword)) {
        matched = [...matched, randomKeyword];
        missing = missing.filter(k => k !== randomKeyword);
      } else if (!isMatched && !missing.includes(randomKeyword) && !matched.includes(randomKeyword)) {
        missing = [...missing, randomKeyword];
      }

      const newScore = Math.min(100, Math.max(50, prev.atsScoreTrend.length ? 
        prev.atsScoreTrend[prev.atsScoreTrend.length - 1].score + (Math.random() * 10 - 5) : 
        70 + (Math.random() * 10 - 5)));

      const update: Partial<RealTimeData> = {
        keywordMatches: {
          matched,
          missing,
          realtimeMatches: [
            ...prev.keywordMatches.realtimeMatches,
            { keyword: randomKeyword, matched: isMatched, timestamp: Date.now() }
          ].slice(-10) // Keep last 10 matches
        },
        atsScoreTrend: [
          ...prev.atsScoreTrend, 
          { timestamp: Date.now(), score: Math.round(newScore) }
        ].slice(-20) // Keep last 20 scores
      };

      // Add premium-only features
      if (tier === 'premium') {
        update.jobDescriptionSimilarity = Math.min(100, Math.max(0, prev.jobDescriptionSimilarity + (Math.random() * 6 - 3)));
        
        // Add real-time feedback occasionally
        if (Math.random() > 0.7) {
          update.liveFeedback = [
            ...(prev.liveFeedback || []),
            generateRealtimeFeedback()
          ].slice(-5); // Keep last 5 feedback items
        }
      }

      return { ...prev, ...update };
    });
  }, [tier, enabled, resumeText, updateInterval, generateRealtimeFeedback]);

  // Start the real-time updates when enabled
  useEffect(() => {
    if (tier !== 'free' && enabled && resumeText) {
      setIsActive(true);
      const interval = setInterval(simulateRealtimeUpdates, updateInterval);
      
      return () => {
        clearInterval(interval);
        setIsActive(false);
      };
    } else {
      setIsActive(false);
    }
  }, [tier, enabled, resumeText, simulateRealtimeUpdates, updateInterval]);

  const clearRealTimeData = useCallback(() => {
    setRealTimeData({
      keywordMatches: {
        matched: [],
        missing: [],
        realtimeMatches: []
      },
      atsScoreTrend: [],
      jobDescriptionSimilarity: 0,
      liveFeedback: []
    });
  }, []);

  return {
    realTimeData,
    isActive,
    tier,
    clearRealTimeData
  };
}
