'use client'

import Link from 'next/link'
import { DollarSign, Leaf, MapPin, Users, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LandingPage() {
  const t = useTranslations('landing')

  return (
    <div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Abstract Background Blobs - Optimized */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[80px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 pt-20 pb-12 text-center max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm mb-6 hover:scale-105 transition-transform cursor-default">
            <span className="text-lg">🇲🇩</span>
            <span className="text-sm font-semibold text-gray-800 tracking-wide uppercase">{t('madeInMoldova')}</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
            <span className="block">{t('heroTitle').split('.')[0]}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {t('heroTitle').split('.').slice(1).join('.')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {t('getStarted')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/50 text-gray-900 border border-white/60 rounded-full font-bold text-lg hover:bg-white/80 transition-all backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('learnMore')}
            </a>
          </div>

          {/* Glassmorphism App Preview */}
          <div className="relative max-w-5xl mx-auto mt-8 perspective-1000">
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-2xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="h-2 w-20 bg-gray-400/20 rounded-full" />
              </div>
              
              {/* Mockup Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">🧥</div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-900/10 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-900/5 rounded" />
                </div>
                {/* Card 2 */}
                <div className="bg-white/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow hidden md:block">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-yellow-100 opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">👟</div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-900/10 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-900/5 rounded" />
                </div>
                {/* Card 3 */}
                <div className="bg-white/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow hidden md:block">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-red-100 opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">👜</div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-900/10 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-900/5 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="px-6 py-24 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{t('whyChooseUs')}</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('features.noFees.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('features.noFees.description')}</p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 -rotate-3 group-hover:-rotate-6">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('features.local.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('features.local.description')}</p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('features.sustainable.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('features.sustainable.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Glass Strip */}
        <div className="px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-[2.5rem] bg-gray-900 text-white p-12 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
              
              <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                <div className="pt-4 md:pt-0">
                  <div className="text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">0%</div>
                  <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{t('stats.fees')}</div>
                </div>
                <div className="pt-8 md:pt-0">
                  <div className="text-5xl font-black mb-2">🇲🇩</div>
                  <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{t('stats.local')}</div>
                </div>
                <div className="pt-8 md:pt-0">
                  <div className="text-5xl font-black mb-2 flex justify-center items-center gap-2">
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{t('stats.community')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900">{t('howItWorks')}</h2>
            
            <div className="space-y-6">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="group flex items-center gap-6 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 transition-colors shadow-sm hover:shadow-md">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{t(`steps.step${step}.title`)}</h3>
                    <p className="text-gray-600">{t(`steps.step${step}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 pb-24 pt-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 rounded-[3rem] bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-300 animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {t('cta.title')}
                </h2>
                <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
                  {t('cta.subtitle')}
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-12 py-5 bg-white text-blue-600 rounded-full font-bold text-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {t('cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
