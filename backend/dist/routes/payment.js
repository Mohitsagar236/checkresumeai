import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ValidationError, PaymentError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = Router();
const razorpay = new Razorpay({
    key_id: config.payment.razorpay.keyId,
    key_secret: config.payment.razorpay.keySecret,
});
const SUBSCRIPTION_PLANS = {
    basic: {
        id: 'basic',
        name: 'Basic Plan',
        price: 999,
        duration: 30,
        features: [
            'Up to 10 resume analyses per month',
            'Basic ATS scoring',
            'Standard recommendations',
            'Email support'
        ]
    },
    premium: {
        id: 'premium',
        name: 'Premium Plan',
        price: 1999,
        duration: 30,
        features: [
            'Unlimited resume analyses',
            'Advanced ATS scoring',
            'Detailed recommendations',
            'Industry benchmarking',
            'Resume comparison',
            'Priority support',
            'Export reports'
        ]
    },
    professional: {
        id: 'professional',
        name: 'Professional Plan',
        price: 4999,
        duration: 90,
        features: [
            'All Premium features',
            'Batch processing',
            'API access',
            'Custom branding',
            'White-label solution',
            'Dedicated support'
        ]
    }
};
router.post('/create-order', asyncHandler(async (req, res) => {
    const { planId, currency = 'INR' } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    if (!planId || !SUBSCRIPTION_PLANS[planId]) {
        throw new ValidationError('Invalid subscription plan selected');
    }
    const plan = SUBSCRIPTION_PLANS[planId];
    try {
        const orderOptions = {
            amount: plan.price,
            currency,
            receipt: `receipt_${userId}_${Date.now()}`,
            notes: {
                user_id: userId,
                plan_id: planId,
                user_email: userEmail,
            }
        };
        const order = await razorpay.orders.create(orderOptions);
        const { data: savedOrder, error } = await supabase
            .from('payment_orders')
            .insert({
            id: order.id,
            user_id: userId,
            plan_id: planId,
            amount: plan.price,
            currency,
            status: 'created',
            razorpay_order_id: order.id,
            receipt: order.receipt,
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error) {
            logger.error('Error saving payment order:', error);
            throw new PaymentError('Failed to create payment order');
        }
        logger.info(`Payment order created for user ${userId}, plan: ${planId}, order ID: ${order.id}`);
        res.json({
            message: 'Payment order created successfully',
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                planId,
                planName: plan.name,
                features: plan.features,
            },
            razorpayKeyId: config.payment.razorpay.keyId,
        });
    }
    catch (error) {
        logger.error('Error creating Razorpay order:', error);
        throw new PaymentError('Failed to create payment order');
    }
}));
router.post('/verify', asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
    const userId = req.user.id;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ValidationError('Missing payment verification data');
    }
    try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', config.payment.razorpay.keySecret)
            .update(body.toString())
            .digest('hex');
        if (expectedSignature !== razorpay_signature) {
            throw new PaymentError('Payment verification failed');
        }
        const { data: order, error: orderError } = await supabase
            .from('payment_orders')
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .eq('user_id', userId)
            .single();
        if (orderError || !order) {
            throw new PaymentError('Order not found');
        }
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (payment.status === 'captured') {
            await supabase
                .from('payment_orders')
                .update({
                status: 'completed',
                razorpay_payment_id,
                razorpay_signature,
                completed_at: new Date().toISOString(),
            })
                .eq('id', order.id);
            const plan = SUBSCRIPTION_PLANS[order.plan_id];
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + plan.duration);
            await supabase
                .from('profiles')
                .update({
                subscription_plan: order.plan_id,
                subscription_status: 'active',
                subscription_expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString(),
            })
                .eq('id', userId);
            logger.info(`Payment verified and subscription activated for user ${userId}, plan: ${order.plan_id}`);
            if (req.user) {
                req.user.subscription = {
                    plan: order.plan_id,
                    status: 'active',
                    expiresAt: expiresAt.toISOString(),
                };
            }
            const token = jwt.sign({
                userId,
                email: req.user?.email || '',
                role: req.user?.role || 'user',
                subscriptionPlan: order.plan_id,
                subscriptionStatus: 'active',
                subscriptionExpiresAt: expiresAt.toISOString()
            }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
            res.json({
                message: 'Payment verified successfully',
                subscription: {
                    plan: order.plan_id,
                    status: 'active',
                    expiresAt: expiresAt.toISOString(),
                },
                token
            });
        }
        else {
            throw new PaymentError('Payment not captured');
        }
    }
    catch (error) {
        logger.error('Payment verification error:', error);
        await supabase
            .from('payment_orders')
            .update({
            status: 'failed',
            razorpay_payment_id,
            error_message: error instanceof Error ? error.message : 'Payment verification failed',
        })
            .eq('razorpay_order_id', razorpay_order_id);
        if (error instanceof PaymentError) {
            throw error;
        }
        throw new PaymentError('Payment verification failed');
    }
}));
router.get('/history', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const { data: payments, error } = await supabase
        .from('payment_orders')
        .select(`
      id,
      plan_id,
      amount,
      currency,
      status,
      created_at,
      completed_at,
      razorpay_payment_id
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);
    if (error) {
        logger.error('Error fetching payment history:', error);
        throw new Error('Failed to fetch payment history');
    }
    const formattedPayments = payments?.map(payment => ({
        id: payment.id,
        planId: payment.plan_id,
        planName: SUBSCRIPTION_PLANS[payment.plan_id]?.name || 'Unknown Plan',
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.created_at,
        completedAt: payment.completed_at,
        paymentId: payment.razorpay_payment_id,
    })) || [];
    res.json({
        message: 'Payment history retrieved successfully',
        data: {
            payments: formattedPayments,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: formattedPayments.length,
            },
        },
    });
}));
router.get('/subscription', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
      subscription_plan,
      subscription_status,
      subscription_expires_at
    `)
        .eq('id', userId)
        .single();
    if (error) {
        logger.error('Error fetching subscription status:', error);
        throw new Error('Failed to fetch subscription status');
    }
    const isActive = profile.subscription_status === 'active' &&
        new Date(profile.subscription_expires_at) > new Date();
    const plan = SUBSCRIPTION_PLANS[profile.subscription_plan];
    res.json({
        message: 'Subscription status retrieved successfully',
        data: {
            plan: profile.subscription_plan,
            planName: plan?.name || 'Free Plan',
            status: isActive ? 'active' : 'inactive',
            expiresAt: profile.subscription_expires_at,
            features: plan?.features || ['Basic resume analysis'],
            daysRemaining: isActive ?
                Math.ceil((new Date(profile.subscription_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
        },
    });
}));
router.post('/cancel', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { error } = await supabase
        .from('profiles')
        .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString(),
    })
        .eq('id', userId);
    if (error) {
        logger.error('Error cancelling subscription:', error);
        throw new Error('Failed to cancel subscription');
    }
    logger.info(`Subscription cancelled for user ${userId}`);
    res.json({
        message: 'Subscription cancelled successfully',
        data: {
            status: 'cancelled',
            message: 'Your subscription will remain active until the end of the current billing period.',
        },
    });
}));
router.get('/plans', (req, res) => {
    const plans = Object.values(SUBSCRIPTION_PLANS).map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price / 100,
        duration: plan.duration,
        features: plan.features,
        popular: plan.id === 'premium',
    }));
    res.json({
        message: 'Subscription plans retrieved successfully',
        data: {
            plans,
            currency: 'INR',
        },
    });
});
router.post('/webhook', asyncHandler(async (req, res) => {
    const secret = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', config.payment.razorpay.keySecret)
        .update(body)
        .digest('hex');
    if (secret !== expectedSignature) {
        logger.warn('Invalid webhook signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
    }
    const event = req.body;
    logger.info(`Webhook received: ${event.event}`);
    switch (event.event) {
        case 'payment.captured':
            break;
        case 'payment.failed':
            break;
        default:
            logger.info(`Unhandled webhook event: ${event.event}`);
    }
    res.json({ status: 'ok' });
}));
export default router;
