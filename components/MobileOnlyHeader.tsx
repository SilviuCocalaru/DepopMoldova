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
      // Check for existing Supabase session in localStorage
      const keys = Object.keys(localStorage).filter(key => key.includes('supabase.auth.token'))
      if (keys.length > 0) {
        const sessionData = localStorage.getItem(keys[0])
        if (sessionData) {
          const parsed = JSON.parse(sessionData)
          if (parsed?.currentSession?.user) {
            // Optimistically set user to prevent flash
            setUser(parsed.currentSession.user)
          }
        }
      }
    } catch (e) {
      // Ignore localStorage errors
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
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
