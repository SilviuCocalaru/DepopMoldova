# Fix Avatar Upload Issue

## Problem
The error "Failed to upload avatar: Bucket not found" means the Supabase storage bucket doesn't exist yet.

## Solution: Create the Avatars Bucket in Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com
2. Select your project
3. Go to **Storage** in the left sidebar

### Step 2: Create the Avatars Bucket
1. Click **"New bucket"** button
2. Fill in the details:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **CHECKED** (important!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/png, image/jpeg, image/jpg, image/webp, image/gif`

3. Click **"Create bucket"**

### Step 3: Set Bucket Policies (RLS)
1. Click on the `avatars` bucket
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Create these policies:

#### Policy 1: Allow Public Read
```sql
-- Name: Public read access
-- Allowed operation: SELECT
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

#### Policy 2: Allow Authenticated Users to Upload
```sql
-- Name: Authenticated users can upload
-- Allowed operation: INSERT
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');
```

#### Policy 3: Allow Users to Update Their Own Avatars
```sql
-- Name: Users can update own avatar
-- Allowed operation: UPDATE
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### Policy 4: Allow Users to Delete Their Own Avatars
```sql
-- Name: Users can delete own avatar
-- Allowed operation: DELETE
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Test Upload
1. Go back to your app
2. Navigate to Edit Profile
3. Try uploading a profile picture again
4. ✅ It should work now!

## Optional: Create Product Images Bucket
While you're there, also create a `product-images` bucket with the same settings for future product uploads.

---

**Note**: The bucket MUST be marked as **public** for profile pictures to be visible to everyone!
