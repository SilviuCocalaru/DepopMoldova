'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
}

interface LiveSearchResultsProps {
  query: string
  isDark: boolean
}

export default function LiveSearchResults({ query, isDark }: LiveSearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const t = useTranslations('search')
  const tResults = useTranslations('searchResults')

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setProducts([])
        return
      }

      setLoading(true)
      
      // Debounce search
      const timeoutId = setTimeout(async () => {
        const { data } = await supabase
          .from('products')
          .select('id, title, price, images')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_sold', false)
          .limit(8)

        setProducts(data || [])
        setLoading(false)
      }, 300)

      return () => clearTimeout(timeoutId)
    }

    searchProducts()
  }, [query])

  if (query.trim().length < 2) {
    return null
  }

  return (
    <div className={`w-full backdrop-blur-[20px] backdrop-saturate-[180%] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] border overflow-hidden max-h-[60vh] overflow-y-auto ${
      isDark ? 'bg-gray-800/85 border-gray-700/30' : 'bg-white/85 border-gray-200/30'
    }`}>
      {loading ? (
        <div className="p-6 text-center">
          <div className={`animate-spin w-6 h-6 border-2 rounded-full mx-auto ${
            isDark ? 'border-white border-t-transparent' : 'border-black border-t-transparent'
          }`}></div>
        </div>
      ) : products.length > 0 ? (
        <div className="py-2">
          <div className={`px-4 py-2 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {tResults('products')}
          </div>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Package className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {product.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{t('noResults')}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{tResults('trySearching')}</p>
        </div>
      )}
    </div>
  )
}
