import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateCourseRecommendations } from '../services/courseRecommendationService.js';
import { supabase } from '../config/database.js';

const router = Router();

// Get course recommendations based on resume analysis
router.get('/recommendations', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { analysisId, jobRole, skillsGap, limit = 10 } = req.query;

  let analysisData = null;

  // If analysisId is provided, get the specific analysis
  if (analysisId) {
    const { data: analysis, error } = await supabase
      .from('resume_analyses')
      .select('result')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('Error fetching analysis for recommendations:', error);
    } else {
      analysisData = analysis.result;
    }
  }

  // If no specific analysis, get the most recent one
  if (!analysisData) {
    const { data: recentAnalysis } = await supabase
      .from('resume_analyses')
      .select('result, job_role')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentAnalysis) {
      analysisData = recentAnalysis.result;
    }
  }
  // Generate recommendations
  const recommendations = await generateCourseRecommendations({
    userId,
    jobRole: jobRole as string || 'general',
    analysisData,
    skillsGap: skillsGap ? (skillsGap as string).split(',') : [],
    limit: Number(limit),
  });

  res.json({
    message: 'Course recommendations generated successfully',
    data: {
      recommendations,
      totalCount: recommendations.length,
      generatedAt: new Date().toISOString(),
    },
  });
}));

// Get course recommendations by category
router.get('/categories/:category', asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;  const recommendations = await generateCourseRecommendations({
    userId: req.user!.id,
    jobRole: 'general',
    ...(category && { category }),
    limit: Number(limit),
  });

  res.json({
    message: `Course recommendations for ${category} retrieved successfully`,
    data: {
      category,
      recommendations,
      totalCount: recommendations.length,
    },
  });
}));

// Save course recommendation (bookmark)
router.post('/:courseId/save', asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user!.id;
  const { title, provider, url, category, description } = req.body;

  const { data: savedCourse, error } = await supabase
    .from('course_recommendations')
    .insert({
      user_id: userId,
      course_id: courseId,
      title,
      provider,
      url,
      category,
      description,
      is_saved: true,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    logger.error('Error saving course recommendation:', error);
    throw new Error('Failed to save course recommendation');
  }

  logger.info(`Course recommendation saved for user ${userId}: ${title}`);

  res.json({
    message: 'Course recommendation saved successfully',
    data: {
      savedCourse,
    },
  });
}));

// Remove saved course recommendation
router.delete('/:courseId/save', asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user!.id;

  const { error } = await supabase
    .from('course_recommendations')
    .delete()
    .eq('course_id', courseId)
    .eq('user_id', userId);

  if (error) {
    logger.error('Error removing saved course:', error);
    throw new Error('Failed to remove saved course');
  }

  res.json({
    message: 'Course recommendation removed successfully',
  });
}));

// Get saved courses
router.get('/saved', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { category, page = 1, limit = 10 } = req.query;

  let query = supabase
    .from('course_recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_saved', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: savedCourses, error } = await query
    .order('created_at', { ascending: false })
    .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);

  if (error) {
    logger.error('Error fetching saved courses:', error);
    throw new Error('Failed to fetch saved courses');
  }

  res.json({
    message: 'Saved courses retrieved successfully',
    data: {
      courses: savedCourses || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: savedCourses?.length || 0,
      },
    },
  });
}));

// Mark course as completed
router.post('/:courseId/complete', asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user!.id;
  const { completedAt, rating, review } = req.body;

  const { data: updatedCourse, error } = await supabase
    .from('course_recommendations')
    .update({
      is_completed: true,
      completed_at: completedAt || new Date().toISOString(),
      rating: rating || null,
      review: review || null,
      updated_at: new Date().toISOString(),
    })
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Error marking course as completed:', error);
    throw new Error('Failed to mark course as completed');
  }

  logger.info(`Course marked as completed for user ${userId}: ${courseId}`);

  res.json({
    message: 'Course marked as completed successfully',
    data: {
      course: updatedCourse,
    },
  });
}));

// Get course progress/stats
router.get('/progress', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Get saved courses count
  const { data: savedCourses } = await supabase
    .from('course_recommendations')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_saved', true);

  // Get completed courses count
  const { data: completedCourses } = await supabase
    .from('course_recommendations')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_completed', true);

  // Get courses by category
  const { data: coursesByCategory } = await supabase
    .from('course_recommendations')
    .select('category')
    .eq('user_id', userId)
    .eq('is_saved', true);

  const categoryStats = coursesByCategory?.reduce((acc: any, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('course_recommendations')
    .select('title, provider, category, created_at, is_completed')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  const progress = {
    totalSaved: savedCourses?.length || 0,
    totalCompleted: completedCourses?.length || 0,
    completionRate: savedCourses?.length ? 
      Math.round(((completedCourses?.length || 0) / savedCourses.length) * 100) : 0,
    categoryBreakdown: categoryStats,
    recentActivity: recentActivity || [],
  };

  res.json({
    message: 'Course progress retrieved successfully',
    data: {
      progress,
    },
  });
}));

// Get course categories
router.get('/categories', (req: Request, res: Response) => {
  const categories = [
    {
      id: 'technical',
      name: 'Technical Skills',
      description: 'Programming, software development, and technical skills',
      icon: 'code',
    },
    {
      id: 'business',
      name: 'Business & Management',
      description: 'Leadership, project management, and business skills',
      icon: 'briefcase',
    },
    {
      id: 'design',
      name: 'Design & Creative',
      description: 'UI/UX design, graphic design, and creative skills',
      icon: 'palette',
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      description: 'Digital marketing, sales, and customer relations',
      icon: 'megaphone',
    },
    {
      id: 'data',
      name: 'Data & Analytics',
      description: 'Data science, analytics, and business intelligence',
      icon: 'chart-bar',
    },
    {
      id: 'personal',
      name: 'Personal Development',
      description: 'Soft skills, communication, and personal growth',
      icon: 'user',
    },
  ];

  res.json({
    message: 'Course categories retrieved successfully',
    data: {
      categories,
    },
  });
});

export default router;
