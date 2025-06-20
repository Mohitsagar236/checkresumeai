import type { AnalysisResult, SkillsGap } from '../types';
import { generateMockAnalysis } from '../data/mockData';
import { ResumeProcessor } from './pdf/pdfProcessor';
import { generateCourseSuggestions } from '../services/courseSuggestionService';

// Flags for API usage - centralizing the configuration
// to ensure consistency throughout the application
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || false;
const USE_GROQ_API = import.meta.env.VITE_USE_GROQ_API === 'true' || true; // Default to true since we have the API key
const USE_OPENAI_API = !!import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'dummy-api-key';

console.log('API Configuration:', { 
  mockEnabled: USE_MOCK_API,
  openaiEnabled: USE_OPENAI_API,
  groqEnabled: USE_GROQ_API,
  isDev: import.meta.env.DEV,
  openaiApiKey: !!import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'dummy-api-key',
  togetherApiKey: !!import.meta.env.VITE_TOGETHER_API_KEY && import.meta.env.VITE_TOGETHER_API_KEY !== 'dummy-api-key',
  groqApiKey: !!import.meta.env.VITE_GROQ_API_KEY && import.meta.env.VITE_GROQ_API_KEY !== 'dummy-api-key'
});

interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  useMockOnFailure?: boolean;
  mockData?: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof TypeError &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.includes('Failed to fetch')
  );
};

const validateEndpoint = (endpoint: string): boolean => {
  try {
    new URL(endpoint);
    return true;
  } catch {
    console.error(`Invalid endpoint URL: ${endpoint}`);
    return false;
  }
};

