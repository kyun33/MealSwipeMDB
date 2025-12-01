-- =====================================================
-- FIX RATING UPDATE TRIGGER
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This ensures the trigger function can update profiles
-- even when called by regular users (bypasses RLS)
-- =====================================================

-- Recreate the function with SECURITY DEFINER to bypass RLS
-- This allows the trigger to update profiles even when called by regular users
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the rated user's profile
  UPDATE profiles
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM ratings
      WHERE rated_user_id = NEW.rated_user_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE rated_user_id = NEW.rated_user_id
    )
  WHERE id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_rating_on_insert ON ratings;
CREATE TRIGGER update_rating_on_insert 
  AFTER INSERT ON ratings
  FOR EACH ROW 
  EXECUTE FUNCTION update_user_rating();

