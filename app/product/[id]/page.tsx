import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'
import Header from '@/components/Header'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (*),
      likes (user_id)
    `)
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's theme preference
  let theme: 'light' | 'dark' = 'light'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme')
      .eq('id', user.id)
      .single()
    
    theme = (profile?.theme as 'light' | 'dark') || 'light'
  }

  return (
    <div>
      <div className="hidden md:block">
        <Header />
      </div>
      <ProductDetail product={product} currentUserId={user?.id} theme={theme} />
    </div>
  )
}
