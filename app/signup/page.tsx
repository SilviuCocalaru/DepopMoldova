'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

export default function SignupPage() {
  const isDark = false // Force light theme on signup page
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Signup failed - no user returned')
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data.user.identities && data.user.identities.length === 0) {
        // Email already exists
        setError('This email is already registered. Please login instead.')
        setLoading(false)
        return
      }

      // Check if user needs to confirm email
      const session = data.session
      
      if (!session) {
        // Email confirmation required - redirect to confirmation page
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`)
        return
      }

      // User is auto-confirmed (email confirmation disabled)
      // Wait a moment for the auth user to be fully committed and trigger to fire
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if profile already exists (created by trigger)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (existingProfile) {
        // Profile exists (created by trigger), just update it with user's chosen data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username,
            full_name: fullName,
          })
          .eq('id', data.user.id)

        if (updateError) {
          console.warn('Could not update profile, but signup succeeded:', updateError)
        }
      } else {
        // Profile doesn't exist, create it (fallback if trigger isn't installed)
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            full_name: fullName,
          })

        if (insertError) {
          console.warn('Could not create profile, but signup succeeded:', insertError)
        }
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
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
            Create Account
          </h2>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </a>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-xl bg-red-50/80 border border-red-100 p-4 backdrop-blur-sm">
              <div className="text-sm text-red-600 font-medium text-center">{error}</div>
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Full Name (optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}
