'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Plus, MessageCircle, User as UserIcon, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MobileFloatingIslandsProps {
  user: any
  profile: any
  unreadMessages: number
}

export default function MobileFloatingIslands({ user, profile, unreadMessages }: MobileFloatingIslandsProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isProductPage, setIsProductPage] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if we're on a product detail page
    const productPagePattern = /^\/product\/[^/]+$/
    setIsProductPage(productPagePattern.test(pathname))
  }, [pathname])

  const handleBackToMenu = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/')
      setTimeout(() => setIsAnimating(false), 300)
    }, 200)
  }

  return (
    <>
      {/* Floating Top Island */}
      <div className={`md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className={`floating-island-top ${isProductPage ? 'expanded' : ''}`}>
          {isProductPage ? (
            <button 
              onClick={handleBackToMenu}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold text-sm">Back to Menu</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-glow"></div>
              <span className="text-xl font-bold text-red-500 lowercase tracking-tight">depop</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Island - Only show if user is logged in */}
      {user && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm">
          <div className="floating-island-bottom">
            <Link 
              href="/" 
              className={`nav-icon ${pathname === '/' ? 'active' : ''}`}
            >
              <Home className="w-6 h-6" strokeWidth={2} />
            </Link>
            
            <Link 
              href="/search" 
              className={`nav-icon ${pathname === '/search' ? 'active' : ''}`}
            >
              <Search className="w-6 h-6" strokeWidth={2} />
            </Link>
            
            {/* Center Plus Button */}
            <Link 
              href="/sell" 
              className="nav-icon-center group"
            >
              <div className="floating-plus-button">
                <Plus className="w-8 h-8 text-white" strokeWidth={3} />
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
