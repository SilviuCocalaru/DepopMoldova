'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import Image from 'next/image'
import { Send, Bell, ArrowLeft } from 'lucide-react'
import Header from './Header'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Database['public']['Tables']['profiles']['Row']
  receiver: Database['public']['Tables']['profiles']['Row']
  product: Database['public']['Tables']['products']['Row'] | null
}

interface MessagesViewProps {
  currentUserId: string
  initialMessages: Message[]
  theme: 'light' | 'dark'
}

interface Conversation {
  userId: string
  username: string
  avatar_url: string | null
  lastMessage: string
  lastMessageAt: string
  productId: string | null
}

export default function MessagesView({ currentUserId, initialMessages, theme }: MessagesViewProps) {
  const isDark = theme === 'dark'
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isProcessing, setIsProcessing] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [profile, setProfile] = useState<any>(null)
  const [showChatList, setShowChatList] = useState(true)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [onlineSellersCount, setOnlineSellersCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Load current user profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single()
      
      if (data) setProfile(data)
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId])

  // Initialize selected conversation from URL params only
  useEffect(() => {
    const userId = searchParams.get('user')
    if (userId) {
      setSelectedConversation(userId)
      setShowChatList(false) // Show chat when opening from URL
      localStorage.setItem('lastConversation', userId)
      // Hide bottom nav when opening a chat from URL
      document.body.classList.add('hide-mobile-nav')
    }
    // Don't reset to chat list if user has manually selected a conversation
  }, [searchParams])

  // Manage bottom nav visibility based on chat state
  useEffect(() => {
    if (!showChatList && selectedConversation) {
      // In active chat - hide bottom nav
      document.body.classList.add('hide-mobile-nav')
    } else {
      // In chat list - show bottom nav
      document.body.classList.remove('hide-mobile-nav')
    }
  }, [showChatList, selectedConversation])

  // Simulate online sellers count (in real app, this would track actual online users)
  useEffect(() => {
    const updateOnlineCount = () => {
      // Simulate 0-5 sellers online with some randomness
      const count = Math.floor(Math.random() * 6)
      setOnlineSellersCount(count)
    }
    
    // Initial count
    updateOnlineCount()
    
    // Update every 30 seconds
    const interval = setInterval(updateOnlineCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Update current time every minute for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Group messages into conversations
  useEffect(() => {
    const conversationMap = new Map<string, Conversation>()

    initialMessages.forEach(msg => {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
      const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender

      const existing = conversationMap.get(otherUserId)
      const msgTime = new Date(msg.created_at).getTime()
      const existingTime = existing ? new Date(existing.lastMessageAt).getTime() : 0

      if (!existing || msgTime > existingTime) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          username: otherUser.username,
          avatar_url: otherUser.avatar_url,
          lastMessage: msg.content,
          lastMessageAt: msg.created_at,
          productId: msg.product_id,
        })
      }
    })

    setConversations(Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    ))
    setIsProcessing(false)
  }, [initialMessages, currentUserId])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (*),
          receiver:receiver_id (*),
          product:product_id (*)
        `)
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedConversation}),and(sender_id.eq.${selectedConversation},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data as Message[])
      }
    }

    loadMessages()

    // Subscribe to new messages for this conversation
    const channel = supabase
      .channel(`messages-${currentUserId}-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: any) => {
          const newMsg = payload.new as any
          
          // Check if message is for this conversation
          if (
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === selectedConversation) ||
            (newMsg.sender_id === selectedConversation && newMsg.receiver_id === currentUserId)
          ) {
            // Fetch the complete message with relations
            const { data } = await supabase
              .from('messages')
              .select(`
                *,
                sender:sender_id (*),
                receiver:receiver_id (*),
                product:product_id (*)
              `)
              .eq('id', newMsg.id)
              .single()

            if (data) {
              setMessages(prev => [...prev, data as Message])
              
              // Play notification sound if message is from other user
              if (newMsg.sender_id !== currentUserId) {
                try {
                  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2i78OScUgwPUKnk75lUDQ1Un+TrqlcMDU+p5O+aVQ0OT6vl7qVeDA4=') 
                  audio.volume = 0.3
                  await audio.play()
                } catch (e) {
                  console.log('Could not play notification sound')
                }
                
                // Show browser notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('New message', {
                    body: data.content,
                    icon: '/icon.png'
                  })
                }
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, currentUserId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Subscribe to all messages for notification badge
  useEffect(() => {
    const channel = supabase
      .channel('all-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          const newMsg = payload.new as any
          // If message is for current user and not in current conversation
          if (newMsg.receiver_id === currentUserId && newMsg.sender_id !== selectedConversation) {
            setUnreadCount(prev => prev + 1)
            
            // Request notification permission if not granted
            if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission()
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const productId = searchParams.get('product')
    const messageContent = newMessage.trim()
    
    // Clear input immediately for better UX
    setNewMessage('')

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: selectedConversation,
      content: messageContent,
      created_at: new Date().toISOString(),
      product_id: productId || null,
      sender: profile,
      receiver: null,
      product: null
    } as any

    setMessages(prev => [...prev, tempMessage])

    // Save to database
    const { data, error } = await supabase.from('messages').insert({
      sender_id: currentUserId,
      receiver_id: selectedConversation,
      content: messageContent,
      product_id: productId || null,
    }).select(`
      *,
      sender:sender_id (*),
      receiver:receiver_id (*),
      product:product_id (*)
    `).single()

    if (error) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
      console.error('Error sending message:', error)
    } else if (data) {
      // Replace temp message with real one
      setMessages(prev => prev.map(m => m.id === tempMessage.id ? data as Message : m))
      
      // Save last conversation to localStorage
      localStorage.setItem('lastConversation', selectedConversation)
    }
  }

  const markMessagesAsRead = async (userId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', currentUserId)
      .eq('sender_id', userId)
      .eq('is_read', false)
  }

  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId)
    setShowChatList(false)
    localStorage.setItem('lastConversation', userId)
    markMessagesAsRead(userId)
    
    // Use router.push to create history entry for proper back navigation
    router.push(`/messages?user=${userId}`, { scroll: false })
    
    // Bottom nav will be hidden by useEffect
  }

  const handleBackToChatList = () => {
    setShowChatList(true)
    setSelectedConversation(null)
    
    // Use router.push to maintain history
    router.push('/messages', { scroll: false })
    
    // Bottom nav will be shown by useEffect
  }

  const handleBackToMenu = () => {
    // Show bottom navigation before navigating away
    document.body.classList.remove('hide-mobile-nav')
    router.push('/')
  }

  // Sync state with URL on mount and navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('user')
    
    if (userId && userId !== selectedConversation) {
      // URL has user param, show that conversation
      setSelectedConversation(userId)
      setShowChatList(false)
      markMessagesAsRead(userId)
    } else if (!userId && selectedConversation) {
      // No user param, show chat list
      setShowChatList(true)
      setSelectedConversation(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Cleanup on unmount - always show bottom nav when leaving messages
  useEffect(() => {
    return () => {
      document.body.classList.remove('hide-mobile-nav')
    }
  }, [])

  // Visual Viewport API - handle keyboard appearance
  useEffect(() => {
    if (!selectedConversation || typeof window === 'undefined') return

    const updateViewportHeight = () => {
      if (window.visualViewport) {
        const height = window.visualViewport.height
        document.documentElement.style.setProperty('--viewport-height', `${height}px`)
      }
    }

    // Set initial viewport height
    updateViewportHeight()

    // Listen for viewport changes (keyboard open/close)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight)
      window.visualViewport.addEventListener('scroll', updateViewportHeight)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight)
        window.visualViewport.removeEventListener('scroll', updateViewportHeight)
      }
      document.documentElement.style.removeProperty('--viewport-height')
    }
  }, [selectedConversation])

  const getRelativeTime = (date: string) => {
    const now = currentTime.getTime()
    const msgTime = new Date(date).getTime()
    const diffMs = now - msgTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(date).toLocaleDateString()
  }

  // Cache current conversation to avoid repeated lookups
  const currentConversation = conversations.find(c => c.userId === selectedConversation)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {isProcessing && conversations.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          {/* Hide header on mobile when in active chat */}
          <div className={`${!showChatList && selectedConversation ? 'hidden' : 'block'} md:block`}>
            <Header />
          </div>
      
      {/* Mobile Floating Islands - Split Layout for Active Chat */}
      {!showChatList && selectedConversation ? (
        <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="flex gap-2">
            {/* Back Button Island - 1/4 width */}
            <button
              onClick={handleBackToChatList}
              className="floating-island-top h-16 w-16 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            >
              <ArrowLeft className={`w-7 h-7 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
            </button>

            {/* User Info Island - 3/4 width */}
            <div className="floating-island-top h-16 flex-1 flex items-center gap-3 px-4">
              {/* User Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                {currentConversation?.avatar_url ? (
                  <Image
                    src={currentConversation.avatar_url}
                    alt={currentConversation.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentConversation?.username?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentConversation?.username || 'User'}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active {Math.floor(Math.random() * 30) + 1}m ago
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="floating-island-top-large">
            <div className="flex flex-col items-center w-full">
              {/* Messages Title */}
              <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Messages</p>
              {/* Online Sellers Status */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {onlineSellersCount} {onlineSellersCount === 1 ? 'seller' : 'sellers'} online now
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto md:px-4 md:sm:px-6 md:lg:px-8 md:py-8">
        {/* Chat container - only fixed when in active chat */}
        <div 
          className={`md:rounded-lg md:shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} ${
            !showChatList && selectedConversation 
              ? 'fixed inset-0 z-40 md:relative md:h-[calc(100vh-200px)]' 
              : 'h-screen md:h-[calc(100vh-200px)]'
          }`}
          style={{
            height: !showChatList && selectedConversation 
              ? 'var(--viewport-height, 100dvh)' 
              : undefined
          }}
        >
          <div className="flex h-full flex-col md:flex-row">
            {/* Conversations List */}
            <div className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3 border-r flex flex-col h-full ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Chat list header - hidden on mobile (shown in island), visible on desktop */}
              <div className={`hidden md:block p-3 md:p-4 border-b flex-shrink-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-base md:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Messages</h2>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-500" />
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Conversations - with padding for mobile island */}
              <div className="flex-1 overflow-y-auto pt-24 md:pt-0">
                {conversations.length === 0 ? (
                  <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConversation(conv.userId)}
                      className={`w-full p-3 md:p-4 flex items-center gap-3 transition-colors ${
                        selectedConversation === conv.userId 
                          ? (isDark ? 'bg-indigo-900' : 'bg-indigo-50') 
                          : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      }`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                        {conv.avatar_url ? (
                          <Image
                            src={conv.avatar_url}
                            alt={conv.username}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-lg md:text-xl font-semibold text-gray-600">
                            {conv.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`font-medium text-sm md:text-base truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{conv.username}</p>
                        <p className={`text-xs md:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area - Flex container */}
            <div className={`${!showChatList && selectedConversation ? 'flex' : 'hidden'} md:flex flex-1 flex-col w-full md:w-auto h-full`}>
              {selectedConversation ? (
                <>
                  {/* Messages scrollable area */}
                  <div className={`flex-1 overflow-y-auto p-3 md:p-4 pt-24 md:pt-4 space-y-3 md:space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
                            msg.sender_id === currentUserId
                              ? 'bg-indigo-600 text-white'
                              : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender_id === currentUserId ? 'text-indigo-200' : (isDark ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            {getRelativeTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input - flex-shrink-0 to stay at bottom */}
                  <form 
                    onSubmit={handleSendMessage} 
                    className={`flex-shrink-0 p-3 md:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="Type a message..."
                        className={`flex-1 px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className={`flex-1 flex items-center justify-center text-sm md:text-base px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
