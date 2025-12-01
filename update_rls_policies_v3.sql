-- =====================================================
-- UPDATE RLS POLICIES - VERSION 3
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This fixes:
-- 1. Users can see their own created orders
-- 2. No foreign key RLS issues when buyers/sellers create orders
-- 3. Foreign key constraint violations on orders_buyer_id_fkey and orders_seller_id_fkey
-- =====================================================
-- CRITICAL: This version ensures profiles are viewable for FK validation
-- =====================================================

-- =====================================================
-- PROFILES POLICIES (Fix foreign key visibility)
-- =====================================================

-- Drop ALL existing SELECT policies on profiles to avoid conflicts
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Recreate to ensure all profiles are viewable for foreign key validation
-- CRITICAL: When creating orders, PostgreSQL needs to verify buyer_id and seller_id
-- exist in profiles. The foreign key constraint check requires the user to be able
-- to SELECT the referenced profile rows. This policy with USING (true) ensures
-- ALL authenticated users can see ALL profiles, which is necessary for FK validation.
-- 
-- Note: This is safe because profiles only contain public information (name, rating, etc.)
-- and users need to see seller profiles to make purchasing decisions anyway.
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT 
  USING (true);

-- =====================================================
-- BUYER REQUESTS POLICIES
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Active buyer requests viewable by everyone" ON buyer_requests;

-- Recreate with fix: Allow sellers who accepted requests to see them
-- This prevents foreign key RLS issues when creating orders from accepted requests
-- CRITICAL: The 'OR accepted_by = auth.uid()' allows sellers to see requests they accepted
-- even after status changes to 'accepted', which is needed for foreign key validation
CREATE POLICY "Active buyer requests viewable by everyone" ON buyer_requests
  FOR SELECT USING (status = 'active' OR buyer_id = auth.uid() OR accepted_by = auth.uid());

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own buyer requests" ON buyer_requests;

-- Recreate with fix: Allow sellers to update active requests (to accept them)
-- USING: Check existing row - allow buyers, active requests, or sellers who accepted
-- WITH CHECK: Ensure sellers can only set accepted_by to themselves
CREATE POLICY "Users can update own buyer requests" ON buyer_requests
  FOR UPDATE 
  USING (
    auth.uid() = buyer_id 
    OR status = 'active'  -- Allow any authenticated user to update active requests (sellers can accept)
    OR auth.uid() = accepted_by  -- Allow sellers to update requests they accepted
  )
  WITH CHECK (
    -- Buyers can update their own requests freely
    auth.uid() = buyer_id
    -- OR sellers can update if they're setting accepted_by to themselves
    OR accepted_by = auth.uid()
  );

-- =====================================================
-- DINING OFFERS POLICIES (Fix foreign key visibility)
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Active dining offers viewable by everyone" ON dining_offers;

-- Recreate to ensure buyers can see active offers for foreign key validation
-- This is CRITICAL: When a buyer creates an order with dining_offer_id,
-- they must be able to SELECT the referenced dining_offer row
CREATE POLICY "Active dining offers viewable by everyone" ON dining_offers
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

-- =====================================================
-- GRUBHUB OFFERS POLICIES (Fix foreign key visibility)
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Active grubhub offers viewable by everyone" ON grubhub_offers;

-- Recreate to ensure buyers can see active offers for foreign key validation
-- This is CRITICAL: When a buyer creates an order with grubhub_offer_id,
-- they must be able to SELECT the referenced grubhub_offer row
CREATE POLICY "Active grubhub offers viewable by everyone" ON grubhub_offers
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their orders" ON orders;

-- Recreate to ensure users can see their own created orders
-- Buyers can see orders where they are the buyer
-- Sellers can see orders where they are the seller
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can create orders as buyer" ON orders;

-- Recreate with check to prevent users from creating orders from their own offers
-- WITH CHECK: Validates the new row being inserted
-- Ensures: 1) User is the buyer, 2) Buyer is not the seller (prevents self-orders)
-- 
-- CRITICAL: For this to work, the profiles policy MUST allow viewing all profiles.
-- When PostgreSQL validates the foreign key constraints on buyer_id and seller_id,
-- it needs to be able to SELECT those profile rows. The profiles policy above
-- with USING (true) ensures this works.
CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id 
    AND buyer_id != seller_id  -- Prevent users from creating orders from their own offers
  );

-- =====================================================
-- VERIFICATION QUERIES (Run these to verify policies are applied)
-- =====================================================

-- Verify profiles policy exists and allows all users to see all profiles
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone';

-- Check all policies on buyer_requests
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'buyer_requests';

-- Check all policies on orders
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders';

-- Check all policies on dining_offers
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'dining_offers';

-- Check all policies on grubhub_offers
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'grubhub_offers';

