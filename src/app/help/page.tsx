import { Metadata } from 'next'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, MessageCircle, FileText, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ヘルプ | TimeBid',
  description: 'TimeBidのヘルプページです。よくある質問や使い方ガイドをご確認いただけます。',
}

export default function HelpPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ヘルプセンター</h1>
        
        {/* 検索バー */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="質問を検索..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-3 text-blue-600">
              検索
            </button>
          </div>
        </div>

        {/* カテゴリーセクション */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">はじめての方へ</h3>
                <p className="text-gray-600 mb-4">
                  TimeBidの基本的な使い方や登録方法についてのガイドです。
                </p>
                <Button variant="outline" className="mt-2">
                  詳細を見る
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">専門家ガイド</h3>
                <p className="text-gray-600 mb-4">
                  専門家として登録し、オークションを開始するための詳細ガイドです。
                </p>
                <Button variant="outline" className="mt-2">
                  詳細を見る
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">クライアントガイド</h3>
                <p className="text-gray-600 mb-4">
                  オークションへの入札方法や専門家とのセッション実施方法を解説します。
                </p>
                <Button variant="outline" className="mt-2">
                  詳細を見る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* よくある質問 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">よくある質問</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium text-left">
                TimeBidとは何ですか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                TimeBidは、専門家の時間をオークション形式で取引するプラットフォームです。専門家は自分の空き時間を出品し、クライアントはその時間に対して入札を行います。最高入札者が専門家の時間を獲得し、オンラインでのコンサルテーションやアドバイスを受けることができます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium text-left">
                専門家として登録するにはどうすればよいですか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                専門家として登録するには、まず会員登録を行い、プロフィールページから「専門家登録」を選択します。専門分野、経験、資格などの情報を入力し、審査に通過すると専門家として活動を開始できます。審査には通常1〜3営業日かかります。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium text-left">
                オークションの開始価格はどのように設定すればよいですか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                開始価格は専門家が自由に設定できます。ただし、あまりに高すぎる開始価格は入札者が少なくなる可能性があります。初めは市場相場よりやや低めに設定し、評価が高まるにつれて徐々に上げていくことをお勧めします。また、AIによる価格提案機能もご利用いただけます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium text-left">
                入札後のキャンセルは可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                オークション終了前であれば入札のキャンセルが可能です。ただし、オークション終了後に落札が確定した場合、原則としてキャンセルはできません。やむを得ない事情がある場合は、専門家との直接交渉またはカスタマーサポートにご相談ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium text-left">
                支払い方法にはどのようなものがありますか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                クレジットカード（VISA、Mastercard、American Express、JCB）、PayPal、銀行振込に対応しています。落札後、選択した支払い方法で決済を行います。セッション実施後に専門家への支払いが行われます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium text-left">
                セッションはどのように行われますか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                セッションは主にビデオ会議ツールを使用してオンラインで行われます。TimeBidは独自のビデオ会議システムを提供していますが、専門家とクライアントの合意があれば、Zoom、Google Meet、Microsoft Teamsなどの外部ツールも利用可能です。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium text-left">
                手数料はいくらかかりますか？
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                専門家には取引金額の15%、クライアントには5%の手数料がかかります。例えば、10,000円の取引の場合、クライアントは10,500円を支払い、専門家には8,500円が支払われます。詳細は料金ページをご確認ください。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* お問い合わせセクション */}
        <div className="bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h2>
            <p className="text-gray-600 mb-6">
              ご質問やお困りのことがございましたら、お気軽にお問い合わせください。
              サポートチームが迅速に対応いたします。
            </p>
            <Button className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              お問い合わせフォーム
            </Button>
          </div>
        </div>

        {/* 関連リンク */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">関連リンク</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/terms" className="text-blue-600 hover:underline">利用規約</Link>
            <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            <Link href="/about" className="text-blue-600 hover:underline">会社概要</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
