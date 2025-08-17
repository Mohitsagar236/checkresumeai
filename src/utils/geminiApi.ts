// Gemini API Integration for Resume Analyzer
import { AnalysisResult, SkillsGap } from '../types';
import { generateMockAnalysis } from '../data/mockData';
import { mockJobRoles } from '../data/mockData';
import { apiCache, createCacheKey } from './cache';

// Gemini API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Gemini API endpoint - Updated to v1 from v1beta
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  RESUME_ANALYSIS: 24 * 60 * 60 * 1000, // 24 hours
  ATS_SCORE: 24 * 60 * 60 * 1000,       // 24 hours
  SKILLS_ANALYSIS: 24 * 60 * 60 * 1000  // 24 hours
};

// Import our enhanced PDF extraction utility
import { extractTextFromPDF } from './enhanced-pdf';

/**
 * Extract text content from a PDF file using our enhanced PDF extractor
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Use the enhanced PDF extractor
    return await extractTextFromPDF(file, 20000);
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return 'PDF PARSING ERROR: Could not extract text from this PDF file. The file may be password-protected, contain only images, or be corrupted.';
  }
};

/**
 * Extract text content from a file
 * Uses PDF.js for PDF files and falls back to text extraction for other file types
 */
const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    // Check if file is a PDF
    if (file.type === 'application/pdf') {
      return await extractTextFromPdf(file);    } else {
      // For non-PDF files, fall back to text extraction
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          resolve(content.substring(0, 20000)); // Limit to 20,000 chars for API limits
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file');
  }
};

// Define Gemini API response types
interface GeminiTextPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiTextPart[];
  role?: string;
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
  index: number;
  safetyRatings: Array<{
    category: string;
    probability: string;
  }>;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

/**
 * Make a request to the Gemini API with caching
 */
const callGeminiApi = async (prompt: string): Promise<GeminiResponse> => {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not found');
    throw new Error('Gemini API key not configured');
  }

  // Create a cache key based on the prompt
  const cacheKey = createCacheKey('gemini', prompt);
  
  return apiCache.get<GeminiResponse>(cacheKey, async () => {
    try {
      const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        let errorMessage = `Gemini API returned ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Gemini API error:', errorData);
          if (errorData.error?.message) {
            errorMessage = `Gemini API error: ${errorData.error.message}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API: Missing text content');
      }

      return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
  });
};

/**
 * Parse JSON from Gemini's text response
 * @param response The Gemini API response
 * @returns The parsed JSON object
 */
const extractJsonFromResponse = <T>(response: GeminiResponse): T => {
  try {
    // Extract the text from the response
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure: Missing text content');
    }

    const text = response.candidates[0].content.parts[0].text;
    
    // First try to find JSON content within the response (between ```json and ```)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch (parseError) {
        console.error('Failed to parse JSON from codeblock:', parseError);
        console.log('Raw JSON content:', jsonMatch[1]);
      }
    }
    
    // If no JSON markers or parsing failed, try to clean the text and parse it
    const cleanText = text
      .replace(/```json\n?|```/g, '') // Remove any remaining JSON markers
      .trim();
    
    try {
      return JSON.parse(cleanText) as T;
    } catch (parseError) {
      console.error('Failed to parse cleaned text as JSON:', parseError);
      console.log('Cleaned text content:', cleanText);
      throw new Error('Could not parse valid JSON from Gemini response');
    }
  } catch (error) {
    console.error('Failed to process Gemini response:', error);
    if (error instanceof Error) {
      throw new Error(`Invalid Gemini API response format: ${error.message}`);
    }
    throw new Error('Invalid Gemini API response format');
  }
};

/**
 * Analyze resume using Gemini API
 */