export const makeApiRequest = async <T>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  useMockOnFailure = false,
  mockData,
}: ApiRequestOptions): Promise<T> => {
  if (!validateEndpoint(endpoint)) {
    if (useMockOnFailure && mockData) {
      console.warn(`Invalid endpoint URL: ${endpoint}, using mock data`);
      return mockData as T;
    }
    throw new ApiError(400, 'Bad Request', `Invalid endpoint URL: ${endpoint}`);
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        ...(!body || !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.warn('Failed to parse error response:', e);
      }

      if (useMockOnFailure && mockData) {
        console.warn(`API request failed with status ${response.status}, using mock data`);
        return mockData as T;
      }

      throw new ApiError(
        response.status,
        response.statusText,
        errorMessage
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    if (useMockOnFailure && mockData) {
      console.warn(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}, using mock data`);
      return mockData as T;
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    if (isNetworkError(error)) {
      throw new ApiError(
        503,
        'Service Unavailable',
        'Unable to connect to analysis service. Please check your connection and try again.'
      );
    }
    throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Define API functions with mock data fallback
export const analyzeResume = async (file: File, jobRoleId: string): Promise<AnalysisResult> => {
  // Generate mock data for both USE_MOCK_API and fallback scenarios
  const mockAnalysisData = generateMockAnalysis(jobRoleId);
  
  // If mock API is enabled, return mock data immediately
  if (USE_MOCK_API) {
    console.log('Using mock API data for resume analysis (mock flag is enabled)');
    return mockAnalysisData;
  }

  // Use the unified API service that handles both Groq and Together AI
  try {    console.log('Using unified API service for resume analysis');
    // Process the file first to get structured resume data
    const processor = ResumeProcessor.getInstance();
    const processedResume = await processor.processResume(file);
    
    // Use the unified API service
    const { analyzeResume: analyzeResumeUnified } = await import('../services/api/unifiedApiService');
    const result = await analyzeResumeUnified(processedResume, jobRoleId);      // Check if we have course suggestions from the API
      console.log('[API] Course suggestions from unified API:', 
                 result.courseSuggestions ? `${result.courseSuggestions.length} suggestions` : 'None');
      
      // Missing skills from the API
      const missingSkills = result.skillsAnalysis?.missingSkills || [];
      console.log('[API] Missing skills from analysis:', missingSkills);
      
      // Convert the result to the expected AnalysisResult format
    return {
      id: `analysis_${Date.now()}`,
      resumeId: `resume_${Date.now()}`,
      atsScore: result.atsCompatibilityScore || result.overallScore || 75,
      formatAnalysis: {
        score: result.contentStructure?.formattingScore || 75,
        layout: {
          score: result.contentStructure?.formattingScore || 75,
          feedback: result.contentStructure?.suggestions?.join(' ') || 'Layout analysis completed'
        },
        readability: {
          score: result.writingStyleAnalysis?.clarity || 75,
          feedback: 'Readability analysis completed'
        },
        organization: {
          score: result.contentStructure?.formattingScore || 75,
          feedback: 'Organization analysis completed'
        }
      },
      contentAnalysis: {
        score: result.overallScore || 75,
        keywords: {
          score: result.keywordMatches?.totalScore || 75,
          matched: result.keywordMatches?.matched || [],
          missing: result.keywordMatches?.missing || [],
          feedback: 'Keyword analysis completed'
        },
        actionVerbs: {
          score: result.writingStyleAnalysis?.actionVerbs ? 85 : 65,
          strong: ['Led', 'Achieved', 'Developed'],
          weak: ['Responsible for', 'Helped with'],
          feedback: 'Action verb analysis completed'
        },
        experience: {
          score: result.experienceRelevance?.relevanceScore || 75,
          feedback: result.experienceRelevance?.feedback?.join(' ') || 'Experience analysis completed'
        }
      },
      skillsGap: {
        score: result.skillsAnalysis?.skillsScore || 75,
        requiredSkills: [], // Add empty array for required skills
        matchedSkills: result.skillsAnalysis?.relevantSkills || [],
        missingSkills: result.skillsAnalysis?.missingSkills || [],
        feedback: result.improvementRecommendations?.join(' ') || 'Skills analysis completed'
      },
      suggestions: result.improvementRecommendations?.map(rec => ({
        section: 'general',
        priority: 'medium' as const,
        current: 'Current content',
        suggested: rec,
        reason: 'To improve overall resume quality'
      })) || [],      createdAt: new Date(),
      // Ensure we always have course suggestions
      courseSuggestions: result.courseSuggestions?.length > 0 
        ? result.courseSuggestions 
        : generateCourseSuggestions(result.skillsAnalysis?.missingSkills || [], 6)
    };
  } catch (error) {
    console.error('Unified API service error:', error);
    console.warn('Falling back to mock data after API failure');
    return mockAnalysisData;
  }
};

export const getAtsScore = async (resumeText: string): Promise<{ score: number }> => {
  // Generate mock data for both USE_MOCK_API and fallback scenarios
  const mockAtsScore = { score: Math.floor(Math.random() * 41) + 60 }; // Random score between 60-100
  
  // If mock API is enabled, return mock data immediately
  if (USE_MOCK_API) {
    console.log('Using mock API data for ATS scoring (mock flag is enabled)');
    return mockAtsScore;
  }

  // Use the unified API service
  try {
    console.log('Using unified API service for ATS scoring');
    const { getAtsScore: getAtsScoreUnified } = await import('../services/api/unifiedApiService');
    return await getAtsScoreUnified(resumeText);
  } catch (error) {
    console.error('Unified API service error for ATS scoring:', error);
    console.warn('Falling back to mock data after API failure');
    return mockAtsScore;
  }
};

export const analyzeSkills = async (resumeText: string, jobRoleId: string): Promise<SkillsGap> => {
  // Generate mock data for both USE_MOCK_API and fallback scenarios
  const mockSkillsData = generateMockAnalysis(jobRoleId).skillsGap;
  
  // If mock API is enabled, return mock data immediately
  if (USE_MOCK_API) {
    console.log('Using mock API data for skills analysis (mock flag is enabled)');
    return mockSkillsData;
  }

  // Use the unified API service
  try {
    console.log('Using unified API service for skills analysis');
    const { analyzeSkills: analyzeSkillsUnified } = await import('../services/api/unifiedApiService');
    const result = await analyzeSkillsUnified(resumeText, jobRoleId);
    
    // Convert the result to the expected SkillsGap format
    return {
      score: result.score,
      requiredSkills: [], // Add empty array for required skills since unified service doesn't provide this
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      feedback: result.feedback
    };
  } catch (error) {
    console.error('Unified API service error for skills analysis:', error);
    console.warn('Falling back to mock data after API failure');
    return mockSkillsData;
  }
};
