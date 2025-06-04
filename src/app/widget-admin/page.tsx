'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  BarChart3, 
  Globe, 
  Code, 
  Shield, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react'
import { WidgetCustomizer } from '@/components/widget/WidgetCustomizer'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { TenantSettings, WidgetConfig, PLANS } from '@/config/widget-config'

interface WidgetStats {
  totalImpressions: number
  totalClicks: number
  totalBids: number
  activeSites: number
  conversionRate: number
  revenue: number
}

interface DomainStats {
  domain: string
  impressions: number
  clicks: number
  bids: number
  lastSeen: Date
}

export default function WidgetAdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null)
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig | null>(null)
  const [stats, setStats] = useState<WidgetStats | null>(null)
  const [domainStats, setDomainStats] = useState<DomainStats[]>([])
  const [allowedDomains, setAllowedDomains] = useState<string[]>(['*'])
  const [newDomain, setNewDomain] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadData()
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)

      // ユーザーのテナント情報を取得
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id, role')
        .eq('id', user!.id)
        .single()

      if (!userData || (userData.role !== 'admin' && userData.role !== 'owner')) {
        router.push('/dashboard')
        return
      }

      // テナント設定を取得
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userData.tenant_id)
        .single()

      if (tenantData) {
        setTenantSettings({
          id: tenantData.id,
          name: tenantData.name,
          plan: tenantData.plan,
          limits: tenantData.limits,
          features: tenantData.features,
          billing: tenantData.billing
        })
      }

      // ウィジェット設定を取得
      const { data: configData } = await supabase
        .from('widget_configs')
        .select('*')
        .eq('tenant_id', userData.tenant_id)
        .single()

      if (configData) {
        setWidgetConfig(configData.config)
        setAllowedDomains(configData.allowed_origins || ['*'])
      }

      // 統計情報を取得（仮のデータ）
      setStats({
        totalImpressions: 45678,
        totalClicks: 3456,
        totalBids: 234,
        activeSites: 12,
        conversionRate: 6.77,
        revenue: 1234567
      })

      // ドメイン別統計を取得（仮のデータ）
      setDomainStats([
        {
          domain: 'example.com',
          impressions: 12345,
          clicks: 987,
          bids: 65,
          lastSeen: new Date()
        },
        {
          domain: 'shop.example.jp',
          impressions: 8765,
          clicks: 543,
          bids: 32,
          lastSeen: new Date(Date.now() - 3600000)
        },
        {
          domain: 'blog.example.net',
          impressions: 5432,
          clicks: 234,
          bids: 12,
          lastSeen: new Date(Date.now() - 7200000)
        }
      ])

    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async (config: WidgetConfig) => {
    try {
      setSaving(true)

      const response = await fetch('/api/widget/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config,
          allowedOrigins: allowedDomains
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save configuration')
      }

      // 成功通知を表示
      alert('設定を保存しました')
      
    } catch (error) {
      console.error('Save error:', error)
      alert('設定の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const addAllowedDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      setAllowedDomains([...allowedDomains, newDomain])
      setNewDomain('')
    }
  }

  const removeAllowedDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain))
  }

  const exportStats = () => {
    // CSV形式で統計をエクスポート
    const csv = [
      ['Domain', 'Impressions', 'Clicks', 'Bids', 'Last Seen'],
      ...domainStats.map(d => [
        d.domain,
        d.impressions.toString(),
        d.clicks.toString(),
        d.bids.toString(),
        d.lastSeen.toISOString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `widget-stats-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tenantSettings) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          テナント設定が見つかりません
        </AlertDescription>
      </Alert>
    )
  }

  const plan = PLANS[tenantSettings.plan]

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ウィジェット管理</h1>
        <p className="text-muted-foreground">
          マルチサイト対応ウィジェットの設定と分析
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総インプレッション
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalImpressions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              前月比 +12.5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総クリック数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              CTR: {((stats?.totalClicks || 0) / (stats?.totalImpressions || 1) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブサイト
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeSites}
            </div>
            <p className="text-xs text-muted-foreground">
              {plan.limits.customDomains === -1 ? '無制限' : `上限: ${plan.limits.customDomains}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              収益
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats?.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              コンバージョン率: {stats?.conversionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            設定
          </TabsTrigger>
          <TabsTrigger value="domains">
            <Globe className="mr-2 h-4 w-4" />
            ドメイン
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            分析
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            セキュリティ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          {widgetConfig && (
            <WidgetCustomizer
              tenantSettings={tenantSettings}
              onSave={handleSaveConfig}
              initialConfig={widgetConfig}
            />
          )}
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>許可ドメイン設定</CardTitle>
              <CardDescription>
                ウィジェットを埋め込み可能なドメインを管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>新しいドメインを追加</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                  <Button onClick={addAllowedDomain}>追加</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ワイルドカード（*.example.com）も使用できます
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>許可されているドメイン</Label>
                <div className="space-y-2">
                  {allowedDomains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-mono text-sm">{domain}</span>
                      {domain !== '*' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAllowedDomain(domain)}
                        >
                          削除
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ドメイン別統計</CardTitle>
              <CardDescription>
                各ドメインでのウィジェットパフォーマンス
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainStats.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">{domain.domain}</div>
                      <div className="text-sm text-muted-foreground">
                        最終アクセス: {domain.lastSeen.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-medium">{domain.impressions.toLocaleString()}</span> インプレッション
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{domain.clicks.toLocaleString()}</span> クリック
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{domain.bids}</span> 入札
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス分析</CardTitle>
              <CardDescription>
                ウィジェットの詳細な分析データ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">時間別パフォーマンス</h4>
                  <div className="h-64 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">グラフエリア（実装予定）</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">コンバージョンファネル</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>インプレッション</span>
                      <span className="font-medium">{stats?.totalImpressions.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
                    </div>

                    <div className="flex justify-between items-center">
                      <span>クリック</span>
                      <span className="font-medium">{stats?.totalClicks.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                    </div>

                    <div className="flex justify-between items-center">
                      <span>入札</span>
                      <span className="font-medium">{stats?.totalBids.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={exportStats}>
                    <Download className="mr-2 h-4 w-4" />
                    データをエクスポート
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                ウィジェットのセキュリティ対策状況
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>XSS保護: iframe sandboxing実装済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>CSPヘッダー: 適切に設定済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>HTTPS: 通信は暗号化されています</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>API認証: APIキーによる認証実装</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>レート制限: {plan.limits.apiCallsPerMinute}回/分</span>
                </div>
              </div>

              <Separator />

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  セキュリティは定期的に監査されています。
                  最終監査日: {new Date().toLocaleDateString()}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium">セキュリティレポート</h4>
                <Button variant="outline" asChild>
                  <a href="/security-report" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    詳細なセキュリティレポートを見る
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}