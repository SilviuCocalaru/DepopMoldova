'use client'

import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProductGridItemProps {
  product: {
    id: string
    title: string
    price: number
    images: string[]
    likes?: any[]
  }
}

export default function ProductGridItem({ product }: ProductGridItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const imageUrl = product.images?.[0] || '/placeholder-product.png'
  const likesCount = product.likes?.length || 0

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                <span className="font-semibold">{likesCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-900">
          ${product.price}
        </div>
      </div>
    </Link>
  )
}
