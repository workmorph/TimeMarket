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
            2. 専門家が提供するサービスがクライアントによって落札された場合、当社は落札金額の15%を手数料として専門家から徴収します。この手数料は、専門家への支払い金額から自動的に差し引かれます。
          </p>
          <p className="text-gray-600 mb-4">
            3. 支払いはクレジットカード、銀行振込、またはその他当社が指定する方法で行うものとします。支払い処理は、当社が提携する決済サービス（Stripe等）を通じて行われます。
          </p>
          <p className="text-gray-600 mb-4">
            4. 登録ユーザーが利用料金の支払を遅滞した場合、登録ユーザーは年14.6％の割合による遅延損害金を当社に支払うものとします。
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

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">第7条（キャンセルおよび返金）</h2>
          <p className="text-gray-600 mb-4">
            本サービスにおけるキャンセルおよび返金について、以下の規定を定めます。
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-600">
            <li className="mb-2">クライアントは、専門家とのサービス実施日の3日前までであれば、キャンセル料なしでキャンセルすることができます。</li>
            <li className="mb-2">サービス実施日の2日前から当日までのキャンセルについては、落札金額の50%をキャンセル料として申し受けます。</li>
            <li className="mb-2">専門家側の事情によるキャンセルの場合、クライアントに対して全額返金されます。ただし、専門家が正当な理由なく繰り返しキャンセルを行う場合、当社は当該専門家のアカウント停止等の措置を取ることがあります。</li>
            <li className="mb-2">サービス提供が著しく契約内容と異なる場合、クライアントは返金を請求することができます。返金の可否は、当社が状況を調査した上で判断します。</li>
            <li className="mb-2">返金が認められた場合、決済手数料を除いた金額が返金されます。</li>
          </ol>

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
          <p className="text-gray-600 mb-4">
            本サービスにおいて提供される全てのコンテンツ（テキスト、グラフィック、ロゴ、ボタンアイコン、画像、音声、データ編集物、ソフトウェア等）に関する知的財産権は、当社または当社にライセンスを許諾している者に帰属します。
          </p>
          <p className="text-gray-600 mb-4">
            専門家とクライアント間のサービス提供によって生じた成果物の知的財産権の帰属については、当事者間で別途合意がない限り、専門家に帰属するものとします。ただし、クライアントは成果物を利用する権利を有します。
          </p>

          <p className="text-gray-600 mt-8 mb-4">
            本規約は2025年6月4日に制定されました。
          </p>
          <p className="text-gray-600">
            TimeBid運営事務局
          </p>
        </div>
      </div>
    </div>
  )
}
