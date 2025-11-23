import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesView from '@/components/MessagesView'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get theme preference
  const { data: profile } = await supabase
    .from('profiles')
    .select('theme')
    .eq('id', session.user.id)
    .single()
  
  const theme = (profile?.theme as 'light' | 'dark') || 'light'

  // Fetch initial messages
  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (*),
      receiver:receiver_id (*),
      product:product_id (*)
    `)
    .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
    .order('created_at', { ascending: false })

  return <MessagesView currentUserId={session.user.id} initialMessages={messages || []} theme={theme} />
}
