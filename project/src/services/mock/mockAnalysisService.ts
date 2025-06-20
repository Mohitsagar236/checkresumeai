// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\services\mock\mockAnalysisService.ts
import { ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { ResumeAnalysisResult } from '../api/groqService';
import { mockJobRoles } from '../../data/mockData';
import { generateCourseSuggestions } from '../courseSuggestionService';

/**
 * Generates realistic mock resume analysis results for development and testing
 * @param resumeData The processed resume data
 * @param jobRole The job role to analyze against
 * @returns A mock ResumeAnalysisResult object
 */
export const generateMockResumeAnalysis = (
  resumeData: ProcessedResume,
  jobRole: string
): ResumeAnalysisResult => {
  // Find matching job role data or use the first one as default
  const jobRoleData = mockJobRoles.find(role => 
    role.title.toLowerCase() === jobRole.toLowerCase()
  ) || mockJobRoles[0];
    // Extract resume content sections for analysis
  const hasEducation = !!resumeData.sections.education?.length;
  const hasSkills = !!resumeData.sections.skills?.length;
  const hasExperience = !!resumeData.sections.experience?.length;
  const hasSummary = !!resumeData.sections.summary?.length;
  
  // Generate random scores for different aspects
  const formattingScore = Math.floor(Math.random() * 30) + 70;
  const keywordScore = Math.floor(Math.random() * 40) + 60;
  const skillsScore = Math.floor(Math.random() * 30) + 70;
  const relevanceScore = Math.floor(Math.random() * 25) + 75;
  const clarityScore = Math.floor(Math.random() * 20) + 80;
  
  // Calculate overall score with weighted components
  const overallScore = Math.floor(
    (formattingScore * 0.2) + 
    (keywordScore * 0.3) + 
    (skillsScore * 0.3) + 
    (relevanceScore * 0.2)
  );
  
  // Generate matched/missing keywords
  const keywords = [...jobRoleData.keywords, ...jobRoleData.requiredSkills];
  const matchedKeywordsCount = Math.floor((keywordScore / 100) * keywords.length);
  const shuffled = [...keywords].sort(() => 0.5 - Math.random());
  const matchedKeywords = shuffled.slice(0, matchedKeywordsCount);
  const missingKeywords = shuffled.slice(matchedKeywordsCount, matchedKeywordsCount + 5);
  
  // Generate relevant/missing skills
  const allSkills = [...jobRoleData.requiredSkills];
  const relevantSkillsCount = Math.floor((skillsScore / 100) * allSkills.length);
  const shuffledSkills = [...allSkills].sort(() => 0.5 - Math.random());
  const relevantSkills = shuffledSkills.slice(0, relevantSkillsCount);
  const missingSkills = shuffledSkills.slice(relevantSkillsCount, relevantSkillsCount + 4);  // Generate course suggestions based on missing skills from analysis
  const courseSuggestions = generateCourseSuggestions(missingSkills, 6);

  return {
    atsCompatibilityScore: overallScore,
    keywordMatches: {
      matched: matchedKeywords,
      missing: missingKeywords,
      totalScore: keywordScore
    },
    contentStructure: {
      hasSummary,
      hasSkills,
      hasExperience,
      hasEducation,
      formattingScore,
      suggestions: getSuggestions(hasSummary, hasSkills, hasExperience, hasEducation)
    },
    skillsAnalysis: {
      relevantSkills,
      missingSkills,
      skillsScore
    },
    experienceRelevance: {
      relevanceScore,
      feedback: [
        "Your experience appears relevant to the job role.",
        "Consider highlighting more specific achievements with metrics.",
        "Focus more on recent work that directly relates to the target position."
      ]
    },
    improvementRecommendations: [
      "Add more industry-specific keywords throughout your resume.",
      "Quantify your achievements with specific metrics and results.",
      "Tailor your summary to highlight experience most relevant to the target role.",
      "Include a skills section with both technical and soft skills.",
      "Ensure consistent formatting throughout your document."
    ],
    writingStyleAnalysis: {
      clarity: clarityScore,
      actionVerbs: Math.random() > 0.3, // 70% chance of having good action verbs
      quantification: Math.random() > 0.5, // 50% chance of good quantification
      suggestions: [
        "Use more powerful action verbs to start bullet points.",
        "Include specific metrics and numbers to quantify achievements.",
        "Keep bullet points concise and focused on results."
      ]
    },
    courseSuggestions, // Added course suggestions
    overallScore
  };
};

// Helper function to generate suggestions based on missing sections
function getSuggestions(hasSummary: boolean, hasSkills: boolean, hasExperience: boolean, hasEducation: boolean): string[] {
  const suggestions: string[] = [];
  
  if (!hasSummary) {
    suggestions.push("Add a professional summary at the top of your resume to highlight your key qualifications.");
  }
  
  if (!hasSkills) {
    suggestions.push("Include a dedicated skills section to showcase technical and soft skills relevant to the position.");
  }
  
  if (!hasExperience) {
    suggestions.push("Expand your work experience section with detailed descriptions of your responsibilities and achievements.");
  }
  
  if (!hasEducation) {
    suggestions.push("Add an education section with your degrees, certifications, and relevant coursework.");
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Your resume has all the essential sections, but consider enhancing each section with more targeted content.");
  }
  
  return suggestions;
}
