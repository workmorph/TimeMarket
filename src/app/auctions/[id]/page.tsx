'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
    Clock, Users, Calendar, MapPin, Star, Shield,
    TrendingUp, MessageCircle, ExternalLink, ChevronRight
} from 'lucide-react'
import { BidForm } from './bid-form'

// Mock data (後でAPI/propsに置換)
const mockAuction = {
    id: '1',
    title: 'Web開発におけるReact最適化コンサルティング',
    description: `
現在のReactアプリケーションのパフォーマンス問題を診断し、具体的な改善策をご提案します。

【対象となる方】
• Reactアプリの読み込みが遅くて困っている
• バンドルサイズが大きすぎる 
• レンダリングが重い箇所がある
• Next.jsへの移行を検討している

【提供内容】
1. 現状分析（20分）
2. 問題点の特定と原因解説（15分）
3. 具体的な改善案の提示（20分）
4. 質疑応答（5分）

【必要な準備】
• GitHubリポジトリのアクセス権限
• 現在の課題をまとめた資料

実際の開発現場で培った知見をもとに、実践的なアドバイスをいたします。
  `,
    current_highest_bid: 8500,
    starting_price: 5000,
    bid_count: 12,
    status: 'active',
    ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
    duration_minutes: 60,
    service_type: 'consultation',
    delivery_method: 'online',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expert: {
        id: 'expert1',
        display_name: '田中 太郎',
        avatar_url: '/avatars/expert1.jpg',
        bio: 'フロントエンド開発歴8年。React/Next.js専門。大手IT企業でのパフォーマンス改善経験多数。',
        verification_status: 'verified',
        expertise_areas: ['React', 'Next.js', 'Performance', 'Frontend'],
        total_sessions: 145,
        average_rating: 4.8,
        response_rate: 98
    }
}

// Mock bids data
const mockBids = [
    { id: '1', bidder_name: '山田*太', amount: 8500, created_at: '2025-06-01T10:30:00Z' },
    { id: '2', bidder_name: '佐藤*子', amount: 7000, created_at: '2025-06-01T10:25:00Z' },
    { id: '3', bidder_name: '鈴木*郎', amount: 6500, created_at: '2025-06-01T10:20:00Z' },
    { id: '4', bidder_name: '田中*美', amount: 5500, created_at: '2025-06-01T10:15:00Z' },
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    }).format(amount)
}

const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString))
}

const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const timeLeft = end - now

    if (timeLeft <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return { hours, minutes, seconds, total: timeLeft }
}

export function AuctionDetail() {
    const [auction] = useState(mockAuction)
    const [bids] = useState(mockBids)
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(auction.ends_at))

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeRemaining(auction.ends_at))
        }, 1000)

        return () => clearInterval(timer)
    }, [auction.ends_at])

    const isActive = auction.status === 'active' && timeLeft.total > 0

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <a href="/auctions" className="hover:text-blue-600">オークション一覧</a>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 truncate">{auction.title}</span>
                </nav>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* タイトル・ステータス */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Badge variant={isActive ? 'default' : 'secondary'}>
                                            {isActive ? '開催中' : '終了'}
                                        </Badge>
                                        <Badge variant="outline">
                                            {auction.service_type === 'consultation' ? 'コンサル' : auction.service_type}
                                        </Badge>
                                        <Badge variant="outline">
                                            {auction.delivery_method === 'online' ? 'オンライン' : auction.delivery_method}
                                        </Badge>
                                    </div>

                                    {isActive && (
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">残り時間</div>
                                            <div className="text-lg font-bold text-red-600 font-mono">
                                                {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <CardTitle className="text-2xl leading-tight">
                                    {auction.title}
                                </CardTitle>

                                {/* 現在価格・入札状況 */}
                                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mt-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">現在価格</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {formatCurrency(auction.current_highest_bid)}
                                        </div>
                                        <div className="flex items-center text-sm text-green-600">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            開始価格から +{formatCurrency(auction.current_highest_bid - auction.starting_price)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-lg font-semibold">
                                            <Users className="w-5 h-5 mr-2" />
                                            {auction.bid_count} 入札
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            開始価格: {formatCurrency(auction.starting_price)}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* サービス詳細 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>サービス詳細</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                                        {auction.description}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>セッション時間: {auction.duration_minutes}分</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>開始: {formatDateTime(auction.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>実施方法: オンライン (Zoom/Meet)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                                        <span>言語: 日本語</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 専門家情報 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>専門家について</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={auction.expert.avatar_url} alt={auction.expert.display_name} />
                                        <AvatarFallback className="bg-blue-600 text-white text-lg">
                                            {auction.expert.display_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{auction.expert.display_name}</h3>
                                            {auction.expert.verification_status === 'verified' && (
                                                <div className="flex items-center gap-1">
                                                    <Shield className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-medium">認証済み</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-3">{auction.expert.bio}</p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>{auction.expert.average_rating} (145件)</span>
                                            </div>
                                            <div>{auction.expert.total_sessions}回のセッション実績</div>
                                            <div>回答率 {auction.expert.response_rate}%</div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {auction.expert.expertise_areas.map((area) => (
                                                <Badge key={area} variant="secondary" className="text-xs">
                                                    {area}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        プロフィールを詳しく見る
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 入札履歴 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>入札履歴</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {bids.map((bid, index) => (
                                        <div key={bid.id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium">{bid.bidder_name}</span>
                                                {index === 0 && (
                                                    <Badge variant="default" className="text-xs">最高額</Badge>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{formatCurrency(bid.amount)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDateTime(bid.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* サイドバー - 入札フォーム */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BidForm auction={auction} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}