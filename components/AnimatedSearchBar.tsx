'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import LiveSearchResults from './LiveSearchResults'

export default function AnimatedSearchBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

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
        <div className="md:hidden fixed inset-0 bg-black/20 z-40" />
      )}

      {/* Search Bar */}
      <div 
        ref={searchRef}
        className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div 
          className={`
            transition-all duration-300 ease-out
            ${isExpanded ? 'w-[calc(100vw-40px)]' : 'w-[180px]'}
            h-[44px] rounded-full bg-white/95 backdrop-blur-xl border
            ${isExpanded ? 'border-black shadow-lg' : 'border-gray-200 shadow-sm'}
            flex items-center px-4 gap-2
          `}
          onClick={handleExpand}
        >
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={isExpanded ? "Search products..." : "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              flex-1 outline-none bg-transparent text-sm placeholder:text-gray-400
              ${!isExpanded && 'text-center pointer-events-none'}
              ${isExpanded && 'text-left'}
            `}
            autoFocus={isExpanded}
          />
          {isExpanded && searchQuery && (
            <button 
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {isExpanded && searchQuery && (
          <div className="mt-2">
            <LiveSearchResults query={searchQuery} />
          </div>
        )}
      </div>
    </>
  )
}
