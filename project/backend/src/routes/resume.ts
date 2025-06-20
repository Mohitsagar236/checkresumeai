import { Router, Request, Response } from 'express';
import multer from 'multer';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError, ExternalServiceError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { premiumMiddleware } from '../middleware/auth.js';
import { analyzeResumeWithAI } from '../services/aiAnalysisService.js';
import { processResumePDF } from '../services/pdfProcessingService.js';
import { saveAnalysisToDatabase } from '../services/analyticsService.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only PDF and Word documents are allowed'));
    }
  },
});

// Analyze resume from uploaded file
router.post('/analyze', upload.single('resume'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ValidationError('Resume file is required');
  }

  const { jobRole, analysisType = 'comprehensive' } = req.body;
  const userId = req.user!.id;

  logger.info(`Resume analysis started for user: ${userId}`);

  try {
    // Extract text from PDF/Word document
    const resumeText = await processResumePDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 100) {
      throw new ValidationError('Resume content is too short or could not be extracted. Please ensure the file is readable.');
    }

    // Perform AI analysis
    const analysisResult = await analyzeResumeWithAI(resumeText, jobRole || 'general', analysisType);

    // Save analysis to database
    const savedAnalysis = await saveAnalysisToDatabase(userId, {
      resumeText,
      jobRole: jobRole || 'general',
      analysisType,
      result: analysisResult,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    // Emit real-time update if socket.io is available
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('resume:analysis:complete', {
        analysisId: savedAnalysis.id,
        result: analysisResult,
      });
    }

    logger.info(`Resume analysis completed for user: ${userId}, analysis ID: ${savedAnalysis.id}`);

    res.json({
      message: 'Resume analysis completed successfully',
      analysisId: savedAnalysis.id,
      result: analysisResult,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Resume analysis error:', error);
    
    if (error instanceof ValidationError || error instanceof ExternalServiceError) {
      throw error;
    }
    
    throw new ExternalServiceError('Resume analysis failed. Please try again.');
  }
}));

// Analyze resume from text input
router.post('/analyze-text', asyncHandler(async (req: Request, res: Response) => {
  const { resumeText, jobRole, analysisType = 'comprehensive' } = req.body;
  const userId = req.user!.id;

  if (!resumeText || resumeText.trim().length < 100) {
    throw new ValidationError('Resume text is required and must be at least 100 characters long');
  }

  logger.info(`Text-based resume analysis started for user: ${userId}`);

  try {
    // Perform AI analysis
    const analysisResult = await analyzeResumeWithAI(resumeText, jobRole || 'general', analysisType);

    // Save analysis to database
    const savedAnalysis = await saveAnalysisToDatabase(userId, {
      resumeText,
      jobRole: jobRole || 'general',
      analysisType,
      result: analysisResult,
      fileName: 'text-input',
      fileSize: resumeText.length,
    });

    logger.info(`Text-based resume analysis completed for user: ${userId}, analysis ID: ${savedAnalysis.id}`);

    res.json({
      message: 'Resume analysis completed successfully',
      analysisId: savedAnalysis.id,
      result: analysisResult,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Text-based resume analysis error:', error);
    
    if (error instanceof ValidationError || error instanceof ExternalServiceError) {
      throw error;
    }
    
    throw new ExternalServiceError('Resume analysis failed. Please try again.');
  }
}));

// Get analysis history
router.get('/history', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 10, jobRole, analysisType } = req.query;

  let query = supabase
    .from('resume_analyses')
    .select(`
      id,
      job_role,
      analysis_type,
      file_name,
      ats_score,
      created_at,
      result
    `)
    .eq('user_id', userId);

  // Apply additional filters if provided
  if (jobRole) {
    query = query.eq('job_role', jobRole);
  }
  if (analysisType) {
    query = query.eq('analysis_type', analysisType);
  }

  const { data: analyses, error } = await query
    .order('created_at', { ascending: false })
    .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);

  if (error) {
    logger.error('Error fetching analysis history:', error);
    throw new Error('Failed to fetch analysis history');
  }

  res.json({
    analyses: analyses || [],
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: analyses?.length || 0,
    },
  });
}));

