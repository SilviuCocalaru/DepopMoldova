import { createBrowserClient } from '@supabase/ssr'

// Singleton instance - created once and reused across the entire app
let clientInstance: any = null

export function createClient() {
  // Return existing instance if already created
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '⚠️  Missing Supabase environment variables.\n' +
      'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.\n' +
      'See SETUP.md for instructions.'
    )
  }

  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false, // DISABLED - causing lock contention, we'll handle manually if needed
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'pkce',
      storageKey: 'supabase.auth.token',
      debug: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'depop-moldova-web',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return clientInstance
}

// Export a function that gets the client, not the client itself
export const getSupabaseClient = () => createClient()
