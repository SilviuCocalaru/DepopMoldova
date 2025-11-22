import { createBrowserClient } from '@supabase/ssr'

// Singleton instance - created once and reused across the entire app
let clientInstance: any = null

export function createClient() {
  // Return existing instance if already created
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '⚠️  Missing Supabase environment variables.\n' +
      'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.\n' +
      'See SETUP.md for instructions.'
    )
  }

  // Use @supabase/ssr's built-in cookie handling instead of localStorage
  // This ensures session is synced between client and server
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return document.cookie
          .split('; ')
          .filter(Boolean)
          .map(cookie => {
            const [name, ...value] = cookie.split('=')
            return { name, value: value.join('=') }
          })
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=${options?.path || '/'}; max-age=${options?.maxAge || 31536000}; SameSite=${options?.sameSite || 'Lax'}`
        })
      },
    },
  })

  return clientInstance
}

// Export a function that gets the client, not the client itself
export const getSupabaseClient = () => createClient()
