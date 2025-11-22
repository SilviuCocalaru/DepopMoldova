import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ProfileView from '@/components/ProfileView'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ id?: string[] }> }) {
  // DEBUG: Log all cookies to see if auth cookies exist
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log('=== PROFILE PAGE DEBUG ===')
  console.log('All cookies:', allCookies.map(c => c.name))
  
  // Check for Supabase auth cookies specifically
  const authCookies = allCookies.filter(c => 
    c.name.includes('supabase') || 
    c.name.includes('sb-') ||
    c.name.includes('auth')
  )
  console.log('Auth cookies found:', authCookies.map(c => ({ name: c.name, valueLength: c.value?.length })))
  
  const supabase = await createClient()
  
  // Resolve params first
  const resolvedParams = await params
  const targetProfileId = resolvedParams.id?.[0]
  
  // If viewing someone else's profile, we don't need auth
  if (targetProfileId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetProfileId)
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
      .eq('seller_id', targetProfileId)
      .order('created_at', { ascending: false })

    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    const isOwnProfile = user?.id === targetProfileId

    return (
      <ProfileView
        profile={profile}
        products={products || []}
        isOwnProfile={isOwnProfile}
        currentUserId={user?.id}
      />
    )
  }
  
  // No ID provided - viewing own profile, auth required
  const { data: { session }, error } = await supabase.auth.getSession()
  
  console.log('getSession result:')
  console.log('  - session exists:', !!session)
  console.log('  - user email:', session?.user?.email || 'NO USER')
  console.log('  - error:', error?.message || 'none')
  console.log('  - access_token exists:', !!session?.access_token)
  console.log('  - refresh_token exists:', !!session?.refresh_token)
  
  const user = session?.user
  
  if (!user?.id) {
    console.log('❌ No user ID, redirecting to login')
    console.log('=== END DEBUG ===')
    redirect('/login')
  }

  console.log('✅ User authenticated:', user.email)
  console.log('=== END DEBUG ===')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
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