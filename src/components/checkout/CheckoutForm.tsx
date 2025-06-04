'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CheckoutFormProps {
  auctionId: string
  auctionTitle: string
  auctionImage?: string
  bidAmount: number
  platformFee: number
  totalAmount: number
  sellerName?: string
  onCancel?: () => void
}

export function CheckoutForm({ 
  auctionId, 
  auctionTitle, 
  auctionImage, 
  bidAmount, 
  platformFee, 
  totalAmount,
  sellerName,
  onCancel 
}: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setErrorDetails(null)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId,
          bidAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '決済の処理中にエラーが発生しました')
        if (data.detail) {
          setErrorDetails(data.detail)
        }
        return
      }

      // セッション情報をローカルストレージに保存（成功ページで使用）
      if (data.session_id) {
        localStorage.setItem('checkout_session_id', data.session_id)
        localStorage.setItem('checkout_bid_amount', data.bid_amount?.toString() || '')
        localStorage.setItem('checkout_total_amount', data.total_amount?.toString() || '')
        localStorage.setItem('checkout_platform_fee', data.platform_fee?.toString() || '')
        localStorage.setItem('checkout_auction_id', auctionId)
        localStorage.setItem('checkout_auction_title', auctionTitle)
      }
      
      // Stripeのチェックアウトページにリダイレクト
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('決済URLが見つかりませんでした')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : '決済の処理中に予期せぬエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>決済情報</CardTitle>
        <CardDescription>{auctionTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {auctionImage && (
            <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
              <img 
                src={auctionImage} 
                alt={auctionTitle} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          {sellerName && (
            <div className="text-sm text-muted-foreground">
              <span>出品者: {sellerName}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>入札金額</span>
              <span className="font-medium">{formatCurrency(bidAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>プラットフォーム手数料 (15%)</span>
              <span className="font-medium">{formatCurrency(platformFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">合計金額</span>
              <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>安全な決済システムを使用しています</span>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラーが発生しました</AlertTitle>
              <AlertDescription>
                {error}
                {errorDetails && (
                  <div className="mt-2 text-xs">
                    <details>
                      <summary>詳細</summary>
                      <p className="mt-1">{errorDetails}</p>
                    </details>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleCheckout} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              決済に進む
            </>
          )}
        </Button>
        
        {onCancel && !isLoading && (
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="w-full"
          >
            キャンセル
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
