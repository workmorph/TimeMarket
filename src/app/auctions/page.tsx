'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AuctionListCard } from '@/components/auction/AuctionListCard'
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Array<{
    id: string
    title: string
    current_highest_bid: number
    starting_price: number
    bid_count: number
    status: string
    ends_at: string
    duration_minutes: number
    expert: {
      id: string
      display_name: string
      avatar_url: string
      average_rating: number
      verification_status: string
    }
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        // オークションデータを取得
        let query = supabase
          .from('auctions')
          .select(`
            *,
            expert:expert_id(
              id,
              display_name,
              avatar_url,
              average_rating,
              verification_status
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
        
        // 検索クエリがある場合はフィルタリング
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`)
        }
        
        const { data, error } = await query
        
        if (error) {
          throw error
        }
        
        setAuctions(data || [])
      } catch (err: Error | unknown) {
        console.error('オークションデータの取得に失敗しました', err)
        setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAuctions()
    
    // リアルタイム更新のサブスクリプション
    const supabase = createClient()
    const subscription = supabase
      .channel('auctions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'auctions'
      }, () => {
        // データが変更されたら再取得
        fetchAuctions()
      })
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [searchQuery])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">オークション一覧</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="オークションを検索..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {user && (
            <Link href="/auctions/create">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                新規作成
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {!isLoading && `${auctions.length}件のオークションが見つかりました`}
        </div>
        
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          フィルター
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>エラーが発生しました: {error}</p>
          <p>再読み込みしてください</p>
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">オークションが見つかりません</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? '検索条件に一致するオークションがありません' : 'アクティブなオークションがありません'}
          </p>
          {user && (
            <Link href="/auctions/create">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                オークションを作成する
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionListCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  )
}
