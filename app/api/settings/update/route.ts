import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, language, gender, style, location, theme } = await request.json()

    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        language,
        gender,
        style,
        location,
        theme,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in settings update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
