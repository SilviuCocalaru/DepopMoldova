'use client'

import Link from 'next/link'
import { DollarSign, Leaf, MapPin, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LandingPage() {
  const t = useTranslations('landing')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="px-6 pt-20 pb-12 text-center">
        <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-6">
          🇲🇩 {t('madeInMoldova')}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('heroTitle')}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/signup"
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            {t('getStarted')}
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-white text-black border-2 border-black rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            {t('learnMore')}
          </a>
        </div>

        {/* Hero Visual - Placeholder */}
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-6xl">
            👗
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">{t('whyChooseUs')}</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* No Fees */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.noFees.title')}</h3>
            <p className="text-gray-600">{t('features.noFees.description')}</p>
          </div>

          {/* Local */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.local.title')}</h3>
            <p className="text-gray-600">{t('features.local.description')}</p>
          </div>

          {/* Sustainable */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.sustainable.title')}</h3>
            <p className="text-gray-600">{t('features.sustainable.description')}</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('steps.step1.title')}</h3>
              <p className="text-gray-600">{t('steps.step1.description')}</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('steps.step2.title')}</h3>
              <p className="text-gray-600">{t('steps.step2.description')}</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('steps.step3.title')}</h3>
              <p className="text-gray-600">{t('steps.step3.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">0%</div>
            <div className="text-gray-400">{t('stats.fees')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">🇲🇩</div>
            <div className="text-gray-400">{t('stats.local')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">
              <Users className="w-10 h-10 inline" />
            </div>
            <div className="text-gray-400">{t('stats.community')}</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {t('cta.subtitle')}
        </p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
        >
          {t('cta.button')}
        </Link>
      </div>
    </div>
  )
}
