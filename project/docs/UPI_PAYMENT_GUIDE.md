# UPI Payment Integration Guide

This guide explains how to use UPI payment methods (GPay, PhonePe, Paytm) with Razorpay in the Resume Analyzer application.

## Implemented Changes

The application has been updated to support UPI payment methods. Here's what was done:

1. Modified the Razorpay payment configuration to include UPI options
2. Set up preferred display order to show UPI options first
3. Added support for various UPI apps: Google Pay, PhonePe, Paytm

## Using UPI Payments

When making a payment:

1. Select your subscription plan (Monthly/Yearly)
2. Complete the payment form
3. In the Razorpay checkout modal, select "Pay with UPI"
4. Choose your preferred UPI app (GPay, PhonePe, Paytm)
5. Complete the payment in your selected UPI app

## Troubleshooting

If UPI options are not visible:

1. Make sure you're using a mobile device or mobile browser mode
2. Ensure UPI payment methods are enabled in your Razorpay dashboard
3. Check that your region supports UPI payments

## Technical Implementation

UPI support is implemented in the following files:

- `src/hooks/usePayment.ts` - Payment configuration
- `src/utils/razorpayService.ts` - Razorpay integration

The configuration prioritizes UPI payment methods in the checkout flow.
