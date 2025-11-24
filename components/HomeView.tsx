'use client'

import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface HomeViewProps {
  products: any[]
  isDark: boolean
  userId?: string
}

export default function HomeView({ products, isDark, userId }: HomeViewProps) {
  const t = useTranslations('home.categories')
  
  // Show first 6 products
  const displayedProducts = products.slice(0, 6)
  const hasMoreProducts = products.length > 6

  return (
    <div className="main-content max-w-7xl mx-auto px-4">
      {/* Suggestions Section */}
      <section>
        <h2 className={`text-xl md:text-2xl font-semibold mb-6 text-center ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Suggested for you
        </h2>
        
        {displayedProducts && displayedProducts.length > 0 ? (
          <>
            <ProductGrid products={displayedProducts} currentUserId={userId} />
            
            {hasMoreProducts && (
              <div className="mt-8 text-center">
                <Link 
                  href="/search"
                  className={`inline-block px-8 py-3 rounded-md font-medium transition-colors ${
                    isDark 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  See more
                </Link>
              </div>
            )}
          </>
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
      </section>
    </div>
  )
}
