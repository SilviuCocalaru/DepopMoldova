'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  refreshAuth: async () => {},
})

export const useAuth = () => useContext(AuthContext)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Create client once to prevent re-creation on renders
  const [supabase] = useState(() => createClient())

  // Load profile helper function
  const loadProfile = useCallback(async (userId: string, userObj?: User) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle()

      if (profileData) {
        setProfile(profileData)
      } else {
        // Fallback profile from user metadata
        setProfile({
          id: userId,
          username: userObj?.email?.split('@')[0] || 'User',
          full_name: userObj?.user_metadata?.full_name || null,
          avatar_url: userObj?.user_metadata?.avatar_url || null,
        })
      }
    } catch (error) {
      console.error('Profile load error:', error)
    }
  }, [supabase])

  const refreshAuth = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth refresh error:', error)
        setUser(null)
        setSession(null)
        setProfile(null)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id, session.user)
        } else {
          setProfile(null)
        }
      }
    } catch (err) {
      console.error('Auth refresh failed:', err)
      setUser(null)
      setSession(null)
      setProfile(null)
    }
  }, [supabase, loadProfile])

  useEffect(() => {
    let mounted = true

    // Set up auth state listener FIRST - this is critical for catching login events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        console.log('Auth event:', event, session?.user?.email || 'No user') // Debug log
        setSession(session)
        setUser(session?.user ?? null)
        
        // Load profile when user signs in
        if (session?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', session.user.id)
              .maybeSingle()

            if (!mounted) return

            if (profileData) {
              setProfile(profileData)
            } else {
              setProfile({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'User',
                full_name: session.user.user_metadata?.full_name || null,
                avatar_url: session.user.user_metadata?.avatar_url || null,
              })
            }
          } catch (error) {
            console.error('Profile load error:', error)
          }
        } else {
          setProfile(null)
        }
        
        // CRITICAL: Set loading false on ANY auth event to unblock UI
        setIsLoading(false)
      }
    )

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!mounted) return
      if (error) {
        console.error('Initial session error:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle()

          if (!mounted) return

          if (profileData) {
            setProfile(profileData)
          } else {
            setProfile({
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'User',
              full_name: session.user.user_metadata?.full_name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
            })
          }
        } catch (error) {
          console.error('Profile load error:', error)
        }
      }
      
      setIsLoading(false)
    })

    // Handle visibility change for background resume
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (!mounted) return
          if (!error) {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .eq('id', session.user.id)
                .maybeSingle()
              if (mounted && profileData) {
                setProfile(profileData)
              }
            }
          }
        } catch (err) {
          console.error('Visibility refresh error:', err)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      mounted = false
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [supabase])

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
