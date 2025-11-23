'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Globe, Heart, MapPin, Palette, Check } from 'lucide-react'
import Link from 'next/link'

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
  const [saving, setSaving] = useState(false)
  
  // Settings state
  const [language, setLanguage] = useState(profile.language || 'en')
  const [gender, setGender] = useState(profile.gender || '')
  const [style, setStyle] = useState(profile.style || '')
  const [location, setLocation] = useState(profile.location || '')
  const [theme, setTheme] = useState(profile.theme || 'light')

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
        
        // Reload page to apply all changes
        window.location.reload()
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const styles = gender === 'man' ? STYLES_MEN : STYLES_WOMEN

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Language Selector */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">Language</h2>
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
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
              >
                <div className="text-3xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.name}</div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-blue-500 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>

          {/* Step 1: Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I am a...
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
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
              >
                <div className="text-3xl mb-1">👨</div>
                <div className="font-medium">Man</div>
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
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
              >
                <div className="text-3xl mb-1">👩</div>
                <div className="font-medium">Woman</div>
              </button>
            </div>
          </div>

          {/* Step 2: Style (only show if gender selected) */}
          {gender && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                My style
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
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                    `}
                  >
                    <div className="text-3xl mb-1">{s.emoji}</div>
                    <div className="font-medium">{s.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Where are you from?
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-black dark:text-white transition-colors"
            >
              <option value="">Select location</option>
              {MOLDOVA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">Theme</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`
                p-4 border-2 rounded-lg transition-all
                ${theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <div className="text-3xl mb-1">☀️</div>
              <div className="font-medium">Light</div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`
                p-4 border-2 rounded-lg transition-all
                ${theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <div className="text-3xl mb-1">🌙</div>
              <div className="font-medium">Dark</div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
