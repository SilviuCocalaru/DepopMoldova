'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import MobileFloatingIslands from './MobileFloatingIslands'

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
}

export default function MobileOnlyHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [supabase] = useState(() => createClient())

  // Optimistically load user from localStorage before async session check
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      // Supabase stores session with key pattern: sb-<project-ref>-auth-token
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
      const storageKey = `sb-${projectRef}-auth-token`
      
      const sessionData = localStorage.getItem(storageKey)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        // Check both possible structures
        const user = parsed?.user || parsed?.currentSession?.user
        if (user) {
          setUser(user)
          console.log('[Optimistic] Loaded user from localStorage:', user.email)
        }
      }
    } catch (e) {
      console.error('[Optimistic] Error loading from localStorage:', e)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadUserAndProfile = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[MobileOnlyHeader] Session error:', error)
        }
        
        if (!mounted) return
        
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
            setProfile({
              id: currentUser.id,
              username: currentUser.email?.split('@')[0] || 'user',
              full_name: currentUser.user_metadata?.full_name || null,
              avatar_url: currentUser.user_metadata?.avatar_url || null
            })
          }
        } else {
          if (mounted) {
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }

    loadUserAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      // Ignore INITIAL_SESSION - it's handled by loadUserAndProfile
      if (event === 'INITIAL_SESSION') {
        return
      }
      
      const currentUser = session?.user ?? null
      if (mounted) {
        setUser(currentUser)
      }
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', currentUser.id)
          .maybeSingle()
        
        if (mounted) {
          if (profileData) {
            setProfile(profileData)
          } else {
            setProfile({
              id: currentUser.id,
              username: currentUser.email?.split('@')[0] || 'user',
              full_name: currentUser.user_metadata?.full_name || null,
              avatar_url: currentUser.user_metadata?.avatar_url || null
            })
          }
        }
      } else {
        if (mounted) {
          setProfile(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      .channel('mobile-header-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return (
    <MobileFloatingIslands 
      key={user?.id || 'no-user'}
      user={user} 
      profile={profile} 
      unreadMessages={unreadMessages}
      isLoading={isLoading}
    />
  )
}
