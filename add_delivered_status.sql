-- Add 'delivered' status to orders table
-- This allows for a two-step completion process:
-- 1. Seller marks order as 'completed'
-- 2. Buyer marks order as 'delivered' (received)
-- 3. After delivery, users can rate the order

-- Update the CHECK constraint to include 'delivered' status
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'delivered', 'cancelled'));

-- Update the trigger function to handle 'delivered' status for transaction counts
-- The trigger should count 'delivered' orders as completed transactions
CREATE OR REPLACE FUNCTION update_transaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'delivered' OR NEW.status = 'completed') 
     AND (OLD.status IS NULL OR (OLD.status != 'delivered' AND OLD.status != 'completed')) THEN
    -- Only count once when order reaches delivered status
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

