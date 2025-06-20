import axios from 'axios';
import { API_CONFIG, SYSTEM_PROMPT } from '../../config/api.config';
import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { generateMockResumeAnalysis } from '../mock/mockAnalysisService';
import { CourseRecommendation, generateCourseSuggestions } from '../courseSuggestionService';

// Define the analysis result interface
export interface ResumeAnalysisResult {
  atsCompatibilityScore: number;
  keywordMatches: {
    matched: string[];
    missing: string[];
    totalScore: number;
  };
  contentStructure: {
    hasSummary: boolean;
    hasSkills: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    formattingScore: number;
    suggestions: string[];
  };
  skillsAnalysis: {
    relevantSkills: string[];
    missingSkills: string[];
    skillsScore: number;
  };
  experienceRelevance: {
    relevanceScore: number;
    feedback: string[];
  };
  improvementRecommendations: string[];
  writingStyleAnalysis: {
    clarity: number;
    actionVerbs: boolean;
    quantification: boolean;
    suggestions: string[];
  };
  courseSuggestions?: CourseRecommendation[]; // Enhanced course suggestions
  overallScore: number;
}

interface GroqChatResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  created: number;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const analyzeResume = async (
  resumeData: ProcessedResume,
  jobRole: string
): Promise<ResumeAnalysisResult> => {  try {
    console.log('Analyzing resume for job role:', jobRole);
      // Only use mock service if explicitly requested via environment variable
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.log('Using mock resume analysis service (explicitly requested)');
      return generateMockResumeAnalysis(resumeData, jobRole);
    }
    
    // Create a structured prompt for the API
    const prompt = `
      Job Role: ${jobRole}
      
      Resume Text:
      ${resumeData.text}
      
      Sections:      ${Object.entries(resumeData.sections)
        .filter(([, content]) => content)
        .map(([title, content]) => `${title.toUpperCase()}: ${content}`)
        .join('\n\n')}
    `;

    // Using a POST request to Groq API (OpenAI-compatible endpoint)
    const response = await axios.post(
      `${API_CONFIG.GROQ_API_BASE_URL}/chat/completions`,
      {
        model: API_CONFIG.RESUME_ANALYSIS_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: API_CONFIG.API_TIMEOUT
      }
    );

    const data = response.data as GroqChatResponse;
    
    // Parse the response content as JSON
    const content = data.choices[0].message.content;
    let result: ResumeAnalysisResult;
      try {
      result = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse API response as JSON:', error);
      throw new Error('Failed to parse analysis results');
    }

    // Enhance course suggestions if missing or insufficient
    if (!result.courseSuggestions || result.courseSuggestions.length === 0) {
      console.log('Enhancing course suggestions using comprehensive course service');
      const missingSkills = result.skillsAnalysis?.missingSkills || [];
      result.courseSuggestions = generateCourseSuggestions(missingSkills, 6);
    }

    return result;} catch (error) {
    console.error('Error analyzing resume:', error);
    
    // Only return mock data if explicitly requested, otherwise throw the error
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.warn('Using mock data due to API error and VITE_USE_MOCK_API flag');
      return generateMockResumeAnalysis(resumeData, jobRole);
    }
    
    throw new Error('Failed to analyze resume. Please try again later.');
  }
};

// Using the mock service instead
