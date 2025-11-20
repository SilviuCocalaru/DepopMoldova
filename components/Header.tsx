'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, User as UserIcon, LogOut, Menu, X, ChevronDown, Home, Plus, Search } from 'lucide-react'

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    const loadUserAndProfile = async () => {
      try {
        // Get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setUser(null)
          setProfile(null)
          setIsLoading(false)
          return
        }
        
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', currentUser.id)
            .maybeSingle()
          
          if (!mounted) return
          
          if (profileData) {
            setProfile(profileData)
          } else {
            // Fallback profile from auth metadata
            setProfile({
              id: currentUser.id,
              username: currentUser.email?.split('@')[0] || 'User',
              full_name: currentUser.user_metadata?.full_name || null,
              avatar_url: currentUser.user_metadata?.avatar_url || null
            })
          }
        } else {
          setProfile(null)
        }
      } catch (error) {
        if (!mounted) return
        console.error('Error loading user:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadUserAndProfile()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('Header auth event:', event, session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', session.user.id)
          .maybeSingle()
        
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pathname]) // Re-run when pathname changes

  // Subscribe to new messages for unread count
  useEffect(() => {
    if (!user) return

    const loadUnreadCount = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)
      
      setUnreadMessages(count || 0)
    }

    loadUnreadCount()

    const channel = supabase
      .channel('header-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as any
          if (newMsg.receiver_id === user.id) {
            setUnreadMessages(prev => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfileDropdownOpen(false)
    router.push('/login')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-red-500 lowercase">
                depop
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-6">
              {isLoading ? (
                <>
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse"></div>
                </>
              ) : user ? (
                <>
                  <Link href="/likes" className="text-gray-700 hover:text-red-500">
                    <Heart className="w-6 h-6" />
                  </Link>
                  <Link href="/messages" className="text-gray-700 hover:text-red-500 relative">
                    <MessageCircle className="w-6 h-6" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/sell"
                    className="px-6 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
                  >
                    Sell now
                  </Link>
                  
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 text-gray-700 hover:text-red-500"
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {profile?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </button>

                    {profileDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">
                              {profile?.full_name || profile?.username}
                            </p>
                            <p className="text-xs text-gray-600">@{profile?.username}</p>
                          </div>
                          
                          <Link
                            href="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <UserIcon className="w-4 h-4" />
                            View Profile
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-md hover:border-gray-400"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-black"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Floating Island Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="glass-nav flex items-center justify-around px-6 py-4 rounded-full">
            <Link 
              href="/" 
              className={`nav-item ${pathname === '/' ? 'active' : ''}`}
            >
              <Home className="w-6 h-6" />
            </Link>
            
            <Link 
              href="/search" 
              className={`nav-item ${pathname === '/search' ? 'active' : ''}`}
            >
              <Search className="w-6 h-6" />
            </Link>
            
            <Link 
              href="/sell" 
              className="nav-item-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </Link>
            
            <Link 
              href="/messages" 
              className={`nav-item relative ${pathname === '/messages' ? 'active' : ''}`}
            >
              <MessageCircle className="w-6 h-6" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            
            <Link 
              href="/profile" 
              className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </Link>
          </div>
        </nav>
      )}

      {/* Mobile Top Bar (minimal, only logo) */}
      <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="flex justify-between items-center h-14 px-4">
          <Link href="/" className="text-xl font-bold text-red-500 lowercase">
            depop
          </Link>
          {!user && (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium text-gray-700"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
