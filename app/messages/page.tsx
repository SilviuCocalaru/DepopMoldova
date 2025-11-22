'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MessagesView from '@/components/MessagesView'

export default function MessagesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let loadingTimeout: NodeJS.Timeout | null = null

    const checkAuthAndLoadMessages = async () => {
      try {
        // Prevent infinite loading - max 10 seconds
        loadingTimeout = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn('Loading timeout - forcing completion')
            setIsLoading(false)
          }
        }, 10000)

        // Get session from client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Messages page - session:', session?.user?.email)
        
        if (!mounted) return
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Authentication error')
          setIsLoading(false)
          return
        }
        
        if (!session?.user) {
          console.log('No session, redirecting to login')
          router.push('/login')
          return
        }

        setCurrentUserId(session.user.id)

        // Load messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (*),
            receiver:receiver_id (*),
            product:product_id (*)
          `)
          .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
          .order('created_at', { ascending: false })

        if (!mounted) return

        if (messagesError) {
          console.error('Messages error:', messagesError)
          setError('Failed to load messages: ' + messagesError.message)
          setIsLoading(false)
          return
        }

        console.log('Loaded messages:', messages?.length || 0)
        setInitialMessages(messages || [])
        setIsLoading(false)
      } catch (err) {
        if (!mounted) return
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isLoading) {
        console.log('Messages page became visible, refreshing auth')
        checkAuthAndLoadMessages()
      }
    }

    checkAuthAndLoadMessages()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      if (loadingTimeout) clearTimeout(loadingTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return <MessagesView currentUserId={currentUserId} initialMessages={initialMessages} />
}
