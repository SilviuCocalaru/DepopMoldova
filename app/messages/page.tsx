'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MessagesView from '@/components/MessagesView'

export default function MessagesPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const checkAuthAndLoadMessages = async () => {
      console.log('🔵 Starting checkAuthAndLoadMessages')
      
      try {
        // Get session from client - use cached session first
        console.log('🔍 Getting session from cache...')
        const { data: { session } } = await supabase.auth.getSession()
        
        console.log('📋 Session:', session?.user?.email || 'NO SESSION')
        
        if (!mounted) {
          console.log('❌ Component unmounted, aborting')
          return
        }
        
        if (!session?.user) {
          console.log('🔒 No session, redirecting to login')
          router.push('/login')
          return
        }

        setCurrentUserId(session.user.id)

        // Load messages
        console.log('📨 Loading messages for user:', session.user.id)
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

        if (!mounted) {
          console.log('❌ Component unmounted after loading messages')
          return
        }

        if (messagesError) {
          console.error('❌ Messages error:', messagesError)
          setError('Failed to load messages: ' + messagesError.message)
          setIsLoading(false)
          return
        }

        console.log('✅ Loaded messages:', messages?.length || 0)
        setInitialMessages(messages || [])
        setIsLoading(false)
        console.log('✅ Loading complete')
      } catch (err) {
        if (!mounted) return
        console.error('❌ Unexpected error:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    checkAuthAndLoadMessages()

    return () => {
      mounted = false
    }
  }, [router, supabase])

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
