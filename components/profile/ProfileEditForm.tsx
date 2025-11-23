'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User as UserIcon, Camera } from 'lucide-react'
import Image from 'next/image'

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
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: profile.username || '',
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    website: profile.website || '',
    avatar_url: profile.avatar_url || ''
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          website: formData.website || null,
          avatar_url: formData.avatar_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error

      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          {formData.avatar_url ? (
            <Image
              src={formData.avatar_url}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className={`w-[120px] h-[120px] rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <label className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors ${
            isDark 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            <Camera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        {uploading && <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Uploading...</p>}
      </div>

      {/* Username */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
          required
        />
      </div>

      {/* Full Name */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Full Name
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
        />
      </div>

      {/* Bio */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
          maxLength={150}
        />
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.bio.length}/150</p>
      </div>

      {/* Website */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          placeholder="https://example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500 placeholder:text-gray-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-black'
          }`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 ${
            isDark 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={`flex-1 font-semibold py-3 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
