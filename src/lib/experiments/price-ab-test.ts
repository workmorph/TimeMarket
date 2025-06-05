import ABTestingFramework from '@/services/experiments/ABTestingFramework'
import type { PriceDisplayVariant } from '@/components/auction/PriceDisplayVariants'

// 実験ID
export const PRICE_DISPLAY_EXPERIMENT_ID = 'price_display_variants_v1'

// メトリクス定義
export const PRICE_METRICS = {
  CLICK_RATE: 'price_click_rate',
  BID_RATE: 'bid_conversion_rate',
  TIME_TO_BID: 'time_to_first_bid',
  SESSION_DURATION: 'session_duration',
  PRICE_VIEW_COUNT: 'price_view_count',
} as const

// バリアント定義
export const PRICE_VARIANTS = {
  control: 'control',
  with_growth: 'with_growth',
  with_prediction: 'with_prediction',
} as const

// A/Bテストフレームワークのインスタンス
let abTestingFramework: ABTestingFramework | null = null

/**
 * 価格表示A/Bテストの初期化
 */
export function initializePriceABTest() {
  if (!abTestingFramework) {
    abTestingFramework = new ABTestingFramework()
    
    // 実験を作成（各バリアント33.3%ずつ）
    abTestingFramework.createExperiment(
      PRICE_DISPLAY_EXPERIMENT_ID,
      Object.values(PRICE_VARIANTS),
      {
        [PRICE_VARIANTS.control]: 33.34,
        [PRICE_VARIANTS.with_growth]: 33.33,
        [PRICE_VARIANTS.with_prediction]: 33.33,
      }
    )
  }
  
  return abTestingFramework
}

/**
 * ユーザーにバリアントを割り当てる
 */
export function assignPriceVariant(userId: string): PriceDisplayVariant {
  const framework = initializePriceABTest()
  
  try {
    const variant = framework.assignVariant(userId, PRICE_DISPLAY_EXPERIMENT_ID)
    return variant as PriceDisplayVariant
  } catch (error) {
    console.error('Failed to assign price variant:', error)
    return 'control' // フォールバック
  }
}

/**
 * メトリクスを記録する
 */
export function recordPriceMetric(
  userId: string,
  variant: PriceDisplayVariant,
  metric: keyof typeof PRICE_METRICS,
  value: number
) {
  const framework = initializePriceABTest()
  
  try {
    framework.recordMetric(
      userId,
      PRICE_DISPLAY_EXPERIMENT_ID,
      variant,
      PRICE_METRICS[metric],
      value
    )
  } catch (error) {
    console.error('Failed to record price metric:', error)
  }
}

/**
 * 価格クリックを記録する
 */
export function recordPriceClick(userId: string, variant: PriceDisplayVariant) {
  recordPriceMetric(userId, variant, 'CLICK_RATE', 1)
}

/**
 * 入札コンバージョンを記録する
 */
export function recordBidConversion(userId: string, variant: PriceDisplayVariant) {
  recordPriceMetric(userId, variant, 'BID_RATE', 1)
}

/**
 * セッション時間を記録する
 */
export function recordSessionDuration(userId: string, variant: PriceDisplayVariant, durationMs: number) {
  recordPriceMetric(userId, variant, 'SESSION_DURATION', durationMs)
}

/**
 * 実験結果を取得する
 */
export function getPriceABTestResults() {
  const framework = initializePriceABTest()
  
  try {
    return framework.getExperimentResults(PRICE_DISPLAY_EXPERIMENT_ID)
  } catch (error) {
    console.error('Failed to get price AB test results:', error)
    return null
  }
}

/**
 * 実験のステータスを取得する
 */
export function getPriceABTestStatus() {
  const framework = initializePriceABTest()
  const experiment = (framework as any).experiments.get(PRICE_DISPLAY_EXPERIMENT_ID)
  
  return experiment?.status || 'NOT_FOUND'
}

/**
 * 実験を一時停止する
 */
export function pausePriceABTest() {
  const framework = initializePriceABTest()
  framework.pauseExperiment(PRICE_DISPLAY_EXPERIMENT_ID)
}

/**
 * 実験を再開する
 */
export function resumePriceABTest() {
  const framework = initializePriceABTest()
  framework.resumeExperiment(PRICE_DISPLAY_EXPERIMENT_ID)
}

/**
 * 実験を終了する
 */
export function completePriceABTest() {
  const framework = initializePriceABTest()
  framework.completeExperiment(PRICE_DISPLAY_EXPERIMENT_ID)
}

/**
 * 統計的有意性をチェックする簡易実装
 * 実際のプロダクションでは、より高度な統計手法を使用する必要があります
 */
export function checkStatisticalSignificance(results: any) {
  if (!results || !results.variants) return null
  
  const variants = Object.entries(results.variants)
  if (variants.length < 2) return null
  
  // 最小サンプルサイズのチェック
  const MIN_SAMPLE_SIZE = 100
  const allHaveMinSamples = variants.every(([_, data]: any) => data.sampleSize >= MIN_SAMPLE_SIZE)
  if (!allHaveMinSamples) {
    return {
      isSignificant: false,
      message: `最小サンプルサイズ（${MIN_SAMPLE_SIZE}）に達していません`,
    }
  }
  
  // コンバージョン率の差をチェック（簡易版）
  const conversionRates = variants.map(([_, data]: any) => data.metrics.bid_conversion_rate || 0)
  const maxRate = Math.max(...conversionRates)
  const minRate = Math.min(...conversionRates)
  const difference = maxRate - minRate
  
  // 20%以上の差があれば有意とみなす（簡易版）
  const SIGNIFICANCE_THRESHOLD = 0.2
  const isSignificant = difference >= SIGNIFICANCE_THRESHOLD
  
  return {
    isSignificant,
    difference: Math.round(difference * 100),
    message: isSignificant 
      ? `統計的に有意な差（${Math.round(difference * 100)}%）が検出されました`
      : `まだ統計的に有意な差は検出されていません（差: ${Math.round(difference * 100)}%）`,
  }
}