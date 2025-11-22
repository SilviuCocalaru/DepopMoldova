'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Search as SearchIcon, Plus, MessageCircle, User as UserIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MobileFloatingIslandsProps {
  user: any
  profile: any
  unreadMessages: number
  isLoading?: boolean
}

const trendingSearches = [
  'lululemon define jacket',
  'baggy jeans',
  'carhartt jacket',
  'essentials hoodie',
  'vintage t shirt'
]

export default function MobileFloatingIslands({ user, profile, unreadMessages, isLoading = false }: MobileFloatingIslandsProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isProductPage, setIsProductPage] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check if we're on a product detail page
    const productPagePattern = /^\/product\/[^/]+$/
    setIsProductPage(productPagePattern.test(pathname))

    // Check if island was previously shown
    const wasIslandShown = sessionStorage.getItem('bottomIslandShown')
    
    if (!wasIslandShown || wasIslandShown === 'false') {
      setShouldAnimate(true)
      sessionStorage.setItem('bottomIslandShown', 'true')
    } else {
      setShouldAnimate(false)
    }

    // Close search when navigating
    setIsSearchOpen(false)
  }, [pathname])

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const handleTrendingClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
  }

  return (
    <>
      {/* Search Overlay - Full screen when search is open */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[100] flex flex-col">
          {/* Search Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Search</h1>
            <button 
              onClick={handleSearchClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for "pink ralph lauren shirt"'
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
              </div>
            </form>
          </div>

          {/* Trending Searches */}
          <div className="flex-1 overflow-y-auto px-4">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Trending searches</h2>
            <div className="space-y-3">
              {trendingSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(query)}
                  className="block w-full text-left text-base text-gray-900 py-3 hover:text-red-500 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Top Islands */}
      {pathname !== '/messages' && !isSearchOpen && (
        <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="flex items-center gap-2">
            {/* Depop Logo - 1/5 width */}
            <div className="floating-island-top" style={{ flex: '0 0 auto' }}>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-glow"></div>
                <span className="text-lg font-bold text-red-500 lowercase tracking-tight">depop</span>
              </Link>
            </div>
            
            {/* Search Bar - 3/5 width (when logged out) or 4/5 width (when logged in) */}
            <button
              onClick={handleSearchClick}
              className="floating-island-top flex-1 flex items-center gap-2 text-left"
            >
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 truncate">Search...</span>
            </button>
            
            {/* Sign Up Button - 1/5 width - only show if not logged in */}
            {!user && !isLoading && (
              <Link 
                href="/signup"
                className="floating-island-top px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap"
                style={{ flex: '0 0 auto' }}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Island - Only show if user is logged in */}
      {user && !isSearchOpen && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm">
          <div className={`floating-island-bottom ${shouldAnimate ? 'animate-slide-up' : ''}`}>
            <Link 
              href="/" 
              className={`nav-icon ${pathname === '/' ? 'active' : ''}`}
            >
              <Home className="w-6 h-6" strokeWidth={2} />
            </Link>
            
            <button
              onClick={handleSearchClick}
              className={`nav-icon ${pathname === '/search' ? 'active' : ''}`}
            >
              <SearchIcon className="w-6 h-6" strokeWidth={2} />
            </button>
            
            {/* Center Plus Button */}
            <Link 
              href="/sell" 
              className="nav-icon-center group"
            >
              <div className="floating-plus-button">
                <Plus className="w-7 h-7 text-white" strokeWidth={3} />
                <div className="plus-glow"></div>
              </div>
            </Link>
            
            <Link 
              href="/messages" 
              className={`nav-icon relative ${pathname === '/messages' ? 'active' : ''}`}
            >
              <MessageCircle className="w-6 h-6" strokeWidth={2} />
              {unreadMessages > 0 && (
                <span className="message-badge">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            
            <Link 
              href="/profile" 
              className={`nav-icon ${pathname === '/profile' ? 'active' : ''}`}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-blue-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                </div>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
