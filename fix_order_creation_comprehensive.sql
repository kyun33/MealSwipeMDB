-- =====================================================
-- COMPREHENSIVE FIX FOR ORDER CREATION
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This ensures:
-- 1. RLS policies allow users to see orders they create
-- 2. Status constraint includes all valid statuses
-- 3. Database function exists for reliable order creation
-- =====================================================

-- =====================================================
-- STEP 1: Update status constraint
-- =====================================================
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'delivered', 'cancelled'));

-- =====================================================
-- STEP 2: Fix RLS policies for orders
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders as buyer" ON orders;
DROP POLICY IF EXISTS "Users can update their orders" ON orders;

-- SELECT policy: Users can see orders where they are buyer or seller
-- This MUST allow users to see orders they just created
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- INSERT policy: Users can create orders as buyer (not seller)
-- WITH CHECK ensures the row being inserted is valid
CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id 
    AND buyer_id != seller_id
  );

-- UPDATE policy: Buyers and sellers can update their orders
CREATE POLICY "Users can update their orders" ON orders
  FOR UPDATE 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- =====================================================
-- STEP 3: Create database function for reliable order creation
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_order_and_return;

-- Create function that inserts and returns order
-- SECURITY DEFINER allows it to bypass RLS for the return value
-- Using RETURNS JSONB works better with Supabase RPC (avoids composite type issues)
CREATE OR REPLACE FUNCTION create_order_and_return(
  p_order_type TEXT,
  p_dining_offer_id UUID,
  p_grubhub_offer_id UUID,
  p_buyer_request_id UUID,
  p_buyer_id UUID,
  p_seller_id UUID,
  p_item_type TEXT,
  p_dining_hall TEXT,
  p_restaurant TEXT,
  p_pickup_location TEXT,
  p_pickup_date DATE,
  p_pickup_time_start TIME,
  p_pickup_time_end TIME,
  p_price DECIMAL(10,2),
  p_status TEXT DEFAULT 'confirmed'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order orders;
BEGIN
  -- Insert the order
  INSERT INTO orders (
    order_type,
    dining_offer_id,
    grubhub_offer_id,
    buyer_request_id,
    buyer_id,
    seller_id,
    item_type,
    dining_hall,
    restaurant,
    pickup_location,
    pickup_date,
    pickup_time_start,
    pickup_time_end,
    price,
    status
  ) VALUES (
    p_order_type,
    p_dining_offer_id,
    p_grubhub_offer_id,
    p_buyer_request_id,
    p_buyer_id,
    p_seller_id,
    p_item_type,
    p_dining_hall,
    p_restaurant,
    p_pickup_location,
    p_pickup_date,
    p_pickup_time_start,
    p_pickup_time_end,
    p_price,
    p_status
  )
  RETURNING * INTO new_order;
  
  -- Return the order as JSONB (Supabase RPC handles this better than composite types)
  RETURN to_jsonb(new_order);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_order_and_return TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run these queries to verify everything is set up correctly:

-- Check policies
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'orders';

-- Check function exists
-- SELECT proname FROM pg_proc WHERE proname = 'create_order_and_return';

-- Check status constraint
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'orders'::regclass AND conname = 'orders_status_check';

