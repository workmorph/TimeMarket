import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Bot, FileText, UserCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pt-14 pb-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                AIが繋ぐ
                <span className="text-blue-600">専門家マッチング</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                AIがクライアントのニーズを詳細に分析し、最適な専門家とマッチング。明確な最低落札額と専門分野で安心取引。
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/auth/register">
                    今すぐ始める
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8">
                  <Link href="/auctions">オークションを見る</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">AIドリブンプロセス</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              どのように機能するか
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              AI技術により、クライアントの要件を正確に把握し、最適な専門家をマッチングします
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Bot className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  AI要件定義
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  AIがクライアントとの対話を通じて、プロジェクトの要件を詳細に聞き取り、構造化された要件定義を作成します。
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  双方向レポート生成
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  クライアントと専門家双方に向けて、プロジェクト概要と期待値を明確化したレポートを自動生成します。
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <UserCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  スマートマッチング
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  最低落札額と専門分野が明示された専門家の中から、要件に最適なマッチングを行います。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              数字で見るTimeBid
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">多くの専門家が既に活躍しています</p>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
              <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">1,200+</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold leading-6 text-gray-900">認証済み専門家</p>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  厳格な審査を通過した信頼できる専門家が登録
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/5 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">8,500+</p>
              <div className="lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold leading-6 text-white">完了セッション</p>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  高い満足度で完了したセッション数
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-blue-600 p-8 shadow-2xl ring-1 ring-gray-900/5 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">¥120M+</p>
              <div className="lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold leading-6 text-white">取引総額</p>
                <p className="mt-2 text-base leading-7 text-blue-200">専門家が得た総収益</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">AIマッチングの強み</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              なぜTimeBidなのか
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              AI技術と透明性の高いオークション形式で、クライアントと専門家の双方に最適な体験を提供
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Bot className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  AI要件分析による精密マッチング
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  AIがクライアントの要件を詳細に分析し、最適な専門分野と経験を持つ専門家を選定します。
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  透明な最低落札額システム
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  専門家が事前に設定した最低落札額により、予算の透明性を確保し、適正価格での取引を実現します。
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  双方向レポートで期待値調整
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  AIが生成するレポートにより、クライアントと専門家の期待値を事前に調整し、プロジェクト成功率を向上します。
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <UserCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  専門分野明示プロフィール
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  各専門家の専門分野と提供価値が明確に表示され、クライアントは確信を持って選択できます。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              AIが最適化する
              <br />
              専門家マッチングを体験
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              AIによる要件分析と透明な価格設定で、クライアントと専門家の双方に価値ある取引を実現します。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/auth/register">無料で始める</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/auctions">詳しく見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
