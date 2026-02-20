/*
  # Create Storage Buckets

  Creates the Supabase Storage buckets required for file uploads.
  Without these buckets, all RFP and document uploads will fail.

  ## Buckets

  - rfp-uploads: stores uploaded RFP files (PDF, DOC, DOCX), 20 MB limit
  - bid-documents: stores supporting bid documents, 20 MB limit

  Both buckets are private (public = false). RLS policies controlling
  per-user access are defined in the storage_rls_policies migration.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES
  ('rfp-uploads',   'rfp-uploads',   false, 20971520),
  ('bid-documents', 'bid-documents', false, 20971520)
ON CONFLICT (id) DO NOTHING;
