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

  // Fetch reels with user profiles and likes
  const { data: reels, error } = await supabase
    .from('reels')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
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

  // Fetch user's likes
  const { data: userLikes } = await supabase
    .from('reel_likes')
    .select('reel_id')
    .eq('user_id', user.id)

  const likedReelIds = new Set(userLikes?.map(like => like.reel_id) || [])

  return (
    <ReelsViewer
      reels={reels}
      currentUserId={user.id}
      initialLikedReelIds={Array.from(likedReelIds)}
    />
  )
}
