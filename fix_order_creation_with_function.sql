-- =====================================================
-- FIX ORDER CREATION WITH DATABASE FUNCTION
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This creates a function that inserts orders and returns them
-- The function uses SECURITY DEFINER to bypass RLS for the return value
-- =====================================================

-- Create a function to insert orders and return the created order
-- This bypasses RLS issues with INSERT ... SELECT
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
RETURNS orders
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
  
  RETURN new_order;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_order_and_return TO authenticated;

-- Also ensure RLS policies are correct (in case function isn't used)
DROP POLICY IF EXISTS "Users can view their orders" ON orders;
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can create orders as buyer" ON orders;
CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id 
    AND buyer_id != seller_id
  );

-- Ensure status constraint includes all valid statuses
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'delivered', 'cancelled'));

