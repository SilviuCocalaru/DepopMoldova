'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, X, Play, Pause } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslations } from 'next-intl'

const CLOTHING_STYLES = [
  { value: 'casual', emoji: '👕', labelKey: 'casual' },
  { value: 'formal', emoji: '👔', labelKey: 'formal' },
  { value: 'streetwear', emoji: '🧢', labelKey: 'streetwear' },
  { value: 'athletic', emoji: '👟', labelKey: 'athletic' },
  { value: 'vintage', emoji: '👗', labelKey: 'vintage' },
  { value: 'boho', emoji: '🌸', labelKey: 'boho' },
  { value: 'minimalist', emoji: '⚪', labelKey: 'minimalist' },
  { value: 'y2k', emoji: '✨', labelKey: 'y2k' },
]

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_DESCRIPTION_LENGTH = 150

export default function CreateReelPage() {
  const { isDark } = useTheme()
  const t = useTranslations('reels')
  const router = useRouter()
  const supabase = createClient()
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [clothingStyle, setClothingStyle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError(t('invalidFileType'))
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(t('fileTooLarge'))
      return
    }

    setVideoFile(file)
    setError(null)

    // Create preview
    const url = URL.createObjectURL(file)
    setVideoPreview(url)
  }

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoFile(null)
    setVideoPreview(null)
    setIsPlaying(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoFile) {
      setError(t('pleaseSelectVideo'))
      return
    }

    if (!clothingStyle) {
      setError(t('pleaseSelectStyle'))
      return
    }

    setLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError(t('mustBeLoggedIn'))
        setLoading(false)
        return
      }

      // Upload video to storage
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('reels')
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      setUploadProgress(50)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('reels')
        .getPublicUrl(fileName)

      setUploadProgress(75)

      // Create reel record
      const { error: dbError } = await supabase
        .from('reels')
        .insert({
          video_url: publicUrl,
          description: description.trim() || null,
          clothing_style: clothingStyle,
          user_id: user.id
        })

      if (dbError) throw dbError

      setUploadProgress(100)

      // Redirect to reels feed
      router.push('/reels')
    } catch (err: any) {
      console.error('Error uploading reel:', err)
      setError(err.message || t('uploadFailed'))
      setLoading(false)
    }
  }

  return (
    <div className="main-content min-h-screen max-w-2xl mx-auto px-4">
      <div className="py-8">
        <h1 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {t('createReel')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('video')} *
            </label>
            
            {!videoPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDark
                    ? 'border-gray-700 hover:border-pink-500 bg-gray-800/50'
                    : 'border-gray-300 hover:border-pink-500 bg-gray-50'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t('clickToUpload')}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {t('videoFormats')} (max 100MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className={`relative aspect-[9/16] max-h-[600px] mx-auto rounded-xl overflow-hidden ${
                  isDark ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    {!isPlaying && (
                      <Play className="w-16 h-16 text-white fill-white" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    isDark ? 'bg-gray-900/90' : 'bg-white/90'
                  } hover:scale-110 transition-transform`}
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
                <div className={`mt-3 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {videoFile?.name} • {(videoFile!.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('description')} ({description.length}/{MAX_DESCRIPTION_LENGTH})
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(e.target.value)
                }
              }}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            />
          </div>

          {/* Clothing Style Selector */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('clothingStyle')} *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CLOTHING_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setClothingStyle(style.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    clothingStyle === style.value
                      ? 'border-pink-500 bg-pink-500/10 scale-105'
                      : isDark
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">{style.emoji}</div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t(`styles.${style.labelKey}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500">
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div>
              <div className={`h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div
                  className="h-full bg-pink-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={`text-sm text-center mt-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('uploading')} {uploadProgress}%
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!videoFile || !clothingStyle || loading}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
              !videoFile || !clothingStyle || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:scale-105'
            }`}
          >
            {loading ? t('posting') : t('postReel')}
          </button>
        </form>
      </div>
    </div>
  )
}
