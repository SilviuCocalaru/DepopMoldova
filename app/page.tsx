import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import Header from '@/components/Header'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (username, avatar_url),
      likes (user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      
      {/* Category Navigation - Desktop Only */}
      <nav className="border-b border-gray-200 dark:border-gray-700 sticky top-16 bg-white dark:bg-gray-800 z-40 hidden md:block transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto py-4">
            <Link href="/search?category=women" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Women
            </Link>
            <Link href="/search?category=men" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Men
            </Link>
            <Link href="/search?category=kids" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Kids
            </Link>
            <Link href="/search?category=brands" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Brands
            </Link>
            <Link href="/search?category=sports" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Sports
            </Link>
            <Link href="/search?category=trending" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Trending
            </Link>
            <Link href="/search?category=gifts" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 whitespace-nowrap transition-colors">
              Gifts
            </Link>
            <Link href="/search?category=sale" className="text-sm font-medium text-red-500 dark:text-red-400 whitespace-nowrap">
              Sale
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-0">
        {/* Women Section */}
        <div className="relative h-[400px] md:h-[500px] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')"
            }}
          ></div>
          <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-white text-5xl md:text-6xl font-bold mb-4">Women</h2>
            <Link 
              href="/search?category=women"
              className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block w-fit"
            >
              Shop now
            </Link>
          </div>
        </div>

        {/* Men Section */}
        <div className="relative h-[400px] md:h-[500px] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80')"
            }}
          ></div>
          <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-white text-5xl md:text-6xl font-bold mb-4">Men</h2>
            <Link 
              href="/search?category=men"
              className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block w-fit"
            >
              Shop now
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 px-4 text-center bg-white dark:bg-gray-900 transition-colors">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Buy for less. Pay no selling fee*. Keep fashion circular.
        </h2>
        <Link 
          href="/sell"
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block text-lg"
        >
          Sell now
        </Link>
      </section>

      {/* Trending Products */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Trending near you</h2>
            <Link href="/explore" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              See more
            </Link>
          </div>
          
          {products && products.length > 0 ? (
            <ProductGrid products={products} currentUserId={user?.id} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No products yet</p>
              <Link
                href="/sell"
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
              >
                List your first item
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Shop by Price */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Shop by price</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/search?price=under10"
              className="bg-gray-200 dark:bg-gray-700 rounded-lg p-12 text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Under $10</h3>
            </Link>
            <Link 
              href="/search?price=under20"
              className="bg-gray-200 dark:bg-gray-700 rounded-lg p-12 text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Under $20</h3>
            </Link>
            <Link 
              href="/search?price=under50"
              className="bg-gray-200 dark:bg-gray-700 rounded-lg p-12 text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Under $50</h3>
            </Link>
            <Link 
              href="/search?price=under100"
              className="bg-gray-200 dark:bg-gray-700 rounded-lg p-12 text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Under $100</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

