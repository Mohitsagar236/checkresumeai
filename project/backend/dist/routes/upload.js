import { Router } from 'express';
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
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: config.upload.maxFileSize,
        files: 5,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new ValidationError('Only PDF and Word documents are allowed'));
        }
    },
});
router.post('/session', optionalAuthMiddleware, asyncHandler(async (req, res) => {
    const sessionId = uuidv4();
    const userId = req.user?.id || null;
    const { purpose = 'resume_analysis', metadata = {} } = req.body;
    const { data: session, error } = await supabase
        .from('upload_sessions')
        .insert({
        id: sessionId,
        user_id: userId,
        purpose,
        metadata,
        status: 'created',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
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
router.post('/session/:sessionId', upload.single('file'), asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    if (!req.file) {
        throw new ValidationError('No file uploaded');
    }
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
    const fileId = uuidv4();
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(config.upload.uploadPath, fileName);
    try {
        if (!fs.existsSync(config.upload.uploadPath)) {
            fs.mkdirSync(config.upload.uploadPath, { recursive: true });
        }
        fs.writeFileSync(filePath, req.file.buffer);
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
    }
    catch (error) {
        logger.error('File upload error:', error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw new Error('Failed to save uploaded file');
    }
}));
router.post('/session/:sessionId/batch', upload.array('files', 5), asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
        throw new ValidationError('No files uploaded');
    }
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
    if (!fs.existsSync(config.upload.uploadPath)) {
        fs.mkdirSync(config.upload.uploadPath, { recursive: true });
    }
    for (const file of files) {
        try {
            const fileId = uuidv4();
            const fileExtension = path.extname(file.originalname);
            const fileName = `${fileId}${fileExtension}`;
            const filePath = path.join(config.upload.uploadPath, fileName);
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
            let currentFiles = session.files || [];
            currentFiles.push(fileRecord);
            session.files = currentFiles;
        }
        catch (error) {
            logger.error(`Error uploading file ${file.originalname}:`, error);
            errors.push({
                originalName: file.originalname,
                error: 'Upload failed',
                status: 'failed',
            });
        }
    }
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
router.get('/session/:sessionId', asyncHandler(async (req, res) => {
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
router.delete('/file/:fileId', asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const { data: sessions, error } = await supabase
        .from('upload_sessions')
        .select('*')
        .contains('files', [{ id: fileId }]);
    if (error || !sessions || sessions.length === 0) {
        throw new ValidationError('File not found');
    }
    const session = sessions[0];
    const file = session.files.find((f) => f.id === fileId);
    if (!file) {
        throw new ValidationError('File not found in session');
    }
    try {
        if (fs.existsSync(file.file_path)) {
            fs.unlinkSync(file.file_path);
        }
        const updatedFiles = session.files.filter((f) => f.id !== fileId);
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
    }
    catch (error) {
        logger.error('Error deleting file:', error);
        throw new Error('Failed to delete file');
    }
}));
router.post('/cleanup', asyncHandler(async (req, res) => {
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
            if (session.files) {
                for (const file of session.files) {
                    if (fs.existsSync(file.file_path)) {
                        fs.unlinkSync(file.file_path);
                    }
                }
            }
            await supabase
                .from('upload_sessions')
                .delete()
                .eq('id', session.id);
            cleanedCount++;
        }
        catch (error) {
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
//# sourceMappingURL=upload.js.map