import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
      ...session.user.user_metadata
    },
    session
  }
}