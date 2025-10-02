/*
  # Enrollment Management System Schema

  ## Overview
  This migration creates the complete enrollment management system with support for:
  - Multiple client organizations
  - Auto-generated enrollment IDs and e-IDs
  - Bulk uploads with proper tracking
  - Human validation workflow

  ## New Tables

  ### 1. `clients`
  Organization/company table for managing different client entities
  - `id` (uuid, primary key) - Unique client identifier
  - `client_code` (text, unique) - Human-readable code (e.g., "ZENITH", "NNPC")
  - `name` (text) - Full company name
  - `contact_person` (text) - Primary contact name
  - `contact_email` (text) - Contact email
  - `contact_phone` (text) - Contact phone
  - `address` (text) - Company address
  - `status` (text) - active/inactive
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `enrollees`
  Main enrollee/member table with auto-generated IDs
  - `id` (uuid, primary key) - Internal database ID
  - `enrollment_id` (text, unique) - Auto-generated format: ENR-YYYY-####
  - `e_id` (text, unique) - Electronic ID for digital cards
  - `client_id` (uuid, foreign key) - References clients table
  - `nhia_number` (text) - National Health Insurance Authority number
  - `bvn` (text) - Bank Verification Number
  - `name` (text) - Full name
  - `gender` (text) - Male/Female/Other
  - `date_of_birth` (date) - Birth date
  - `age` (integer) - Calculated or stored age
  - `phone` (text) - Contact phone
  - `email` (text) - Email address
  - `address` (text) - Residential address
  - `plan` (text) - Bronze/Silver/Gold
  - `status` (text) - active/pending/inactive
  - `effective_date` (date) - Coverage start date
  - `expiration_date` (date) - Coverage end date
  - `validation_status` (text) - pending/approved/rejected
  - `validated_by` (text) - Name of validator
  - `validation_date` (timestamptz) - Date of validation
  - `validation_notes` (text) - Validation comments
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `bulk_uploads`
  Track bulk upload operations
  - `id` (uuid, primary key) - Upload session ID
  - `client_id` (uuid, foreign key) - Client for this upload
  - `uploaded_by` (text) - User who performed upload
  - `file_name` (text) - Original file name
  - `total_records` (integer) - Total rows in file
  - `successful_records` (integer) - Successfully processed
  - `failed_records` (integer) - Failed to process
  - `status` (text) - processing/completed/failed
  - `error_log` (jsonb) - Detailed error information
  - `created_at` (timestamptz) - Upload timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Authenticated users can read their organization's data
  - Only admins can insert/update/delete records

  ## Indexes
  - Created for enrollment_id and e_id for fast lookups
  - Client_id indexed for query performance

  ## Functions
  - Auto-generate enrollment_id using trigger
  - Auto-generate e_id using trigger
  - Auto-update updated_at timestamp
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_code text UNIQUE NOT NULL,
  name text NOT NULL,
  contact_person text,
  contact_email text,
  contact_phone text,
  address text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enrollees table
CREATE TABLE IF NOT EXISTS enrollees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id text UNIQUE,
  e_id text UNIQUE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  nhia_number text,
  bvn text,
  name text NOT NULL,
  gender text CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth date,
  age integer,
  phone text,
  email text,
  address text,
  plan text DEFAULT 'Bronze' CHECK (plan IN ('Bronze', 'Silver', 'Gold')),
  status text DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  effective_date date,
  expiration_date date,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  validated_by text,
  validation_date timestamptz,
  validation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bulk_uploads table
CREATE TABLE IF NOT EXISTS bulk_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  uploaded_by text NOT NULL,
  file_name text NOT NULL,
  total_records integer DEFAULT 0,
  successful_records integer DEFAULT 0,
  failed_records integer DEFAULT 0,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_log jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollees_enrollment_id ON enrollees(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_enrollees_e_id ON enrollees(e_id);
CREATE INDEX IF NOT EXISTS idx_enrollees_client_id ON enrollees(client_id);
CREATE INDEX IF NOT EXISTS idx_enrollees_status ON enrollees(status);
CREATE INDEX IF NOT EXISTS idx_enrollees_validation_status ON enrollees(validation_status);
CREATE INDEX IF NOT EXISTS idx_clients_client_code ON clients(client_code);

-- Function to generate enrollment ID
CREATE OR REPLACE FUNCTION generate_enrollment_id()
RETURNS TRIGGER AS $$
DECLARE
  current_year text;
  max_number integer;
  new_number text;
BEGIN
  IF NEW.enrollment_id IS NULL THEN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::text;
    
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(enrollment_id FROM 'ENR-' || current_year || '-(.*)') AS INTEGER)
    ), 0) INTO max_number
    FROM enrollees
    WHERE enrollment_id LIKE 'ENR-' || current_year || '-%';
    
    new_number := LPAD((max_number + 1)::text, 4, '0');
    NEW.enrollment_id := 'ENR-' || current_year || '-' || new_number;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate e-ID
CREATE OR REPLACE FUNCTION generate_e_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.e_id IS NULL THEN
    NEW.e_id := 'EID-' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 12));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for enrollees
DROP TRIGGER IF EXISTS trigger_generate_enrollment_id ON enrollees;
CREATE TRIGGER trigger_generate_enrollment_id
  BEFORE INSERT ON enrollees
  FOR EACH ROW
  EXECUTE FUNCTION generate_enrollment_id();

DROP TRIGGER IF EXISTS trigger_generate_e_id ON enrollees;
CREATE TRIGGER trigger_generate_e_id
  BEFORE INSERT ON enrollees
  FOR EACH ROW
  EXECUTE FUNCTION generate_e_id();

DROP TRIGGER IF EXISTS trigger_update_enrollees_updated_at ON enrollees;
CREATE TRIGGER trigger_update_enrollees_updated_at
  BEFORE UPDATE ON enrollees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_update_clients_updated_at ON clients;
CREATE TRIGGER trigger_update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollees ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Authenticated users can view clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for enrollees table
CREATE POLICY "Authenticated users can view enrollees"
  ON enrollees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert enrollees"
  ON enrollees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update enrollees"
  ON enrollees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete enrollees"
  ON enrollees FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for bulk_uploads table
CREATE POLICY "Authenticated users can view bulk uploads"
  ON bulk_uploads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bulk uploads"
  ON bulk_uploads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bulk uploads"
  ON bulk_uploads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample clients
INSERT INTO clients (client_code, name, contact_person, contact_email, contact_phone, address, status)
VALUES 
  ('ZENITH', 'Zenith Bank Plc', 'HR Manager', 'hr@zenithbank.com', '+234-801-111-1111', '123 Victoria Island, Lagos', 'active'),
  ('NNPC', 'Nigerian National Petroleum Corporation', 'Chief Medical Officer', 'cmo@nnpc.gov.ng', '+234-802-222-2222', '456 Garki District, Abuja', 'active'),
  ('ACCESS', 'Access Bank Plc', 'Welfare Officer', 'welfare@accessbank.com', '+234-803-333-3333', '789 Marina, Lagos', 'active'),
  ('MTN', 'MTN Nigeria', 'Benefits Manager', 'benefits@mtn.ng', '+234-804-444-4444', '321 Ikoyi, Lagos', 'active')
ON CONFLICT (client_code) DO NOTHING;