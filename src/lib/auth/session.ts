import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // ユーザープロファイルから名前を取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single();
    
    // 名前の優先順位: display_name > username > user_metadata.username > emailの@前
    const name = profile?.display_name || 
                 profile?.username || 
                 user.user_metadata?.username ||
                 user.email?.split('@')[0];
    
    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: name || undefined,
      }
    };
  } catch (error) {
    console.error('getServerSession error:', error);
    return null;
  }
}