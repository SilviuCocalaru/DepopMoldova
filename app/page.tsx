import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import Header from '@/components/Header'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
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
  const t = await getTranslations('home.categories')
  
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
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Header />
      
      {/* Category Navigation - Desktop Only */}
      <nav className={`border-b sticky top-16 z-40 hidden md:block transition-colors ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto py-4">
            <Link href="/search?category=women" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('women')}
            </Link>
            <Link href="/search?category=men" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('men')}
            </Link>
            <Link href="/search?category=accessories" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('accessories')}
            </Link>
            <Link href="/search?category=shoes" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('shoes')}
            </Link>
            <Link href="/search?category=vintage" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('vintage')}
            </Link>
            <Link href="/search?category=sportswear" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('sportswear')}
            </Link>
            <Link href="/search?category=designer" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('designer')}
            </Link>
            <Link href="/search" className={`text-sm font-medium whitespace-nowrap transition-colors ${
              isDark ? 'text-gray-100 hover:text-red-400' : 'text-gray-900 hover:text-red-500'
            }`}>
              {t('all')}
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
      <section className={`py-16 px-4 text-center transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Buy for less. Pay no selling fee*. Keep fashion circular.
        </h2>
        <Link 
          href="/sell"
          className={`px-8 py-4 rounded-md font-medium transition-colors inline-block text-lg ${
            isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          Sell now
        </Link>
      </section>

      {/* Trending Products */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl md:text-3xl font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>Trending near you</h2>
            <Link href="/explore" className={`font-medium hover:underline ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              See more
            </Link>
          </div>
          
          {products && products.length > 0 ? (
            <ProductGrid products={products} currentUserId={user?.id} />
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>No products yet</p>
              <Link
                href="/sell"
                className={`px-6 py-3 rounded-md font-medium transition-colors inline-block ${
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                List your first item
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Shop by Price */}
      <section className={`py-16 px-4 transition-colors ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>Shop by price</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/search?price=under10"
              className={`rounded-lg p-12 text-center transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <h3 className={`text-2xl font-medium ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>Under $10</h3>
            </Link>
            <Link 
              href="/search?price=under20"
              className={`rounded-lg p-12 text-center transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <h3 className={`text-2xl font-medium ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>Under $20</h3>
            </Link>
            <Link 
              href="/search?price=under50"
              className={`rounded-lg p-12 text-center transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <h3 className={`text-2xl font-medium ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>Under $50</h3>
            </Link>
            <Link 
              href="/search?price=under100"
              className={`rounded-lg p-12 text-center transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <h3 className={`text-2xl font-medium ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>Under $100</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

