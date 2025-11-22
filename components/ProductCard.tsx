'use client'

import { Database } from '@/types/database.types'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
  likes: { user_id: string }[]
}

interface ProductCardProps {
  product: Product
  currentUserId?: string
}

export default function ProductCard({ product, currentUserId }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(product.likes?.length || 0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (currentUserId && product.likes) {
      setIsLiked(product.likes.some(like => like.user_id === currentUserId))
    }
  }, [currentUserId, product.likes])

  const handleCardClick = (e: React.MouseEvent) => {
    // If user is not logged in, redirect to signup
    if (!currentUserId) {
      e.preventDefault()
      router.push('/signup')
      return
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUserId) {
      window.location.href = '/login'
      return
    }

    if (isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('product_id', product.id)

      if (!error) {
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: currentUserId, product_id: product.id })

      if (!error) {
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    }
  }

  return (
    <Link 
      href={currentUserId ? `/product/${product.id}` : '/signup'} 
      onClick={handleCardClick}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>
        {product.is_sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {product.size || 'One size'}
            </p>
            <h3 className="text-base font-normal text-gray-900 line-clamp-2 mt-0.5">
              {product.title}
            </h3>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm line-through text-gray-400">
              ${(Number(product.price) * 1.2).toFixed(2)}
            </p>
            <p className="text-lg font-bold text-gray-900">
              ${product.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
