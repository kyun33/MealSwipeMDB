# Setup Chat Images Storage Bucket

The error "Bucket not found" means the `chat-images` storage bucket doesn't exist in your Supabase project.

## Option 1: Create via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Enter bucket name: `chat-images`
6. Choose **Public** (recommended for chat images - access is still controlled via message RLS policies)
7. Click **Create bucket**

## Option 2: Create via SQL (if you have admin access)

Run this in your Supabase SQL Editor:

```sql
-- Note: This requires the storage extension and proper permissions
-- You may need to enable this via Supabase Dashboard first

-- Insert bucket into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-images',
  'chat-images',
  false, -- Private bucket
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;
```

## Set Up Storage Policies

After creating the bucket, you need to set up policies so users can upload and read images:

### Via Supabase Dashboard:
1. Go to **Storage** > **Policies** tab
2. Select the `chat-images` bucket
3. Click **New Policy**

**Policy 1: Allow authenticated users to upload**
- Policy name: "Users can upload chat images"
- Allowed operation: INSERT
- Policy definition:
```sql
bucket_id = 'chat-images'
```

**Policy 2: Allow authenticated users to read**
- Policy name: "Users can read chat images"
- Allowed operation: SELECT
- Policy definition:
```sql
bucket_id = 'chat-images'
```

### Via SQL:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-images');

-- Allow authenticated users to read images
CREATE POLICY "Users can read chat images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');
```

## Verify Setup

After creating the bucket and policies, try uploading an image in the chat again. It should work!

