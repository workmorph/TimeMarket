'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Play, Pause, StopCircle, TrendingUp, Users, MousePointer, ShoppingCart, Clock, BarChart3 } from 'lucide-react'
import { usePriceABTestResults } from '@/hooks/use-price-ab-test'
import {
  getPriceABTestStatus,
  pausePriceABTest,
  resumePriceABTest,
  completePriceABTest,
  checkStatisticalSignificance,
} from '@/lib/experiments/price-ab-test'
import { useState } from 'react'

export function PriceABTestDashboard() {
  const { results, loading, error } = usePriceABTestResults()
  const [status, setStatus] = useState(getPriceABTestStatus())
  
  const handlePause = () => {
    pausePriceABTest()
    setStatus('PAUSED')
  }
  
  const handleResume = () => {
    resumePriceABTest()
    setStatus('RUNNING')
  }
  
  const handleComplete = () => {
    if (confirm('実験を終了してもよろしいですか？')) {
      completePriceABTest()
      setStatus('COMPLETED')
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>エラーが発生しました: {error}</AlertDescription>
      </Alert>
    )
  }
  
  if (!results) {
    return (
      <Alert>
        <AlertDescription>実験データがありません</AlertDescription>
      </Alert>
    )
  }
  
  const significance = checkStatisticalSignificance(results)
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>価格表示A/Bテスト</CardTitle>
              <CardDescription>
                3つの価格表示パターンの効果を測定しています
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status === 'RUNNING' ? 'default' : status === 'PAUSED' ? 'secondary' : 'outline'}>
                {status === 'RUNNING' ? '実行中' : status === 'PAUSED' ? '一時停止' : '完了'}
              </Badge>
              <div className="flex gap-2">
                {status === 'RUNNING' && (
                  <Button size="sm" variant="outline" onClick={handlePause}>
                    <Pause className="w-4 h-4 mr-1" />
                    一時停止
                  </Button>
                )}
                {status === 'PAUSED' && (
                  <Button size="sm" variant="outline" onClick={handleResume}>
                    <Play className="w-4 h-4 mr-1" />
                    再開
                  </Button>
                )}
                {status !== 'COMPLETED' && (
                  <Button size="sm" variant="destructive" onClick={handleComplete}>
                    <StopCircle className="w-4 h-4 mr-1" />
                    終了
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{results.totalSamples}</div>
              <div className="text-sm text-muted-foreground">総サンプル数</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Object.keys(results.variants || {}).length}
              </div>
              <div className="text-sm text-muted-foreground">バリアント数</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {significance?.isSignificant ? '検出' : '未検出'}
              </div>
              <div className="text-sm text-muted-foreground">統計的有意差</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {significance?.difference || 0}%
              </div>
              <div className="text-sm text-muted-foreground">最大差</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 統計的有意性のアラート */}
      {significance && (
        <Alert variant={significance.isSignificant ? 'default' : 'secondary'}>
          <BarChart3 className="w-4 h-4" />
          <AlertDescription>{significance.message}</AlertDescription>
        </Alert>
      )}
      
      {/* バリアント詳細 */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(results.variants || {}).map(([variantName, data]: [string, any]) => (
          <Card key={variantName}>
            <CardHeader>
              <CardTitle className="text-lg">
                {getVariantDisplayName(variantName)}
              </CardTitle>
              <CardDescription>
                {getVariantDescription(variantName)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">サンプル数</span>
                </div>
                <span className="font-semibold">{data.sampleSize}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <MetricRow
                  icon={<MousePointer className="w-4 h-4" />}
                  label="クリック率"
                  value={formatPercentage(data.metrics.price_click_rate)}
                />
                <MetricRow
                  icon={<ShoppingCart className="w-4 h-4" />}
                  label="入札率"
                  value={formatPercentage(data.metrics.bid_conversion_rate)}
                  highlight={true}
                />
                <MetricRow
                  icon={<Clock className="w-4 h-4" />}
                  label="平均滞在時間"
                  value={formatDuration(data.metrics.session_duration)}
                />
                <MetricRow
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="ページビュー"
                  value={Math.round(data.metrics.price_view_count || 0).toString()}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MetricRow({ icon, label, value, highlight = false }: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`flex items-center justify-between ${highlight ? 'font-semibold' : ''}`}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>
      <span className={highlight ? 'text-blue-600' : ''}>{value}</span>
    </div>
  )
}

function getVariantDisplayName(variant: string): string {
  const names: Record<string, string> = {
    control: 'パターンA（既存）',
    with_growth: 'パターンB（上昇率）',
    with_prediction: 'パターンC（予想価格）',
  }
  return names[variant] || variant
}

function getVariantDescription(variant: string): string {
  const descriptions: Record<string, string> = {
    control: '現在価格のみを表示',
    with_growth: '価格と上昇率を表示',
    with_prediction: '価格と予想最終価格を表示',
  }
  return descriptions[variant] || ''
}

function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === 0) return '0%'
  return `${Math.round(value * 100)}%`
}

function formatDuration(milliseconds: number | undefined): string {
  if (!milliseconds) return '0秒'
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`
  }
  return `${seconds}秒`
}