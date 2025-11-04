import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ResumeAnalysisResult } from './aiAnalysisService.js';

export interface AnalysisData {
  resumeText: string;
  jobRole: string;
  analysisType: string;
  result: ResumeAnalysisResult;
  fileName: string;
  fileSize: number;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  jobRole: string;
  analysisType: string;
  fileName: string;
  fileSize: number;
  atsScore: number;
  overallScore: number;
  result: ResumeAnalysisResult;
  createdAt: string;
  updatedAt: string;
}

/**
 * Save resume analysis to database
 */
export const saveAnalysisToDatabase = async (
  userId: string,
  analysisData: AnalysisData
): Promise<SavedAnalysis> => {
  try {
    logger.debug(`Saving analysis to database for user: ${userId}`);

    const { data, error } = await supabase
      .from('resume_analyses')
      .insert({
        user_id: userId,
        job_role: analysisData.jobRole,
        analysis_type: analysisData.analysisType,
        file_name: analysisData.fileName,
        file_size: analysisData.fileSize,
        resume_text: analysisData.resumeText,
        ats_score: analysisData.result.atsScore,
        overall_score: analysisData.result.overallScore,
        result: analysisData.result,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Database save error:', error);
      throw new Error('Failed to save analysis to database');
    }

    // Update user analytics
    await updateUserAnalytics(userId, analysisData.result);

    logger.info(`Analysis saved successfully with ID: ${data.id}`);

    return {
      id: data.id,
      userId: data.user_id,
      jobRole: data.job_role,
      analysisType: data.analysis_type,
      fileName: data.file_name,
      fileSize: data.file_size,
      atsScore: data.ats_score,
      overallScore: data.overall_score,
      result: data.result,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

  } catch (error) {
    logger.error('Error saving analysis to database:', error);
    throw error;
  }
};

/**
 * Update user analytics with new analysis data
 */
export const updateUserAnalytics = async (
  userId: string,
  analysisResult: ResumeAnalysisResult
): Promise<void> => {
  try {
    // Get current analytics
    const { data: currentAnalytics } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    const now = new Date().toISOString();
    const previousAtsScore = currentAnalytics?.ats_score || 0;
    
    if (currentAnalytics) {
      // Update existing analytics
      const { error } = await supabase
        .from('user_analytics')
        .update({
          ats_score: analysisResult.atsScore,
          previous_ats_score: previousAtsScore,
          overall_score: analysisResult.overallScore,
          skills_matched: analysisResult.skillsAnalysis.presentSkills.length,
          total_skills: analysisResult.skillsAnalysis.presentSkills.length + analysisResult.skillsAnalysis.missingSkills.length,
          readability_score: analysisResult.estimatedReading.difficulty === 'easy' ? 90 : 
                           analysisResult.estimatedReading.difficulty === 'medium' ? 70 : 50,
          keyword_density: analysisResult.keywordAnalysis.density,
          total_analyses: (currentAnalytics.total_analyses || 0) + 1,
          last_analysis_date: now,
          updated_at: now,
        })
        .eq('user_id', userId);

      if (error) {
        logger.error('Error updating user analytics:', error);
      }
    } else {
      // Create new analytics record
      const { error } = await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          ats_score: analysisResult.atsScore,
          previous_ats_score: 0,
          overall_score: analysisResult.overallScore,
          skills_matched: analysisResult.skillsAnalysis.presentSkills.length,
          total_skills: analysisResult.skillsAnalysis.presentSkills.length + analysisResult.skillsAnalysis.missingSkills.length,
          readability_score: analysisResult.estimatedReading.difficulty === 'easy' ? 90 : 
                           analysisResult.estimatedReading.difficulty === 'medium' ? 70 : 50,
          keyword_density: analysisResult.keywordAnalysis.density,
          total_analyses: 1,
          last_analysis_date: now,
          created_at: now,
          updated_at: now,
        });

      if (error) {
        logger.error('Error creating user analytics:', error);
      }
    }

    // Add trend data
    await addAnalyticsTrend(userId, analysisResult);

  } catch (error) {
    logger.error('Error updating user analytics:', error);
    // Don't throw error as this is not critical for the main flow
  }
};

