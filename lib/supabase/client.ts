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

  // createBrowserClient from @supabase/ssr handles cookies automatically
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return clientInstance
}

export const getSupabaseClient = () => createClient()
