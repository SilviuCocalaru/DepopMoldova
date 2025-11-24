import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileActions from '@/components/profile/ProfileActions'
import ProfileTabs from '@/components/profile/ProfileTabs'
import ProductGrid from '@/components/profile/ProductGrid'
import Header from '@/components/Header'
import MobileOnlyHeader from '@/components/MobileOnlyHeader'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ id?: string[] }> }) {
  const supabase = await createClient()
  
  // Resolve params first
  const resolvedParams = await params
  const targetProfileId = resolvedParams.id?.[0]
  
  // Get current session
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no target profile ID and no session, redirect to login
  if (!targetProfileId && !session?.user) {
    redirect('/login')
  }
  
  // Determine which profile to show
  const profileId = targetProfileId || session?.user.id
  const isOwnProfile = !targetProfileId || targetProfileId === session?.user.id
  
  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      likes (user_id)
    `)
    .eq('seller_id', profileId)
    .order('created_at', { ascending: false })

  // TODO: Fetch followers/following counts when tables exist
  const followersCount = 0
  const followingCount = 0

  const isDark = profile.theme === 'dark'

  return (
    <div className={`min-h-screen pt-20 md:pt-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="max-w-[935px] mx-auto px-4 py-3">
        <ProfileHeader 
          profile={profile}
          postsCount={products?.length || 0}
          followersCount={followersCount}
          followingCount={followingCount}
          isDark={isDark}
        />
        <ProfileActions 
          userId={profileId!}
          isOwnProfile={isOwnProfile}
          isDark={isDark}
        />
        <ProfileTabs isDark={isDark} />
        <ProductGrid products={products || []} isDark={isDark} />
      </div>
    </div>
  )
}