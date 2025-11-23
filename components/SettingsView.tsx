'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Globe, Heart, MapPin, Palette, Check, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

interface SettingsViewProps {
  profile: any
  userId: string
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

const STYLES_MEN = [
  { id: 'casual', name: 'Casual', emoji: '👕' },
  { id: 'formal', name: 'Formal', emoji: '🤵' },
  { id: 'streetwear', name: 'Streetwear', emoji: '🧥' },
  { id: 'athletic', name: 'Athletic', emoji: '👟' }
]

const STYLES_WOMEN = [
  { id: 'casual', name: 'Casual', emoji: '👗' },
  { id: 'elegant', name: 'Elegant', emoji: '👠' },
  { id: 'boho', name: 'Boho', emoji: '🌸' },
  { id: 'sporty', name: 'Sporty', emoji: '👟' }
]

const MOLDOVA_LOCATIONS = [
  'Chișinău',
  'Bălți',
  'Tiraspol',
  'Bender (Tighina)',
  'Cahul',
  'Ungheni',
  'Soroca',
  'Orhei',
  'Comrat',
  'Ceadîr-Lunga',
  'Strășeni',
  'Edineț',
  'Căușeni'
]

export default function SettingsView({ profile, userId }: SettingsViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const t = useTranslations('settings')
  
  // Settings state
  const [language, setLanguage] = useState(profile.language || 'en')
  const [gender, setGender] = useState(profile.gender || '')
  const [style, setStyle] = useState(profile.style || '')
  const [location, setLocation] = useState(profile.location || '')
  const [theme, setTheme] = useState(profile.theme || 'light')

  // Get current theme for dynamic styling
  const isDark = theme === 'dark'

  const saveSettings = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          language,
          gender,
          style,
          location,
          theme
        })
      })

      if (response.ok) {
        // Apply theme immediately
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        document.documentElement.setAttribute('data-theme', theme)
        
        // Force reload to apply new language
        window.location.href = '/profile'
      } else {
        alert(t('saveError'))
        setSaving(false)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert(t('saveError'))
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm(t('logout') + '?')) return
    
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
      setLoggingOut(false)
    }
  }

  const styles = gender === 'man' ? STYLES_MEN : STYLES_WOMEN

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b px-4 py-3 ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/profile" className={`p-2 rounded-full ${
            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}>
            <ChevronLeft className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {t('title')}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Language Selector */}
        <div className={`border rounded-xl p-4 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              {t('language')}
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`
                  p-4 border-2 rounded-lg transition-all text-center
                  ${language === lang.code 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'}
                `}
              >
                <div className="text-3xl mb-1">{lang.flag}</div>
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>{lang.name}</div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-blue-500 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className={`border rounded-xl p-4 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('preferences')}</h2>
          </div>

          {/* Step 1: Gender */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('gender.title')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setGender('man')
                  setStyle('') // Reset style when gender changes
                }}
                className={`
                  p-4 border-2 rounded-lg transition-all
                  ${gender === 'man' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'}
                `}
              >
                <div className="text-3xl mb-1">👨</div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{t('gender.man')}</div>
              </button>
              <button
                onClick={() => {
                  setGender('woman')
                  setStyle('') // Reset style when gender changes
                }}
                className={`
                  p-4 border-2 rounded-lg transition-all
                  ${gender === 'woman' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'}
                `}
              >
                <div className="text-3xl mb-1">👩</div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{t('gender.woman')}</div>
              </button>
            </div>
          </div>

          {/* Step 2: Style (only show if gender selected) */}
          {gender && (
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('style.title')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`
                      p-4 border-2 rounded-lg transition-all
                      ${style === s.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'}
                    `}
                  >
                    <div className="text-3xl mb-1">{s.emoji}</div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{t(`style.${s.id}` as any)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          <div>
            <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <MapPin className="w-4 h-4" />
              {t('location.title')}
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-black'
              }`}
            >
              <option value="">{t('location.select')}</option>
              {MOLDOVA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className={`border rounded-xl p-4 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Palette className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('theme')}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`
                p-4 border-2 rounded-lg transition-all
                ${theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'}
              `}
            >
              <div className="text-3xl mb-1">☀️</div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{t('themeOptions.light')}</div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`
                p-4 border-2 rounded-lg transition-all
                ${theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'}
              `}
            >
              <div className="text-3xl mb-1">🌙</div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{t('themeOptions.dark')}</div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? t('saving') : t('save')}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-8"
        >
          <LogOut className="w-5 h-5" />
          {loggingOut ? t('loggingOut') : t('logout')}
        </button>
      </div>
    </div>
  )
}
