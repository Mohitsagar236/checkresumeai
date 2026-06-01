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
router.post('/contact', asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: name, email, subject, message',
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    const adminEmail = config.email.smtp.user || config.email.from.email;
    try {
        const sent = await emailService.sendEmail({
            to: adminEmail,
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; font-weight:bold; width:100px;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Subject</td><td style="padding:8px;">${subject}</td></tr>
          </table>
          <div style="margin-top:16px; padding:16px; background:#f9fafb; border-radius:6px;">
            <strong>Message:</strong>
            <p style="margin-top:8px; white-space:pre-wrap;">${message}</p>
          </div>
          <hr style="margin-top:24px;">
          <p style="font-size:12px; color:#6b7280;">Sent via CheckResumeAI contact form</p>
        </div>`,
        });
        if (sent) {
            logger.info(`Contact form email received from ${email}`);
            return res.json({ success: true, message: 'Your message has been sent. We will get back to you soon!' });
        }
        else {
            return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
        }
    }
    catch (error) {
        logger.error('Contact form error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
}));
export default router;
