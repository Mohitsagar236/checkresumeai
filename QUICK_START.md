# 🚀 Quick Start Guide - UPI Payment System

## Immediate Actions Required

### Step 1: Update Your UPI ID (5 minutes)

**Frontend `.env` file:**
```env
VITE_UPI_ID=yourname@paytm  # ⚠️ REPLACE THIS
```

**Backend `backend/.env` file:**
```env
UPI_ID=yourname@paytm  # ⚠️ REPLACE THIS
ADMIN_EMAIL=youremail@gmail.com  # ⚠️ REPLACE THIS
```

### Step 2: Database Setup (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project → SQL Editor
2. Copy content from `sql/create_pending_payments_table.sql`
3. Paste and execute
4. Verify success ✅

### Step 3: Set Admin Access (1 minute)

Run this in Supabase SQL Editor:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin-email@gmail.com';  -- ⚠️ REPLACE THIS
```

### Step 4: Install Dependencies (2 minutes)

```bash
# Backend - Remove Razorpay
cd backend
npm uninstall razorpay
npm install
npm run build

# Frontend
cd ..
npm install
```

### Step 5: Start Your App (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

---

## Testing the System (5 minutes)

### Test User Payment Flow:

1. Open http://localhost:3000/pricing
2. Click "Upgrade to Premium" on any plan
3. You should see:
   - UPI ID displayed
   - Amount to pay
   - "Pay with UPI App" button
   - Transaction ID input
   - Screenshot upload area
4. Make a test payment (or use fake data for testing)
5. Enter transaction ID: `TEST123456789`
6. Upload any image as screenshot
7. Click "Submit Payment"
8. You should see success message ✅

### Test Admin Verification:

1. Open http://localhost:3000/admin/payments
2. You should see the test payment submission
3. Click "Verify Payment"
4. Confirm verification ✅

---

## What Changed?

### ✅ Created:
- `src/components/premium/UpiPayment.tsx` - UPI payment component
- `src/pages/PaymentVerificationPage.tsx` - Admin dashboard
- `sql/create_pending_payments_table.sql` - Database migration
- `UPI_PAYMENT_SYSTEM.md` - Complete documentation
- `PAYMENT_MIGRATION_SUMMARY.md` - Migration details

### 🔄 Modified:
- `src/components/premium/PaymentModal.tsx` - Now uses UPI
- `.env` - Added VITE_UPI_ID
- `backend/.env` - Added UPI_ID and ADMIN_EMAIL
- `backend/package.json` - Removed razorpay
- `backend/src/config/index.ts` - Updated payment config
- `src/routes.tsx` - Added admin route

---

## Important URLs

- **User Payment**: http://localhost:3000/pricing
- **Admin Dashboard**: http://localhost:3000/admin/payments
- **Supabase Dashboard**: https://app.supabase.com

---

## Pricing

- **Monthly Plan**: ₹99/month
- **Yearly Plan**: ₹499/year (58% savings)

---

## Need Help?

1. **Full Documentation**: See `UPI_PAYMENT_SYSTEM.md`
2. **Migration Details**: See `PAYMENT_MIGRATION_SUMMARY.md`
3. **Database Schema**: See `sql/create_pending_payments_table.sql`

---

## Files to Delete (Optional Cleanup)

After testing, you can manually delete these old Razorpay files:

```
src/utils/razorpayService.ts
src/types/razorpay.ts
src/types/razorpayGlobal.ts
src/components/premium/PaymentMethodSelector.tsx
supabase/functions/razorpay-webhook/
supabase/functions/verify-razorpay-payment/
sql/razorpay_db_patch.sql
sql/create_razorpay_tables.sql
```

---

## ✨ Benefits of UPI System

✅ **Zero transaction fees**
✅ **No monthly gateway charges**
✅ **Direct to your bank account**
✅ **Supports all UPI apps (GPay, PhonePe, Paytm, BHIM)**
✅ **Perfect for Indian customers**
✅ **Full control over payments**

---

## Support Payment Methods

Your users can pay using:
- 💳 Google Pay
- 📱 PhonePe
- 💰 Paytm
- 🏦 BHIM
- 🔵 Any UPI app

---

**You're all set! 🎉**

The new UPI payment system is ready to use. Users can now pay directly to your UPI ID via their favorite payment apps!
