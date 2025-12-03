-- =====================================================
-- FIX ORDER INSERT RLS FOR BUYER REQUESTS
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- Problem: When sellers accept buyer requests, they create orders
-- but the current RLS policy only allows buyers to create orders.
-- Solution: Update the INSERT policy to allow both:
--   1. Buyers creating orders (when accepting offers)
--   2. Sellers creating orders (when accepting buyer requests)
-- =====================================================

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can create orders as buyer" ON orders;

-- Create new policy that allows both buyers and sellers to create orders
-- Buyers can create orders when accepting offers (order_type = 'dining_offer' or 'grubhub_offer')
-- Sellers can create orders when accepting buyer requests (order_type = 'buyer_request')
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT 
  WITH CHECK (
    -- Case 1: User is the buyer (for dining_offer and grubhub_offer orders)
    (auth.uid() = buyer_id AND buyer_id != seller_id) OR
    -- Case 2: User is the seller accepting a buyer request
    (auth.uid() = seller_id AND order_type = 'buyer_request' AND buyer_id != seller_id)
  );

-- =====================================================
-- VERIFICATION
-- =====================================================
-- To verify the policy was created correctly, run:
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'orders' AND cmd = 'INSERT';

