import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import emailService from '../utils/emailService.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { authenticateJWTHandler, authorizeRolesHandler } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/test', authenticateJWTHandler, authorizeRolesHandler(['admin']), asyncHandler(async (req, res) => {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: to, subject, message',
        });
    }
    try {
        const emailSent = await emailService.sendEmail({
            to,
            subject,
            text: message,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>Test Email</h3>
          <p>${message}</p>
          <hr>
          <p><small>This is a test email sent from the CheckResumeAI application.</small></p>
        </div>`
        });
        if (emailSent) {
            logger.info(`Test email sent successfully to ${to}`);
            return res.json({
                success: true,
                message: 'Test email sent successfully',
                config: {
                    smtpHost: config.email.smtp.host,
                    smtpPort: config.email.smtp.port,
                    smtpUser: config.email.smtp.user,
                    fromEmail: config.email.from.email,
                }
            });
        }
        else {
            logger.error(`Failed to send test email to ${to}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to send test email',
            });
        }
    }
    catch (error) {
        logger.error('Error sending test email:', error);
        return res.status(500).json({
            success: false,
            message: 'Error sending test email',
            error: error.message,
        });
    }
}));
router.get('/status', authenticateJWTHandler, authorizeRolesHandler(['admin']), asyncHandler(async (req, res) => {
    const isConfigured = Boolean(config.email.smtp.host &&
        config.email.smtp.port &&
        config.email.smtp.user &&
        config.email.smtp.pass);
    return res.json({
        success: true,
        isConfigured,
        config: {
            smtpHost: config.email.smtp.host,
            smtpPort: config.email.smtp.port,
            smtpUser: config.email.smtp.user,
            fromEmail: config.email.from.email,
            fromName: config.email.from.name,
            hasSmtpPass: Boolean(config.email.smtp.pass),
        }
    });
}));
export default router;
