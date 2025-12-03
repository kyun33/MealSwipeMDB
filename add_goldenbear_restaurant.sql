-- Migration: Add 'goldenbear' to restaurant CHECK constraints
-- Run this in your Supabase SQL Editor

-- =====================================================
-- Update grubhub_offers table
-- =====================================================

-- Drop the existing CHECK constraint if it exists (by name or by finding it)
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Try to drop the named constraint first
    BEGIN
        ALTER TABLE grubhub_offers DROP CONSTRAINT IF EXISTS grubhub_offers_restaurant_check;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Find any constraint on restaurant column
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'grubhub_offers'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%restaurant%IN%'
    LIMIT 1;
    
    -- Drop it if found
    IF constraint_name IS NOT NULL THEN
        BEGIN
            EXECUTE format('ALTER TABLE grubhub_offers DROP CONSTRAINT %I', constraint_name);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;

-- Add the new CHECK constraint with 'goldenbear' included
ALTER TABLE grubhub_offers
ADD CONSTRAINT grubhub_offers_restaurant_check 
CHECK (restaurant IN ('browns', 'ladle', 'monsoon', 'goldenbear'));

-- =====================================================
-- Update buyer_requests table
-- =====================================================

-- Drop the existing CHECK constraint if it exists
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Try to drop the named constraint first
    BEGIN
        ALTER TABLE buyer_requests DROP CONSTRAINT IF EXISTS buyer_requests_restaurant_check;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Find any constraint on restaurant column
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'buyer_requests'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%restaurant%IN%'
    LIMIT 1;
    
    -- Drop it if found
    IF constraint_name IS NOT NULL THEN
        BEGIN
            EXECUTE format('ALTER TABLE buyer_requests DROP CONSTRAINT %I', constraint_name);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;

-- Add the new CHECK constraint with 'goldenbear' included
ALTER TABLE buyer_requests
ADD CONSTRAINT buyer_requests_restaurant_check 
CHECK (restaurant IN ('browns', 'ladle', 'monsoon', 'goldenbear'));

-- =====================================================
-- Verification
-- =====================================================
-- You can run these queries to verify the constraints were updated:

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'grubhub_offers'::regclass 
--   AND conname LIKE '%restaurant%';

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'buyer_requests'::regclass 
--   AND conname LIKE '%restaurant%';
