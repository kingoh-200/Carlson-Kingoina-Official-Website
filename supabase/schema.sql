-- =============================================
-- Supabase Schema for Carlson Kingoina's Portfolio
-- Run this ENTIRE script in the Supabase SQL Editor
-- =============================================

-- ── Profiles (single row) ──
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Carlson Kingoina',
  bio TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL DEFAULT 'kingoina254@gmail.com',
  location TEXT DEFAULT 'Kenya',
  role TEXT DEFAULT 'Developer & Creator',
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Authenticated can update profile" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO profiles (full_name, email, location, role, social_github, social_linkedin, social_twitter)
VALUES (
  'Carlson Kingoina', 'kingoina254@gmail.com', 'Kenya', 'Developer & Creator',
  'https://github.com/kingoh-200', 'https://linkedin.com/in/carlsonkingoina', 'https://twitter.com/carlsonkingoina'
) ON CONFLICT DO NOTHING;

-- ── Projects ──
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

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

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert images" ON gallery_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update images" ON gallery_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete images" ON gallery_images FOR DELETE USING (auth.role() = 'authenticated');

-- ── Subscribers ──
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read subscribers" ON subscribers FOR SELECT USING (true);
CREATE POLICY "Authenticated can update subscribers" ON subscribers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete subscribers" ON subscribers FOR DELETE USING (auth.role() = 'authenticated');

-- ── Contact Messages ──
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update messages" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');

-- ── Testimonials ──
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- ── Site Settings (key-value store) ──
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can update settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can insert settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_title', 'Carlson Kingoina — Developer & Creator', 'Site title for SEO'),
  ('site_description', 'Personal website and portfolio of Carlson Kingoina', 'Site description for SEO'),
  ('hero_tagline', 'A developer and creator building things for the web.', 'Homepage hero tagline'),
  ('about_intro', 'I got my start at a bootcamp at Javi RSS Hub, where I discovered the magic of building things with code.', 'About page intro')
ON CONFLICT (key) DO NOTHING;

-- ── Storage bucket ──
-- Create in Supabase Dashboard > Storage > New Bucket
-- Bucket name: "images"
-- Public: YES
-- Then run these policies in SQL Editor:
--
-- CREATE POLICY "Public read access" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Authenticated upload" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated delete" ON storage.objects
--   FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
