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
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let mounted = true
    
    const loadUserAndProfile = async () => {
      try {
        setIsLoading(true)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[MobileOnlyHeader] Session error:', error)
        }
        
        if (!mounted) return
        
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        console.log('[MobileOnlyHeader] User loaded:', currentUser ? 'Logged in' : 'Not logged in', 'Session:', !!session)
        
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
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      console.log('[MobileOnlyHeader] Auth state changed:', _event, 'User:', !!session?.user)
      
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
  }, [supabase])

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
  }, [user])

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
