-- Database patch script for Razorpay integration
-- This script can be run manually in the Supabase SQL Editor

-- First, verify if the tables already exist to avoid errors
DO $$
BEGIN
    -- Check if payment_orders table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_orders') THEN
        -- Create payment_orders table
        CREATE TABLE public.payment_orders (
            id SERIAL PRIMARY KEY,
            order_id TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES auth.users(id),
            plan_id TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        -- Create indexes for payment_orders
        CREATE INDEX idx_payment_orders_order_id ON public.payment_orders(order_id);
        CREATE INDEX idx_payment_orders_user_id ON public.payment_orders(user_id);
        
        RAISE NOTICE 'Created payment_orders table';
    ELSE
        RAISE NOTICE 'payment_orders table already exists';
    END IF;
    
    -- Check if payments table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
        -- Create payments table
        CREATE TABLE public.payments (
            id SERIAL PRIMARY KEY,
            payment_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES auth.users(id),
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        -- Create indexes for payments
        CREATE INDEX idx_payments_payment_id ON public.payments(payment_id);
        CREATE INDEX idx_payments_order_id ON public.payments(order_id);
        CREATE INDEX idx_payments_user_id ON public.payments(user_id);
        
        RAISE NOTICE 'Created payments table';
    ELSE
        RAISE NOTICE 'payments table already exists';
    END IF;
    
    -- Check if profiles table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Check if is_premium column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'is_premium'
        ) THEN
            -- Add subscription fields to profiles table
            ALTER TABLE public.profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
            RAISE NOTICE 'Added is_premium column to profiles table';
        ELSE
            RAISE NOTICE 'is_premium column already exists in profiles table';
        END IF;
        
        -- Check if subscription_start_date column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'subscription_start_date'
        ) THEN
            -- Add subscription_start_date column
            ALTER TABLE public.profiles ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added subscription_start_date column to profiles table';
        ELSE
            RAISE NOTICE 'subscription_start_date column already exists in profiles table';
        END IF;
        
        -- Check if subscription_end_date column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'subscription_end_date'
        ) THEN
            -- Add subscription_end_date column
            ALTER TABLE public.profiles ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added subscription_end_date column to profiles table';
        ELSE
            RAISE NOTICE 'subscription_end_date column already exists in profiles table';
        END IF;
    ELSE
        RAISE NOTICE 'profiles table does not exist';
    END IF;
    
    -- Set RLS policies to ensure proper security
    
    -- Payment Orders RLS
    DROP POLICY IF EXISTS "Payment orders are viewable by the user who created them" ON payment_orders;
    CREATE POLICY "Payment orders are viewable by the user who created them"
    ON payment_orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Payment orders are insertable by service role only" ON payment_orders;
    CREATE POLICY "Payment orders are insertable by service role only"
    ON payment_orders FOR INSERT
    TO service_role
    WITH CHECK (true);
    
    -- Payments RLS
    DROP POLICY IF EXISTS "Payments are viewable by the user who created them" ON payments;
    CREATE POLICY "Payments are viewable by the user who created them"
    ON payments FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Payments are insertable by service role only" ON payments;
    CREATE POLICY "Payments are insertable by service role only"
    ON payments FOR INSERT
    TO service_role
    WITH CHECK (true);
    
    -- Enable Row Level Security
    ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Row Level Security policies have been set up';
    
END$$;
