# UPI Payment System

This document describes the new UPI-based payment system that replaces Razorpay integration.

## Overview

Users can now pay for premium subscriptions directly via UPI using Google Pay, PhonePe, Paytm, or any other UPI app. Payments are manually verified by administrators.

## Payment Flow

### For Users:

1. User selects a premium plan (Monthly ₹99 or Yearly ₹499)
2. Payment modal displays:
   - UPI ID to pay to
   - Exact amount to pay
   - Quick pay button (opens UPI app directly)
3. User makes payment via their UPI app
4. User submits:
   - Transaction ID / UTR number
   - Screenshot of successful payment
5. Payment is submitted for verification
6. User receives confirmation within 24 hours

### For Administrators:

1. Access admin panel at `/admin/payments`
2. View all pending payment submissions
3. Review payment screenshot and transaction details
4. Verify or reject payments
5. System automatically activates user subscription upon verification

## Setup Instructions

### 1. Database Setup

Run the SQL migration to create the required table:

```bash
# Execute this SQL file in your Supabase SQL editor
sql/create_pending_payments_table.sql
```

This creates:
- `pending_payments` table for storing payment submissions
- `payment-screenshots` storage bucket for payment proofs
- Row Level Security (RLS) policies
- Necessary indexes and triggers

### 2. Environment Variables

Add your UPI ID to environment variables:

**Frontend (.env)**
```env
VITE_UPI_ID=your-upi-id@paytm
```

**Backend (backend/.env)**
```env
UPI_ID=your-upi-id@paytm
ADMIN_EMAIL=your-admin-email@gmail.com
```

### 3. Storage Bucket

Ensure the `payment-screenshots` bucket is created in Supabase:

1. Go to Supabase Dashboard → Storage
2. Create bucket named `payment-screenshots`
3. Make it public (policies are set via SQL migration)

### 4. Admin Access

To access the payment verification dashboard:

1. Set user role to 'admin' in Supabase auth.users table:
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin-email@gmail.com';
```

2. Access dashboard at: `http://localhost:3000/admin/payments`

## Components

### UpiPayment Component
**Location:** `src/components/premium/UpiPayment.tsx`

Features:
- Displays UPI ID and amount
- One-click UPI app payment button
- Transaction ID input
- Screenshot upload
- Payment submission to database

### PaymentModal Component (Updated)
**Location:** `src/components/premium/PaymentModal.tsx`

Changes:
- Removed Razorpay integration
- Now uses UpiPayment component
- Simplified flow for manual payment submission

### PaymentVerificationPage
**Location:** `src/pages/PaymentVerificationPage.tsx`

Admin dashboard features:
- View all payment submissions
- Filter by status (pending/verified/rejected)
- Search by email or transaction ID
- View payment screenshots
- Verify or reject payments
- Add rejection reasons

## Database Schema

### pending_payments Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| user_email | TEXT | User's email address |
| transaction_id | TEXT | UPI transaction ID/UTR (unique) |
| amount | NUMERIC | Payment amount |
| currency | TEXT | Currency code (default: INR) |
| plan_type | TEXT | 'monthly' or 'yearly' |
| plan_name | TEXT | Plan display name |
| screenshot_url | TEXT | URL to payment proof |
| status | TEXT | 'pending', 'verified', or 'rejected' |
| verified_by | UUID | Admin who verified (nullable) |
| verified_at | TIMESTAMPTZ | Verification timestamp (nullable) |
| rejection_reason | TEXT | Reason if rejected (nullable) |
| created_at | TIMESTAMPTZ | Submission timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Security

- Row Level Security (RLS) enabled
- Users can only:
  - Insert their own payment records
  - View their own payment records
- Admins can:
  - View all payment records
  - Update payment status
- Storage bucket policies ensure users can only upload to their own folder

## Workflow

### Payment Submission
1. User fills payment form
2. Screenshot uploaded to Supabase Storage at `payment-screenshots/{user_id}/{timestamp}.{ext}`
3. Record inserted into `pending_payments` with status 'pending'
4. User sees success message

### Payment Verification
1. Admin views pending payments
2. Admin reviews screenshot and transaction details
3. Admin clicks "Verify" or "Reject"
4. If verified:
   - Status updated to 'verified'
   - Subscription activated (implement subscription activation logic)
   - Email sent to user (optional)
5. If rejected:
   - Status updated to 'rejected'
   - Rejection reason stored
   - Email sent to user (optional)

## Future Enhancements

1. **Email Notifications**
   - Send confirmation email on submission
   - Send activation email on verification
   - Send explanation email on rejection

2. **Automated Verification**
   - Integrate with UPI payment gateway API
   - Auto-verify using transaction ID

3. **Payment Analytics**
   - Revenue tracking
   - Conversion rates
   - Payment method preferences

4. **Refund Management**
   - Track refund requests
   - Process refunds manually

## Removed Components

The following Razorpay-related files should be removed:

- `src/utils/razorpayService.ts`
- `src/types/razorpay.ts`
- `src/types/razorpayGlobal.ts`
- `supabase/functions/razorpay-webhook/`
- `supabase/functions/verify-razorpay-payment/`
- `sql/razorpay_db_patch.sql`
- `sql/create_razorpay_tables.sql`

Backend:
- Uninstall `razorpay` package
- Remove Razorpay routes from `backend/src/routes/payment.ts`
- Remove Razorpay config from `backend/src/config/index.ts`

## Support

For issues or questions about the UPI payment system:
1. Check payment status in admin dashboard
2. Verify UPI ID is correctly configured
3. Ensure storage bucket is public and accessible
4. Check Supabase logs for errors

## Testing

### Test Payment Flow:
1. Create a test user account
2. Select a premium plan
3. Use a test UPI transaction
4. Upload a test screenshot
5. Verify as admin
6. Check subscription activation

### Test Admin Dashboard:
1. Login as admin user
2. View pending payments
3. Test filters and search
4. Verify a test payment
5. Reject a test payment with reason
