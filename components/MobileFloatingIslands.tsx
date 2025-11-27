'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Plus, MessageCircle, User as UserIcon, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import AnimatedSearchBar from './AnimatedSearchBar'
import { useTranslations } from 'next-intl'

interface MobileFloatingIslandsProps {
  user: any
  profile: any
  unreadMessages: number
  isLoading?: boolean
}

export default function MobileFloatingIslands({ user, profile, unreadMessages, isLoading = false }: MobileFloatingIslandsProps) {
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const t = useTranslations('auth')

  // Check if on product detail page or reels page
  const isProductPage = pathname?.startsWith('/product/')
  const isReelsPage = pathname === '/reels'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    // Check if island was previously shown
    const wasIslandShown = sessionStorage.getItem('bottomIslandShown')
    
    if (!wasIslandShown || wasIslandShown === 'false') {
      setShouldAnimate(true)
      sessionStorage.setItem('bottomIslandShown', 'true')
    } else {
      setShouldAnimate(false)
    }
  }, [pathname, isMounted])

  // Debug: log render conditions to help diagnose disappearing islands
  useEffect(() => {
    try {
      console.log('[Islands Debug]', {
        mounted: isMounted,
        pathname,
        isProductPage,
        isReelsPage,
        userExists: !!user,
        isLoading: !!isLoading,
        showIslands: !!user && !isProductPage && !isReelsPage,
      })
    } catch (e) {}
    // Limit logs to core state changes
  }, [isMounted, pathname, isProductPage, user, isLoading])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null
  }

  // Show islands when user exists, but hide on product and reels pages
  const showIslands = !!user && !isProductPage && !isReelsPage

  // Optional on-screen debug via ?debugIslands=1
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debugIslands')

  return (
    <>
      {/* Debug badge */}
      {debug && (
        <div className="fixed top-2 left-2 z-[100] px-2 py-1 rounded bg-black/70 text-white text-[10px] leading-tight">
          <div>mounted: {String(isMounted)}</div>
          <div>userExists: {String(!!user)}</div>
          <div>isLoading: {String(!!isLoading)}</div>
          <div>showIslands: {String(showIslands)}</div>
          <div>path: {pathname}</div>
        </div>
      )}

      {/* Top Gradient Fade - Only when search bar is visible */}
      {showIslands && pathname === '/' && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 via-black/15 to-transparent z-30 pointer-events-none" />
      )}
      
      {/* Bottom Gradient Fade - Only when bottom menu is visible (NOT on product or reels pages) */}
      {showIslands && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/30 via-black/15 to-transparent z-30 pointer-events-none" />
      )}
      
      {/* Animated Search Bar - Only for logged-in users on homepage */}
      {showIslands && pathname === '/' && <AnimatedSearchBar isLoggedIn={true} />}

      {/* Floating Bottom Island - Always show if user is logged in AND not on product/reels page */}
      {showIslands && (
        <div 
          className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)'
          }}
        >
          <div 
            className={`
              floating-island-bottom
              flex items-center justify-around h-[60px] rounded-[30px]
              backdrop-blur-[16px] backdrop-saturate-[180%]
              shadow-[0_4px_24px_0_rgba(0,0,0,0.08)]
              ${shouldAnimate ? 'animate-slide-up' : ''}
            `}
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-around',
              height: '60px',
              padding: 0
            }}
          >
            <Link 
              href="/" 
              className={`nav-icon ${pathname === '/' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}
            >
              <Home strokeWidth={2} />
            </Link>
            
            <Link
              href="/reels"
              className={`nav-icon ${pathname === '/reels' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}
            >
              <Video strokeWidth={2} fill={pathname === '/reels' ? 'currentColor' : 'none'} />
            </Link>
            
            {/* Center Plus Button */}
            <Link 
              href="/sell" 
              className="nav-icon-center group"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px'
              }}
            >
              <div className="floating-plus-button">
                <Plus className="text-white" strokeWidth={3} />
                <div className="plus-glow"></div>
              </div>
            </Link>
            
            <Link 
              href="/messages" 
              className={`nav-icon relative ${pathname === '/messages' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}
            >
              <MessageCircle strokeWidth={2} />
              {unreadMessages > 0 && (
                <span className="message-badge">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            
            <Link 
              href="/profile" 
              className={`nav-icon ${pathname === '/profile' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}
            >
              <UserIcon strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}