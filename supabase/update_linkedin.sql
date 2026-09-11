-- Run once in Supabase Dashboard > SQL Editor to update the existing profile.
UPDATE profiles
SET social_linkedin = 'https://www.linkedin.com/in/carison-moikoro-56b198303',
    updated_at = now();
