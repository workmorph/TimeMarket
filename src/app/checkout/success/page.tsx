'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [auctionId, setAuctionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // URLからオークションIDを取得
    const auctionId = searchParams.get('auction_id')
    
    if (auctionId) {
      setAuctionId(auctionId)
      setIsLoading(false)
    } else {
      setError('オークション情報が見つかりませんでした')
      setIsLoading(false)
    }
    
    // TODO: 必要に応じてセッションIDを使用して支払い状態を確認するAPIを呼び出す
    // 現在はwebhookで処理しているため、ここでの確認は不要
  }, [searchParams])

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
          ) : (
            <div className="space-y-4 text-center">
              <p>
                入札が正常に処理されました。オークションの結果はダッシュボードで確認できます。
              </p>
              <p className="text-sm text-muted-foreground">
                ※ 支払い処理には数分かかる場合があります。
                しばらく経ってもダッシュボードに反映されない場合は、お問い合わせください。
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
        </CardFooter>
      </Card>
    </div>
  )
}
