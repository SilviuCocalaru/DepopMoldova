'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Plus, MessageCircle, User as UserIcon, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import AnimatedSearchBar from './AnimatedSearchBar'

interface MobileFloatingIslandsProps {
  user: any
  profile: any
  unreadMessages: number
  isLoading?: boolean
}

export default function MobileFloatingIslands({ user, profile, unreadMessages, isLoading = false }: MobileFloatingIslandsProps) {
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    // Check if island was previously shown
    const wasIslandShown = sessionStorage.getItem('bottomIslandShown')
    
    if (!wasIslandShown || wasIslandShown === 'false') {
      setShouldAnimate(true)
      sessionStorage.setItem('bottomIslandShown', 'true')
    } else {
      setShouldAnimate(false)
    }
  }, [pathname])

  return (
    <>
      {/* Animated Search Bar - iPhone Dynamic Island Style */}
      <AnimatedSearchBar />

      {/* Sign Up Button - Only show if not logged in */}
      {!user && !isLoading && pathname !== '/messages' && (
        <div className="md:hidden fixed top-4 right-4 z-50">
          <Link 
            href="/signup"
            className="floating-island-top px-5 flex items-center justify-center text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap h-[44px]"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Floating Bottom Island - Only show if user is logged in */}
      {user && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm">
          <div className={`floating-island-bottom ${shouldAnimate ? 'animate-slide-up' : ''}`}>
            <Link 
              href="/" 
              className={`nav-icon ${pathname === '/' ? 'active' : ''}`}
            >
              <Home className="w-6 h-6" strokeWidth={2} />
            </Link>
            
            <Link
              href="/reels"
              className={`nav-icon ${pathname === '/reels' ? 'active' : ''}`}
            >
              <Video className="w-6 h-6" strokeWidth={2} fill={pathname === '/reels' ? 'currentColor' : 'none'} />
            </Link>
            
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
