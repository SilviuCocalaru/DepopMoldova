'use client'

import { User as UserIcon } from 'lucide-react'
import Image from 'next/image'

interface ProfileHeaderProps {
  profile: {
    id: string
    username: string
    full_name?: string | null
    bio?: string | null
    website?: string | null
    avatar_url?: string | null
  }
  postsCount: number
  followersCount: number
  followingCount: number
  isDark?: boolean
}

export default function ProfileHeader({ 
  profile, 
  postsCount, 
  followersCount, 
  followingCount,
  isDark = false
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      {/* Profile Picture */}
      <div className="mb-4">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={150}
            height={150}
            className={`rounded-full object-cover ring-2 ${
              isDark ? 'ring-gray-700' : 'ring-gray-200'
            }`}
          />
        ) : (
          <div className={`w-[150px] h-[150px] rounded-full flex items-center justify-center ring-2 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 ring-gray-700' 
              : 'bg-gradient-to-br from-gray-100 to-gray-200 ring-gray-200'
          }`}>
            <UserIcon className={`w-16 h-16 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Username */}
      <h1 className={`text-xl font-bold mb-1 ${
        isDark ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {profile.full_name || profile.username}
      </h1>
      
      {/* Username handle if full_name exists */}
      {profile.full_name && (
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>@{profile.username}</p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p className={`text-sm mb-3 max-w-md px-4 ${
          isDark ? 'text-gray-300' : 'text-gray-900'
        }`}>
          {profile.bio}
        </p>
      )}

      {/* Website */}
      {profile.website && (
        <a 
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mb-6"
        >
          {profile.website.replace(/^https?:\/\//, '')}
        </a>
      )}

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-8 mt-6 mb-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-900">{postsCount}</span>
          <span className="text-xs text-gray-500">posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-900">{followersCount}</span>
          <span className="text-xs text-gray-500">followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-900">{followingCount}</span>
          <span className="text-xs text-gray-500">following</span>
        </div>
      </div>
    </div>
  )
}
