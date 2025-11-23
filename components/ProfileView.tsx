'use client'

import { Database } from '@/types/database.types'
import Image from 'next/image'
import { useState } from 'react'
import { MapPin, Edit, LogOut, Package, TrendingUp } from 'lucide-react'
import ProductCard from './ProductCard'
import Header from './Header'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = Database['public']['Tables']['profiles']['Row']
type Product = Database['public']['Tables']['products']['Row'] & {
  likes: { user_id: string }[]
}

interface ProfileViewProps {
  profile: Profile
  products: Product[]
  isOwnProfile: boolean
  currentUserId?: string
}

export default function ProfileView({ profile, products, isOwnProfile, currentUserId }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'selling' | 'sold'>('selling')
  const supabase = createClient()
  const router = useRouter()

  const sellingProducts = products.filter(p => !p.is_sold)
  const soldProducts = products.filter(p => p.is_sold)
  
  const totalLikes = products.reduce((sum, product) => sum + (product.likes?.length || 0), 0)
  const totalRevenue = soldProducts.reduce((sum, product) => sum + Number(product.price), 0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-32">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-semibold text-gray-600 dark:text-gray-300">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">@{profile.username}</h1>
                {isOwnProfile && (
                  <button className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>

              {profile.full_name && (
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">{profile.full_name}</p>
              )}

              {profile.bio && (
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2">{profile.bio}</p>
              )}

              {profile.location && (
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  {profile.location}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 md:p-3 transition-colors">
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs">Selling</span>
                  </div>
                  <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">{sellingProducts.length}</span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 md:p-3 transition-colors">
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs">Sold</span>
                  </div>
                  <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">{soldProducts.length}</span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 md:p-3 transition-colors">
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <span className="text-xs">❤️ Total Likes</span>
                  </div>
                  <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">{totalLikes}</span>
                </div>
                
                {isOwnProfile && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 md:p-3 transition-colors">
                    <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 dark:text-gray-400 mb-1">
                      <span className="text-xs">💰 Revenue</span>
                    </div>
                    <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">${totalRevenue.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Logout Button for Own Profile */}
              {isOwnProfile && (
                <button
                  onClick={handleLogout}
                  className="mt-3 md:mt-4 flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-6 transition-colors">
          <nav className="flex gap-4 md:gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('selling')}
              className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'selling'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Selling ({sellingProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'sold'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Sold ({soldProducts.length})
            </button>
          </nav>
        </div>

        {/* Products Grid */}
        {activeTab === 'selling' ? (
          sellingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {sellingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, profiles: profile }}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg">
                {isOwnProfile ? "You haven't listed any items yet" : 'No items listed'}
              </p>
            </div>
          )
        ) : (
          soldProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {soldProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, profiles: profile }}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg">No sold items</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
