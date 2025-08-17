import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize, // 10MB
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only PDF and Word documents are allowed'));
    }
  },
});

// Create upload session
router.post('/session', optionalAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const sessionId = uuidv4();
  const userId = req.user?.id || null;
  const { purpose = 'resume_analysis', metadata = {} } = req.body;

  // Save upload session to database
  const { data: session, error } = await supabase
    .from('upload_sessions')
    .insert({
      id: sessionId,
      user_id: userId,
      purpose,
      metadata,
      status: 'created',
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating upload session:', error);
    throw new Error('Failed to create upload session');
  }

  logger.info(`Upload session created: ${sessionId}`);

  res.json({
    message: 'Upload session created successfully',
    data: {
      sessionId: session.id,
      expiresAt: session.expires_at,
      maxFileSize: config.upload.maxFileSize,
      allowedTypes: config.upload.allowedTypes,
    },
  });
}));

// Upload file to session
router.post('/session/:sessionId', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  
  if (!req.file) {
    throw new ValidationError('No file uploaded');
  }

  // Verify upload session
  const { data: session, error: sessionError } = await supabase
    .from('upload_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    throw new ValidationError('Invalid or expired upload session');
  }

  // Check if session is expired
  if (new Date(session.expires_at) < new Date()) {
    throw new ValidationError('Upload session has expired');
  }

  const fileId = uuidv4();
  const fileExtension = path.extname(req.file.originalname);
  const fileName = `${fileId}${fileExtension}`;
  const filePath = path.join(config.upload.uploadPath, fileName);

  try {
    // Ensure upload directory exists
    if (!fs.existsSync(config.upload.uploadPath)) {
      fs.mkdirSync(config.upload.uploadPath, { recursive: true });
    }

    // Save file to disk
    fs.writeFileSync(filePath, req.file.buffer);

    // Save file info to database
    const fileRecord = {
      id: fileId,
      session_id: sessionId,
      original_name: req.file.originalname,
      file_name: fileName,
      file_path: filePath,
      mime_type: req.file.mimetype,
      file_size: req.file.size,
      upload_status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Update session with file info
    let currentFiles = session.files || [];
    currentFiles.push(fileRecord);

    await supabase
      .from('upload_sessions')
      .update({
        files: currentFiles,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    logger.info(`File uploaded successfully: ${req.file.originalname} (${req.file.size} bytes)`);

    res.json({
      message: 'File uploaded successfully',
      data: {
        fileId,
        originalName: req.file.originalname,
        fileName,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error('File upload error:', error);
    
    // Clean up file if it was partially saved
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw new Error('Failed to save uploaded file');
  }
}));

// Upload multiple files to session
router.post('/session/:sessionId/batch', upload.array('files', 5), asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    throw new ValidationError('No files uploaded');
  }

  // Verify upload session
  const { data: session, error: sessionError } = await supabase
    .from('upload_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    throw new ValidationError('Invalid or expired upload session');
  }

  if (new Date(session.expires_at) < new Date()) {
    throw new ValidationError('Upload session has expired');
  }

  const uploadResults = [];
  const errors = [];

  // Ensure upload directory exists
  if (!fs.existsSync(config.upload.uploadPath)) {
    fs.mkdirSync(config.upload.uploadPath, { recursive: true });
  }

  for (const file of files) {
    try {
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fileId}${fileExtension}`;
      const filePath = path.join(config.upload.uploadPath, fileName);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      const fileRecord = {
        id: fileId,
        session_id: sessionId,
        original_name: file.originalname,
        file_name: fileName,
        file_path: filePath,
        mime_type: file.mimetype,
        file_size: file.size,
        upload_status: 'completed',
        created_at: new Date().toISOString(),
      };

      uploadResults.push({
        fileId,
        originalName: file.originalname,
        fileName,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'success',
      });

      // Update session files
      let currentFiles = session.files || [];
      currentFiles.push(fileRecord);
      session.files = currentFiles;

    } catch (error) {
      logger.error(`Error uploading file ${file.originalname}:`, error);
      errors.push({
        originalName: file.originalname,
        error: 'Upload failed',
        status: 'failed',
      });
    }
  }

  // Update session in database
  await supabase
    .from('upload_sessions')
    .update({
      files: session.files,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  logger.info(`Batch upload completed: ${uploadResults.length} successful, ${errors.length} failed`);

  res.json({
    message: 'Batch upload completed',
    data: {
      successful: uploadResults,
      failed: errors,
      summary: {
        total: files.length,
        successful: uploadResults.length,
        failed: errors.length,
      },
    },
  });
}));

// Get upload session status
router.get('/session/:sessionId', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const { data: session, error } = await supabase
    .from('upload_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !session) {
    throw new ValidationError('Upload session not found');
  }

  const isExpired = new Date(session.expires_at) < new Date();

  res.json({
    message: 'Upload session status retrieved',
    data: {
      sessionId: session.id,
      status: isExpired ? 'expired' : session.status,
      purpose: session.purpose,
      filesCount: session.files ? session.files.length : 0,
      files: session.files || [],
      expiresAt: session.expires_at,
      createdAt: session.created_at,
      isExpired,
    },
  });
}));

// Delete uploaded file
router.delete('/file/:fileId', asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.params;

  // Find the file in upload sessions
  const { data: sessions, error } = await supabase
    .from('upload_sessions')
    .select('*')
    .contains('files', [{ id: fileId }]);

  if (error || !sessions || sessions.length === 0) {
    throw new ValidationError('File not found');
  }

  const session = sessions[0];
  const file = session.files.find((f: any) => f.id === fileId);

  if (!file) {
    throw new ValidationError('File not found in session');
  }

  try {
    // Delete file from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Remove file from session
    const updatedFiles = session.files.filter((f: any) => f.id !== fileId);

    await supabase
      .from('upload_sessions')
      .update({
        files: updatedFiles,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    logger.info(`File deleted: ${file.original_name}`);

    res.json({
      message: 'File deleted successfully',
      data: {
        fileId,
        fileName: file.original_name,
      },
    });

  } catch (error) {
    logger.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}));

// Clean up expired sessions (could be called by a cron job)
router.post('/cleanup', asyncHandler(async (req: Request, res: Response) => {
  const { data: expiredSessions, error } = await supabase
    .from('upload_sessions')
    .select('*')
    .lt('expires_at', new Date().toISOString());

  if (error) {
    logger.error('Error fetching expired sessions:', error);
    throw new Error('Failed to fetch expired sessions');
  }

  let cleanedCount = 0;

  for (const session of expiredSessions || []) {
    try {
      // Delete files from disk
      if (session.files) {
        for (const file of session.files) {
          if (fs.existsSync(file.file_path)) {
            fs.unlinkSync(file.file_path);
          }
        }
      }

      // Delete session from database
      await supabase
        .from('upload_sessions')
        .delete()
        .eq('id', session.id);

      cleanedCount++;

    } catch (error) {
      logger.error(`Error cleaning up session ${session.id}:`, error);
    }
  }

  logger.info(`Cleaned up ${cleanedCount} expired upload sessions`);

  res.json({
    message: 'Cleanup completed',
    data: {
      cleanedSessions: cleanedCount,
      totalExpired: expiredSessions?.length || 0,
    },
  });
}));

export default router;
