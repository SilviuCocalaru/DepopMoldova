import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export default async function LikesPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { data: likes } = await supabase
    .from('likes')
    .select(`
      *,
      product:products (
        *,
        profiles:seller_id (*),
        likes (user_id)
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const likedProducts = likes?.map(like => like.product).filter(Boolean) || []
  const userId = session.user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Liked Items</h1>
        
        {likedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't liked any items yet</p>
          </div>
        ) : (
          <ProductGrid products={likedProducts} currentUserId={userId} />
        )}
      </div>
    </div>
  )
}
