# Reels Feature - Storage Bucket Setup

## Required Supabase Storage Configuration

### 1. Create Storage Bucket

Go to your Supabase project dashboard:
1. Navigate to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Bucket name: `reels`
4. Set as **Public bucket** ✓
5. Click **Create bucket**

### 2. Set Storage Policies

After creating the bucket, set up the following policies:

#### Allow public read access:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'reels' );
```

#### Allow authenticated users to upload:
```sql
CREATE POLICY "Authenticated users can upload reels"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reels' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Allow users to delete their own files:
```sql
CREATE POLICY "Users can delete own reels"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'reels'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. File Upload Settings

Recommended settings for the `reels` bucket:
- **Allowed MIME types**: `video/*` (video/mp4, video/quicktime, video/x-msvideo, etc.)
- **Max file size**: 100MB (100000000 bytes)
- **File size limit**: Enforced at application level

### 4. Database Migrations

Run the migrations in order:
1. `003_create_reels_tables.sql` - Creates reels and reel_likes tables
2. `004_add_increment_reel_views.sql` - Creates view increment function

```bash
# If using Supabase CLI
supabase db push

# Or apply manually through Supabase Dashboard > SQL Editor
```

### 5. Verify Setup

After setup, verify:
- ✓ Bucket `reels` exists and is public
- ✓ Storage policies are active
- ✓ Tables `reels` and `reel_likes` exist
- ✓ RLS policies are enabled on both tables
- ✓ Function `increment_reel_views` exists

## Testing the Feature

1. **Upload Test**:
   - Go to `/sell`
   - Click "Create Reel"
   - Upload a short video (< 100MB)
   - Fill description and select style
   - Click "Post Reel"

2. **View Test**:
   - Navigate to `/reels`
   - Video should autoplay
   - Swipe up/down to navigate
   - Double-tap to like
   - Tap once to pause/play

3. **Performance Test**:
   - Upload multiple reels
   - Verify smooth scrolling
   - Check that only active video plays
   - Verify view count increments

## Features Implemented

✅ Database tables with RLS
✅ Storage bucket configuration
✅ Upload flow with preview
✅ TikTok-style vertical feed
✅ Autoplay on scroll
✅ Like functionality
✅ View count tracking
✅ Multilingual support (EN/RO)
✅ Mobile-optimized UI
✅ Share functionality
✅ Mute/unmute toggle
✅ Double-tap to like animation

## Mobile Navigation

The Video icon is already added to the mobile bottom navigation bar:
- Home 🏠
- **Reels 🎥** (new!)
- Create ➕
- Messages 💬
- Profile 👤

## Notes

- Videos are stored in user-specific folders: `{user_id}/{timestamp}.{ext}`
- All videos are public but organized by user
- Maximum file size: 100MB (configurable)
- Supported formats: MP4, MOV, AVI, and other video/* types
- Theme support: Light and Dark mode