/**
 * Add analytics trend data
 */
export const addAnalyticsTrend = async (
  userId: string,
  analysisResult: ResumeAnalysisResult
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('analytics_trends')
      .insert({
        user_id: userId,
        ats_score: analysisResult.atsScore,
        overall_score: analysisResult.overallScore,
        readability_score: analysisResult.estimatedReading.difficulty === 'easy' ? 90 : 
                         analysisResult.estimatedReading.difficulty === 'medium' ? 70 : 50,
        keyword_density: analysisResult.keywordAnalysis.density,
        skills_match: analysisResult.skillsAnalysis.skillsMatch,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      logger.error('Error adding analytics trend:', error);
    }

  } catch (error) {
    logger.error('Error adding analytics trend:', error);
  }
};

/**
 * Get user analytics dashboard data
 */
export const getUserAnalytics = async (userId: string) => {
  try {
    // Get current analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      throw analyticsError;
    }

    // Get trend data (last 30 data points)
    const { data: trends, error: trendsError } = await supabase
      .from('analytics_trends')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(30);

    if (trendsError) {
      logger.error('Error fetching trends:', trendsError);
    }

    // Get recent analyses
    const { data: recentAnalyses, error: analysesError } = await supabase
      .from('resume_analyses')
      .select(`
        id,
        job_role,
        analysis_type,
        file_name,
        ats_score,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (analysesError) {
      logger.error('Error fetching recent analyses:', analysesError);
    }

    return {
      analytics: analytics || {
        ats_score: 0,
        previous_ats_score: 0,
        overall_score: 0,
        skills_matched: 0,
        total_skills: 0,
        readability_score: 0,
        keyword_density: 0,
        total_analyses: 0,
      },
      trends: trends || [],
      recentAnalyses: recentAnalyses || [],
    };

  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    throw error;
  }
};

/**
 * Generate analytics insights for user
 */
export const generateAnalyticsInsights = async (userId: string) => {
  try {
    const analyticsData = await getUserAnalytics(userId);
    const { analytics, trends } = analyticsData;

    const insights = [];

    // ATS Score insights
    if (analytics.ats_score > analytics.previous_ats_score) {
      insights.push({
        type: 'improvement',
        category: 'ATS Score',
        message: `Your ATS score improved by ${(analytics.ats_score - analytics.previous_ats_score).toFixed(1)} points!`,
        impact: 'positive'
      });
    } else if (analytics.ats_score < analytics.previous_ats_score) {
      insights.push({
        type: 'decline',
        category: 'ATS Score',
        message: `Your ATS score decreased by ${(analytics.previous_ats_score - analytics.ats_score).toFixed(1)} points.`,
        impact: 'negative'
      });
    }

    // Trend analysis
    if (trends.length >= 3) {
      const recentTrends = trends.slice(0, 3);
      const avgRecentScore = recentTrends.reduce((sum, t) => sum + t.ats_score, 0) / recentTrends.length;
      const olderTrends = trends.slice(3, 6);
      
      if (olderTrends.length > 0) {
        const avgOlderScore = olderTrends.reduce((sum, t) => sum + t.ats_score, 0) / olderTrends.length;
        
        if (avgRecentScore > avgOlderScore + 5) {
          insights.push({
            type: 'trend',
            category: 'Progress',
            message: 'You\'re on an upward trend! Keep up the great work.',
            impact: 'positive'
          });
        }
      }
    }

    // Frequency insights
    if (analytics.total_analyses >= 5) {
      insights.push({
        type: 'milestone',
        category: 'Usage',
        message: `You've completed ${analytics.total_analyses} resume analyses. You're becoming a pro!`,
        impact: 'neutral'
      });
    }

    return insights;

  } catch (error) {
    logger.error('Error generating analytics insights:', error);
    return [];
  }
};
