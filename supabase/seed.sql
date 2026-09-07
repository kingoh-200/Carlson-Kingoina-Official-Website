-- =============================================
-- Seed Data for Carlson Kingoina's Portfolio
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- =============================================

-- ── Projects ──
INSERT INTO projects (title, description, tags, live_url, github_url, featured, sort_order)
VALUES
  (
    'Campus Mart',
    'A digital marketplace built for university campuses — connecting students with products, services, and opportunities right within their academic community.',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    'https://campusmart-rvrc.onrender.com/',
    NULL,
    true,
    1
  ),
  (
    'Teens Aloud Foundation',
    'A platform for the Teens Aloud Foundation — empowering young people through mentorship, advocacy, and community-driven programs that amplify youth voices.',
    ARRAY['Next.js', 'Supabase', 'Tailwind CSS'],
    'https://teens-aloud-foundation-rust.vercel.app/gallery',
    NULL,
    true,
    2
  ),
  (
    'Personal Website',
    'My personal portfolio and blog — built with Next.js, Tailwind CSS, Supabase, and interactive canvas animations.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    'https://carlsonkingoina.dev',
    'https://github.com/kingoh-200/Carlson-Kingoina-Official-Website',
    false,
    3
  )
ON CONFLICT DO NOTHING;

-- ── Default site settings (in case schema.sql INSERT was skipped) ──
INSERT INTO site_settings (key, value, description)
VALUES
  ('site_title', 'Carlson Kingoina — Developer & Creator', 'Site title for SEO'),
  ('site_description', 'Personal website and portfolio of Carlson Kingoina', 'Site description for SEO'),
  ('hero_tagline', 'A developer and creator building things for the web.', 'Homepage hero tagline'),
  ('about_intro', 'I got my start at a bootcamp at Javi RSS Hub, where I discovered the magic of building things with code.', 'About page intro')
ON CONFLICT (key) DO NOTHING;
