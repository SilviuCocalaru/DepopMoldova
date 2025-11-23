'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get email from URL params or session storage
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    
    if (emailParam) {
      setEmail(emailParam)
      sessionStorage.setItem('pendingEmail', emailParam)
    } else {
      const storedEmail = sessionStorage.getItem('pendingEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }

    // Check if user is already confirmed
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setConfirmed(true)
        sessionStorage.removeItem('pendingEmail')
        
        // Wait for profile to be created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to home
        router.push('/')
        router.refresh()
      }
    }
    
    checkUser()

    // Listen for auth state changes (email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('Auth event:', event, 'Session:', session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setConfirmed(true)
        sessionStorage.removeItem('pendingEmail')
        
        // Wait for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to home
        router.push('/')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleResendEmail = async () => {
    if (!email) {
      setError('No email address found')
      return
    }

    setError(null)
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (resendError) {
      setError(resendError.message)
    } else {
      alert('Confirmation email resent! Check your inbox.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
          {!confirmed ? (
            <>
              {/* Email Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>

              {/* Title */}
              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                Check your email
              </h2>
              
              {email && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                  We sent a confirmation link to:
                  <span className="block font-semibold text-gray-900 dark:text-gray-100 mt-1">{email}</span>
                </p>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  What's next?
                </h3>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Find the confirmation email from Depop Moldova</li>
                  <li>Click the confirmation link</li>
                  <li>You'll be automatically redirected back here and logged in</li>
                </ol>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resend Email Button */}
              <button
                onClick={handleResendEmail}
                className="w-full flex justify-center py-2 px-4 border border-indigo-600 dark:border-indigo-400 rounded-md shadow-sm text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4 transition-colors"
              >
                Resend confirmation email
              </button>

              {/* Help Text */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Can't find the email? Check your spam folder or{' '}
                <button
                  onClick={handleResendEmail}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                >
                  resend it
                </button>
              </p>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <a
                  href="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  ← Back to login
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                Email confirmed!
              </h2>
              
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Your account has been verified. Redirecting you to the app...
              </p>

              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              </div>

              <button
                onClick={() => {
                  router.push('/')
                  router.refresh()
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Continue to App
              </button>
            </>
          )}
        </div>

        {/* Additional Info */}
        {!confirmed && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already confirmed?{' '}
              <button
                onClick={() => {
                  router.push('/login')
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Go to login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
