'use client'

import { useState } from 'react'
import { Share2, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileActionsProps {
  userId: string
  isOwnProfile?: boolean
  isDark?: boolean
}

export default function ProfileActions({ userId, isOwnProfile = true, isDark = false }: ProfileActionsProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${userId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  return (
    <div className="px-4 mb-3">
      {isOwnProfile ? (
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/profile/edit"
            className={`text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors text-center flex items-center justify-center ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            Edit profile
          </Link>
          <button
            onClick={handleShare}
            className={`text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors flex items-center justify-center gap-1 ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
          <Link
            href="/settings"
            className={`text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors flex items-center justify-center gap-1 ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      ) : (
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            Follow
          </button>
          <button className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-white text-xs font-semibold py-1.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Message
          </button>
        </div>
      )}
    </div>
  )
}