// Get specific analysis
router.get('/:analysisId', asyncHandler(async (req: Request, res: Response) => {
  const { analysisId } = req.params;
  const userId = req.user!.id;

  const { data: analysis, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single();

  if (error || !analysis) {
    throw new ValidationError('Analysis not found or access denied');
  }

  res.json({
    analysis,
  });
}));

// Delete analysis
router.delete('/:analysisId', asyncHandler(async (req: Request, res: Response) => {
  const { analysisId } = req.params;
  const userId = req.user!.id;

  const { error } = await supabase
    .from('resume_analyses')
    .delete()
    .eq('id', analysisId)
    .eq('user_id', userId);

  if (error) {
    logger.error('Error deleting analysis:', error);
    throw new Error('Failed to delete analysis');
  }

  res.json({
    message: 'Analysis deleted successfully',
  });
}));

// Compare two analyses (Premium feature)
router.post('/compare', premiumMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { analysisId1, analysisId2 } = req.body;
  const userId = req.user!.id;

  if (!analysisId1 || !analysisId2) {
    throw new ValidationError('Both analysis IDs are required');
  }

  // Fetch both analyses
  const { data: analyses, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .in('id', [analysisId1, analysisId2])
    .eq('user_id', userId);

  if (error || !analyses || analyses.length !== 2) {
    throw new ValidationError('One or both analyses not found or access denied');
  }

  const [analysis1, analysis2] = analyses;

  // Generate comparison report
  const comparison = {
    analysis1: {
      id: analysis1.id,
      jobRole: analysis1.job_role,
      atsScore: analysis1.ats_score,
      createdAt: analysis1.created_at,
    },
    analysis2: {
      id: analysis2.id,
      jobRole: analysis2.job_role,
      atsScore: analysis2.ats_score,
      createdAt: analysis2.created_at,
    },
    improvements: {
      atsScoreChange: analysis2.ats_score - analysis1.ats_score,
      percentage: ((analysis2.ats_score - analysis1.ats_score) / analysis1.ats_score) * 100,
    },
    recommendations: [
      // This would be generated by AI based on the differences
      'Continue to focus on keyword optimization',
      'Maintain the improved formatting structure',
      'Consider adding more quantifiable achievements',
    ],
  };

  logger.info(`Resume comparison generated for user: ${userId}`);

  res.json({
    message: 'Resume comparison completed',
    comparison,
  });
}));

// Batch analysis (Premium feature)
router.post('/batch-analyze', premiumMiddleware, upload.array('resumes', 5), asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { jobRole } = req.body;
  const userId = req.user!.id;

  if (!files || files.length === 0) {
    throw new ValidationError('At least one resume file is required');
  }

  if (files.length > 5) {
    throw new ValidationError('Maximum 5 files allowed for batch analysis');
  }

  logger.info(`Batch analysis started for user: ${userId}, files: ${files.length}`);

  const results = [];

  for (const file of files) {
    try {
      const resumeText = await processResumePDF(file.buffer);
      const analysisResult = await analyzeResumeWithAI(resumeText, jobRole || 'general', 'quick');
      
      const savedAnalysis = await saveAnalysisToDatabase(userId, {
        resumeText,
        jobRole: jobRole || 'general',
        analysisType: 'quick',
        result: analysisResult,
        fileName: file.originalname,
        fileSize: file.size,
      });

      results.push({
        fileName: file.originalname,
        analysisId: savedAnalysis.id,
        atsScore: analysisResult.atsScore,
        status: 'success',
      });

    } catch (error) {
      logger.error(`Batch analysis failed for file ${file.originalname}:`, error);
      results.push({
        fileName: file.originalname,
        status: 'failed',
        error: 'Analysis failed',
      });
    }
  }

  logger.info(`Batch analysis completed for user: ${userId}`);

  res.json({
    message: 'Batch analysis completed',
    results,
    summary: {
      total: files.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
    },
  });
}));

export default router;
