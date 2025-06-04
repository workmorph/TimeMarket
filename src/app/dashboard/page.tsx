'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AuctionListCard } from '@/components/auction/AuctionListCard'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { 
  TrendingUp, Users, Calendar, 
  Wallet, PlusCircle 
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

// モックデータ（後でAPIから取得）
const mockStats = {
  totalEarnings: 125000,
  activeAuctions: 5,
  completedAuctions: 12,
  totalBids: 87,
  averageBidAmount: 7500,
  winRate: 65,
  upcomingSessions: 3
}

// モックオークションデータ（後でAPIから取得）
const mockAuctions = [
  {
    id: '1',
    title: 'Web開発におけるReact最適化コンサルティング',
    current_highest_bid: 8500,
    starting_price: 5000,
    bid_count: 12,
    status: 'active',
    ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
    duration_minutes: 60,
    expert: {
      id: 'expert1',
      display_name: '田中 太郎',
      avatar_url: '/avatars/expert1.jpg',
      average_rating: 4.8,
      verification_status: 'verified'
    }
  },
  {
    id: '2',
    title: 'TypeScriptプロジェクト移行サポート',
    current_highest_bid: 12000,
    starting_price: 8000,
    bid_count: 8,
    status: 'active',
    ends_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5時間後
    duration_minutes: 90,
    expert: {
      id: 'expert2',
      display_name: '佐藤 花子',
      avatar_url: '/avatars/expert2.jpg',
      average_rating: 4.9,
      verification_status: 'verified'
    }
  },
  {
    id: '3',
    title: 'AIを活用したプロダクト戦略相談',
    current_highest_bid: 15000,
    starting_price: 10000,
    bid_count: 5,
    status: 'active',
    ends_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12時間後
    duration_minutes: 60,
    expert: {
      id: 'expert3',
      display_name: '鈴木 一郎',
      avatar_url: '/avatars/expert3.jpg',
      average_rating: 4.7,
      verification_status: 'verified'
    }
  }
]

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [auctions, setAuctions] = useState(mockAuctions)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // APIからデータを取得する処理（モック）
    const fetchData = async () => {
      try {
        // 実際のAPIコール
        // const statsResponse = await fetch('/api/dashboard/stats')
        // const auctionsResponse = await fetch('/api/dashboard/auctions')
        // const statsData = await statsResponse.json()
        // const auctionsData = await auctionsResponse.json()
        // setStats(statsData)
        // setAuctions(auctionsData)
        
        // モックデータ使用（遅延をシミュレート）
        setTimeout(() => {
          setStats(mockStats)
          setAuctions(mockAuctions)
          setIsLoading(false)
        }, 500)
      } catch (err) {
        console.error('ダッシュボードデータの取得に失敗しました', err)
        setError(err instanceof Error ? err : new Error('データの取得に失敗しました'))
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-gray-500 mt-1">アカウント概要とアクティビティ</p>
        </div>
        <Link href="/auctions/create">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            新規オークション作成
          </Button>
        </Link>
      </div>

      {error ? (
        <ErrorState 
          error={error} 
          retry={() => {
            setError(null)
            setIsLoading(true)
            window.location.reload()
          }}
          variant="page"
        />
      ) : isLoading ? (
        <LoadingState 
          variant="spinner" 
          size="lg" 
          message="ダッシュボードを読み込んでいます..."
          className="h-64"
        />
      ) : (
        <>
          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-blue-600"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">総収益</CardTitle>
                <div className="p-2 rounded-full bg-blue-50">
                  <Wallet className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
                <div className="flex items-center text-xs text-green-600 font-medium mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  前月比 +12%
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-purple-600"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">アクティブオークション</CardTitle>
                <div className="p-2 rounded-full bg-purple-50">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  完了済み: {stats.completedAuctions}
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-amber-600"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">総入札数</CardTitle>
                <div className="p-2 rounded-full bg-amber-50">
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBids}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  平均: {formatCurrency(stats.averageBidAmount)}/件
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-emerald-600"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">予定セッション</CardTitle>
                <div className="p-2 rounded-full bg-emerald-50">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  今週: 2件 / 来週: 1件
                </div>
              </CardContent>
            </Card>
          </div>

          {/* アクティブオークション */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">アクティブオークション</h2>
              <Link href="/auctions">
                <Button variant="outline" size="sm">
                  すべて見る
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionListCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
