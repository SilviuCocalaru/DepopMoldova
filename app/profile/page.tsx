import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileView from '@/components/ProfileView'

export default async function MyProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      likes (user_id)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <ProfileView
      profile={profile}
      products={products || []}
      isOwnProfile={true}
      currentUserId={user.id}
    />
  )
}
