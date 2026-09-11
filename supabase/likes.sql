-- Persistent page likes
-- Run this once in Supabase Dashboard > SQL Editor.

CREATE TABLE IF NOT EXISTS page_likes (
  page TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view page likes" ON page_likes;
CREATE POLICY "Anyone can view page likes" ON page_likes
  FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION increment_page_likes(page_name TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  IF page_name NOT IN ('home', 'projects') THEN
    RAISE EXCEPTION 'Unknown page';
  END IF;

  INSERT INTO page_likes (page, count)
  VALUES (page_name, 1)
  ON CONFLICT (page)
  DO UPDATE SET count = page_likes.count + 1, updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION increment_page_likes(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_page_likes(TEXT) TO service_role;
