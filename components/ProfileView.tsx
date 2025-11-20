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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <span className="text-4xl font-semibold text-gray-600">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">@{profile.username}</h1>
                {isOwnProfile && (
                  <button className="p-2 text-gray-600 hover:text-indigo-600">
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>

              {profile.full_name && (
                <p className="text-gray-700 mb-2">{profile.full_name}</p>
              )}

              {profile.bio && (
                <p className="text-gray-600 mb-2">{profile.bio}</p>
              )}

              {profile.location && (
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Selling</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">{sellingProducts.length}</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Sold</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">{soldProducts.length}</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <span className="text-xs">❤️ Total Likes</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">{totalLikes}</span>
                </div>
                
                {isOwnProfile && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <span className="text-xs">💰 Revenue</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900">${totalRevenue.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Logout Button for Own Profile */}
              {isOwnProfile && (
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('selling')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'selling'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Selling ({sellingProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sold'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sold ({soldProducts.length})
            </button>
          </nav>
        </div>

        {/* Products Grid */}
        {activeTab === 'selling' ? (
          sellingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sellingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, profiles: profile }}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isOwnProfile ? "You haven't listed any items yet" : 'No items listed'}
              </p>
            </div>
          )
        ) : (
          soldProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {soldProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, profiles: profile }}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sold items</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
