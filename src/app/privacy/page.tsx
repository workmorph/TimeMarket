import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | TimeBid',
  description: 'TimeBidのプライバシーポリシーをご確認ください。専門家の時間をオークション形式で取引するサービスにおける個人情報の取り扱いについて説明しています。',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
        
        <div className="prose prose-blue max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              最終更新日: 2025年6月4日
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            TimeBid（以下「当社」）は、当社が提供するサービス（以下「本サービス」）における、ユーザーの個人情報の取扱いについて、
            以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. 個人情報の収集方法</h2>
          <p className="text-gray-600 mb-4">
            当社は、ユーザーが利用登録をする際に、氏名、生年月日、住所、電話番号、メールアドレス、銀行口座情報、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。
            また、ユーザーと提携先などとの間でなされた、ユーザーの肖像・氏名・連絡先・その他の情報の取扱いに関する同意に基づき、提携先などから個人情報の提供を受ける場合があります。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. 個人情報を収集・利用する目的</h2>
          <p className="text-gray-600 mb-4">
            当社が個人情報を収集・利用する目的は、以下のとおりです。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">当社サービスの提供・運営のため</li>
            <li className="mb-2">ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
            <li className="mb-2">ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
            <li className="mb-2">メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
            <li className="mb-2">利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
            <li className="mb-2">ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
            <li className="mb-2">有料サービスにおいて、ユーザーに利用料金を請求するため</li>
            <li className="mb-2">オークションシステムの公正な運営および不正防止のため</li>
            <li className="mb-2">専門家とクライアント間の安全な取引環境を確保するため</li>
            <li className="mb-2">サービス品質向上のための統計データ作成および分析のため</li>
            <li className="mb-2">上記の利用目的に付随する目的</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. 個人情報の第三者提供</h2>
          <p className="text-gray-600 mb-4">
            当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li className="mb-2">公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li className="mb-2">国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
            <li className="mb-2">予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. 個人情報の開示</h2>
          <p className="text-gray-600 mb-4">
            当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
            <li className="mb-2">当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
            <li className="mb-2">その他法令に違反することとなる場合</li>
          </ol>
          <p className="text-gray-600 mb-4">
            前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. 個人情報の訂正および削除</h2>
          <p className="text-gray-600 mb-4">
            1. ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
          </p>
          <p className="text-gray-600 mb-4">
            2. 当社は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
          </p>
          <p className="text-gray-600 mb-4">
            3. 当社は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. 個人情報の利用停止等</h2>
          <p className="text-gray-600 mb-4">
            1. 当社は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
          </p>
          <p className="text-gray-600 mb-4">
            2. 前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
          </p>
          <p className="text-gray-600 mb-4">
            3. 当社は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
          </p>
          <p className="text-gray-600 mb-4">
            4. 前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. オークションデータの取り扱い</h2>
          <p className="text-gray-600 mb-4">
            当社は、本サービスにおけるオークションに関連するデータを以下のように取り扱います。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">オークション履歴（入札履歴、落札情報など）は、取引の透明性確保および紛争解決のために保存されます。</li>
            <li className="mb-2">専門家のプロフィール情報および評価情報は、サービスの品質向上および適切なマッチングのために他のユーザーに公開されます。</li>
            <li className="mb-2">オークション中の入札情報は、入札者のユーザー名（または匿名化されたID）と入札額のみが公開され、その他の個人情報は公開されません。</li>
            <li className="mb-2">オークション終了後、落札者と専門家には相互にコンタクトを取るための連絡先情報が提供されますが、これらの情報は当事者間でのみ共有され、他のユーザーには公開されません。</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. 支払い情報の取り扱い</h2>
          <p className="text-gray-600 mb-4">
            当社は、ユーザーの支払い情報を以下のように取り扱います。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">クレジットカード情報等の決済情報は、当社が直接保持せず、PCI DSSに準拠した決済代行サービス（Stripe等）を通じて安全に処理されます。</li>
            <li className="mb-2">銀行口座情報等の振込先情報は、専門家への報酬支払いのためにのみ利用され、適切な暗号化措置を施した上で保管されます。</li>
            <li className="mb-2">支払い履歴は、会計処理および税務申告の目的で法令に定められた期間保存されます。</li>
            <li className="mb-2">支払いに関するトラブルや不正利用の調査のため、取引記録を一定期間保存することがあります。</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">9. メッセージおよびコミュニケーションデータの取り扱い</h2>
          <p className="text-gray-600 mb-4">
            当社は、本サービス内でのメッセージやコミュニケーションデータを以下のように取り扱います。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">専門家とクライアント間のメッセージ内容は、原則として当事者以外からはアクセスできません。</li>
            <li className="mb-2">ただし、利用規約違反の調査や紛争解決のために必要な場合、当社の担当者が内容を確認することがあります。</li>
            <li className="mb-2">サービス品質向上のため、メッセージ内容を匿名化した上で統計的に分析することがあります。</li>
            <li className="mb-2">メッセージデータは、取引完了後も一定期間保存されますが、ユーザーは自身のアカウントから過去のメッセージを削除することができます。</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">10. プライバシーポリシーの変更</h2>
          <p className="text-gray-600 mb-4">
            1. 本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
          </p>
          <p className="text-gray-600 mb-4">
            2. 当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
          </p>

          <p className="text-gray-600 mt-8 mb-4">
            本プライバシーポリシーは2025年6月4日に制定されました。
          </p>
          <p className="text-gray-600">
            TimeBid運営事務局
          </p>
        </div>
      </div>
    </div>
  )
}
