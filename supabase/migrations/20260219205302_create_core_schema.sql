/*
  # Create Core SAMBidder Schema

  ## Summary
  Sets up the complete database schema for SAMBidder, an AI-powered government
  contracting bid management platform.

  ## New Tables

  ### 1. profiles
  Stores user profile and company information linked to auth.users.
  - id: UUID matching auth.users.id
  - full_name, job_title: personal info
  - company_name, duns_number, uei, cage_code, primary_naics: company identifiers
  - set_aside_qualifications: array of set-aside types (8a, HUBZone, etc.)

  ### 2. notification_preferences
  Per-user toggles for notification types.
  - bid_status_updates, due_date_reminders, rfp_matches, weekly_summary: boolean toggles

  ### 3. bids
  Core bid/proposal records.
  - title, solicitation_number, agency, naics_code, set_aside: RFP metadata
  - status: draft | in_review | submitted | won | lost
  - pwin_score: 0-100 probability of win
  - estimated_value_min/max: numeric range
  - due_date: submission deadline
  - compliance_score: 0-100
  - rfp_file_path: path in Supabase Storage
  - executive_summary, full_proposal: AI-generated text content
  - raw_rfp_text: extracted text from the uploaded RFP file

  ### 4. compliance_items
  Per-bid compliance requirements extracted from RFP.
  - requirement: description of the compliance requirement
  - status: compliant | partial | missing
  - section: proposal volume/section reference (Volume I, etc.)

  ### 5. bid_documents
  Supporting documents uploaded per bid.
  - doc_type: past-performance | capability-statement | team-resumes | certifications
  - file_path: path in Supabase Storage
  - file_name: original filename

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Profiles auto-created on user signup via trigger
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  job_title text DEFAULT '',
  company_name text DEFAULT '',
  duns_number text DEFAULT '',
  uei text DEFAULT '',
  cage_code text DEFAULT '',
  primary_naics text DEFAULT '',
  set_aside_qualifications text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_status_updates boolean DEFAULT true,
  due_date_reminders boolean DEFAULT true,
  rfp_matches boolean DEFAULT false,
  weekly_summary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  solicitation_number text DEFAULT '',
  agency text DEFAULT '',
  naics_code text DEFAULT '',
  set_aside text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'submitted', 'won', 'lost')),
  pwin_score integer DEFAULT 20 CHECK (pwin_score >= 0 AND pwin_score <= 100),
  estimated_value_min numeric DEFAULT 0,
  estimated_value_max numeric DEFAULT 0,
  due_date date,
  compliance_score integer DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  rfp_file_path text DEFAULT '',
  rfp_url text DEFAULT '',
  raw_rfp_text text DEFAULT '',
  executive_summary text DEFAULT '',
  full_proposal text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bids"
  ON bids FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bids"
  ON bids FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bids"
  ON bids FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bids"
  ON bids FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requirement_id text DEFAULT '',
  requirement text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'missing' CHECK (status IN ('compliant', 'partial', 'missing')),
  section text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compliance items"
  ON compliance_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own compliance items"
  ON compliance_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own compliance items"
  ON compliance_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own compliance items"
  ON compliance_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS bid_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type text NOT NULL CHECK (doc_type IN ('past-performance', 'capability-statement', 'team-resumes', 'certifications')),
  file_path text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bid_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bid documents"
  ON bid_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bid documents"
  ON bid_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bid documents"
  ON bid_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();


CREATE INDEX IF NOT EXISTS bids_user_id_idx ON bids(user_id);
CREATE INDEX IF NOT EXISTS bids_status_idx ON bids(status);
CREATE INDEX IF NOT EXISTS compliance_items_bid_id_idx ON compliance_items(bid_id);
CREATE INDEX IF NOT EXISTS bid_documents_bid_id_idx ON bid_documents(bid_id);
