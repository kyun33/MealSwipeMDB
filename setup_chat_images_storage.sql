-- =====================================================
-- SETUP SUPABASE STORAGE FOR CHAT IMAGES
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This creates a storage bucket for chat images with proper policies
-- =====================================================

-- Create storage bucket for chat images (if it doesn't exist)
-- Note: You may need to create this bucket manually in Supabase Dashboard > Storage
-- The bucket name should be: chat-images

-- Storage policies will be created via Supabase Dashboard or using the Storage API
-- For now, here are the recommended policies:

-- 1. Allow authenticated users to upload images to their order folders
-- INSERT policy:
--   - Name: "Users can upload chat images"
--   - Policy: authenticated users can insert
--   - Bucket: chat-images
--   - Policy definition: (bucket_id = 'chat-images'::text)

-- 2. Allow users to read images from orders they're part of
-- SELECT policy:
--   - Name: "Users can view chat images from their orders"
--   - Policy: authenticated users can select
--   - Bucket: chat-images
--   - Policy definition: (bucket_id = 'chat-images'::text)

-- Note: The actual storage bucket and policies should be set up via:
-- 1. Supabase Dashboard > Storage > Create bucket "chat-images" (public: false)
-- 2. Add policies via Dashboard or Storage API

-- Alternative: Use RLS policies on the messages table to control access
-- The image URLs will be public URLs, but access is controlled via message RLS

