-- Create storage buckets for avatars and product images
-- Run this in Supabase SQL Editor

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create product-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for product-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own product images" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow users to update their own product images
CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own product images
CREATE POLICY "Users can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
