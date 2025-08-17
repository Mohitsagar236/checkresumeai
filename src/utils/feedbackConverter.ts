import { AnalysisResult, Suggestion } from '../types';

export interface FeedbackItem {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  impact?: string;
}

/**
 * Converts analysis results to premium feedback format
 */
export const convertAnalysisToFeedback = (analysis: AnalysisResult): FeedbackItem[] => {
  const feedback: FeedbackItem[] = [];

  // ATS Score feedback
  if (analysis.atsScore !== undefined) {
    if (analysis.atsScore >= 80) {
      feedback.push({
        id: 'ats-score-excellent',
        type: 'success',
        message: 'Excellent ATS compatibility score',
        description: `Your resume scored ${analysis.atsScore}% for ATS compatibility, indicating strong machine readability.`,
        priority: 'low',
        impact: 'High chance of passing initial automated screening'
      });
    } else if (analysis.atsScore >= 60) {
      feedback.push({
        id: 'ats-score-good',
        type: 'warning',
        message: 'Good ATS compatibility with room for improvement',
        description: `Your ATS score of ${analysis.atsScore}% is decent but could be enhanced.`,
        priority: 'medium',
        impact: 'Improving ATS score by 10-20 points could increase screening success'
      });
    } else {
      feedback.push({
        id: 'ats-score-poor',
        type: 'error',
        message: 'Low ATS compatibility score needs attention',
        description: `Your ATS score of ${analysis.atsScore}% indicates potential issues with automated screening.`,
        priority: 'high',
        impact: 'Critical: Low ATS scores significantly reduce interview chances'
      });
    }
  }

  // Format Analysis feedback
  if (analysis.formatAnalysis) {
    const formatScore = analysis.formatAnalysis.score;
    if (formatScore >= 80) {
      feedback.push({
        id: 'format-excellent',
        type: 'success',
        message: 'Professional resume formatting detected',
        description: 'Your resume demonstrates excellent structure, layout, and visual hierarchy.',
        priority: 'low',
        impact: 'Strong formatting enhances recruiter experience'
      });
    } else if (formatScore >= 60) {
      feedback.push({
        id: 'format-needs-improvement',
        type: 'warning',
        message: 'Resume formatting could be enhanced',
        description: 'Some formatting elements need refinement for optimal presentation.',
        priority: 'medium',
        impact: 'Better formatting could improve first impressions by 15-20%'
      });
    } else {
      feedback.push({
        id: 'format-poor',
        type: 'error',
        message: 'Resume formatting needs significant improvement',
        description: 'Current formatting may negatively impact readability and professional appearance.',
        priority: 'high',
        impact: 'Poor formatting can reduce interview chances by 30-40%'
      });
    }
  }

  // Skills Gap Analysis
  if (analysis.skillsGap) {
    const skillsScore = analysis.skillsGap.score;
    const missingSkills = analysis.skillsGap.missingSkills?.length || 0;
    const matchedSkills = analysis.skillsGap.matchedSkills?.length || 0;

    if (skillsScore >= 80) {
      feedback.push({
        id: 'skills-excellent',
        type: 'success',
        message: 'Strong skills alignment with job requirements',
        description: `You demonstrate ${matchedSkills} key skills matching the job requirements.`,
        priority: 'low',
        impact: 'Strong skills match indicates high qualification fit'
      });
    } else if (missingSkills > 0) {
      feedback.push({
        id: 'skills-missing',
        type: 'warning',
        message: `Missing ${missingSkills} key skills for this role`,
        description: `Consider highlighting or developing: ${analysis.skillsGap.missingSkills?.slice(0, 3).join(', ')}${missingSkills > 3 ? '...' : ''}`,
        priority: 'medium',
        impact: 'Adding missing skills could improve qualification match by 20-25%'
      });
    }
  }

  // Content Analysis
  if (analysis.contentAnalysis) {
    const contentScore = analysis.contentAnalysis.score;
    if (contentScore >= 80) {
      feedback.push({
        id: 'content-excellent',
        type: 'success',
        message: 'Compelling resume content quality',
        description: 'Your resume content effectively communicates value and achievements.',
        priority: 'low',
        impact: 'Strong content helps differentiate you from other candidates'
      });
    } else if (contentScore >= 60) {
      feedback.push({
        id: 'content-good',
        type: 'warning',
        message: 'Resume content has potential for enhancement',
        description: 'Content is solid but could be more impactful with specific metrics and achievements.',
        priority: 'medium',
        impact: 'Enhanced content could improve recruiter engagement by 15-20%'
      });
    } else {
      feedback.push({
        id: 'content-poor',
        type: 'error',
        message: 'Resume content needs significant improvement',
        description: 'Content lacks impact, specific achievements, and compelling value propositions.',
        priority: 'high',
        impact: 'Weak content significantly reduces chances of getting noticed'
      });
    }

    // Keyword analysis
    if (analysis.contentAnalysis.keywords) {
      const keywordScore = analysis.contentAnalysis.keywords.score;
      const missingKeywords = analysis.contentAnalysis.keywords.missing?.length || 0;
      
      if (keywordScore < 70 && missingKeywords > 0) {
        feedback.push({
          id: 'keywords-missing',
          type: 'warning',
          message: 'Missing important keywords for this role',
          description: `Your resume could benefit from including more relevant keywords. Missing: ${analysis.contentAnalysis.keywords.missing?.slice(0, 3).join(', ')}${missingKeywords > 3 ? '...' : ''}`,
          priority: 'medium',
          impact: 'Adding relevant keywords could improve ATS score by 10-15 points'
        });
      }
    }
  }  // Process suggestions for high-priority items
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    const highPrioritySuggestions = analysis.suggestions
      .filter((suggestion: Suggestion) => suggestion.priority === 'high')
      .slice(0, 2); // Limit to top 2 high-priority suggestions

    highPrioritySuggestions.forEach((suggestion: Suggestion, index: number) => {
      feedback.push({
        id: `suggestion-${index}`,
        type: 'error',
        message: `${suggestion.section} section needs attention`,
        description: suggestion.reason,
        priority: 'high',
        impact: 'Addressing this issue will significantly improve resume effectiveness'
      });
    });
  }

  return feedback;
};

