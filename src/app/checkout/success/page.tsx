'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2, Receipt } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface SessionDetails {
  id: string
  amount_total: number
  payment_status: string
  auction_id: string
  auction_title: string
  created_at: string
  bid_amount: number
  platform_fee: number
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        // URLからセッションIDとオークションIDを取得
        const sessionId = searchParams.get('session_id')
        const auctionId = searchParams.get('auction_id')
        
        if (!sessionId) {
          // セッションIDがない場合は、オークションIDのみで簡易表示
          if (auctionId) {
            setSessionDetails({
              id: '',
              amount_total: 0,
              payment_status: 'paid',
              auction_id: auctionId,
              auction_title: '',
              created_at: new Date().toISOString(),
              bid_amount: 0,
              platform_fee: 0,
            })
          } else {
            setError('決済情報が見つかりませんでした')
          }
          setIsLoading(false)
          return
        }

        // セッション情報を取得するAPIを呼び出す
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)
        
        if (!response.ok) {
          throw new Error('セッション情報の取得に失敗しました')
        }

        const data = await response.json()
        setSessionDetails(data)
      } catch (err) {
        console.error('Error fetching session details:', err)
        setError('決済情報の取得中にエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionDetails()
  }, [searchParams])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">決済が完了しました</CardTitle>
          <CardDescription className="text-center">
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
          ) : sessionDetails ? (
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <p>
                  入札が正常に処理されました。オークションの結果はダッシュボードで確認できます。
                </p>
                
                {sessionDetails.amount_total > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-center mb-2">
                      <Receipt className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">取引詳細</span>
                    </div>
                    
                    {sessionDetails.auction_title && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">オークション</span>
                        <span className="font-medium">{sessionDetails.auction_title}</span>
                      </div>
                    )}
                    
                    {sessionDetails.bid_amount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">入札額</span>
                          <span>{formatCurrency(sessionDetails.bid_amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">手数料（15%）</span>
                          <span>{formatCurrency(sessionDetails.platform_fee)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-medium">合計</span>
                            <span className="font-medium text-lg">
                              {formatCurrency(sessionDetails.amount_total)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {sessionDetails.created_at && (
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(sessionDetails.created_at), {
                          addSuffix: true,
                          locale: ja,
                        })}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  ※ 支払い処理には数分かかる場合があります。
                  しばらく経ってもダッシュボードに反映されない場合は、お問い合わせください。
                </p>
              </div>
              
              {sessionDetails.id && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    取引ID: {sessionDetails.id}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>決済情報を読み込んでいます...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {sessionDetails?.auction_id && (
            <Button asChild className="w-full">
              <Link href={`/auctions/${sessionDetails.auction_id}`}>
                オークションに戻る
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">
              ダッシュボードへ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}