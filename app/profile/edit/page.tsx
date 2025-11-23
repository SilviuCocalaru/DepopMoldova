import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import Header from '@/components/Header'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const isDark = profile?.theme === 'dark'
  const t = await getTranslations('editProfile')

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors pb-32`}>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className={`text-2xl font-bold mb-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{t('title')}</h1>
        <ProfileEditForm profile={profile} isDark={isDark} />
      </div>
    </div>
  )
}
