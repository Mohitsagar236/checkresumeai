import axios from 'axios';
import { API_CONFIG, SYSTEM_PROMPT } from '../../config/api.config';
import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { generateMockResumeAnalysis } from '../mock/mockAnalysisService';
import { ResumeAnalysisResult } from './groqService';
import { generateCourseSuggestions } from '../courseSuggestionService';

interface OpenAIChatResponse {
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

export const analyzeResumeWithOpenAI = async (
  resumeData: ProcessedResume,
  jobRole: string
): Promise<ResumeAnalysisResult> => {
  // For development, use mock data if mock flag is set
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    console.log('[OpenAI Service] Using mock data for resume analysis');
    return generateMockResumeAnalysis(resumeData, jobRole);
  }

  console.log('[OpenAI Service] Analyzing resume with OpenAI API...');
    try {
    const resumeText = resumeData.text;
    const sectionsData = resumeData.sections;    // Prepare the sections summary for improved context
    const sectionsSummary = Object.entries(sectionsData)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}: ${value}`).join('\n\n');    
      
    // Create a prompt that includes the resume content and job role    
    const prompt = `Resume Content:
    ${resumeText}

    Extracted Sections:
    ${sectionsSummary}

    Job Role: ${jobRole}

    Please analyze this resume against the job role and provide a comprehensive analysis.
    
    IMPORTANT: Identify specific missing skills (at least 3-5) that would make this candidate more competitive for the job role.
    For each missing skill, suggest a relevant course - PRIORITIZE FREE YOUTUBE VIDEOS and online resources whenever possible.
    
    Make sure to include the "courseSuggestions" section in your response, with detailed course recommendations 
    including title, platform, link (use placeholder links if needed), level, and price information.
    
    The courseSuggestions must be provided in the following format:
    "courseSuggestions": [
      {
        "title": "Course Title",
        "platform": "Platform Name", 
        "link": "https://example.com/course",
        "level": "Beginner/Intermediate/Advanced",
        "price": "Free/Paid/$XX",
        "duration": "X hours/X weeks",
        "sourceType": "YouTube/OnlineCourse/Tutorial/Certification", 
        "skillMatch": "Name of the skill this addresses"
      },
      ...
    ]
    
    CRITICAL REQUIREMENTS FOR YOUR RECOMMENDATIONS:
    1. PRIORITIZE YouTube videos and free online resources when suggesting courses.
    2. At least 60% of your recommendations MUST be from YouTube specifically (not just any video platform).
    3. For each identified missing skill, first try to find a FREE YouTube video that teaches this skill.
    4. Use actual YouTube links rather than placeholders when possible.
    5. Include actual video duration when known (e.g., "45 minutes", "2 hours", etc.)
    6. For YouTube recommendations, ensure they are current (from the last 2-3 years if possible).
    7. For each recommendation, make sure to correctly identify which specific missing skill it addresses in the "skillMatch" field.
    
    COURSE SUGGESTIONS ARE REQUIRED IN YOUR RESPONSE. Even if you can't find specific courses, provide general course recommendations related to the job role and missing skills.
    `;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2048,
      },      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
        },
        timeout: 60000 // 60 seconds
      }
    );      console.log('[OpenAI Service] Analysis completed successfully');
    const apiResponse: OpenAIChatResponse = response.data;
    console.log('[OpenAI Service] Response tokens used:', apiResponse.usage?.total_tokens || 'N/A');
    
    try {      // Parse the JSON response
      const content = apiResponse.choices[0].message.content;
      const result = JSON.parse(content) as ResumeAnalysisResult;
      
      // Initialize courseSuggestions if it doesn't exist
      if (!result.courseSuggestions) {
        result.courseSuggestions = [];
      }
        // Add course suggestions based on missing skills
      const missingSkills = result.skillsAnalysis.missingSkills || [];
      console.log('[OpenAI Service] Generating course suggestions for missing skills:', missingSkills);
      
      try {
        // Always ensure we have course suggestions
        if (!result.courseSuggestions || result.courseSuggestions.length === 0) {
          // Only generate our own if OpenAI didn't provide any
          console.log('[OpenAI Service] No course suggestions from OpenAI, generating locally');
          result.courseSuggestions = generateCourseSuggestions(missingSkills, 6);
        } else {
          console.log('[OpenAI Service] Using OpenAI provided course suggestions:', result.courseSuggestions.length);
          // Ensure we have at least some minimum number of course suggestions
          if (result.courseSuggestions.length < 3) {
            console.log('[OpenAI Service] Not enough OpenAI course suggestions, adding more locally');
            const additionalSuggestions = generateCourseSuggestions(
              missingSkills.filter(skill => 
                !result.courseSuggestions!.some(course => 
                  course.title.toLowerCase().includes(skill.toLowerCase())
                )
              ), 
              6 - result.courseSuggestions.length
            );
            result.courseSuggestions = [...result.courseSuggestions, ...additionalSuggestions];
          }
        }
        
        // Final check to ensure we always have at least some course recommendations
        if (!result.courseSuggestions || result.courseSuggestions.length === 0) {
          console.log('[OpenAI Service] Still no course suggestions, using default recommendations');
          result.courseSuggestions = generateCourseSuggestions([], 6); // Will use default recommendations
        }
      } catch (error) {
        console.error('[OpenAI Service] Error generating course suggestions:', error);
        // If any error occurs while processing course suggestions, generate new ones
        result.courseSuggestions = generateCourseSuggestions(missingSkills.length > 0 ? missingSkills : [], 6);
      }
      
      return result;
    } catch (parseError) {
      console.error('[OpenAI Service] Failed to parse API response:', parseError);
      console.log('[OpenAI Service] Raw API response:', apiResponse.choices[0].message.content);
      throw new Error('Failed to parse OpenAI API response');
    }
  } catch (error) {
    console.error('[OpenAI Service] Error analyzing resume with OpenAI:', error);
    throw error;
  }
};

/**
 * Get ATS compatibility score using OpenAI
 */
export const getAtsScoreWithOpenAI = async (
  resumeData: ProcessedResume,
  jobRole: string
): Promise<number> => {
  try {
    const analysis = await analyzeResumeWithOpenAI(resumeData, jobRole);
    return analysis.atsCompatibilityScore;
  } catch (error) {
    console.error('[OpenAI Service] Error getting ATS score:', error);
    return 65; // Return a default value in case of error
  }
};
