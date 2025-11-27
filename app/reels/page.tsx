import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReelsViewer from '@/components/ReelsViewer'

export default async function ReelsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch reels (without profile join; no FK to public.profiles)
  const { data: reels, error } = await supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reels:', error)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-white">Error loading reels</p>
      </div>
    )
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black px-4">
        <p className="text-white text-xl mb-4">No reels yet</p>
        <a
          href="/sell/reel"
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold"
        >
          Create the first reel
        </a>
      </div>
    )
  }

  // Fetch profiles for all reel user_ids
  const userIds = Array.from(new Set(reels.map(r => r.user_id).filter(Boolean)))
  let profilesMap: Record<string, { username: string; avatar_url: string | null }> = {}
  if (userIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles for reels:', profilesError)
    } else {
      profilesMap = (profilesData || []).reduce((acc: Record<string, any>, p: any) => {
        acc[p.id] = { username: p.username, avatar_url: p.avatar_url }
        return acc
      }, {})
    }
  }

  // Attach profiles to reels for the UI
  const reelsWithProfiles = reels.map((r: any) => ({
    ...r,
    profiles: profilesMap[r.user_id] ? profilesMap[r.user_id] : null
  }))

  // Fetch user's likes
  const { data: userLikes } = await supabase
    .from('reel_likes')
    .select('reel_id')
    .eq('user_id', user.id)

  const likedReelIds = new Set(userLikes?.map(like => like.reel_id) || [])

  return (
    <ReelsViewer
      reels={reelsWithProfiles}
      currentUserId={user.id}
      initialLikedReelIds={Array.from(likedReelIds)}
    />
  )
}