/**
 * Sample feedback items for demonstration
 */
export const sampleFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    type: 'error',
    message: 'Missing key skills section',
    description: 'Your resume lacks a dedicated skills section which is crucial for ATS scanning and recruiter review.',
    priority: 'high',
    impact: 'Adding a skills section could improve your ATS score by 25-30%'
  },
  {
    id: '2',
    type: 'warning',
    message: 'Too many bullet points under one job role',
    description: 'Your current position has 8 bullet points, which may overwhelm recruiters. Optimal range is 4-6 bullet points.',
    priority: 'medium',
    impact: 'Condensing to 5-6 key achievements will improve readability'
  },
  {
    id: '3',
    type: 'success',
    message: 'Education section is complete',
    description: 'Your education section includes all necessary details: degree, institution, graduation date, and relevant coursework.',
    priority: 'low',
    impact: 'Well-structured education section supports your qualifications'
  },
  {
    id: '4',
    type: 'warning',
    message: 'Limited use of action verbs',
    description: 'Your resume uses passive language in 60% of bullet points. Strong action verbs create more impact.',
    priority: 'medium',
    impact: 'Using dynamic action verbs could increase recruiter engagement by 20%'
  },
  {
    id: '5',
    type: 'success',
    message: 'Excellent quantification of achievements',
    description: 'You consistently include specific metrics and numbers to demonstrate impact in your role.',
    priority: 'low',
    impact: 'Quantified achievements help recruiters understand your value contribution'
  },
  {
    id: '6',
    type: 'error',
    message: 'Missing professional summary',
    description: 'Your resume lacks a compelling professional summary to immediately communicate your value proposition.',
    priority: 'high',
    impact: 'A strong summary can increase resume review time by 30-40%'
  }
];
