'use client'

import { Video, Bookmark, Tag } from 'lucide-react'
import { useState } from 'react'

type TabType = 'tagged' | 'reels' | 'saved'

interface ProfileTabsProps {
  isDark?: boolean
}

export default function ProfileTabs({ isDark = false }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('tagged')

  const tabs = [
    { id: 'tagged' as TabType, icon: Tag, label: 'On Sale' },
    { id: 'reels' as TabType, icon: Video, label: 'Videos' },
    { id: 'saved' as TabType, icon: Bookmark, label: 'Saved' },
  ]

  return (
    <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-1.5 px-6 py-2 border-t-2 transition-colors ${
              activeTab === tab.id
                ? isDark
                  ? 'border-white text-white'
                  : 'border-black text-black'
                : isDark
                  ? 'border-transparent text-gray-500 hover:text-gray-300'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-xs font-semibold uppercase hidden sm:inline">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
