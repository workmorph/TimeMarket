import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | TimeBid',
  description: 'TimeBidの利用規約をご確認ください。専門家の時間をオークション形式で取引するサービスの利用条件について詳しく説明しています。',
}

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
        
        <div className="prose prose-blue max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              最終更新日: 2025年6月4日
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            この利用規約（以下「本規約」）は、TimeBid（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
            本サービスをご利用いただく際には、本規約に同意いただく必要があります。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第1条（適用）</h2>
          <p className="text-gray-600 mb-4">
            1. 本規約は、本サービスの提供条件及び当社と登録ユーザーとの間の権利義務関係を定めることを目的とし、登録ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
          </p>
          <p className="text-gray-600 mb-4">
            2. 当社が当社ウェブサイト上で掲載する本サービスに関するルール、ガイドライン等も、本規約の一部を構成するものとします。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第2条（定義）</h2>
          <p className="text-gray-600 mb-4">
            本規約において使用する以下の用語は、各々以下に定める意味を有するものとします。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">「サービス利用契約」とは、本規約を契約条件として当社と登録ユーザーの間で締結される、本サービスの利用契約を意味します。</li>
            <li className="mb-2">「知的財産権」とは、著作権、特許権、実用新案権、意匠権、商標権その他の知的財産権（それらの権利を取得し、またはそれらの権利につき登録等を出願する権利を含みます。）を意味します。</li>
            <li className="mb-2">「投稿データ」とは、登録ユーザーが本サービスを利用して投稿その他送信するコンテンツ（文章、画像、動画等を含みますがこれらに限りません。）を意味します。</li>
            <li className="mb-2">「当社ウェブサイト」とは、そのドメインが「timebid.jp」である、当社が運営するウェブサイト（理由の如何を問わず、当社のウェブサイトのドメインまたは内容が変更された場合は、当該変更後のウェブサイトを含みます。）を意味します。</li>
            <li className="mb-2">「登録ユーザー」とは、第3条に基づき本サービスの利用者としての登録がなされた個人または法人を意味します。</li>
            <li className="mb-2">「専門家」とは、本サービスにおいて時間をオークションに出品する登録ユーザーを意味します。</li>
            <li className="mb-2">「クライアント」とは、本サービスにおいて専門家の時間を落札する登録ユーザーを意味します。</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第3条（登録）</h2>
          <p className="text-gray-600 mb-4">
            1. 本サービスの利用を希望する者（以下「登録希望者」）は、本規約を遵守することに同意し、かつ当社の定める一定の情報（以下「登録情報」）を当社の定める方法で当社に提供することにより、当社に対し、本サービスの利用の登録を申請することができます。
          </p>
          <p className="text-gray-600 mb-4">
            2. 当社は、当社の基準に従って、登録希望者の登録の可否を判断し、当社が登録を認める場合にはその旨を登録希望者に通知します。登録希望者の登録ユーザーとしての登録は、当社が本項の通知を行ったことをもって完了したものとします。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第4条（料金および支払方法）</h2>
          <p className="text-gray-600 mb-4">
            1. 登録ユーザーは、本サービス利用の対価として、当社が別途定め、当社ウェブサイトに表示する利用料金を、当社が指定する支払方法により支払うものとします。
          </p>
          <p className="text-gray-600 mb-4">
            2. <strong>専門家が提供するサービスがクライアントによって落札された場合、当社は落札金額の15%（税別）をプラットフォーム利用手数料として専門家から徴収します。</strong>この手数料は、専門家への支払い金額から自動的に差し引かれます。なお、この手数料率は、サービスの改善・維持のために使用され、事前の通知により変更される場合があります。
          </p>
          <p className="text-gray-600 mb-4">
            3. クライアントは落札金額の全額を支払うものとし、追加の手数料は発生しません。ただし、決済方法によっては、決済サービス提供者が定める手数料が別途発生する場合があります。
          </p>
          <p className="text-gray-600 mb-4">
            4. 支払いは以下の方法で行うことができます：
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li className="mb-2">クレジットカード（Visa、Mastercard、American Express、JCB、Diners Club、Discover）</li>
            <li className="mb-2">デビットカード</li>
            <li className="mb-2">銀行振込（振込手数料はお客様負担となります）</li>
            <li className="mb-2">その他当社が指定する決済方法</li>
          </ul>
          <p className="text-gray-600 mb-4">
            5. 支払い処理は、PCI DSS（Payment Card Industry Data Security Standard）に準拠した決済サービス提供者（Stripe等）を通じて行われ、お客様のカード情報は当社のサーバーには保存されません。
          </p>
          <p className="text-gray-600 mb-4">
            6. 登録ユーザーが利用料金の支払を遅滞した場合、登録ユーザーは年14.6％の割合による遅延損害金を当社に支払うものとします。
          </p>
          <p className="text-gray-600 mb-4">
            7. 専門家への報酬支払いは、サービス提供完了後、クライアントの承認を得た後に行われます。支払いは原則として5営業日以内に、専門家が登録した銀行口座に振り込まれます。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第5条（禁止事項）</h2>
          <p className="text-gray-600 mb-4">
            登録ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為または該当すると当社が判断する行為をしてはなりません。
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-600">
            <li className="mb-2">法令に違反する行為または犯罪行為に関連する行為</li>
            <li className="mb-2">当社、本サービスの他の利用者またはその他の第三者に対する詐欺または脅迫行為</li>
            <li className="mb-2">公序良俗に反する行為</li>
            <li className="mb-2">当社、本サービスの他の利用者またはその他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利または利益を侵害する行為</li>
            <li className="mb-2">本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
            <li className="mb-2">当社が提供するソフトウェアその他のシステムに対するリバースエンジニアリングその他の解析行為</li>
            <li className="mb-2">不正アクセスをし、またはこれを試みる行為</li>
            <li className="mb-2">第三者になりすます行為</li>
            <li className="mb-2">本サービスの運営を妨害するおそれのある行為</li>
            <li className="mb-2">その他、当社が不適切と判断する行為</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第6条（オークションに関する規定）</h2>
          <p className="text-gray-600 mb-4">
            本サービスにおけるオークションについて、以下の規定を定めます。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">専門家は、自らの時間をオークションに出品することができます。出品時には、提供可能な時間、サービス内容、開始価格、オークション期間を明示する必要があります。</li>
            <li className="mb-2">クライアントは、出品されている専門家の時間に対して入札することができます。入札は、現在の最高入札額以上の金額で行う必要があります。</li>
            <li className="mb-2">オークション終了時点で最高額の入札をしたクライアントが落札者となります。落札者は、落札金額を支払う義務を負います。</li>
            <li className="mb-2">専門家は、正当な理由なくサービス提供を拒否することはできません。やむを得ない事情がある場合は、速やかに当社および落札者に連絡し、対応を協議するものとします。</li>
            <li className="mb-2">クライアントは、専門家のサービス提供完了後、評価を行うことができます。この評価は他のユーザーに公開され、専門家の評価として蓄積されます。</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第7条（キャンセル、返金および紛争解決）</h2>
          <p className="text-gray-600 mb-4">
            本サービスにおけるキャンセル、返金および紛争解決について、以下の規定を定めます。
          </p>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">1. クライアントによるキャンセル</h3>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">サービス実施日の<strong>72時間前まで</strong>：キャンセル料なし（全額返金）</li>
            <li className="mb-2">サービス実施日の<strong>48時間前から24時間前まで</strong>：落札金額の30%のキャンセル料</li>
            <li className="mb-2">サービス実施日の<strong>24時間前から当日まで</strong>：落札金額の50%のキャンセル料</li>
            <li className="mb-2">サービス開始後のキャンセルは原則として認められません</li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">2. 専門家によるキャンセル</h3>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">専門家側の事情によるキャンセルの場合、理由の如何を問わず、クライアントに対して<strong>全額返金</strong>されます</li>
            <li className="mb-2">専門家がキャンセルした場合、当該専門家の評価に影響し、キャンセル履歴として記録されます</li>
            <li className="mb-2">正当な理由なく繰り返しキャンセルを行う専門家に対しては、以下の措置を段階的に実施します：
              <ul className="list-disc pl-6 mt-2">
                <li>1回目：警告通知</li>
                <li>2回目：一時的な出品停止（1週間）</li>
                <li>3回目：アカウントの永久停止</li>
              </ul>
            </li>
            <li className="mb-2">不可抗力（天災、急病、忌引き等）によるキャンセルは、証明書類の提出により上記の対象外とすることがあります</li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">3. 返金請求および紛争解決</h3>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">以下の場合、クライアントは返金を請求することができます：
              <ul className="list-disc pl-6 mt-2">
                <li>サービス内容が事前の説明と著しく異なる場合</li>
                <li>専門家が約束した成果物を提供しなかった場合</li>
                <li>専門家が予定時間を大幅に短縮した場合（15分以上）</li>
                <li>その他、契約不履行に該当する場合</li>
              </ul>
            </li>
            <li className="mb-2">返金請求は、サービス提供日から<strong>7日以内</strong>に、具体的な理由を添えて当社カスタマーサポートに申請する必要があります</li>
            <li className="mb-2">当社は両当事者から事情を聴取し、必要に応じて証拠（メッセージ履歴、成果物等）を確認した上で、<strong>5営業日以内</strong>に判断を下します</li>
            <li className="mb-2">返金が認められた場合、決済手数料を除いた金額が、申請承認から<strong>10営業日以内</strong>に返金されます</li>
            <li className="mb-2">当社の判断に不服がある場合、両当事者は第三者機関による調停を申し立てることができます</li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">4. 免責事項</h3>
          <p className="text-gray-600 mb-4">
            当社は、専門家とクライアント間の取引において仲介者として行動し、サービスの品質や成果について保証するものではありません。
            ただし、明らかな詐欺行為や重大な契約違反があった場合は、被害を最小限に抑えるため積極的に介入します。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第8条（本サービスの停止等）</h2>
          <p className="text-gray-600 mb-4">
            当社は、以下のいずれかに該当する場合には、登録ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">本サービスに係るコンピューター・システムの点検または保守作業を緊急に行う場合</li>
            <li className="mb-2">コンピューター、通信回線等の障害、誤操作、過度なアクセスの集中、不正アクセス、ハッキング等により本サービスの運営ができなくなった場合</li>
            <li className="mb-2">地震、落雷、火災、風水害、停電、天災地変などの不可抗力により本サービスの運営ができなくなった場合</li>
            <li className="mb-2">その他、当社が停止または中断を必要と判断した場合</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第9条（知的財産権）</h2>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">1. プラットフォームの知的財産権</h3>
          <p className="text-gray-600 mb-4">
            本サービスにおいて提供される全てのコンテンツ（テキスト、グラフィック、ロゴ、ボタンアイコン、画像、音声、動画、データ編集物、ソフトウェア、およびそれらの選択・配置等）に関する知的財産権（著作権、商標権、特許権、実用新案権、意匠権、ノウハウを含むがこれらに限られない）は、当社または当社にライセンスを許諾している者に帰属します。
          </p>
          <p className="text-gray-600 mb-4">
            登録ユーザーは、本サービスの利用に必要な範囲でのみこれらのコンテンツを使用することができ、当社の事前の書面による承諾なく、複製、改変、公衆送信、販売、その他の二次利用を行うことはできません。
          </p>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">2. 成果物の知的財産権</h3>
          <p className="text-gray-600 mb-4">
            専門家とクライアント間のサービス提供によって生じた成果物の知的財産権については、以下の通り取り扱います：
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2"><strong>デフォルトルール</strong>：当事者間で別途書面による合意がない限り、成果物の著作権は専門家に帰属します。ただし、クライアントは成果物を自己の事業のために使用する権利（利用許諾）を有します。</li>
            <li className="mb-2"><strong>著作権譲渡</strong>：クライアントが成果物の著作権譲渡を希望する場合は、オークション出品時または落札後の交渉において、追加料金を含めた条件を専門家と合意する必要があります。</li>
            <li className="mb-2"><strong>既存の知的財産</strong>：専門家が成果物に自己または第三者の既存の知的財産を含める場合、事前にクライアントに通知し、必要な権利処理を行うものとします。</li>
            <li className="mb-2"><strong>機密情報</strong>：サービス提供の過程でクライアントから提供された機密情報、営業秘密、個人情報等は、クライアントに帰属し、専門家は守秘義務を負います。</li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">3. ユーザー生成コンテンツ</h3>
          <p className="text-gray-600 mb-4">
            登録ユーザーが本サービス上に投稿したプロフィール情報、サービス説明、レビュー、コメント等（以下「ユーザー生成コンテンツ」）の著作権は、当該ユーザーに帰属します。
          </p>
          <p className="text-gray-600 mb-4">
            ただし、登録ユーザーは、当社に対して、ユーザー生成コンテンツを本サービスの運営、改善、プロモーションのために、無償で、地域や期間の制限なく、複製、改変、公衆送信、翻訳する権利を許諾するものとします。
          </p>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">4. 権利侵害の申立て</h3>
          <p className="text-gray-600 mb-4">
            第三者の知的財産権を侵害するコンテンツを発見した場合、権利者は当社の定める手続きに従って侵害の申立てを行うことができます。当社は、正当な申立てと判断した場合、当該コンテンツの削除等の適切な措置を講じます。
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第10条（免責事項）</h2>
          <p className="text-gray-600 mb-4">
            1. 当社は、本サービスに関して登録ユーザーに生じた損害について、当社に故意または重過失がある場合を除き、一切の責任を負いません。
          </p>
          <p className="text-gray-600 mb-4">
            2. 当社は、専門家が提供するサービスの品質、正確性、適法性、および成果について保証せず、これらに起因してクライアントに生じた損害について責任を負いません。
          </p>
          <p className="text-gray-600 mb-4">
            3. 登録ユーザー間の紛争については、当事者間で解決するものとし、当社は調停役としての支援は行いますが、法的責任は負いません。
          </p>
          <p className="text-gray-600 mb-4">
            4. 当社は、本サービスの提供の中断、停止、終了、利用不能または変更、登録ユーザーが本サービスに送信したメッセージまたは情報の削除または消失、登録ユーザーの登録の抹消、本サービスの利用によるデータの消失または機器の故障もしくは損傷、その他本サービスに関して登録ユーザーに生じた損害につき、賠償する責任を一切負わないものとします。
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第11条（規約の変更）</h2>
          <p className="text-gray-600 mb-4">
            1. 当社は、必要と判断した場合には、登録ユーザーに通知することなく、いつでも本規約を変更することができるものとします。
          </p>
          <p className="text-gray-600 mb-4">
            2. 変更後の本規約は、当社ウェブサイトに掲示された時点から効力を生じるものとします。
          </p>
          <p className="text-gray-600 mb-4">
            3. 登録ユーザーは、本規約の変更後も本サービスを継続して利用することにより、変更後の本規約に同意したものとみなされます。
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第12条（準拠法および管轄裁判所）</h2>
          <p className="text-gray-600 mb-4">
            1. 本規約の解釈にあたっては、日本法を準拠法とします。
          </p>
          <p className="text-gray-600 mb-4">
            2. 本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              本規約は2025年6月4日に制定されました。
            </p>
            <p className="text-gray-600 mb-8">
              最終改定日：2025年6月4日
            </p>
            <p className="text-gray-700 font-semibold">
              株式会社TimeBid<br />
              代表取締役 山田 太郎
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
