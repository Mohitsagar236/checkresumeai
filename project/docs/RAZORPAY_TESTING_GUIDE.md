# End-to-End Testing Guide for Razorpay Integration

This document provides a step-by-step guide to test the complete Razorpay integration in the Resume Analyzer SaaS application.

## Prerequisites

Before starting the test, ensure you have:

1. Deployed all Edge Functions to Supabase
2. Created the necessary database tables
3. Updated the profiles table with subscription fields
4. Configured the environment variables
5. Set up webhooks in the Razorpay dashboard (optional but recommended)

You can use the `test-razorpay-integration.ps1` script to verify these prerequisites.

## Test Cases

### Test Case 1: Creating an Order

**Steps:**
1. Log in to the application
2. Navigate to the pricing page
3. Click "Get Premium" on either the monthly or yearly plan
4. In the payment modal, select "Razorpay" as the payment method
5. Click "Continue to Payment"

**Expected Results:**
- The Razorpay checkout should open in a modal
- The order amount should match the selected plan
- The order should be recorded in the `payment_orders` table in your database

### Test Case 2: Successful Payment

**Steps:**
1. Complete Test Case 1
2. In the Razorpay checkout, use the following test card details:
   - Card Number: 5267 3181 8797 5449
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name
   - 3D Secure Password: 1234
3. Complete the payment

**Expected Results:**
- The payment should be successful
- The payment status should be "captured" or "authorized"
- The payment should be recorded in the `payments` table
- The user's premium status should be updated to `true`
- The subscription start and end dates should be set correctly
- The success screen should be displayed

### Test Case 3: Failed Payment

**Steps:**
1. Complete Test Case 1
2. In the Razorpay checkout, use the following test card details:
   - Card Number: 4012 0010 3714 1112
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name
3. Complete the payment

**Expected Results:**
- The payment should fail
- An appropriate error message should be displayed
- The payment status in the database should be "failed" (if webhooks are configured)
- The user's premium status should remain `false`

### Test Case 4: Webhook Processing (If Configured)

**Steps:**
1. Complete Test Case 2 (successful payment)
2. Check the Razorpay dashboard for webhook calls

**Expected Results:**
- The webhook should be triggered for the `payment.captured` or `payment.authorized` event
- The webhook call should be successful (status 200)
- The database should reflect the webhook processing

## Database Verification Queries

After running the tests, use these SQL queries in your Supabase SQL editor to verify the data:

### Check Orders
```sql
SELECT * FROM payment_orders ORDER BY created_at DESC LIMIT 10;
```

### Check Payments
```sql
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;
```

### Check User Premium Status
```sql
SELECT id, email, is_premium, subscription_start_date, subscription_end_date 
FROM profiles 
WHERE is_premium = true
LIMIT 10;
```

## Troubleshooting

### Payment Not Processing
- Check the browser console for JavaScript errors
- Verify the Razorpay key ID in `razorpayService.ts`
- Ensure the Razorpay SDK is loading correctly

### Order Creation Fails
- Check the Supabase Edge Function logs for `create-razorpay-order`
- Verify the environment variables in Supabase
- Test the Edge Function directly using a tool like Postman

### Payment Verification Fails
- Check the HMAC signature verification in the `verify-razorpay-payment` function
- Verify that the correct Razorpay key secret is being used

### Webhooks Not Working
- Check the webhook settings in the Razorpay dashboard
- Verify the webhook URL is correct and accessible
- Check the webhook secret matches between Razorpay and your Supabase Edge Function
