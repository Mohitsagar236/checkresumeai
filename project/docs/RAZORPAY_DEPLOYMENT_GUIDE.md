# Razorpay Integration Deployment Guide

This guide provides step-by-step instructions to deploy the Razorpay integration for the Resume Analyzer SaaS application.

## 1. Set Up Database Tables

Run the SQL statements from the `sql/create_razorpay_tables.sql` file in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Paste the contents of `sql/create_razorpay_tables.sql`
5. Execute the query to create the necessary tables and columns

## 2. Deploy Edge Functions

### Using the Supabase CLI:

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the Edge Functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

### Using the Supabase Dashboard:

If you don't have the CLI installed:

1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. For each function (`create-razorpay-order`, `verify-razorpay-payment`, `razorpay-webhook`):
   - Click "Create New Function"
   - Enter the function name
   - Paste the code from the respective function file
   - Deploy the function

## 3. Set Environment Variables

In your Supabase dashboard:

1. Go to Settings > API
2. Add the following environment variables:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID (`rzp_test_LOXRGg0tuOTABB` for testing)
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret (`dSk7QhNCPOCzHb3j4pM0KLJ2` for testing)
   - `RAZORPAY_WEBHOOK_SECRET`: Create a secure random string for webhook verification

## 4. Configure Razorpay Webhooks

1. Log in to your Razorpay dashboard
2. Go to Settings > Webhooks
3. Click "Add New Webhook"
4. Enter your webhook URL: `https://<your-supabase-project-ref>.functions.supabase.co/razorpay-webhook`
5. Select events: `payment.authorized`, `payment.failed`, `payment.captured`
6. Enter the same webhook secret you used in your Supabase environment variables
7. Save the webhook configuration

## 5. Testing the Integration

1. Ensure your application is using test mode credentials
2. Make a test payment with these test card details:
   - Card Number: 5267 3181 8797 5449
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name
   - 3D Secure Password: 1234
3. Verify that payment records are created in your database
4. Verify that the user's premium status is updated correctly

## 6. Switching to Production

When ready to go live:

1. Update the Razorpay Key ID and Secret with production credentials
2. Update the webhook URL in your Razorpay production dashboard
3. Perform a test transaction to verify everything works correctly

## Troubleshooting

- **Payment failures**: Check the Razorpay dashboard for transaction details
- **Edge Functions not working**: Verify environment variables and check function logs in Supabase
- **Webhook issues**: Check webhook logs in the Razorpay dashboard
