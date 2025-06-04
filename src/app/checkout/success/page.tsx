'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2, Receipt, Calendar, User } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PaymentDetails {
  amount: number
  platformFee: number
  sellerAmount: number
  auctionTitle: string
  bidderName: string
  sellerName: string
  sessionId: string
  paymentMethod?: string
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [auctionId, setAuctionId] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      // URLからパラメータを取得
      const auction = searchParams.get('auction')
      const sessionId = searchParams.get('session_id')
      
      if (!auction || !sessionId) {
        setError('必要なパラメータが不足しています')
        setIsLoading(false)
        return
      }
      
      setAuctionId(auction)
      
      try {
        // ローカルストレージから支払い情報を取得（Checkoutフォームが保存したもの）
        const storedDetails = localStorage.getItem(`payment_${sessionId}`)
        if (storedDetails) {
          const details = JSON.parse(storedDetails)
          setPaymentDetails({
            ...details,
            sessionId
          })
          
          // 使用済みのデータを削除
          localStorage.removeItem(`payment_${sessionId}`)
        } else {
          // ストレージにない場合はAPIから取得を試みる（将来的な実装）
          console.log('Payment details not found in localStorage')
        }
      } catch (err) {
        console.error('Failed to fetch payment details:', err)
        setError('支払い情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPaymentDetails()
  }, [searchParams])

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-3xl">決済が完了しました</CardTitle>
          <CardDescription className="text-center text-lg">
            お支払いいただきありがとうございます
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {paymentDetails && (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    取引詳細
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">オークション</p>
                      <p className="font-medium">{paymentDetails.auctionTitle}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">入札金額</p>
                      <p className="font-medium text-lg">{formatCurrency(paymentDetails.amount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">プラットフォーム手数料（15%）</p>
                      <p className="font-medium">{formatCurrency(paymentDetails.platformFee)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">出品者への支払額</p>
                      <p className="font-medium">{formatCurrency(paymentDetails.sellerAmount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        落札者
                      </p>
                      <p className="font-medium">{paymentDetails.bidderName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        出品者
                      </p>
                      <p className="font-medium">{paymentDetails.sellerName}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">決済ID</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {paymentDetails.sessionId}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-blue-900">
                  <Calendar className="h-4 w-4" />
                  次のステップ
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>出品者から連絡があります（通常24時間以内）</li>
                  <li>ミーティングの日時を調整してください</li>
                  <li>ミーティング完了後、評価をお願いします</li>
                </ol>
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                ※ 領収書はダッシュボードからダウンロードできます
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {auctionId && (
            <Button asChild className="w-full">
              <Link href={`/auctions/${auctionId}`}>
                オークションに戻る
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">
              ダッシュボードへ
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/auctions">
              他のオークションを見る
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}