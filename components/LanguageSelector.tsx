'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange?: (lang: string) => void
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' }
]

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [localLang, setLocalLang] = useState(currentLanguage)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('preferredLanguage')
    if (stored) {
      setLocalLang(stored)
    }
  }, [])

  const activeLangCode = mounted ? localLang : currentLanguage
  const currentLang = LANGUAGES.find(l => l.code === activeLangCode) || LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = async (langCode: string) => {
    // Save language preference to localStorage for non-logged users
    localStorage.setItem('preferredLanguage', langCode)
    // Set cookie for server-side rendering
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`
    
    // If callback provided, use it (for logged-in users to update in DB)
    if (onLanguageChange) {
      onLanguageChange(langCode)
    }
    
    // Reload page to apply new language
    window.location.reload()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button Island */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          h-[44px] rounded-full
          bg-white/75 backdrop-blur-[16px] backdrop-saturate-[180%]
          border border-gray-200/30
          shadow-[0_2px_12px_0_rgba(0,0,0,0.04)]
          flex items-center px-4 gap-2
          hover:bg-white/90 transition-all
          ${isOpen ? 'shadow-[0_4px_24px_0_rgba(0,0,0,0.08)]' : ''}
        `}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">{currentLang.flag}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 min-w-[160px] py-2 animate-slide-down rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-100/80 transition-colors ${
                currentLanguage === lang.code ? 'bg-blue-50/80' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium text-gray-700">{lang.nativeName}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