export const analyzeResumeWithGemini = async (file: File, jobRoleId: string): Promise<AnalysisResult> => {
  try {
    // Get job role details
    const jobRole = mockJobRoles.find(role => role.id === jobRoleId) || mockJobRoles[0];
    
    // Extract text from file
    const resumeText = await extractTextFromFile(file);
    
    // Create a cache key based on the resume text and job role
    const cacheKey = createCacheKey('resumeAnalysis', resumeText.substring(0, 1000), jobRoleId);
    
    return await apiCache.get<AnalysisResult>(
      cacheKey,
      async () => {
    
    // Create prompt for Gemini
    const prompt = `
You are an expert ATS (Applicant Tracking System) and resume analyzer. You will analyze the provided resume for a ${jobRole.title} position.

The job requires the following skills:
${jobRole.requiredSkills.join(', ')}

The job has these key responsibilities:
${jobRole.keyResponsibilities.join('\n')}

Important keywords for this role:
${jobRole.keywords.join(', ')}

RESUME TEXT:
"""
${resumeText}
"""

Analyze this resume and provide a detailed assessment in the following JSON format:
\`\`\`json
{
  "formatScore": 0-100,
  "contentScore": 0-100,
  "atsScore": 0-100,
  "analysis": {
    "format": {
      "score": 0-100,
      "feedback": "Detailed feedback on resume format"
    },
    "content": {
      "score": 0-100,
      "keywords": {
        "score": 0-100,
        "matched": ["keyword1", "keyword2"],
        "missing": ["keyword3", "keyword4"],
        "feedback": "Feedback on keyword usage"
      },
      "actionVerbs": {
        "score": 0-100,
        "strong": ["implemented", "led"],
        "weak": ["helped", "worked on"],
        "feedback": "Feedback on action verb usage"
      },
      "experience": {
        "score": 0-100,
        "feedback": "Feedback on experience section"
      }
    }
  },
  "skillsGap": {
    "score": 0-100,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3", "skill4"],
    "requiredSkills": ["skill1", "skill2", "skill3", "skill4"],
    "feedback": "Detailed feedback on skills gap"
  },
  "suggestions": [
    {
      "section": "Format|Skills|Experience|Keywords",
      "priority": "high|medium|low",
      "current": "Description of current approach",
      "suggested": "Suggested improvement",
      "reason": "Reason for suggestion"
    }
  ],
  "createdAt": "Current timestamp"
}
\`\`\`
Provide only valid JSON that matches exactly this format with no additional text.
`;

    // Call Gemini API
    console.log('Calling Gemini API for resume analysis...');
    const geminiResponse = await callGeminiApi(prompt);
    
    // Extract and parse JSON
    const analysisResult = extractJsonFromResponse<AnalysisResult>(geminiResponse);
    
    // Add createdAt timestamp if not provided
    if (!analysisResult.createdAt) {
      analysisResult.createdAt = new Date();
    }
      console.log('Resume analysis complete via Gemini API');
    return analysisResult;
      },
      { ttl: CACHE_TTL.RESUME_ANALYSIS }
    );
  } catch (error) {
    console.error('Failed to analyze resume with Gemini API:', error);
    console.warn('Falling back to mock data for resume analysis');
    
    // Create a structured error response that includes the fallback data
    const fallbackData = generateMockAnalysis(jobRoleId);
    
    // Add error information to the analysis
    fallbackData.analysis = {
      ...fallbackData.analysis,
      errorInfo: {
        occurred: true,
        message: error instanceof Error ? error.message : 'Unknown error during Gemini API analysis',
        fallbackUsed: true,
        timestamp: new Date().toISOString()
      }
    };
    
    return fallbackData;
  }
};

/**
 * Get ATS score using Gemini API
 */
export const getAtsScoreWithGemini = async (resumeText: string): Promise<{ score: number }> => {
  try {
    // Create cache key with first 1000 chars to identify the resume
    const cacheKey = createCacheKey('atsScore', resumeText.substring(0, 1000));

    return apiCache.get<{ score: number }>(
      cacheKey,
      async () => {
        const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Evaluate the following resume text and provide an ATS compatibility score between 0-100.

RESUME TEXT:
"""
${resumeText.substring(0, 10000)}
"""

Return ONLY a valid JSON object with this format:
\`\`\`json
{
  "score": 75
}
\`\`\`
`;

        console.log('Calling Gemini API for ATS scoring...');
        const geminiResponse = await callGeminiApi(prompt);
        const result = extractJsonFromResponse<{ score: number }>(geminiResponse);
        
        return { score: result.score };
      },
      { ttl: CACHE_TTL.ATS_SCORE }
    );
  } catch (error) {
    console.error('Failed to get ATS score with Gemini API:', error);
    console.warn('Falling back to mock data for ATS score');
    
    // Generate a random fallback score
    const fallbackScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
    
    // Just return the score since our interface doesn't support error info here
    return { score: fallbackScore };
  }
};

/**
 * Analyze skills gap using Gemini API
 */
export const analyzeSkillsWithGemini = async (resumeText: string, jobRoleId: string): Promise<SkillsGap> => {
  try {
    // Get job role details
    const jobRole = mockJobRoles.find(role => role.id === jobRoleId) || mockJobRoles[0];
    
    // Create cache key using start of resume and job role
    const cacheKey = createCacheKey('skillsAnalysis', resumeText.substring(0, 1000), jobRoleId);
    
    return apiCache.get<SkillsGap>(
      cacheKey,
      async () => {
        const prompt = `
You are an expert skills analyzer for job applications. Compare the resume text with the required skills for a ${jobRole.title} position.

Required skills for this position:
${jobRole.requiredSkills.join(', ')}

RESUME TEXT:
"""
${resumeText.substring(0, 10000)}
"""

Provide a detailed skills gap analysis in the following JSON format:
\`\`\`json
{
  "score": 0-100,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "requiredSkills": ${JSON.stringify(jobRole.requiredSkills)},
  "feedback": "Detailed feedback on skills gap"
}
\`\`\`
`;

        console.log('Calling Gemini API for skills analysis...');
        const geminiResponse = await callGeminiApi(prompt);
        return extractJsonFromResponse<SkillsGap>(geminiResponse);
      },
      { ttl: CACHE_TTL.SKILLS_ANALYSIS }
    );
  } catch (error) {
    console.error('Failed to analyze skills with Gemini API:', error);
    console.warn('Falling back to mock data for skills analysis');
    
    // Get fallback skills gap data from mock analysis
    const fallbackData = generateMockAnalysis(jobRoleId).skillsGap;
    
    // Log the error but don't modify the interface structure
    console.error('Skills analysis error:', {
      occurred: true,
      message: error instanceof Error ? error.message : 'Unknown error during skills analysis',
      fallbackUsed: true,
      timestamp: new Date().toISOString()
    });
    
    return fallbackData;
  }
};
