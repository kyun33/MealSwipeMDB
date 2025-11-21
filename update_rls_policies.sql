-- =====================================================
-- UPDATE RLS POLICIES
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This fixes:
-- 1. Users can see their own created orders
-- 2. No foreign key RLS issues when buyers/sellers create orders
-- =====================================================

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
CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id 
    AND buyer_id != seller_id  -- Prevent users from creating orders from their own offers
  );

-- =====================================================
-- VERIFICATION QUERIES (Optional - run to verify policies)
-- =====================================================

-- Check current policies on buyer_requests
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'buyer_requests';

-- Check current policies on orders
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'orders';

-- Check current policies on dining_offers
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'dining_offers';

-- Check current policies on grubhub_offers
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'grubhub_offers';

