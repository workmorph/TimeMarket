'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
    Clock, Users, Calendar, MapPin, Star, Shield,
    TrendingUp, MessageCircle, ExternalLink, ChevronRight,
    Loader2
} from 'lucide-react'
import { BidForm } from './bid-form'
import { useRealtimeAuction } from '@/hooks/use-realtime-auction'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getTimeRemaining, formatCurrency, formatDateTime } from '@/lib/utils'

// フォールバック用のモックデータ（データ取得前に表示するため）
const fallbackAuction = {
    id: '',
    title: 'オークション情報を読み込み中...',
    description: 'データを取得しています...',
    current_highest_bid: 0,
    starting_price: 0,
    bid_count: 0,
    status: 'active',
    ends_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    duration_minutes: 60,
    service_type: 'consultation',
    delivery_method: 'online',
    created_at: new Date().toISOString(),
    expert: {
        id: '',
        display_name: '読み込み中...',
        avatar_url: '',
        bio: '',
        verification_status: 'pending',
        expertise_areas: [],
        total_sessions: 0,
        average_rating: 0,
        response_rate: 0
    }
}

// utils.tsからフォーマット関数をインポートしたので、ここでの定義は不要

export function AuctionDetail({ auctionId }: { auctionId: string }) {
    const { user } = useAuth()
    const { auction, bids, isLoading, error, placeBid } = useRealtimeAuction(auctionId)
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(auction?.ends_at ?? fallbackAuction.ends_at))

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeRemaining(auction?.ends_at ?? fallbackAuction.ends_at))
        }, 1000)

        return () => clearInterval(timer)
    }, [auction?.ends_at])

    // データが読み込まれるまではフォールバックを使用
    const currentAuction = auction || fallbackAuction
    const isActive = currentAuction.status === 'active' && timeLeft.total > 0

    // エラー表示
    if (error && !isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">エラーが発生しました</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <Button className="mt-4" onClick={() => window.location.reload()}>
                            再読み込み
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="mt-2 text-gray-600">オークション情報を読み込み中...</p>
                        </div>
                    </div>
                )}
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
                                            {formatCurrency(currentAuction.current_highest_bid)}
                                        </div>
                                        <div className="flex items-center text-sm text-green-600">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            開始価格から +{formatCurrency(currentAuction.current_highest_bid - currentAuction.starting_price)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-lg font-semibold">
                                            <Users className="w-5 h-5 mr-2" />
                                            {currentAuction.bid_count} 入札
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            開始価格: {formatCurrency(currentAuction.starting_price)}
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
                                        {currentAuction.description}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>セッション時間: {currentAuction.duration_minutes}分</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>開始: {formatDateTime(currentAuction.created_at)}</span>
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
                                        <AvatarImage src={currentAuction.expert?.avatar_url} alt={currentAuction.expert?.display_name} />
                                        <AvatarFallback className="bg-blue-600 text-white text-lg">
                                            {currentAuction.expert?.display_name.charAt(0) || '?'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{currentAuction.expert?.display_name}</h3>
                                            {currentAuction.expert?.verification_status === 'verified' && (
                                                <div className="flex items-center gap-1">
                                                    <Shield className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-medium">認証済み</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-3">{currentAuction.expert?.bio}</p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>{currentAuction.expert?.average_rating} ({currentAuction.expert?.total_sessions || 0}件)</span>
                                            </div>
                                            <div>{currentAuction.expert?.total_sessions || 0}回のセッション実績</div>
                                            <div>回答率 {currentAuction.expert?.response_rate || 0}%</div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {currentAuction.expert?.expertise_areas?.map((area) => (
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
                                    {bids && bids.length > 0 ? bids.map((bid, index) => (
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
                                    )) : (
                                        <div className="py-8 text-center text-gray-500">
                                            まだ入札がありません。最初の入札者になりましょう！
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* サイドバー - 入札フォーム */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BidForm 
                                auction={currentAuction} 
                                onPlaceBid={user ? (amount: number) => placeBid(amount, user.id) : undefined} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}