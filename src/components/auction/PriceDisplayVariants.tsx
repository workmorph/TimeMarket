'use client'

import { formatCurrency } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

export type PriceDisplayVariant = 'control' | 'with_growth' | 'with_prediction'

interface PriceDisplayProps {
  variant: PriceDisplayVariant
  currentPrice: number
  startingPrice?: number
  onClick?: () => void
}

/**
 * 価格表示のA/Bテストバリエーション
 * - control: 現在価格のみ（既存）
 * - with_growth: 価格 + 上昇率表示
 * - with_prediction: 価格 + 推定最終価格
 */
export function PriceDisplay({ variant, currentPrice, startingPrice = 0, onClick }: PriceDisplayProps) {
  // 上昇率を計算
  const growthRate = startingPrice > 0 
    ? Math.round(((currentPrice - startingPrice) / startingPrice) * 100)
    : 0

  // 推定最終価格を計算（簡易的なアルゴリズム）
  // 実際の実装では、過去のデータや機械学習モデルを使用
  const estimatedFinalPrice = Math.round(currentPrice * 1.3)

  switch (variant) {
    case 'control':
      // パターンA: 現在価格のみ
      return (
        <span className="text-xl font-bold text-blue-600 cursor-pointer" onClick={onClick}>
          {formatCurrency(currentPrice)}
        </span>
      )

    case 'with_growth':
      // パターンB: 価格 + 上昇率表示
      return (
        <span className="cursor-pointer" onClick={onClick}>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </span>
          {growthRate > 0 && (
            <span className="ml-2 text-sm font-medium text-green-600 inline-flex items-center">
              (+{growthRate}% <TrendingUp className="w-3 h-3 ml-1" />)
            </span>
          )}
        </span>
      )

    case 'with_prediction':
      // パターンC: 価格 + 推定最終価格
      return (
        <span className="cursor-pointer" onClick={onClick}>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            (予想最終 {formatCurrency(estimatedFinalPrice)})
          </span>
        </span>
      )

    default:
      // フォールバック
      return (
        <span className="text-xl font-bold text-blue-600 cursor-pointer" onClick={onClick}>
          {formatCurrency(currentPrice)}
        </span>
      )
  }
}

/**
 * オークションカード用の価格表示バリエーション
 * より詳細な表示を行う
 */
interface DetailedPriceDisplayProps extends PriceDisplayProps {
  bidCount?: number
  timeRemaining?: { hours: number; minutes: number }
}

export function DetailedPriceDisplay({ 
  variant, 
  currentPrice, 
  startingPrice = 0, 
  bidCount = 0,
  timeRemaining,
  onClick 
}: DetailedPriceDisplayProps) {
  const growthRate = startingPrice > 0 
    ? Math.round(((currentPrice - startingPrice) / startingPrice) * 100)
    : 0

  // より高度な予測アルゴリズム（時間と入札数を考慮）
  const timeMultiplier = timeRemaining && timeRemaining.hours < 1 ? 1.5 : 1.3
  const bidMultiplier = bidCount > 10 ? 1.1 : 1.0
  const estimatedFinalPrice = Math.round(currentPrice * timeMultiplier * bidMultiplier)

  switch (variant) {
    case 'control':
      return (
        <div className="cursor-pointer" onClick={onClick}>
          <div className="text-sm text-muted-foreground">現在価格</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </div>
        </div>
      )

    case 'with_growth':
      return (
        <div className="cursor-pointer" onClick={onClick}>
          <div className="text-sm text-muted-foreground">現在価格</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </div>
          {growthRate > 0 && (
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              開始価格から +{growthRate}% 上昇
            </div>
          )}
        </div>
      )

    case 'with_prediction':
      return (
        <div className="cursor-pointer" onClick={onClick}>
          <div className="text-sm text-muted-foreground">現在価格</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            予想最終価格: <span className="font-semibold">{formatCurrency(estimatedFinalPrice)}</span>
          </div>
        </div>
      )

    default:
      return (
        <div className="cursor-pointer" onClick={onClick}>
          <div className="text-sm text-muted-foreground">現在価格</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(currentPrice)}
          </div>
        </div>
      )
  }
}