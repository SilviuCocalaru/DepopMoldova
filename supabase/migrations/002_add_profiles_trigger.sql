-- Add trigger to auto-create profiles when auth users are created
-- This prevents FK violations when signup tries to insert profiles

-- Ensure pgcrypto extension exists (needed for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to auto-create a minimal profile row when an auth.user is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if email is confirmed or confirmation is not required
  -- This prevents creating profiles for unconfirmed signups
  IF NEW.email_confirmed_at IS NOT NULL OR NEW.confirmation_token IS NULL THEN
    INSERT INTO public.profiles (id, username, created_at, updated_at)
    VALUES (
      NEW.id,
      lower(split_part(NEW.email, '@', 1)) || '_' || substring(NEW.id::text from 1 for 8),
      timezone('utc', now()),
      timezone('utc', now())
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Create trigger to call the function after a user is inserted (auto-confirm case)
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- Create trigger to call the function when email is confirmed
CREATE TRIGGER on_auth_user_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_new_auth_user();
