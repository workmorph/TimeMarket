'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { PriceDisplayVariant } from '@/components/auction/PriceDisplayVariants'
import {
  assignPriceVariant,
  recordPriceClick,
  recordBidConversion,
  recordSessionDuration,
  recordPriceMetric,
} from '@/lib/experiments/price-ab-test'

/**
 * 価格表示A/Bテスト用のカスタムフック
 * ユーザーのバリアント割り当てとメトリクス記録を管理
 */
export function usePriceABTest() {
  const { user } = useAuth()
  const [variant, setVariant] = useState<PriceDisplayVariant>('control')
  const [sessionId] = useState(() => generateSessionId())
  const sessionStartTime = useRef<number>(Date.now())
  const hasRecordedSession = useRef(false)
  
  // ユーザーIDまたはセッションIDを取得
  const userId = user?.id || sessionId
  
  // バリアントの割り当て
  useEffect(() => {
    const assignedVariant = assignPriceVariant(userId)
    setVariant(assignedVariant)
  }, [userId])
  
  // 価格クリックの記録
  const recordClick = useCallback(() => {
    recordPriceClick(userId, variant)
  }, [userId, variant])
  
  // 入札の記録
  const recordBid = useCallback(() => {
    recordBidConversion(userId, variant)
  }, [userId, variant])
  
  // ページビューの記録
  const recordPageView = useCallback(() => {
    recordPriceMetric(userId, variant, 'PRICE_VIEW_COUNT', 1)
  }, [userId, variant])
  
  // セッション時間の記録
  const recordSession = useCallback(() => {
    if (!hasRecordedSession.current) {
      const duration = Date.now() - sessionStartTime.current
      recordSessionDuration(userId, variant, duration)
      hasRecordedSession.current = true
    }
  }, [userId, variant])
  
  // コンポーネントのアンマウント時にセッション時間を記録
  useEffect(() => {
    return () => {
      recordSession()
    }
  }, [recordSession])
  
  // ページビューを記録
  useEffect(() => {
    recordPageView()
  }, [recordPageView])
  
  return {
    variant,
    recordClick,
    recordBid,
    recordSession,
    userId,
  }
}

/**
 * セッションIDを生成する
 */
function generateSessionId(): string {
  // タイムスタンプとランダム文字列を組み合わせる
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return `session_${timestamp}_${randomStr}`
}

/**
 * A/Bテスト結果表示用のフック
 */
export function usePriceABTestResults() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        // 実際の実装では、APIエンドポイントから結果を取得
        const { getPriceABTestResults } = await import('@/lib/experiments/price-ab-test')
        const data = getPriceABTestResults()
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results')
      } finally {
        setLoading(false)
      }
    }
    
    fetchResults()
    
    // 定期的に結果を更新
    const interval = setInterval(fetchResults, 30000) // 30秒ごと
    
    return () => clearInterval(interval)
  }, [])
  
  return { results, loading, error }
}