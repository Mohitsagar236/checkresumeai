import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { API_CONFIG } from '../../config/api.config';
import { analyzeResume as analyzeWithGroq, ResumeAnalysisResult } from './groqService';

/**
 * Creates a minimal ProcessedResume object from raw text
 */
function createMinimalProcessedResume(resumeText: string): ProcessedResume {
  return {
    text: resumeText,
    sections: {},
    pages: 1,
    metadata: {},
    score: 0,
    keywordMatch: 0,
    formattingScore: 0,
    skillsGap: [],
    atsCompatibility: 0
  };
}

/**
 * Unified resume analysis service that can switch between different AI providers
 */
export const analyzeResume = async (
  resumeData: ProcessedResume,
  jobRole: string
): Promise<ResumeAnalysisResult> => {
  console.log(`Using ${API_CONFIG.PRIMARY_API_PROVIDER} as primary API provider`);
  
  try {
    // Use primary API provider
    if (API_CONFIG.PRIMARY_API_PROVIDER === 'openai') {
      const { analyzeResumeWithOpenAI } = await import('./openaiService');
      return await analyzeResumeWithOpenAI(resumeData, jobRole);
    } else if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
      const { analyzeResumeWithTogether } = await import('./togetherService');
      return await analyzeResumeWithTogether(resumeData, jobRole);
    } else {
      return await analyzeWithGroq(resumeData, jobRole);
    }
  } catch (error) {
    console.error(`Primary API provider (${API_CONFIG.PRIMARY_API_PROVIDER}) failed:`, error);
    
    // Fallback to alternative provider
    try {
      console.log('Attempting fallback to alternative provider...');
      if (API_CONFIG.PRIMARY_API_PROVIDER === 'openai') {
        console.log('Falling back to Together API');
        const { analyzeResumeWithTogether } = await import('./togetherService');
        return await analyzeResumeWithTogether(resumeData, jobRole);
      } else if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
        console.log('Falling back to Groq API');
        return await analyzeWithGroq(resumeData, jobRole);
      } else {
        console.log('Falling back to Together AI');
        const { analyzeResumeWithTogether } = await import('./togetherService');
        return await analyzeResumeWithTogether(resumeData, jobRole);
      }
    } catch (fallbackError) {
      console.error('Fallback provider also failed:', fallbackError);
      throw new Error('Both primary and fallback API providers failed. Please try again later.');
    }
  }
};

// Export types for external use
export type { ResumeAnalysisResult };

/**
 * Unified ATS scoring service
 */
export const getAtsScore = async (resumeText: string): Promise<{ score: number }> => {
  console.log(`Using ${API_CONFIG.PRIMARY_API_PROVIDER} for ATS scoring`);
  
  try {
    // Use primary API provider
    if (API_CONFIG.PRIMARY_API_PROVIDER === 'openai') {
      const { getAtsScoreWithOpenAI } = await import('./openaiService');
      const mockResumeData = createMinimalProcessedResume(resumeText);
      const score = await getAtsScoreWithOpenAI(mockResumeData, "General");
      return { score };
    } else if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
      const { getAtsScoreWithTogether } = await import('./togetherService');
      return await getAtsScoreWithTogether(resumeText);    
    } else {
      const { getAtsScoreWithGroq } = await import('../../utils/groqApi');
      return await getAtsScoreWithGroq(resumeText);
    }
  } catch (error) {
    console.error(`Primary API provider (${API_CONFIG.PRIMARY_API_PROVIDER}) failed for ATS scoring:`, error);
    
    // Fallback to alternative provider
    try {
      console.log('Attempting fallback for ATS scoring...');      if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
        console.log('Falling back to Groq API for ATS scoring');
        const { getAtsScoreWithGroq } = await import('../../utils/groqApi');
        return await getAtsScoreWithGroq(resumeText);
      } else {
        console.log('Falling back to Together AI for ATS scoring');
        const { getAtsScoreWithTogether } = await import('./togetherService');
        return await getAtsScoreWithTogether(resumeText);
      }
    } catch (fallbackError) {
      console.error('Fallback provider also failed for ATS scoring:', fallbackError);
      return { score: 75 }; // Fallback score
    }
  }
};

