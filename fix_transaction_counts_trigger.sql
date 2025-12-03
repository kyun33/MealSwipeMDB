-- =====================================================
-- FIX TRANSACTION COUNTS TRIGGER
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This fixes the update_transaction_counts() function to:
-- 1. Use SECURITY DEFINER to bypass RLS when updating profiles
-- 2. Only count 'delivered' orders (not 'completed')
-- 3. Prevent double-counting by checking OLD.status
-- =====================================================

-- Recreate the function with SECURITY DEFINER to bypass RLS
-- This allows the trigger to update profiles even when called by regular users
CREATE OR REPLACE FUNCTION update_transaction_counts()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only count when order reaches 'delivered' status (buyer confirmed receipt)
  -- This ensures we count the transaction only once, when the buyer marks it as received
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
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS update_counts_on_order_complete ON orders;
CREATE TRIGGER update_counts_on_order_complete 
  AFTER UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_transaction_counts();

-- =====================================================
-- VERIFICATION
-- =====================================================
-- To verify the function was created correctly, run:
-- SELECT proname, prosecdef, proconfig 
-- FROM pg_proc 
-- WHERE proname = 'update_transaction_counts';
--
-- prosecdef should be 't' (true) indicating SECURITY DEFINER is set

