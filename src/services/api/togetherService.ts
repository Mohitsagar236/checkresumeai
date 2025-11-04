import axios from 'axios';
import { API_CONFIG, SYSTEM_PROMPT } from '../../config/api.config';
import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { generateMockResumeAnalysis } from '../mock/mockAnalysisService';
import { ResumeAnalysisResult } from './groqService';
import { generateCourseSuggestions } from '../courseSuggestionService';

interface TogetherChatResponse {
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

export const analyzeResumeWithTogether = async (
  resumeData: ProcessedResume,
  jobRole: string
): Promise<ResumeAnalysisResult> => {
  try {
    console.log('Analyzing resume with Together AI for job role:', jobRole);
      // Only use mock service if explicitly requested via environment variable
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.log('Using mock resume analysis service (explicitly requested)');
      return generateMockResumeAnalysis(resumeData, jobRole);
    }
    
    // Check if Together API key is configured
    if (!API_CONFIG.TOGETHER_API_KEY || API_CONFIG.TOGETHER_API_KEY === 'dummy-api-key') {
      console.warn('Together API key not configured, falling back to mock service');
      return generateMockResumeAnalysis(resumeData, jobRole);
    }
    
    // Create a structured prompt for the API
    const prompt = `
      Job Role: ${jobRole}
      
      Resume Text:
      ${resumeData.text}
      
      Sections:
      ${Object.entries(resumeData.sections)
        .filter(([, content]) => content)
        .map(([title, content]) => `${title.toUpperCase()}: ${content}`)
        .join('\n\n')}
    `;

    // Using a POST request to Together AI API (OpenAI-compatible endpoint)
    const response = await axios.post(
      `${API_CONFIG.TOGETHER_API_BASE_URL}/chat/completions`,
      {
        model: API_CONFIG.TOGETHER_RESUME_ANALYSIS_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: API_CONFIG.API_TIMEOUT
      }
    );

    const data = response.data as TogetherChatResponse;
    
    // Parse the response content as JSON
    const content = data.choices[0].message.content;
    let result: ResumeAnalysisResult;
    
    try {
      result = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse Together AI response as JSON:', error);
      throw new Error('Failed to parse analysis results');
    }    // Validate that we have required fields
    if (!result.atsCompatibilityScore && result.atsCompatibilityScore !== 0) {
      throw new Error('Invalid analysis result format');
    }

    // Enhance course suggestions if missing or insufficient
    if (!result.courseSuggestions || result.courseSuggestions.length === 0) {
      console.log('Enhancing course suggestions using comprehensive course service');
      const missingSkills = result.skillsAnalysis?.missingSkills || [];
      result.courseSuggestions = generateCourseSuggestions(missingSkills, 6);
    }

    console.log('Together AI analysis completed successfully');
    return result;} catch (error) {
    console.error('Error analyzing resume with Together AI:', error);
    
    // Only return mock data if explicitly requested, otherwise throw the error
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.warn('Using mock data due to API error and VITE_USE_MOCK_API flag');
      return generateMockResumeAnalysis(resumeData, jobRole);
    }
    
    throw new Error('Failed to analyze resume with Together AI. Please try again later.');
  }
};

// Export the service for backward compatibility
export const analyzeResume = analyzeResumeWithTogether;

/**
 * Get ATS score using Together AI with enhanced timeout handling
 */