/**
 * Unified skills analysis service
 */
export const analyzeSkills = async (resumeText: string, jobRoleId: string): Promise<{ score: number; matchedSkills: string[]; missingSkills: string[]; feedback: string }> => {
  console.log(`Using ${API_CONFIG.PRIMARY_API_PROVIDER} for skills analysis`);
    try {
    // Use primary API provider
    if (API_CONFIG.PRIMARY_API_PROVIDER === 'openai') {
      // Create a simple ProcessedResume object
      const mockResumeData = createMinimalProcessedResume(resumeText);
      
      const { analyzeResumeWithOpenAI } = await import('./openaiService');
      const analysis = await analyzeResumeWithOpenAI(mockResumeData, jobRoleId);
      
      return {
        score: analysis.skillsAnalysis.skillsScore,
        matchedSkills: analysis.skillsAnalysis.relevantSkills,
        missingSkills: analysis.skillsAnalysis.missingSkills,
        feedback: analysis.improvementRecommendations.join(' ')
      };
    } else if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
      const { analyzeSkillsWithTogether } = await import('./togetherService');
      return await analyzeSkillsWithTogether(resumeText, jobRoleId);    
    } else {
      const { analyzeSkillsWithGroq } = await import('../../utils/groqApi');
      const result = await analyzeSkillsWithGroq(resumeText, jobRoleId);
      // Convert SkillsGap to expected format
      return {
        score: result.score || 75,
        matchedSkills: result.matchedSkills || [],
        missingSkills: result.missingSkills || [],
        feedback: result.feedback || 'Skills analysis completed'
      };
    }
  } catch (error) {
    console.error(`Primary API provider (${API_CONFIG.PRIMARY_API_PROVIDER}) failed for skills analysis:`, error);
    
  // Fallback to alternative provider
    try {
      console.log('Attempting fallback for skills analysis...');
      if (API_CONFIG.PRIMARY_API_PROVIDER === 'openai') {
        console.log('Falling back to Together AI for skills analysis');
        const { analyzeSkillsWithTogether } = await import('./togetherService');
        return await analyzeSkillsWithTogether(resumeText, jobRoleId);
      } else if (API_CONFIG.PRIMARY_API_PROVIDER === 'together') {
        console.log('Falling back to Groq API for skills analysis');
        const { analyzeSkillsWithGroq } = await import('../../utils/groqApi');
        const result = await analyzeSkillsWithGroq(resumeText, jobRoleId);
        return {
          score: result.score || 75,
          matchedSkills: result.matchedSkills || [],
          missingSkills: result.missingSkills || [],
          feedback: result.feedback || 'Skills analysis completed'
        };
      } else {
        console.log('Falling back to OpenAI for skills analysis');
        // Create a simple ProcessedResume object
        const mockResumeData = createMinimalProcessedResume(resumeText);
        
        const { analyzeResumeWithOpenAI } = await import('./openaiService');
        const analysis = await analyzeResumeWithOpenAI(mockResumeData, jobRoleId);
        
        return {          score: analysis.skillsAnalysis.skillsScore,
          matchedSkills: analysis.skillsAnalysis.relevantSkills,
          missingSkills: analysis.skillsAnalysis.missingSkills,
          feedback: analysis.improvementRecommendations.join(' ') || 'Skills analysis completed'
        };
      }
    } catch (fallbackError) {
      console.error('Fallback provider also failed for skills analysis:', fallbackError);
      return {
        score: 75,
        matchedSkills: [],
        missingSkills: [],
        feedback: 'Skills analysis completed with fallback'
      };
    }
  }
};
