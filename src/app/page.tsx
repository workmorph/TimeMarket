import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Clock, TrendingUp, Shield, ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヒーローセクション */}
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg">
              <Link href="/auth/register">専門家として登録</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auctions">オークションを見る</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">TimeBidの特徴</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              専門家とクライアント双方にメリットをもたらす革新的なプラットフォーム
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 特徴1 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">市場価値の最適化</h3>
                  <p className="text-gray-600">
                    オークション形式により、あなたの専門知識の真の市場価値が決まります。
                    固定価格ではなく、需要と供給に基づいた公正な価格設定が可能です。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 特徴2 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">時間の有効活用</h3>
                  <p className="text-gray-600">
                    空き時間を効率的に活用し、収益化できます。
                    1時間単位のセッションで、スケジュール管理も簡単です。
                    自分のペースで働ける新しいワークスタイルを実現します。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 特徴3 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">安心の保証システム</h3>
                  <p className="text-gray-600">
                    専門家の認証制度と評価システムにより、高品質なサービスを保証。
                    セッション後の満足度評価で、透明性の高いエコシステムを構築しています。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 使い方セクション */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">TimeBidの使い方</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3つの簡単なステップで、専門知識の価値を最大化
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* ステップ1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">プロフィール登録</h3>
              <p className="text-gray-600 mb-4">
                専門分野、経験、提供できるサービスを詳細に記入。
                あなたの強みをアピールしましょう。
              </p>
              <div className="mt-auto">
                <Button variant="link" className="gap-1">
                  登録する <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">オークション作成</h3>
              <p className="text-gray-600 mb-4">
                提供するサービス内容、開始価格、オークション期間を設定。
                魅力的なタイトルと説明文で注目を集めましょう。
              </p>
              <div className="mt-auto">
                <Button variant="link" className="gap-1">
                  オークションを作成 <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">セッション実施</h3>
              <p className="text-gray-600 mb-4">
                落札者とスケジュールを調整し、オンラインでセッションを実施。
                あなたの専門知識で価値を提供し、評価を得ましょう。
              </p>
              <div className="mt-auto">
                <Button variant="link" className="gap-1">
                  詳しく見る <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 実績数値セクション */}
      <div className="bg-blue-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">認証済み専門家</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-blue-100">完了セッション</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">¥120M+</div>
              <div className="text-blue-100">取引総額</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">平均評価</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">あなたの専門知識を収益化しませんか？</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              今すぐ登録して、あなたの時間の価値を最大化しましょう。
              新しい働き方の扉が開かれています。
            </p>
            <Button asChild size="lg">
              <Link href="/auth/register">無料で始める</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}