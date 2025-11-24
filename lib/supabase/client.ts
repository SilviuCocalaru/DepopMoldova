import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '⚠️  Missing Supabase environment variables.\n' +
      'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.\n' +
      'See SETUP.md for instructions.'
    )
  }

  // Return existing instance if available (singleton pattern)
  if (clientInstance) {
    return clientInstance
  }

  // createBrowserClient from @supabase/ssr handles cookies and persistence automatically
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })
  
  return clientInstance
}

export const getSupabaseClient = () => createClient()
