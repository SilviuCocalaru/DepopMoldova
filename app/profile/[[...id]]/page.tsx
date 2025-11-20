import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ProfileView from '@/components/ProfileView'

export default async function ProfilePage({ params }: { params: { id?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If no ID, show current user's profile
  const profileId = params.id ? (await params).id : user?.id

  if (!profileId) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      likes (user_id)
    `)
    .eq('seller_id', profileId)
    .order('created_at', { ascending: false })

  const isOwnProfile = user?.id === profileId

  return (
    <ProfileView
      profile={profile}
      products={products || []}
      isOwnProfile={isOwnProfile}
      currentUserId={user?.id}
    />
  )
}
