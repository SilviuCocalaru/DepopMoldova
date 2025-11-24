/**
 * Client-side image and video compression utilities
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

/**
 * Compress an image file before upload
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeMB = 2,
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }
        
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'))
              return
            }
            
            // Check size
            const sizeInMB = blob.size / 1024 / 1024
            
            if (sizeInMB > maxSizeMB && quality > 0.1) {
              // Try again with lower quality
              compressImage(file, {
                ...options,
                quality: quality - 0.1,
              }).then(resolve).catch(reject)
              return
            }
            
            // Create new file
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, '.webp'),
              { type: 'image/webp' }
            )
            
            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Could not load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Compress a video file (basic compression - creates a smaller version)
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
  } = options

  // For video compression, we need to use a library or server-side processing
  // This is a placeholder that just returns the original file
  // For full video compression, consider using ffmpeg.wasm or server-side processing
  
  console.warn('Video compression not fully implemented. Returning original file.')
  console.log('Consider using server-side video compression for production.')
  
  return file
}

/**
 * Get optimized image dimensions
 */
export function getOptimizedDimensions(
  width: number,
  height: number,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }
  
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  
  return {
    width: Math.floor(width * ratio),
    height: Math.floor(height * ratio),
  }
}

/**
 * Check if file is an image
 */
export function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if file is a video
 */
export function isVideo(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
