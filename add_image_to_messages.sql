-- =====================================================
-- ADD IMAGE SUPPORT TO MESSAGES
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================
-- This adds an image_url column to the messages table
-- =====================================================

-- Add image_url column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for image_url queries (optional, but can help with performance)
CREATE INDEX IF NOT EXISTS idx_messages_image_url ON messages(image_url) WHERE image_url IS NOT NULL;

