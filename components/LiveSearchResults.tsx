'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
}

interface LiveSearchResultsProps {
  query: string
}

export default function LiveSearchResults({ query }: LiveSearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
            Products
          </div>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
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
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.title}
                </p>
                <p className="text-sm text-gray-600">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
          <p className="text-xs text-gray-500">Try searching for something else</p>
        </div>
      )}
    </div>
  )
}
