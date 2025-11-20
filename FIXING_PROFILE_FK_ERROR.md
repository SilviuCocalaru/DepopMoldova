# Fix for Foreign Key Constraint Error on Profiles

## Problem
When signing up, you get: `insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"`

## Root Cause
The `profiles` table has a foreign key to `auth.users(id)`. When you try to insert a profile, the user must already exist in `auth.users`. The error occurs because:
1. The database trigger that auto-creates profiles hasn't been applied to your Supabase project yet
2. The app tries to insert a profile row before the auth user is fully committed

## Solution (Choose ONE)

### Option 1: Apply the Database Trigger (RECOMMENDED)

**This is the cleanest solution** - it automatically creates a profile whenever a user signs up.

#### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run This SQL** (copy everything below):

```sql
-- Ensure pgcrypto extension exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to auto-create profiles when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    lower(split_part(NEW.email, '@', 1)) || '_' || substring(NEW.id::text from 1 for 8),
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();
```

4. **Click "Run" or press Ctrl+Enter**

5. **Verify it worked**:
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
You should see one row returned.

6. **Test Signup**
   - Go back to your app at `http://localhost:3000/signup`
   - Try signing up
   - It should work now!

### Option 2: Manual Profile Creation (Temporary Workaround)

If you can't run SQL right now, the app will now continue even if profile creation fails. The trigger will create the profile automatically when you apply it later.

## Verification Steps

After applying the trigger:

1. **Sign up a new test user** in your app

2. **Check in Supabase Dashboard**:
   - **Authentication → Users**: Verify the user exists
   - **Table Editor → profiles**: Verify a profile exists with the same `id`

3. **The profile should have**:
   - `id`: matching the auth user id
   - `username`: auto-generated like `johndoe_a1b2c3d4` (gets updated to your chosen username)
   - Timestamps populated

## Fix Existing Users (If Needed)

If you already have auth users without profiles, run this:

```sql
-- Find auth users without profiles
SELECT u.id, u.email 
FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id 
WHERE p.id IS NULL;

-- Create missing profiles
INSERT INTO public.profiles (id, username, created_at, updated_at)
SELECT 
  u.id,
  lower(split_part(u.email, '@', 1)) || '_' || substring(u.id::text from 1 for 8),
  now(),
  now()
FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id 
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

## How It Works Now

1. User fills signup form
2. Supabase Auth creates user in `auth.users`
3. **Trigger automatically creates profile** in `public.profiles`
4. App upserts profile with full username/name (updates the auto-created one)
5. No FK error because profile already exists ✅

## Changes Made

- ✅ `002_add_profiles_trigger.sql` - Database trigger to auto-create profiles
- ✅ `app/signup/page.tsx` - Added retry logic, better error handling, and won't fail if profile creation errors
- ✅ Changed from `insert` to `upsert` to handle cases where trigger already created the profile

## Troubleshooting

**Still getting FK error after applying trigger?**
- Verify trigger exists: `SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check Supabase logs: Dashboard → Logs → Database
- Ensure profiles table exists: `SELECT * FROM public.profiles LIMIT 1;`

**Username conflict errors?**
- The trigger generates a temporary username
- Your app upserts with the real username
- If you get unique constraint errors, the username might already be taken

**Need to reset everything?**
```sql
-- CAREFUL: This deletes all data
TRUNCATE auth.users CASCADE;
TRUNCATE public.profiles CASCADE;
```
