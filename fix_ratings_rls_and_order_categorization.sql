-- =====================================================
-- FIX RATINGS RLS POLICY AND ORDER CATEGORIZATION
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This fixes:
-- 1. Ratings RLS policy to allow ratings when order status is 'delivered' (not 'completed')
-- 2. Updates transaction count trigger to use 'delivered' status
-- =====================================================

-- =====================================================
-- RATINGS POLICIES
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create ratings for their orders" ON ratings;

-- Recreate with fix: Allow ratings when order status is 'delivered' (buyer has confirmed receipt)
CREATE POLICY "Users can create ratings for their orders" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
      AND orders.status = 'delivered'
    )
  );

-- =====================================================
-- UPDATE TRANSACTION COUNT TRIGGER
-- =====================================================

-- Update the trigger function to count 'delivered' orders (not 'completed')
CREATE OR REPLACE FUNCTION update_transaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Only count when order reaches 'delivered' status (buyer confirmed receipt)
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Update seller's total sales
    UPDATE profiles
    SET total_sales = total_sales + 1
    WHERE id = NEW.seller_id;
    
    -- Update buyer's total purchases
    UPDATE profiles
    SET total_purchases = total_purchases + 1
    WHERE id = NEW.buyer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

