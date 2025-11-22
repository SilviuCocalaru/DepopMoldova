'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import MobileFloatingIslands from './MobileFloatingIslands'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

export default function MobileIslandsWrapper() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    let isCancelled = false

    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (isCancelled) return
        
        if (session?.user) {
          setUser(session.user)

          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', session.user.id)
            .single()

          if (!isCancelled && profileData) {
            setProfile(profileData)
          }

          // Fetch unread messages count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', session.user.id)
            .eq('is_read', false)

          if (!isCancelled) {
            setUnreadMessages(count || 0)
          }
        }
      } catch (error) {
        console.error('Error loading islands data:', error)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore token refresh events
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        return
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setUnreadMessages(0)
      } else if (session?.user) {
        setUser(session.user)
        loadData()
      }
    })

    return () => {
      isCancelled = true
      subscription.unsubscribe()
    }
  }, [pathname])

  return (
    <MobileFloatingIslands
      user={user}
      profile={profile}
      unreadMessages={unreadMessages}
      isLoading={isLoading}
    />
  )
}
