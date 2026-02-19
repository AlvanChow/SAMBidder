/*
  # Storage RLS Policies

  ## Summary
  Adds Row Level Security policies to Supabase Storage buckets so that
  authenticated users can only access their own files.

  ## Policies Added

  ### rfp-uploads bucket
  - SELECT: users can read their own RFP files (path starts with their user ID)
  - INSERT: users can upload RFP files to their own folder
  - DELETE: users can delete their own RFP files

  ### bid-documents bucket
  - SELECT: users can read their own supporting documents
  - INSERT: users can upload supporting documents to their own folder
  - DELETE: users can delete their own supporting documents
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can read own rfp uploads'
  ) THEN
    CREATE POLICY "Users can read own rfp uploads"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'rfp-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload own rfp files'
  ) THEN
    CREATE POLICY "Users can upload own rfp files"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'rfp-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own rfp files'
  ) THEN
    CREATE POLICY "Users can delete own rfp files"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'rfp-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can read own bid documents'
  ) THEN
    CREATE POLICY "Users can read own bid documents"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'bid-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload own bid documents'
  ) THEN
    CREATE POLICY "Users can upload own bid documents"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'bid-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own bid documents'
  ) THEN
    CREATE POLICY "Users can delete own bid documents"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'bid-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
