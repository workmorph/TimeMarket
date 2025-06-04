import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { mockSupabaseClient } from './supabase/mock-client'
import { createClient as createServerClient } from './supabase/server'

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabaseクライアントの作成
let supabaseClient;

// 環境変数が設定されていない場合はモッククライアントを使用
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase環境変数が設定されていません。モッククライアントを使用します。')
  supabaseClient = mockSupabaseClient
} else {
  // 環境変数が設定されている場合は実際のSupabaseクライアントを作成
  supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

// サーバーサイドのクライアント作成関数をエクスポート
export { createServerClient as createClient }

// 型定義
export type Profile = {
  id: string
  user_id: string
  display_name: string
  bio?: string
  avatar_url?: string
  expertise_areas?: string[]
  verification_status: 'pending' | 'verified' | 'rejected'
  total_sessions: number
  average_rating: number
  response_rate: number
  created_at: string
  updated_at: string
}

export type Auction = {
  id: string
  title: string
  description: string
  expert_id: string
  starting_price: number
  current_highest_bid: number
  bid_count: number
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  ends_at: string
  duration_minutes: number
  service_type: 'consultation' | 'mentoring' | 'review' | 'teaching'
  delivery_method: 'online' | 'in_person' | 'phone' | 'chat'
  created_at: string
  updated_at: string
  expert?: Profile
}

export type Bid = {
  id: string
  auction_id: string
  bidder_id: string
  amount: number
  created_at: string
  bidder_name?: string
}
