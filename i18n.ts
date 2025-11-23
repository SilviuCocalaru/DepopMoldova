import { getRequestConfig } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

// Import all translations statically
import en from './messages/en.json';
import ro from './messages/ro.json';
import ru from './messages/ru.json';

const messages = { en, ro, ru } as const;

export default getRequestConfig(async () => {
  // Get the user's language preference from Supabase
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let locale: 'en' | 'ro' | 'ru' = 'en'; // Default language

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('language')
      .eq('id', user.id)
      .single();

    if (profile?.language && (profile.language === 'en' || profile.language === 'ro' || profile.language === 'ru')) {
      locale = profile.language;
    }
  }

  return {
    locale,
    messages: messages[locale],
  };
});
