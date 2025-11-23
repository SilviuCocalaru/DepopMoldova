'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User as UserIcon, Camera } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface ProfileEditFormProps {
  profile: {
    id: string
    username: string
    full_name?: string | null
    bio?: string | null
    website?: string | null
    avatar_url?: string | null
  }
  isDark?: boolean
}

export default function ProfileEditForm({ profile, isDark = false }: ProfileEditFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('editProfile')
  const tCommon = useTranslations('common')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: profile.username || '',
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    avatar_url: profile.avatar_url || ''
  })

  // Hide mobile nav when editing profile
  useEffect(() => {
    document.body.classList.add('hide-mobile-nav')
    return () => {
      document.body.classList.remove('hide-mobile-nav')
    }
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Compress image to circular thumbnail
      const compressedFile = await compressImage(file, 200, 200)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      alert(`Failed to upload avatar: ${error?.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const compressImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const size = Math.min(img.width, img.height)
          const startX = (img.width - size) / 2
          const startY = (img.height - size) / 2
          
          canvas.width = maxWidth
          canvas.height = maxHeight
          
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Failed to get canvas context'))
          
          // Draw circular crop
          ctx.beginPath()
          ctx.arc(maxWidth / 2, maxHeight / 2, maxWidth / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          
          // Draw cropped and resized image
          ctx.drawImage(img, startX, startY, size, size, 0, 0, maxWidth, maxHeight)
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to compress image'))
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }, 'image/jpeg', 0.85)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Only update fields that exist in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null
        })
        .eq('id', profile.id)
        .select()

      if (error) {
        console.error('Update error:', error)
        alert(`Failed to update profile: ${error.message}`)
        throw error
      }

      console.log('Profile updated successfully:', data)
      router.push('/profile')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(`Failed to update profile: ${error?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          {formData.avatar_url ? (
            <Image
              src={formData.avatar_url}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <label className={`absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer transition-colors ${
            isDark 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        {uploading && <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{tCommon('uploading')}</p>}
      </div>

      {/* Username */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('username')}
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
          required
        />
      </div>

      {/* Full Name */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('fullName')}
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
        />
      </div>

      {/* Bio */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('bio')}
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-none ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
          maxLength={150}
        />
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.bio.length}/150</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 ${
            isDark 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {loading ? tCommon('saving') : t('saveChanges')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          }`}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}
