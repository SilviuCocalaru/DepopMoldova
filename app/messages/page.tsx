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
    let isCancelled = false

    const loadMessages = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (isCancelled) return
        
        if (!session?.user) {
          router.push('/login')
          return
        }

        setCurrentUserId(session.user.id)

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

        if (isCancelled) return

        if (messagesError) {
          console.error('Messages error:', messagesError)
          setError('Failed to load messages')
        } else {
          setInitialMessages(messages || [])
        }
      } catch (err) {
        if (isCancelled) return
        console.error('Load error:', err)
        setError('An unexpected error occurred')
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadMessages()

    return () => {
      isCancelled = true
    }
  }, [])

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
