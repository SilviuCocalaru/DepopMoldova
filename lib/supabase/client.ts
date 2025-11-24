import { createBrowserClient } from '@supabase/ssr'

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

  // createBrowserClient from @supabase/ssr handles cookies and persistence automatically
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const getSupabaseClient = () => createClient()
