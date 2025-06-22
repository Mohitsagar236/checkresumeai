import OpenAI from 'openai';
import { Groq } from 'groq-sdk';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { ExternalServiceError } from '../middleware/errorHandler.js';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: config.ai.openai.apiKey,
});

const groq = new Groq({
  apiKey: config.ai.groq.apiKey,
});

export interface ResumeAnalysisResult {
  atsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: number;
  }>;
  skillsAnalysis: {
    presentSkills: string[];
    missingSkills: string[];
    skillsMatch: number;
    industryRelevance: number;
  };
  sectionAnalysis: {
    contactInfo: { score: number; feedback: string };
    summary: { score: number; feedback: string };
    experience: { score: number; feedback: string };
    education: { score: number; feedback: string };
    skills: { score: number; feedback: string };
  };
  keywordAnalysis: {
    density: number;
    relevantKeywords: string[];
    missingKeywords: string[];
  };
  formatting: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  industryBenchmark: {
    industry: string;
    averageScore: number;
    percentile: number;
  };
  estimatedReading: {
    timeSeconds: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

const ANALYSIS_PROMPT = `
You are an expert ATS (Applicant Tracking System) resume analyzer and career consultant. 
Analyze the following resume and provide a comprehensive evaluation.

Resume Text:
{resumeText}

Job Role/Industry: {jobRole}

Analysis Type: {analysisType}

Please provide a detailed analysis in the following JSON format:
{
  "atsScore": number (0-100),
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "recommendations": [
    {
      "category": "string",
      "priority": "high/medium/low",
      "description": "string",
      "impact": number (0-100)
    }
  ],
  "skillsAnalysis": {
    "presentSkills": ["skill1", "skill2", ...],
    "missingSkills": ["skill1", "skill2", ...],
    "skillsMatch": number (0-100),
    "industryRelevance": number (0-100)
  },
  "sectionAnalysis": {
    "contactInfo": {"score": number, "feedback": "string"},
    "summary": {"score": number, "feedback": "string"},
    "experience": {"score": number, "feedback": "string"},
    "education": {"score": number, "feedback": "string"},
    "skills": {"score": number, "feedback": "string"}
  },
  "keywordAnalysis": {
    "density": number (0-100),
    "relevantKeywords": ["keyword1", "keyword2", ...],
    "missingKeywords": ["keyword1", "keyword2", ...]
  },
  "formatting": {
    "score": number (0-100),
    "issues": ["issue1", "issue2", ...],
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "industryBenchmark": {
    "industry": "string",
    "averageScore": number,
    "percentile": number
  },
  "estimatedReading": {
    "timeSeconds": number,
    "difficulty": "easy/medium/hard"
  }
}

Focus on:
1. ATS compatibility and keyword optimization
2. Content quality and relevance to the job role
3. Structure and formatting
4. Skills alignment with industry requirements
5. Achievement quantification
6. Professional presentation

Provide specific, actionable recommendations that will improve the resume's effectiveness.
`;

export const analyzeResumeWithAI = async (
  resumeText: string,
  jobRole: string,
  analysisType: string = 'comprehensive'
): Promise<ResumeAnalysisResult> => {
  logger.info(`Starting AI resume analysis for job role: ${jobRole}, type: ${analysisType}`);

  const prompt = ANALYSIS_PROMPT
    .replace('{resumeText}', resumeText)
    .replace('{jobRole}', jobRole)
    .replace('{analysisType}', analysisType);

  try {
    // Try OpenAI first
    if (config.ai.openai.apiKey) {
      try {
        logger.debug('Using OpenAI for resume analysis');
        const completion = await openai.chat.completions.create({
          model: config.ai.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert ATS resume analyzer. Always respond with valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: config.ai.openai.maxTokens,
          temperature: 0.3,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
          throw new Error('No response from OpenAI');
        }

        // Parse JSON response
        const analysisResult = JSON.parse(response) as ResumeAnalysisResult;
        
        logger.info('Resume analysis completed successfully with OpenAI');
        return analysisResult;

      } catch (openaiError) {
        logger.warn('OpenAI analysis failed, trying Groq:', openaiError);
      }
    }

    // Fallback to Groq
    if (config.ai.groq.apiKey) {
      logger.debug('Using Groq for resume analysis');
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS resume analyzer. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: config.ai.groq.model,
        max_tokens: Math.min(config.ai.groq.maxTokens, 8000), // Groq has token limits
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq');
      }

      // Parse JSON response
      const analysisResult = JSON.parse(response) as ResumeAnalysisResult;
      
      logger.info('Resume analysis completed successfully with Groq');
      return analysisResult;
    }

    throw new Error('No AI service available');

  } catch (error) {
    logger.error('AI resume analysis failed:', error);
    
    if (error instanceof SyntaxError) {
      // JSON parsing error - return a fallback analysis
      logger.warn('AI returned invalid JSON, using fallback analysis');
      return generateFallbackAnalysis(resumeText, jobRole);
    }
    
    throw new ExternalServiceError('Resume analysis service is temporarily unavailable', 'AI_SERVICE');
  }
};

// Fallback analysis when AI services fail
const generateFallbackAnalysis = (resumeText: string, jobRole: string): ResumeAnalysisResult => {
  const wordCount = resumeText.split(/\s+/).length;
  const hasEmail = /@/.test(resumeText);
  const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText);
  const hasExperience = /experience|work|job|position|role/i.test(resumeText);
  const hasEducation = /education|degree|university|college|school/i.test(resumeText);
  const hasSkills = /skills|proficient|knowledge|familiar/i.test(resumeText);

  return {
    atsScore: Math.min(85, 60 + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasExperience ? 10 : 0) + (hasEducation ? 5 : 0)),
    overallScore: Math.min(80, 50 + (wordCount > 200 ? 15 : 0) + (hasSkills ? 10 : 0) + (hasExperience ? 15 : 0)),
    strengths: [
      hasEmail && hasPhone ? 'Complete contact information' : null,
      hasExperience ? 'Work experience included' : null,
      hasEducation ? 'Educational background provided' : null,
      wordCount > 300 ? 'Comprehensive content' : null,
    ].filter(Boolean) as string[],
    weaknesses: [
      !hasEmail ? 'Missing email address' : null,
      !hasPhone ? 'Missing phone number' : null,
      !hasExperience ? 'Limited work experience details' : null,
      wordCount < 200 ? 'Resume too brief' : null,
    ].filter(Boolean) as string[],
    recommendations: [
      {
        category: 'Contact Information',
        priority: 'high' as const,
        description: 'Ensure all contact details are clearly visible',
        impact: 90
      },
      {
        category: 'Keywords',
        priority: 'high' as const,
        description: `Add relevant keywords for ${jobRole} position`,
        impact: 85
      }
    ],
    skillsAnalysis: {
      presentSkills: [],
      missingSkills: [`Key ${jobRole} skills`, 'Technical skills', 'Soft skills'],
      skillsMatch: 60,
      industryRelevance: 70
    },
    sectionAnalysis: {
      contactInfo: { score: hasEmail && hasPhone ? 90 : 60, feedback: 'Basic contact information analysis' },
      summary: { score: 70, feedback: 'Professional summary evaluation needed' },
      experience: { score: hasExperience ? 75 : 50, feedback: 'Experience section analysis' },
      education: { score: hasEducation ? 80 : 60, feedback: 'Education section review' },
      skills: { score: hasSkills ? 70 : 50, feedback: 'Skills section assessment' }
    },
    keywordAnalysis: {
      density: 65,
      relevantKeywords: [],
      missingKeywords: [`${jobRole} keywords`, 'Industry terms']
    },
    formatting: {
      score: 75,
      issues: ['Limited formatting analysis available'],
      suggestions: ['Use consistent formatting', 'Ensure ATS compatibility']
    },
    industryBenchmark: {
      industry: jobRole,
      averageScore: 72,
      percentile: 65
    },
    estimatedReading: {
      timeSeconds: Math.max(30, Math.min(120, wordCount * 0.2)),
      difficulty: wordCount > 400 ? 'medium' as const : 'easy' as const
    }
  };
};
