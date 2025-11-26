'use client'

import Link from 'next/link'
import { ShoppingBag, Video } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslations } from 'next-intl'

export default function SellChoicePage() {
  const { isDark } = useTheme()
  const t = useTranslations('sell')

  return (
    <div className="main-content min-h-screen max-w-4xl mx-auto px-4">
      <div className="py-8">
        <h1 className={`text-3xl font-bold text-center mb-3 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {t('chooseOption')}
        </h1>
        <p className={`text-center mb-12 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('chooseDescription')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* List Item Option */}
          <Link
            href="/sell/list"
            className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 p-6 rounded-full ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <ShoppingBag className={`w-12 h-12 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {t('listItem')}
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('listDescription')}
              </p>
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
              isDark ? 'bg-blue-500' : 'bg-blue-600'
            }`} />
          </Link>

          {/* Create Reel Option */}
          <Link
            href="/sell/reel"
            className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark
                ? 'bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-700 hover:border-pink-500'
                : 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 hover:border-pink-500'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 p-6 rounded-full ${
                isDark ? 'bg-pink-500/20' : 'bg-pink-100'
              }`}>
                <Video className={`w-12 h-12 ${
                  isDark ? 'text-pink-400' : 'text-pink-600'
                }`} />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {t('createReel')}
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('reelDescription')}
              </p>
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
              isDark ? 'bg-pink-500' : 'bg-pink-600'
            }`} />
          </Link>
        </div>
      </div>
    </div>
  )
}
