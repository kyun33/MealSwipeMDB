-- =====================================================
-- FIX OFFER UPDATE USING DATABASE FUNCTION
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This creates a function that updates offer status to 'sold'
-- The function uses SECURITY DEFINER to bypass RLS
-- =====================================================

-- =====================================================
-- DINING OFFERS UPDATE FUNCTION
-- =====================================================

-- Create function to mark dining offer as sold
-- SECURITY DEFINER allows it to bypass RLS
CREATE OR REPLACE FUNCTION mark_dining_offer_sold(p_offer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow updating from 'active' to 'sold'
  UPDATE dining_offers
  SET status = 'sold'
  WHERE id = p_offer_id
    AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer not found or not active';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_dining_offer_sold(UUID) TO authenticated;

-- =====================================================
-- GRUBHUB OFFERS UPDATE FUNCTION
-- =====================================================

-- Create function to mark grubhub offer as sold
-- SECURITY DEFINER allows it to bypass RLS
CREATE OR REPLACE FUNCTION mark_grubhub_offer_sold(p_offer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow updating from 'active' to 'sold'
  UPDATE grubhub_offers
  SET status = 'sold'
  WHERE id = p_offer_id
    AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer not found or not active';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_grubhub_offer_sold(UUID) TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run these queries to verify everything is set up correctly:

-- Check functions exist
-- SELECT proname FROM pg_proc WHERE proname IN ('mark_dining_offer_sold', 'mark_grubhub_offer_sold');

