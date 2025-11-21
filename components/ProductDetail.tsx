'use client'

import { Database } from '@/types/database.types'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, MessageCircle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
  likes: { user_id: string }[]
}

interface ProductDetailProps {
  product: Product
  currentUserId?: string
}

export default function ProductDetail({ product, currentUserId }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(
    currentUserId ? product.likes.some(like => like.user_id === currentUserId) : false
  )
  const [likesCount, setLikesCount] = useState(product.likes.length)
  const supabase = createClient()
  const router = useRouter()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleLike = async () => {
    if (!currentUserId) {
      router.push('/login')
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

  const handleMessage = () => {
    if (!currentUserId) {
      router.push('/login')
      return
    }
    router.push(`/messages?user=${product.seller_id}&product=${product.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Desktop Only */}
        <button
          onClick={() => router.back()}
          className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.images.length > 0 ? (
                <>
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  {product.is_sold && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">SOLD</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-4xl font-bold text-gray-900 mb-6">${product.price}</p>

            {/* Seller Info */}
            <Link
              href={`/profile/${product.seller_id}`}
              className="flex items-center space-x-3 mb-6 hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {product.profiles?.avatar_url ? (
                  <Image
                    src={product.profiles.avatar_url}
                    alt={product.profiles.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {product.profiles?.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.profiles?.username}</p>
                <p className="text-sm text-gray-500">View profile</p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleLike}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border-2 border-red-600'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 inline mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'} ({likesCount})
              </button>
              <button
                onClick={handleMessage}
                disabled={product.is_sold || currentUserId === product.seller_id}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Message
              </button>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              
              {product.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-gray-600 mt-1">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Condition</p>
                  <p className="text-gray-600 mt-1">{product.condition}</p>
                </div>
                {product.size && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Size</p>
                    <p className="text-gray-600 mt-1">{product.size}</p>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Brand</p>
                    <p className="text-gray-600 mt-1">{product.brand}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Listed</p>
                <p className="text-gray-600 mt-1" suppressHydrationWarning>
                  {new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
