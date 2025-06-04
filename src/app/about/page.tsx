import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TimeBidについて | 専門家の時間をオークション形式で取引',
  description: 'TimeBidは、専門家の時間をオークション形式で取引できる革新的なマーケットプレイスです。私たちのミッション、サービスの特徴、安全性への取り組みについてご紹介します。',
  keywords: 'TimeBid, 会社情報, サービス紹介, ミッション, 専門家オークション, 時間売買',
  openGraph: {
    title: 'TimeBidについて | 専門家の時間をオークション形式で取引',
    description: 'TimeBidは専門家と相談者をつなぐ革新的なプラットフォームです。',
    type: 'website'
  }
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">TimeBidについて</h1>
        
        <div className="prose prose-blue max-w-none">
          {/* ミッション */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">私たちのミッション</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <p className="text-lg text-gray-700 font-medium">
                「専門知識を必要とするすべての人に、最適な専門家との出会いを」
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              TimeBidは、専門家の貴重な時間と、その知識を必要とする方々を効率的につなげる革新的なマーケットプレイスです。
              オークション形式により、専門家の時間の価値を市場が決定し、公正で透明性の高い取引を実現します。
            </p>
            <p className="text-gray-600">
              私たちは、知識経済において専門家の時間がより適切に評価され、
              必要とする人々がより簡単にアクセスできる世界を目指しています。
            </p>
          </section>

          {/* サービスの特徴 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">サービスの特徴</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">透明性の高い価格決定</h3>
                <p className="text-gray-600">
                  オークション形式により、専門家の時間の価値を市場が決定。
                  需要と供給のバランスに基づいた公正な価格形成を実現します。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">幅広い専門分野</h3>
                <p className="text-gray-600">
                  ビジネスコンサルティング、法務、医療、技術、教育など、
                  様々な分野の専門家が登録。あらゆるニーズに対応可能です。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">安全な決済システム</h3>
                <p className="text-gray-600">
                  業界最高水準のセキュリティを誇るStripeを採用。
                  クレジットカード情報は安全に管理され、安心して取引できます。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">評価システム</h3>
                <p className="text-gray-600">
                  サービス完了後の相互評価により、質の高いサービス提供を促進。
                  実績と評価が可視化され、信頼性の高い取引を実現します。
                </p>
              </div>
            </div>
          </section>

          {/* 数字で見るTimeBid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">数字で見るTimeBid</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">10,000+</p>
                <p className="text-gray-600 mt-2">登録専門家数</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">50,000+</p>
                <p className="text-gray-600 mt-2">累計取引件数</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">98%</p>
                <p className="text-gray-600 mt-2">顧客満足度</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">24時間</p>
                <p className="text-gray-600 mt-2">平均応答時間</p>
              </div>
            </div>
          </section>

          {/* 安全性への取り組み */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">安全性・セキュリティへの取り組み</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">本人確認の徹底</h3>
                <p className="text-gray-600">
                  専門家登録時には身分証明書による本人確認を実施。
                  なりすましや不正利用を防止し、安全な取引環境を維持しています。
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">SSL暗号化通信</h3>
                <p className="text-gray-600">
                  すべての通信は最新のSSL技術により暗号化。
                  個人情報や取引情報は安全に保護されています。
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">24時間監視体制</h3>
                <p className="text-gray-600">
                  不正な取引や規約違反を24時間体制で監視。
                  問題が発生した場合は迅速に対応し、ユーザーの安全を守ります。
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">エスクローサービス</h3>
                <p className="text-gray-600">
                  支払いはサービス完了まで当社が一時的に預かるエスクロー方式を採用。
                  専門家・クライアント双方の利益を保護します。
                </p>
              </div>
            </div>
          </section>

          {/* 運営会社情報 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">運営会社情報</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 text-gray-600 font-medium w-1/3">会社名</td>
                    <td className="py-3 text-gray-800">株式会社TimeBid</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">設立</td>
                    <td className="py-3 text-gray-800">2023年4月1日</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">代表取締役</td>
                    <td className="py-3 text-gray-800">山田 太郎</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">資本金</td>
                    <td className="py-3 text-gray-800">1億円</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">所在地</td>
                    <td className="py-3 text-gray-800">
                      〒100-0001<br />
                      東京都千代田区千代田1-1-1<br />
                      TimeBidビル 10F
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">事業内容</td>
                    <td className="py-3 text-gray-800">
                      専門家と相談者をつなぐオークションプラットフォームの運営<br />
                      関連するコンサルティングサービス
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 font-medium">登録番号</td>
                    <td className="py-3 text-gray-800">
                      古物商許可番号：東京都公安委員会 第123456789号<br />
                      電気通信事業届出番号：A-12-34567
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">お問い合わせ</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">一般的なお問い合わせ</h3>
                <p className="text-gray-600 mb-2">カスタマーサポート</p>
                <p className="text-gray-800">
                  <a href="mailto:support@timebid.jp" className="text-blue-600 hover:underline">
                    support@timebid.jp
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  営業時間：平日 9:00-18:00
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">ビジネスに関するお問い合わせ</h3>
                <p className="text-gray-600 mb-2">法人営業部</p>
                <p className="text-gray-800">
                  <a href="mailto:business@timebid.jp" className="text-blue-600 hover:underline">
                    business@timebid.jp
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  提携・協業のご相談など
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">報道関係者の方</h3>
                <p className="text-gray-600 mb-2">広報部</p>
                <p className="text-gray-800">
                  <a href="mailto:pr@timebid.jp" className="text-blue-600 hover:underline">
                    pr@timebid.jp
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  取材・掲載のご依頼など
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">採用に関するお問い合わせ</h3>
                <p className="text-gray-600 mb-2">人事部</p>
                <p className="text-gray-800">
                  <a href="mailto:careers@timebid.jp" className="text-blue-600 hover:underline">
                    careers@timebid.jp
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  キャリア採用・新卒採用
                </p>
              </div>
            </div>
          </section>

          {/* 関連リンク */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">関連ページ</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/help" className="text-blue-600 hover:underline">ヘルプ・よくある質問</a>
              </li>
              <li>
                <a href="/terms" className="text-blue-600 hover:underline">利用規約</a>
              </li>
              <li>
                <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}