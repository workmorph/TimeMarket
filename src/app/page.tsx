import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            専門家の時間を
            <span className="text-blue-600">オークション</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            あなたの専門知識が正当に評価される新しい働き方。
            限られた時間を最高価格で提供し、クライアントは真の価値にアクセスできます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">専門家として登録</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auctions">オークションを見る</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}