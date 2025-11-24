import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import Header from '@/components/Header'
import MobileOnlyHeader from '@/components/MobileOnlyHeader'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; price?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''
  const priceFilter = params.price || ''
  
  const supabase = await createClient()
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
  
  const isDark = theme === 'dark'

  // Build the query
  let productsQuery = supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (username, avatar_url),
      likes (user_id)
    `)
    .eq('is_sold', false)

  // Apply search filter
  if (query) {
    productsQuery = productsQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Apply category filter
  if (category && category !== 'all') {
    productsQuery = productsQuery.eq('category', category)
  }

  // Apply price filter
  if (priceFilter) {
    switch (priceFilter) {
      case 'under10':
        productsQuery = productsQuery.lte('price', 10)
        break
      case 'under20':
        productsQuery = productsQuery.lte('price', 20)
        break
      case 'under50':
        productsQuery = productsQuery.lte('price', 50)
        break
      case 'under100':
        productsQuery = productsQuery.lte('price', 100)
        break
    }
  }

  const { data: products } = await productsQuery.order('created_at', { ascending: false })

  const resultText = query 
    ? `Search results for "${query}"` 
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)}` 
    : priceFilter
    ? `Under $${priceFilter.replace('under', '')}`
    : 'Browse all'

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="hidden md:block">
        <Header />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{resultText}</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {products?.length || 0} {products?.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {products && products.length > 0 ? (
          <ProductGrid products={products} currentUserId={user?.id} />
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className={`w-16 h-16 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>No items found</h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your search or browse all items</p>
            <Link
              href="/"
              className={`inline-block px-6 py-3 rounded-md font-medium transition-colors ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Browse all items
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
