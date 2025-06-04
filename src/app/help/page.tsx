import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ヘルプ・よくある質問 | TimeBid',
  description: 'TimeBidのよくある質問と使い方ガイド。専門家の時間をオークション形式で取引するサービスの詳しい使い方、トラブルシューティング、お問い合わせ方法をご案内します。',
  keywords: 'TimeBid, ヘルプ, FAQ, よくある質問, 使い方, トラブルシューティング, お問い合わせ',
  openGraph: {
    title: 'ヘルプ・よくある質問 | TimeBid',
    description: 'TimeBidのよくある質問と使い方ガイド。サービスの詳しい使い方をご案内します。',
    type: 'website'
  }
}

export default function HelpPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ヘルプ・よくある質問</h1>
        
        <div className="prose prose-blue max-w-none">
          {/* はじめに */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">TimeBidについて</h2>
            <p className="text-gray-600 mb-4">
              TimeBidは、専門家の時間をオークション形式で取引できる革新的なマーケットプレイスです。
              専門知識を持つプロフェッショナルと、その知識を必要とする方々を効率的につなげます。
            </p>
          </section>

          {/* 使い方ガイド */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">使い方ガイド</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">クライアント（購入者）の方へ</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>アカウント登録：メールアドレスとパスワードで簡単に登録できます</li>
                  <li>専門家を探す：カテゴリーやキーワードで専門家を検索</li>
                  <li>オークションに参加：希望する専門家の時間に入札</li>
                  <li>落札・支払い：落札後、安全な決済システムで支払い</li>
                  <li>サービスを受ける：専門家と日程を調整してサービスを受ける</li>
                  <li>評価する：サービス完了後、専門家を評価</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">専門家（出品者）の方へ</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>専門家登録：プロフィールと専門分野を登録</li>
                  <li>時間を出品：提供可能な時間枠と開始価格を設定</li>
                  <li>オークション管理：入札状況を確認し、必要に応じて対応</li>
                  <li>落札通知：落札されたら通知が届きます</li>
                  <li>サービス提供：クライアントと調整してサービスを提供</li>
                  <li>報酬受取：サービス完了後、手数料15%を差し引いた金額を受取</li>
                </ol>
              </div>
            </div>
          </section>

          {/* よくある質問 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">よくある質問（FAQ）</h2>
            
            <div className="space-y-6">
              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: TimeBidの手数料はいくらですか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: 専門家の方から、落札金額の15%を手数料としていただいています。クライアントの方は、落札金額のみのお支払いとなります。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: キャンセルはできますか？
                </summary>
                <div className="mt-4 text-gray-600 space-y-2">
                  <p>A: キャンセルポリシーは以下の通りです：</p>
                  <ul className="list-disc pl-6">
                    <li>サービス実施日の3日前まで：キャンセル料無料</li>
                    <li>2日前から当日：落札金額の50%のキャンセル料</li>
                    <li>専門家都合のキャンセル：全額返金</li>
                  </ul>
                </div>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: 支払い方法は何が使えますか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: クレジットカード（Visa、Mastercard、American Express、JCB）および銀行振込がご利用いただけます。
                  決済は安全性の高いStripeシステムを使用しています。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: 専門家になるには審査がありますか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: はい、サービスの品質を保つため、専門家登録時には簡単な審査があります。
                  専門分野での実績や資格などを確認させていただきます。審査は通常1-3営業日で完了します。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: オークションの期間はどのくらいですか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: 専門家が出品時に1日から7日の間で自由に設定できます。期間終了時に最高額で入札している方が落札者となります。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: サービスに満足できなかった場合は？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: サービス内容が著しく契約内容と異なる場合は、返金申請が可能です。
                  サービス完了後7日以内にカスタマーサポートまでご連絡ください。状況を確認の上、対応させていただきます。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: 複数の時間枠を同時に出品できますか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: はい、専門家の方は複数の時間枠を同時に出品することができます。
                  ただし、スケジュールの重複にはご注意ください。
                </p>
              </details>

              <details className="border-b border-gray-200 pb-6">
                <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Q: 海外からも利用できますか？
                </summary>
                <p className="mt-4 text-gray-600">
                  A: 現在、日本国内からのご利用のみ対応しております。
                  今後、サービス対象地域の拡大を検討しています。
                </p>
              </details>
            </div>
          </section>

          {/* トラブルシューティング */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">トラブルシューティング</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">ログインできない場合</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>パスワードをお忘れの場合は、ログインページの「パスワードを忘れた方」からリセットできます</li>
                  <li>メールアドレスが正しく入力されているか確認してください</li>
                  <li>ブラウザのキャッシュをクリアしてお試しください</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">入札ができない場合</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>ログイン状態を確認してください</li>
                  <li>支払い方法が登録されているか確認してください</li>
                  <li>現在の最高入札額以上の金額で入札してください</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">決済エラーが発生した場合</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>クレジットカード情報が正しく入力されているか確認してください</li>
                  <li>カードの有効期限を確認してください</li>
                  <li>利用限度額を超えていないか確認してください</li>
                  <li>問題が解決しない場合は、別の支払い方法をお試しください</li>
                </ul>
              </div>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">お問い合わせ</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">カスタマーサポート</h3>
              <div className="space-y-3 text-gray-600">
                <p>ご不明な点やお困りのことがございましたら、お気軽にお問い合わせください。</p>
                
                <div className="space-y-2">
                  <p><strong>メールでのお問い合わせ：</strong></p>
                  <p className="pl-4">support@timebid.jp</p>
                  <p className="pl-4 text-sm">（平日9:00-18:00、土日祝日を除く）</p>
                </div>
                
                <div className="space-y-2">
                  <p><strong>お問い合わせフォーム：</strong></p>
                  <p className="pl-4">
                    <a href="/contact" className="text-blue-600 hover:underline">
                      お問い合わせフォームはこちら
                    </a>
                  </p>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded">
                  <p className="text-sm">
                    <strong>営業時間：</strong>平日 9:00 - 18:00（土日祝日、年末年始を除く）<br />
                    <strong>返信について：</strong>通常1-2営業日以内にご返信いたします
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 関連リンク */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">関連リンク</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/terms" className="text-blue-600 hover:underline">利用規約</a>
              </li>
              <li>
                <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>
              </li>
              <li>
                <a href="/about" className="text-blue-600 hover:underline">TimeBidについて</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}