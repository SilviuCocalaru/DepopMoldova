-- Add settings columns to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS style VARCHAR(50),
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'light';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_settings ON profiles(language, theme);

-- Update existing profiles to have default values
UPDATE profiles 
SET 
  language = COALESCE(language, 'en'),
  theme = COALESCE(theme, 'light')
WHERE language IS NULL OR theme IS NULL;
