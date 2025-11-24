'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#F3F4F6] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse-slow delay-1000" />

      <div className="w-full max-w-md p-8 mx-4 relative z-10 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {t('signInTitle')}
          </h2>
          <p className="text-sm text-gray-600">
            Or{' '}
            <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              {t('createAccount')}
            </a>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-xl bg-red-50/80 border border-red-100 p-4 backdrop-blur-sm">
              <div className="text-sm text-red-600 font-medium text-center">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? t('signingIn') : t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}
