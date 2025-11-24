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
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 transition-colors">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        
        {/* Likes count badge - top left */}
        {likesCount > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{likesCount}{likesCount >= 5 ? '+' : ''}</span>
          </div>
        )}
        
        {/* Like button - bottom right */}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
          />
        </button>
        
        {product.is_sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD</span>
          </div>
        )}
        
        {/* Size badge - bottom left */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-sm">
          <p className="text-sm font-semibold text-white">
            {product.size || 'One size'}
          </p>
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Price with discount */}
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                £{product.price}
              </p>
              <p className="text-sm line-through text-yellow-600 dark:text-yellow-500">
                £{(Number(product.price) * 1.32).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
