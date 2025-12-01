-- =====================================================
-- FIX ORDER INSERT/SELECT RLS ISSUE
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This fixes the issue where INSERT with SELECT returns 0 rows
-- The problem: After INSERT, the SELECT might not see the row due to RLS
-- Solution: Ensure the SELECT policy allows users to see orders they just created
-- =====================================================

-- The SELECT policy should already allow this, but let's make sure it's correct
-- Users should be able to see orders where they are buyer or seller
DROP POLICY IF EXISTS "Users can view their orders" ON orders;

CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Also ensure the INSERT policy is correct
DROP POLICY IF EXISTS "Users can create orders as buyer" ON orders;

CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id 
    AND buyer_id != seller_id
  );

-- Make sure the status constraint includes all valid statuses
-- This ensures 'confirmed' status is valid when creating orders
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'delivered', 'cancelled'));

