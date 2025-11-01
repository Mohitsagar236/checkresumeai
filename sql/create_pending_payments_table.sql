-- Create pending_payments table for manual UPI payment verification
CREATE TABLE IF NOT EXISTS pending_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  plan_name TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);
CREATE INDEX IF NOT EXISTS idx_pending_payments_transaction_id ON pending_payments(transaction_id);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for pending_payments table
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own payment records
CREATE POLICY "Users can insert their own payment records"
ON pending_payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own payment records
CREATE POLICY "Users can view their own payment records"
ON pending_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Admins can view all payment records (you'll need to add admin role check)
CREATE POLICY "Admins can view all payment records"
ON pending_payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Admins can update payment records
CREATE POLICY "Admins can update payment records"
ON pending_payments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Storage policies for payment screenshots
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pending_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER pending_payments_updated_at
BEFORE UPDATE ON pending_payments
FOR EACH ROW
EXECUTE FUNCTION update_pending_payments_updated_at();

COMMENT ON TABLE pending_payments IS 'Stores pending UPI payment submissions for manual verification';
COMMENT ON COLUMN pending_payments.transaction_id IS 'UPI transaction ID / UTR number';
COMMENT ON COLUMN pending_payments.screenshot_url IS 'URL to the payment screenshot proof';
COMMENT ON COLUMN pending_payments.status IS 'Payment verification status: pending, verified, or rejected';
