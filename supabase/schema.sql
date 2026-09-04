-- =============================================
-- Supabase Schema for Carlson Kingoina's Portfolio
-- Run this in the Supabase SQL Editor
-- =============================================

-- ── Subscribers ──
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow anyone to subscribe (insert)
-- Only service role can read/update/delete
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read subscribers"
  ON subscribers FOR SELECT
  USING (true);

CREATE POLICY "Service role can update subscribers"
  ON subscribers FOR UPDATE
  USING (true);

-- ── Gallery Images ──
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Anyone can read gallery images
-- Only authenticated users can insert/update/delete
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert images"
  ON gallery_images FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
  ON gallery_images FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
  ON gallery_images FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Profile (single row) ──
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Carlson Kingoina',
  bio TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL DEFAULT 'kingoina254@gmail.com',
  location TEXT DEFAULT 'Kenya',
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Anyone can read the profile
-- Only authenticated users can update
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update profile"
  ON profiles FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Insert default profile row
INSERT INTO profiles (full_name, email, location, social_github, social_linkedin, social_twitter)
VALUES (
  'Carlson Kingoina',
  'kingoina254@gmail.com',
  'Kenya',
  'https://github.com/kingoh-200',
  'https://linkedin.com/in/carlsonkingoina',
  'https://twitter.com/carlsonkingoina'
)
ON CONFLICT DO NOTHING;

-- ── Storage bucket for images ──
-- Run this in Supabase Dashboard > Storage > New Bucket
-- Bucket name: "images"
-- Public: yes

-- Storage policies (run in SQL editor)
-- INSERT: authenticated users can upload to images/
-- SELECT: anyone can view images/
-- DELETE: authenticated users can delete from images/
