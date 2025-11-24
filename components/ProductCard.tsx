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
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        
        {/* Likes count badge - top right */}
        {likesCount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span className="text-xs font-bold text-gray-900">{likesCount}{likesCount >= 5 ? '+' : ''}</span>
          </div>
        )}
        
        {/* Save button - bottom right */}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={isLiked ? 'fill-gray-900 text-gray-900' : 'text-gray-900'}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        {product.is_sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD</span>
          </div>
        )}
        
        {/* Size badge - bottom left */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm">
          <p className="text-xs font-bold text-white">
            {product.size || 'One size'}
          </p>
        </div>
        
        {/* Price - top left with yellow diamond */}
        <div className="absolute top-3 left-3 flex flex-col gap-0.5">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-sm">
            <span className="text-base">💎</span>
            <span className="text-xs line-through text-gray-300">
              {(Number(product.price) * 1.32).toFixed(0)} MDL
            </span>
          </div>
          <div className="px-2 py-1 bg-black/80 backdrop-blur-sm">
            <p className="text-lg font-bold text-white">
              {product.price} MDL
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
