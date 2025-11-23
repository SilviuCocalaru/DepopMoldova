'use client'

import { Database } from '@/types/database.types'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, MessageCircle, ChevronLeft, ChevronRight, ArrowLeft, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ProductBackIsland from './ProductBackIsland'

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
  likes: { user_id: string }[]
}

interface ProductDetailProps {
  product: Product
  currentUserId?: string
  theme: 'light' | 'dark'
}

export default function ProductDetail({ product, currentUserId, theme }: ProductDetailProps) {
  const isDark = theme === 'dark'
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(
    currentUserId ? product.likes.some(like => like.user_id === currentUserId) : false
  )
  const [likesCount, setLikesCount] = useState(product.likes.length)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const t = useTranslations('productPage')
  const tCommon = useTranslations('common')

  const isOwnProduct = currentUserId === product.seller_id

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

  const handleDelete = async () => {
    if (!currentUserId || !isOwnProduct) {
      return
    }

    const confirmed = window.confirm(t('deleteConfirm'))
    if (!confirmed) return

    setIsDeleting(true)

    try {
      // Delete product images from storage if they exist
      if (product.images && product.images.length > 0) {
        const imagePaths = product.images.map(url => {
          const path = url.split('/').pop()
          return `products/${path}`
        })
        
        await supabase.storage
          .from('product-images')
          .remove(imagePaths)
      }

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(t('deleteError'))
      setIsDeleting(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Desktop Only */}
        <button
          onClick={() => router.back()}
          className={`hidden md:flex items-center gap-2 mb-6 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{tCommon('back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className={`relative aspect-square rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
                      <span className="text-white font-bold text-3xl">{t('sold')}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
            <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{product.title}</h1>
            <p className={`text-4xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>${product.price}</p>

            {/* Seller Info */}
            <Link
              href={`/profile/${product.seller_id}`}
              className={`flex items-center space-x-3 mb-6 p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                {product.profiles?.avatar_url ? (
                  <Image
                    src={product.profiles.avatar_url}
                    alt={product.profiles.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <span className={`text-xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.profiles?.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{product.profiles?.username}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('viewProfile')}</p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {!isOwnProduct ? (
                <>
                  <button
                    onClick={handleLike}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLiked
                        ? 'bg-red-50 text-red-600 border-2 border-red-600'
                        : isDark
                        ? 'bg-gray-700 text-gray-200 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 inline mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? t('liked') : t('like')} ({likesCount})
                  </button>
                  <button
                    onClick={handleMessage}
                    disabled={product.is_sold}
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5 inline mr-2" />
                    {t('message')}
                  </button>
                </>
              ) : (
                <div className="flex gap-3 w-full">
                  <Link
                    href={`/sell?edit=${product.id}`}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-center ${
                      isDark
                        ? 'bg-gray-700 text-gray-200 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Edit className="w-5 h-5 inline mr-2" />
                    {t('editListing')}
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isDark
                        ? 'bg-red-900 text-red-100 hover:bg-red-800 disabled:bg-red-900/50'
                        : 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400'
                    } disabled:cursor-not-allowed`}
                  >
                    <Trash2 className="w-5 h-5 inline mr-2" />
                    {isDeleting ? t('deleting') : t('deleteListing')}
                  </button>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={`rounded-lg p-6 space-y-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{t('productDetails')}</h2>
              
              {product.description && (
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('description')}</p>
                  <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('category')}</p>
                  <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('condition')}</p>
                  <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.condition}</p>
                </div>
                {product.size && (
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('size')}</p>
                    <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.size}</p>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('brand')}</p>
                    <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.brand}</p>
                  </div>
                )}
              </div>

              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('listed')}</p>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} suppressHydrationWarning>
                  {new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back Button Island - Mobile Only */}
      <ProductBackIsland isDark={isDark} />
    </div>
  )
}
