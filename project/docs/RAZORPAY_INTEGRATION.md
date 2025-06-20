# Razorpay Integration Guide

This document outlines how to complete the Razorpay integration in your Resume Analyzer SaaS application.

## Prerequisites

1. Razorpay account with API keys:
   - Key ID: `rzp_test_LOXRGg0tuOTABB` (already configured)
   - Key Secret: `dSk7QhNCPOCzHb3j4pM0KLJ2` (needs to be securely stored)

2. Supabase project with Edge Functions capability

## Implementation Overview

We've integrated Razorpay into the application with the following components:

1. **Frontend Integration:**
   - Added Razorpay SDK loading
   - Created PaymentMethodSelector component
   - Updated PaymentModal to support Razorpay payments
   - Enhanced SubscriptionContext to handle payment methods

2. **Backend Integration (Edge Functions):**
   - Created `create-razorpay-order` function
   - Created `verify-razorpay-payment` function

## Deployment Steps

### 1. Set up Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the Edge Functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

### 2. Set Environment Variables

In your Supabase project dashboard, navigate to Settings > API, and add the following environment variables:

- `RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
- `SUPABASE_URL`: Your Supabase URL (automatically set by Supabase)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (automatically set by Supabase)

### 3. Create Database Tables

The integration uses two tables:

#### Payment Orders Table
```sql
CREATE TABLE payment_orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  payment_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 4. Update Profiles Table

Add subscription fields to your profiles table:

```sql
ALTER TABLE profiles 
ADD COLUMN is_premium BOOLEAN DEFAULT false,
ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
```

### 5. Configure Webhooks (Optional but Recommended)

For better payment tracking and handling failed payments, configure webhooks in your Razorpay dashboard:

1. Go to Settings > Webhooks
2. Create a new webhook with the URL: `https://<your-supabase-project-ref>.functions.supabase.co/razorpay-webhook`
3. Select events: `payment.authorized`, `payment.failed`, `payment.captured`
4. Set a webhook secret and add it to your Supabase environment variables as `RAZORPAY_WEBHOOK_SECRET`

### 6. Test the Integration

1. Make a test payment using the Razorpay test mode
2. Verify that the payment is recorded in your database
3. Check that the user's premium status is updated correctly

### 7. Moving to Production

When ready to move to production:

1. Switch to production API keys in Razorpay
2. Update the environment variables in your Supabase project
3. Thoroughly test the production setup with real payments

## Customization

### Payment Plans

You can modify the payment plans in `src/utils/razorpayService.ts`:

```typescript
export const RAZORPAY_PLANS = {
  'monthly': {
    id: 'plan_premium_monthly',
    name: 'Premium Monthly',
    amount: 79900, // In paise (799 INR)
    currency: 'INR',
    interval: 'monthly'
  },
  'yearly': {
    id: 'plan_premium_yearly',
    name: 'Premium Yearly',
    amount: 399900, // In paise (3,999 INR)
    currency: 'INR',
    interval: 'yearly'
  }
};
```

## Troubleshooting

1. **Payment failure**: Check the Razorpay dashboard for transaction details
2. **Edge functions not working**: Verify environment variables and deploy logs
3. **Webhook issues**: Check webhook logs in the Razorpay dashboard

## Security Considerations

1. Never expose your Razorpay Key Secret in the frontend code
2. Always verify payments on the server side
3. Use HTTPS for all API calls
4. Implement proper error handling and logging
