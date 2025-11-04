import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from './logger.js';
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initialize();
    }
    initialize() {
        try {
            const { host, port, user, pass } = config.email.smtp;
            const { email: fromEmail, name: fromName } = config.email.from;
            if (!host || !user || !pass) {
                logger.warn('SMTP not properly configured. Email functionality will be limited.');
                return;
            }
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: {
                    user,
                    pass
                },
                tls: {
                    rejectUnauthorized: config.server.environment === 'production'
                }
            });
            this.isInitialized = true;
            logger.info('Email service initialized successfully');
        }
        catch (error) {
            logger.error('Failed to initialize email service:', error);
            this.isInitialized = false;
        }
    }
    async sendEmail({ to, subject, text, html, attachments = [], cc, bcc, replyTo }) {
        if (!this.isInitialized) {
            logger.error('Email service not initialized. Cannot send email.');
            return false;
        }
        try {
            const mailOptions = {
                from: `"${config.email.from.name}" <${config.email.from.email}>`,
                to,
                cc,
                bcc,
                replyTo,
                subject,
                text,
                html,
                attachments
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully: ${info.messageId}`);
            return true;
        }
        catch (error) {
            logger.error('Error sending email:', error);
            return false;
        }
    }
    async sendPasswordResetEmail(to, resetLink) {
        const subject = 'Reset Your CheckResumeAI Password';
        const text = `
      Hello,
      
      You've requested a password reset for your CheckResumeAI account.
      
      Please click the link below to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The CheckResumeAI Team
    `;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2C3E50;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You've requested a password reset for your CheckResumeAI account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #3498DB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The CheckResumeAI Team</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you're having trouble clicking the button, copy and paste the following URL into your web browser:</p>
        <p style="font-size: 12px; color: #777; word-break: break-all;">${resetLink}</p>
      </div>
    `;
        return this.sendEmail({ to, subject, text, html });
    }
    async sendWelcomeEmail(to, firstName) {
        const subject = 'Welcome to CheckResumeAI!';
        const text = `
      Hello ${firstName},
      
      Welcome to CheckResumeAI! We're excited to have you on board.
      
      With CheckResumeAI, you can get expert AI-powered analysis of your resume to help you stand out to recruiters and land more interviews.
      
      To get started, simply upload your resume and select the analysis type you need.
      
      If you have any questions, feel free to reply to this email.
      
      Best regards,
      The CheckResumeAI Team
    `;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2C3E50;">Welcome to CheckResumeAI!</h2>
        <p>Hello ${firstName},</p>
        <p>Welcome to CheckResumeAI! We're excited to have you on board.</p>
        <p>With CheckResumeAI, you can get expert AI-powered analysis of your resume to help you stand out to recruiters and land more interviews.</p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Ready to optimize your resume?</p>
          <a href="${process.env.FRONTEND_URL || 'https://www.checkresumeai.com'}" style="background-color: #3498DB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Get Started</a>
        </div>
        <p>To begin, simply upload your resume and select the analysis type you need.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The CheckResumeAI Team</p>
      </div>
    `;
        return this.sendEmail({ to, subject, text, html });
    }
    async sendSubscriptionConfirmation(to, firstName, planName, expiryDate) {
        const subject = 'Your CheckResumeAI Subscription Confirmation';
        const text = `
      Hello ${firstName},
      
      Thank you for subscribing to CheckResumeAI ${planName} plan!
      
      Your subscription is now active and will expire on ${expiryDate}.
      
      You can now enjoy all the features of your subscription plan.
      
      If you have any questions about your subscription, please contact our support team.
      
      Best regards,
      The CheckResumeAI Team
    `;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2C3E50;">Subscription Confirmation</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for subscribing to CheckResumeAI <strong>${planName}</strong> plan!</p>
        <div style="background-color: #f8f9fa; border-left: 4px solid #3498DB; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Subscription Details:</strong></p>
          <p style="margin: 10px 0 0;">Plan: ${planName}</p>
          <p style="margin: 5px 0 0;">Expiry Date: ${expiryDate}</p>
        </div>
        <p>You can now enjoy all the features of your subscription plan.</p>
        <p>If you have any questions about your subscription, please contact our support team.</p>
        <p>Best regards,<br>The CheckResumeAI Team</p>
      </div>
    `;
        return this.sendEmail({ to, subject, text, html });
    }
}
const emailService = new EmailService();
export default emailService;
