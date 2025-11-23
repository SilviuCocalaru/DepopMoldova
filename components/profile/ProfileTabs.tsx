'use client'

import { Grid3x3, Video, Bookmark, Tag } from 'lucide-react'
import { useState } from 'react'

type TabType = 'posts' | 'reels' | 'saved' | 'tagged'

interface ProfileTabsProps {
  isDark?: boolean
}

export default function ProfileTabs({ isDark = false }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts')

  const tabs = [
    { id: 'posts' as TabType, icon: Grid3x3, label: 'Posts' },
    { id: 'reels' as TabType, icon: Video, label: 'Reels' },
    { id: 'saved' as TabType, icon: Bookmark, label: 'Saved' },
    { id: 'tagged' as TabType, icon: Tag, label: 'Tagged' },
  ]

  return (
    <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-8 py-3 border-t-2 transition-colors ${
              activeTab === tab.id
                ? isDark
                  ? 'border-white text-white'
                  : 'border-black text-black'
                : isDark
                  ? 'border-transparent text-gray-500 hover:text-gray-300'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-5 h-5" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-xs font-semibold uppercase hidden sm:inline">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
