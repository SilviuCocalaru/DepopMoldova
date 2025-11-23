'use client'

import { useState } from 'react'
import { Share2, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileActionsProps {
  userId: string
  isOwnProfile?: boolean
}

export default function ProfileActions({ userId, isOwnProfile = true }: ProfileActionsProps) {
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
    <div className="px-4 mb-6">
      {isOwnProfile ? (
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/profile/edit"
            className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
          >
            Edit profile
          </Link>
          <button
            onClick={handleShare}
            className="bg-white dark:bg-gray-800 text-black dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
          <Link
            href="/settings"
            className="bg-white dark:bg-gray-800 text-black dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      ) : (
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-500 dark:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            Follow
          </button>
          <button className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Message
          </button>
        </div>
      )}
    </div>
  )
}
