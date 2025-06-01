'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Shield, TrendingUp, Info } from 'lucide-react'

// 一時的なモック関数（後でSupabase/Stripeに置換）
const useAuth = () => ({
    user: { id: '1', email: 'test@example.com' }, // null でログイン未状態をテスト可能
    profile: { display_name: 'テストユーザー' }
})

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    }).format(amount)
}

interface BidFormProps {
    auction: {
        id: string
        title: string
        current_highest_bid: number
        starting_price: number
        bid_count: number
        status: string
        expert: {
            display_name: string
        }
    }
    onBidSuccess?: () => void
}

export function BidForm({ auction, onBidSuccess }: BidFormProps) {
    const { user } = useAuth()
    const [bidAmount, setBidAmount] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const currentHighest = auction.current_highest_bid || auction.starting_price
    const minimumBid = currentHighest + 1000
    const bidAmountNum = parseInt(bidAmount) || 0
    const serviceFee = Math.floor(bidAmountNum * 0.1)
    const totalAmount = bidAmountNum + serviceFee

    // 推奨入札額
    const suggestedBids = [
        minimumBid,
        minimumBid + 2000,
        minimumBid + 5000,
        minimumBid + 10000
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!user) {
            setError('ログインが必要です')
            return
        }

        if (bidAmountNum < minimumBid) {
            setError(`最低入札額は${formatCurrency(minimumBid)}です`)
            return
        }

        setIsSubmitting(true)

        try {
            // TODO: 実際のAPI呼び出し
            await new Promise(resolve => setTimeout(resolve, 1500)) // シミュレート

            console.log('入札処理:', {
                auction_id: auction.id,
                amount: bidAmountNum,
                user_id: user.id
            })

            // TODO: Toast通知
            alert(`${formatCurrency(bidAmountNum)}で入札しました！`)

            setBidAmount('')
            onBidSuccess?.()
        } catch (error) {
            console.error('入札エラー:', error)
            setError('入札に失敗しました。しばらく時間をおいて再度お試しください。')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSuggestedBid = (amount: number) => {
        setBidAmount(amount.toString())
    }

    if (auction.status !== 'active') {
        return (
            <Card>
                <CardContent className="pt-6 text-center">
                    <div className="text-gray-400 mb-2">
                        <CreditCard className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">オークション終了</p>
                    <p className="text-sm text-muted-foreground">
                        このオークションは既に終了しています
                    </p>
                </CardContent>
            </Card>
        )
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="pt-6 text-center">
                    <div className="text-blue-400 mb-4">
                        <Shield className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">ログインが必要です</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        オークションに参加するにはアカウントにログインしてください
                    </p>
                    <Button asChild className="w-full">
                        <a href="/auth/login">ログインする</a>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    入札する
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                    <p>専門家: <span className="font-medium">{auction.expert.display_name}</span></p>
                    <p>現在の最高額: <span className="font-bold text-blue-600">{formatCurrency(currentHighest)}</span></p>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* エラー表示 */}
                {error && (
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* 推奨入札額 */}
                <div>
                    <Label className="text-sm font-medium">推奨入札額</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {suggestedBids.map((amount) => (
                            <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestedBid(amount)}
                                className="text-xs"
                            >
                                {formatCurrency(amount)}
                            </Button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="bid-amount">入札額 (円)</Label>
                        <Input
                            id="bid-amount"
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`最低 ${minimumBid.toLocaleString()} 円`}
                            min={minimumBid}
                            step={1000}
                            required
                            className="text-lg font-medium"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            最低入札額: {formatCurrency(minimumBid)} (現在額 + 1,000円)
                        </p>
                    </div>

                    {/* 料金内訳 */}
                    {bidAmountNum >= minimumBid && (
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-sm">料金内訳</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>入札額:</span>
                                    <span className="font-medium">{formatCurrency(bidAmountNum)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>サービス手数料 (10%):</span>
                                    <span>{formatCurrency(serviceFee)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>合計支払額:</span>
                                    <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            <Alert>
                                <Shield className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    決済は仮押さえとなり、オークション終了後に実際の取引が確定します
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || bidAmountNum < minimumBid}
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                処理中...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                {formatCurrency(bidAmountNum || minimumBid)}で入札する
                            </>
                        )}
                    </Button>
                </form>

                {/* 入札に関する注意事項 */}
                <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
                    <p>• 入札後のキャンセルはできません</p>
                    <p>• 最高入札者として終了した場合、自動的に取引が成立します</p>
                    <p>• 支払いはStripeにより安全に処理されます</p>
                </div>
            </CardContent>
        </Card>
    )
}