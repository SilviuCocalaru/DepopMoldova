import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

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

  return (
    <>
      <ProductDetail product={product} currentUserId={user?.id} />
    </>
  )
}
