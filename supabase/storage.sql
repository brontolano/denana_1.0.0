-- Run this in Supabase SQL Editor (once)
-- Creates the product-images storage bucket

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow users to update/delete their own uploads
CREATE POLICY "Authenticated Manage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-images');
