-- =====================================================
-- FIX OFFER UPDATE RLS POLICIES
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This allows buyers to mark offers as 'sold' when they create an order
-- =====================================================

-- =====================================================
-- DINING OFFERS UPDATE POLICY
-- =====================================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own dining offers" ON dining_offers;

-- Create new policy that allows:
-- 1. Sellers to update their own offers (any status change)
-- 2. Any authenticated user to update offers from 'active' to 'sold' (when creating an order)
--    This is safe because it's a one-way transition that prevents duplicate orders
-- USING clause checks the existing row (before update)
-- WITH CHECK clause checks the new row (after update)
CREATE POLICY "Users can update own dining offers" ON dining_offers
  FOR UPDATE 
  USING (
    auth.uid() = seller_id  -- Sellers can always update their own offers
    OR (status = 'active' AND auth.uid() IS NOT NULL)  -- Authenticated users can update active offers
  )
  WITH CHECK (
    auth.uid() = seller_id  -- Sellers can make any update
    OR (status = 'sold' AND auth.uid() IS NOT NULL)  -- Authenticated users can only set status to 'sold'
  );

-- =====================================================
-- GRUBHUB OFFERS UPDATE POLICY
-- =====================================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own grubhub offers" ON grubhub_offers;

-- Create new policy that allows:
-- 1. Sellers to update their own offers (any status change)
-- 2. Any authenticated user to update offers from 'active' to 'sold' (when creating an order)
--    This is safe because it's a one-way transition that prevents duplicate orders
-- USING clause checks the existing row (before update)
-- WITH CHECK clause checks the new row (after update)
CREATE POLICY "Users can update own grubhub offers" ON grubhub_offers
  FOR UPDATE 
  USING (
    auth.uid() = seller_id  -- Sellers can always update their own offers
    OR (status = 'active' AND auth.uid() IS NOT NULL)  -- Authenticated users can update active offers
  )
  WITH CHECK (
    auth.uid() = seller_id  -- Sellers can make any update
    OR (status = 'sold' AND auth.uid() IS NOT NULL)  -- Authenticated users can only set status to 'sold'
  );

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run these queries to verify everything is set up correctly:

-- Check dining_offers policies
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'dining_offers';

-- Check grubhub_offers policies
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'grubhub_offers';

