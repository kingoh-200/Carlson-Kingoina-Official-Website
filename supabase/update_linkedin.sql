-- Run once in Supabase Dashboard > SQL Editor to update the existing profile links.
UPDATE profiles
SET social_linkedin = 'https://www.linkedin.com/in/carison-moikoro-56b198303',
    social_twitter = 'https://x.com/carlson15564064',
    updated_at = now();
