'use client'

import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { BookOpen } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tutorial Button */}
      <div className="mb-6">
        <Link 
          href="/tutorial"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isDark 
              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Tutorial
        </Link>
      </div>

      {/* Suggestions Section */}
      <section>
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Suggestions
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
