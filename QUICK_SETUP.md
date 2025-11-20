# Quick Setup Guide - Depop Moldova

## Your Supabase is Connected! ✅

Your environment variables are already configured:
- Project URL: `https://jpsovrnhbccmvoerqqyu.supabase.co`
- Credentials are in `.env.local`

## What You Need to Do NOW:

### 1. Apply Database Schema (REQUIRED)

Your database tables don't exist yet. You need to create them:

**Steps:**
1. Open your Supabase dashboard: https://supabase.com/dashboard/project/jpsovrnhbccmvoerqqyu
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the **ENTIRE contents** of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for "Success" message

This will create:
- ✅ `profiles` table
- ✅ `products` table  
- ✅ `likes` table
- ✅ `messages` table
- ✅ Storage bucket for product images
- ✅ Auto-create profile trigger (fixes FK errors)
- ✅ All security policies

### 2. Verify It Worked

After running the SQL, check:

**Go to Table Editor:**
- You should see tables: `profiles`, `products`, `likes`, `messages`

**Run this test query in SQL Editor:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```
You should see all 4 tables listed.

### 3. Test Signup

Now you can test the app:

```powershell
cd 'C:\Users\perso\Desktop\Depop Moldova\depop-marketplace'
npm run dev
```

1. Go to http://localhost:3000/signup
2. Fill in:
   - Username: `yourname`
   - Full Name: `Your Full Name`
   - Email: `your.email@example.com`
   - Password: (min 6 characters)
3. Click "Sign up"

**What happens next:**

**If email confirmation is ENABLED (default):**
- You'll be redirected to the confirmation page
- Check your email for the confirmation link
- Click the link to confirm your email
- You'll be automatically logged in and redirected to the homepage
- Your profile will be created when you confirm your email

**If email confirmation is DISABLED:**
- You'll be logged in immediately
- Your profile will be created automatically
- You'll be redirected to the homepage

**After signup:**
- Check Supabase Dashboard → **Authentication** → **Users** (you should see your user)
- After email confirmation: Check **Table Editor** → **profiles** (you should see your profile)

### 4. Common Issues

**"relation 'profiles' does not exist"**
- You didn't run the migration SQL yet
- Go back to step 1

**"insert or update violates foreign key constraint"**
- The trigger wasn't created
- Re-run the full migration SQL from step 1

**Email confirmation required?**
- By default Supabase requires email confirmation
- **The app now handles this!** You'll see a confirmation page after signup
- To disable confirmations: Dashboard → Authentication → Settings → Email Auth → **Disable** "Enable email confirmations"
- Note: With confirmations disabled, profiles are created immediately. With confirmations enabled, profiles are created when user confirms their email.

**Can't see my profile after signup?**
- Wait 500ms after signup (the code already does this)
- Check browser console for errors
- Verify the trigger exists:
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

### 5. Next Steps After Setup

Once signup works:
- ✅ View your profile (click avatar in header)
- ✅ Create a product listing (click "Sell" button)
- ✅ Upload product images
- ✅ Like products
- ✅ Send messages to sellers

## Quick Commands

**Start dev server:**
```powershell
npm run dev
```

**Build for production:**
```powershell
npm run build
```

**Check database tables:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

**Check if trigger exists:**
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**View all users:**
```sql
SELECT id, email FROM auth.users;
```

**View all profiles:**
```sql
SELECT * FROM public.profiles;
```

## Support

If you run into issues:
1. Check the Supabase logs: Dashboard → Logs → Database
2. Check browser console (F12)
3. Verify environment variables are set in `.env.local`
4. Make sure the migration SQL ran successfully
