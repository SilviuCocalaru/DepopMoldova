'use client'

import ProductCard from './ProductCard'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
  likes: { user_id: string }[]
}

interface ProductGridProps {
  products: Product[]
  currentUserId?: string
}

export default function ProductGrid({ products, currentUserId }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
