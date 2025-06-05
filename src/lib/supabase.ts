import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// ブラウザ用クライアント
export const supabase = createClientComponentClient()

// デフォルトエクスポート
export default supabase
