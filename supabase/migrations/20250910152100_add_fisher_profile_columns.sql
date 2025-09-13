-- Add columns to profiles table for fisher profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS license_number TEXT,
  ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile images
DO $$
BEGIN
  -- Allow public read access to profile images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = 'Public profile images read access'
  ) THEN
    CREATE POLICY "Public profile images read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-images');
  END IF;

  -- Allow authenticated users to upload their own profile images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = 'Users can upload their own profile images'
  ) THEN
    CREATE POLICY "Users can upload their own profile images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'profile-images' 
      AND (auth.uid()::text = (storage.foldername(name))[1])
    );
  END IF;

  -- Allow users to update their own profile images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = 'Users can update their own profile images'
  ) THEN
    CREATE POLICY "Users can update their own profile images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  -- Allow users to delete their own profile images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = 'Users can delete their own profile images'
  ) THEN
    CREATE POLICY "Users can delete their own profile images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
