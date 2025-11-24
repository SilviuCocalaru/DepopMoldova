import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import Header from '@/components/Header'
import HomeView from '@/components/HomeView'
import LandingPage from '@/components/LandingPage'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // If NOT logged in, show landing page
  if (!user) {
    return <LandingPage />
  }
  
  // Get user's theme preference
  let theme: 'light' | 'dark' = 'light'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme')
      .eq('id', user.id)
      .single()
    
    theme = (profile?.theme as 'light' | 'dark') || 'light'
  }
  
  const isDark = theme === 'dark'
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (username, avatar_url),
      likes (user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className={`min-h-screen transition-colors pt-16 md:pt-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Desktop Header Only */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Main content */}
      <HomeView products={products || []} isDark={isDark} userId={user.id} />
    </div>
  )
}

