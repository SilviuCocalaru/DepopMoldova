'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import LiveSearchResults from './LiveSearchResults'
import { useTheme } from './ThemeProvider'
import { useTranslations } from 'next-intl'

export default function AnimatedSearchBar() {
  const { isDark } = useTheme()
  const t = useTranslations('search')
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        setSearchQuery('')
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  // Auto-focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isExpanded])

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setIsExpanded(false)
  }

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      )}

      {/* Search Bar */}
      <div 
        ref={searchRef}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        <div 
          className={`
            transition-all duration-300 ease-out
            ${isExpanded ? 'w-[calc(100vw-100px)]' : 'w-[150px]'}
            h-[44px] rounded-full
            ${isDark ? 'bg-gray-800/75 border-gray-700/30' : 'bg-white/75 border-gray-200/30'}
            backdrop-blur-[16px] backdrop-saturate-[180%]
            border
            ${isExpanded ? 'shadow-[0_4px_24px_0_rgba(0,0,0,0.08)]' : 'shadow-[0_2px_12px_0_rgba(0,0,0,0.04)]'}
            flex items-center px-4 gap-2
          `}
          onClick={handleExpand}
        >
          <Search className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder={isExpanded ? t('placeholderExpanded') : t('placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              flex-1 outline-none bg-transparent text-sm text-left
              ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}
              ${!isExpanded && 'pointer-events-none'}
            `}
          />
          {isExpanded && searchQuery && (
            <button 
              onClick={handleClear}
              className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {isExpanded && searchQuery && (
          <div className="mt-2">
            <LiveSearchResults query={searchQuery} isDark={isDark} />
          </div>
        )}
      </div>
    </>
  )
}
