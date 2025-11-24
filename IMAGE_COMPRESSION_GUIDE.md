# Image & Video Compression Guide

## What I've Set Up

### 1. Next.js Image Optimization (Automatic)

**File: `next.config.ts`**

I've configured Next.js to automatically:
- Convert images to AVIF/WebP (smaller file sizes, better quality)
- Resize images for different devices
- Cache optimized images
- Enable gzip/brotli compression

**Benefits:**
- Images are automatically compressed when served
- Responsive images for mobile/desktop
- Lazy loading by default
- No extra work needed

### 2. Client-Side Image Compression (Before Upload)

**File: `lib/imageCompression.ts`**

Use this when users upload images:

```typescript
import { compressImage } from '@/lib/imageCompression'

// In your upload handler
const handleFileUpload = async (file: File) => {
  if (file.type.startsWith('image/')) {
    // Compress before uploading to Supabase
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85,
      maxSizeMB: 2
    })
    
    // Now upload compressedFile instead of file
    const { data, error } = await supabase.storage
      .from('products')
      .upload(`image-${Date.now()}.webp`, compressedFile)
  }
}
```

### 3. Optimized Image Component

**File: `components/OptimizedImage.tsx`**

Use this instead of regular `<img>` tags:

```tsx
import OptimizedImage from '@/components/OptimizedImage'

// Instead of:
<img src={product.image_url} alt={product.title} />

// Use:
<OptimizedImage 
  src={product.image_url} 
  alt={product.title}
  width={400}
  height={400}
  quality={85}
/>
```

## How to Implement

### Step 1: Update Product Upload

Find your product upload component and add compression:

```typescript
import { compressImage } from '@/lib/imageCompression'

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  try {
    // Show loading state
    setUploading(true)
    
    // Compress image
    const compressed = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85,
      maxSizeMB: 2
    })
    
    console.log('Original size:', file.size / 1024 / 1024, 'MB')
    console.log('Compressed size:', compressed.size / 1024 / 1024, 'MB')
    
    // Upload to Supabase
    const fileName = `${Date.now()}-${compressed.name}`
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, compressed)
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)
    
    setImageUrl(publicUrl)
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    setUploading(false)
  }
}
```

### Step 2: Replace `<img>` with `OptimizedImage`

Search your code for `<img` tags and replace them:

**Before:**
```tsx
<img 
  src={product.image_url} 
  alt={product.name}
  className="w-full h-64 object-cover"
/>
```

**After:**
```tsx
<OptimizedImage 
  src={product.image_url} 
  alt={product.name}
  width={800}
  height={600}
  className="w-full h-64"
  objectFit="cover"
  quality={85}
/>
```

### Step 3: For Supabase Storage URLs

Make sure Supabase URLs are in the allowed list (already done):

```typescript
// next.config.ts
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.supabase.co',
  },
]
```

## Video Compression

For videos, you have 2 options:

### Option 1: Client-Side (Limited)

Videos are large and hard to compress in browser. Basic usage:

```typescript
import { compressVideo } from '@/lib/imageCompression'

const compressed = await compressVideo(videoFile)
```

**Note:** This doesn't actually compress videos well. For real compression, use Option 2.

### Option 2: Server-Side (Recommended)

Install ffmpeg.wasm for video compression:

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

Or use a service like:
- Cloudinary
- Mux
- AWS MediaConvert
- Vercel Blob with video optimization

## Performance Tips

### 1. Use `priority` for Above-the-Fold Images

```tsx
<OptimizedImage 
  src={heroImage}
  priority  // Load immediately, don't lazy load
  width={1920}
  height={1080}
/>
```

### 2. Use `sizes` for Responsive Images

```tsx
<OptimizedImage 
  src={image}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width={800}
  height={600}
/>
```

### 3. Lower Quality for Thumbnails

```tsx
<OptimizedImage 
  src={thumbnail}
  quality={60}  // Lower quality for small images
  width={100}
  height={100}
/>
```

## Expected Results

### Before Compression:
- 5MB image → 5MB served
- Slow loading on mobile
- High bandwidth usage

### After Compression:
- 5MB image → 200KB AVIF/WebP served
- Fast loading
- 95% less bandwidth

## Testing

1. Upload an image through your app
2. Check browser DevTools → Network tab
3. Look at image sizes
4. Should see `.webp` or `.avif` extensions
5. Should see much smaller file sizes

## Troubleshooting

**Images not compressing:**
- Check that you're using `OptimizedImage` or Next.js `Image` component
- Verify `next.config.ts` has the image config

**Uploads still large:**
- Make sure you're calling `compressImage()` before upload
- Check console logs for compression results

**Videos too large:**
- Consider using a video hosting service (Vimeo, YouTube)
- Or implement server-side compression with ffmpeg

## Next Steps

1. Find your product upload form
2. Add `compressImage()` before uploading
3. Replace `<img>` tags with `<OptimizedImage>`
4. Test uploading and viewing images
5. Check Network tab to verify compression

Need help implementing this in a specific file? Let me know which component handles image uploads!