export const getAtsScoreWithTogether = async (resumeText: string): Promise<{ score: number }> => {
  try {
    console.log('Getting ATS score with Together AI');
    
    if (!API_CONFIG.TOGETHER_API_KEY || API_CONFIG.TOGETHER_API_KEY === 'dummy-api-key') {
      console.warn('Together API key not configured, using fallback score');
      return { score: Math.floor(Math.random() * 30) + 70 }; // Random score 70-100
    }

    // Truncate resume text if it's too long to prevent timeouts
    const maxTextLength = 10000; // Reasonable limit for ATS analysis
    const truncatedText = resumeText.length > maxTextLength 
      ? resumeText.substring(0, maxTextLength) + "..." 
      : resumeText;

    const prompt = `Calculate the ATS (Applicant Tracking System) compatibility score for this resume:

${truncatedText}

Analyze the resume for:
- Proper formatting and structure
- Use of standard section headers
- Keyword optimization
- File format compatibility
- Readability by ATS systems

Provide only a numerical score between 0-100 representing ATS compatibility.`;    // Implement retry logic with timeout handling
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
      // Calculate timeout for this attempt - move outside try block
      const timeoutForAttempt = attempt === 1 
        ? API_CONFIG.API_TIMEOUT 
        : Math.max(20000, API_CONFIG.API_TIMEOUT / attempt);
        
      try {
        console.log(`Together AI ATS scoring attempt ${attempt}/${API_CONFIG.MAX_RETRIES}`);

        const response = await axios.post(
          `${API_CONFIG.TOGETHER_API_BASE_URL}/chat/completions`,
          {
            model: API_CONFIG.TOGETHER_RESUME_ANALYSIS_MODEL,
            messages: [
              { 
                role: 'system', 
                content: 'You are an ATS expert. Respond with only a JSON object containing a "score" field with a number between 0-100.' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 100,
            response_format: { type: "json_object" }
          },
          {
            headers: {
              'Authorization': `Bearer ${API_CONFIG.TOGETHER_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: timeoutForAttempt
          }
        );

        const data = response.data;
        const content = data.choices[0].message.content;
        
        try {
          const result = JSON.parse(content);
          const score = typeof result.score === 'number' ? result.score : 75;
          console.log('Together AI ATS scoring completed successfully');
          return { score: Math.min(100, Math.max(0, score)) };
        } catch (parseError) {
          console.error('Failed to parse ATS score response:', parseError);
          return { score: 75 };
        }
        
      } catch (error) {
        lastError = error as Error;
        
        // Check if it's a timeout error
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
          console.warn(`Together AI ATS timeout on attempt ${attempt}/${API_CONFIG.MAX_RETRIES} (${timeoutForAttempt}ms)`);
          
          // If this is the last attempt, don't wait
          if (attempt < API_CONFIG.MAX_RETRIES) {
            const backoffDelay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
            console.log(`Retrying after ${backoffDelay}ms backoff...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
          }
          continue;
        }
        
        // For other errors, log and potentially retry
        console.error(`Together AI ATS scoring attempt ${attempt} failed:`, error);
        
        // If this is the last attempt, break
        if (attempt >= API_CONFIG.MAX_RETRIES) {
          break;
        }
        
        // Wait before retry for non-timeout errors
        const backoffDelay = API_CONFIG.RETRY_DELAY * attempt;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    
    // If all retries failed, throw the last error
    throw lastError || new Error('All Together AI ATS retry attempts failed');
    
  } catch (error) {
    console.error('Error getting ATS score with Together AI:', error);
    
    // Provide more specific error message for timeout
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
      console.error('Together AI ATS scoring timed out after multiple attempts');
    }
    
    return { score: 75 };
  }
};

/**
 * Analyze skills gap using Together AI with enhanced timeout handling
 */
export const analyzeSkillsWithTogether = async (resumeText: string, jobRoleId: string): Promise<{ score: number; matchedSkills: string[]; missingSkills: string[]; feedback: string }> => {
  try {
    console.log('Analyzing skills with Together AI for job role:', jobRoleId);
    
    if (!API_CONFIG.TOGETHER_API_KEY || API_CONFIG.TOGETHER_API_KEY === 'dummy-api-key') {
      console.warn('Together API key not configured, using fallback skills analysis');
      return {
        score: Math.floor(Math.random() * 30) + 70,
        matchedSkills: ['JavaScript', 'React', 'Node.js'],
        missingSkills: ['TypeScript', 'AWS', 'Docker'],
        feedback: 'Skills analysis completed with fallback data'
      };
    }

    // Truncate resume text if it's too long to prevent timeouts
    const maxTextLength = 8000; // Reduced from unlimited to prevent timeout
    const truncatedText = resumeText.length > maxTextLength 
      ? resumeText.substring(0, maxTextLength) + "..." 
      : resumeText;

    const prompt = `Analyze the skills in this resume for the job role "${jobRoleId}":

${truncatedText}

Identify:
1. Skills that match the job requirements
2. Important skills that are missing
3. Overall skills compatibility score (0-100)
4. Recommendations for improvement

Focus on technical skills, soft skills, and industry-specific competencies relevant to ${jobRoleId}.`;    // Implement retry logic with exponential backoff
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
      // Calculate timeout for this attempt (shorter timeout for retries) - move outside try block
      const timeoutForAttempt = attempt === 1 
        ? API_CONFIG.SKILLS_ANALYSIS_TIMEOUT 
        : Math.max(15000, API_CONFIG.SKILLS_ANALYSIS_TIMEOUT / attempt);
        
      try {
        console.log(`Together AI skills analysis attempt ${attempt}/${API_CONFIG.MAX_RETRIES}`);

        const response = await axios.post(
          `${API_CONFIG.TOGETHER_API_BASE_URL}/chat/completions`,
          {
            model: API_CONFIG.TOGETHER_RESUME_ANALYSIS_MODEL,
            messages: [
              { 
                role: 'system', 
                content: 'You are a skills analysis expert. Respond with a JSON object containing: score (number 0-100), matchedSkills (array), missingSkills (array), and feedback (string).' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 500,
            response_format: { type: "json_object" }
          },
          {
            headers: {
              'Authorization': `Bearer ${API_CONFIG.TOGETHER_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: timeoutForAttempt
          }
        );

        const data = response.data;
        const content = data.choices[0].message.content;
        
        try {
          const result = JSON.parse(content);
          console.log('Together AI skills analysis completed successfully');
          return {
            score: typeof result.score === 'number' ? Math.min(100, Math.max(0, result.score)) : 75,
            matchedSkills: Array.isArray(result.matchedSkills) ? result.matchedSkills : [],
            missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
            feedback: typeof result.feedback === 'string' ? result.feedback : 'Skills analysis completed'
          };
        } catch (parseError) {
          console.error('Failed to parse skills analysis response:', parseError);
          return {
            score: 75,
            matchedSkills: [],
            missingSkills: [],
            feedback: 'Skills analysis completed with parsing fallback'
          };
        }
        
      } catch (error) {
        lastError = error as Error;
        
        // Check if it's a timeout error
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
          console.warn(`Together AI timeout on attempt ${attempt}/${API_CONFIG.MAX_RETRIES} (${timeoutForAttempt}ms)`);
          
          // If this is the last attempt, don't wait
          if (attempt < API_CONFIG.MAX_RETRIES) {
            const backoffDelay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
            console.log(`Retrying after ${backoffDelay}ms backoff...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
          }
          continue;
        }
        
        // For other errors, log and potentially retry
        console.error(`Together AI skills analysis attempt ${attempt} failed:`, error);
        
        // If this is the last attempt, break
        if (attempt >= API_CONFIG.MAX_RETRIES) {
          break;
        }
        
        // Wait before retry for non-timeout errors
        const backoffDelay = API_CONFIG.RETRY_DELAY * attempt;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    
    // If all retries failed, throw the last error
    throw lastError || new Error('All Together AI retry attempts failed');
    
  } catch (error) {
    console.error('Error analyzing skills with Together AI:', error);
    
    // Provide more specific error message for timeout
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
      console.error('Together AI skills analysis timed out after multiple attempts');
    }
    
    return {
      score: 75,
      matchedSkills: [],
      missingSkills: [],
      feedback: 'Skills analysis completed with error fallback'
    };
  }
};
