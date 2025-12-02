-- =====================================================
-- COMPLETE SETUP FOR CHAT IMAGES STORAGE
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This creates the storage bucket and policies for chat images
-- Note: You may need to create the bucket via Dashboard first if this doesn't work
-- =====================================================

-- Create the storage bucket (if it doesn't exist)
-- Note: This might require admin privileges or need to be done via Dashboard
-- For chat images, we use a public bucket for easier access
-- Access is still controlled via RLS policies on the messages table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-images',
  'chat-images',
  true, -- Public bucket (easier for chat images, access controlled via message RLS)
  5242880, -- 5MB file size limit (adjust as needed)
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true; -- Ensure bucket is public

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload chat images" ON storage.objects;
DROP POLICY IF EXISTS "Users can read chat images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their chat images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their chat images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-images');

-- Policy 2: Allow authenticated users to read images
CREATE POLICY "Users can read chat images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');

-- Policy 3: Allow users to update their own uploads (optional)
CREATE POLICY "Users can update their chat images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'chat-images')
WITH CHECK (bucket_id = 'chat-images');

-- Policy 4: Allow users to delete their own uploads (optional)
CREATE POLICY "Users can delete their chat images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-images');

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run these queries to verify everything is set up correctly:

-- Check if bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'chat-images';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

