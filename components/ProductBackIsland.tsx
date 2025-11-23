'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProductBackIslandProps {
  isDark: boolean
}

export default function ProductBackIsland({ isDark }: ProductBackIslandProps) {
  const router = useRouter()
  const tCommon = useTranslations('common')

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => router.back()}
        className={`
          px-6 py-3 rounded-full
          ${isDark ? 'bg-gray-800/75 border-gray-700/30' : 'bg-white/75 border-gray-200/30'}
          backdrop-blur-[16px] backdrop-saturate-[180%]
          border
          shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]
          flex items-center gap-2
          transition-all duration-200
          hover:scale-105
          active:scale-95
        `}
      >
        <ArrowLeft className={`w-4 h-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {tCommon('back')}
        </span>
      </button>
    </div>
  )
}
