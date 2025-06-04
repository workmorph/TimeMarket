'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams()
  const [auctionId, setAuctionId] = useState<string | null>(null)

  useEffect(() => {
    // URLからオークションIDを取得
    const auctionId = searchParams.get('auction_id')
    if (auctionId) {
      setAuctionId(auctionId)
    }
  }, [searchParams])

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-center text-2xl">決済がキャンセルされました</CardTitle>
          <CardDescription className="text-center">
            決済処理は完了していません
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p>
              決済がキャンセルされたか、処理中にエラーが発生しました。
              入札は保存されていません。
            </p>
            <p className="text-sm text-muted-foreground">
              再度入札する場合は、オークションページから手続きを行ってください。
              問題が解決しない場合は、お問い合わせください。
            </p>
          </div>
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
            <Link href="/auctions">
              オークション一覧へ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
