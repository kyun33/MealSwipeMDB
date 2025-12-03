-- Enable Realtime for the messages table
-- This allows Supabase Realtime to listen to changes on this table
-- Run this in your Supabase SQL Editor

-- Add the messages table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Verify the table was added (optional check)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages';