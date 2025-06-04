'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Palette, 
  Layout, 
  Code, 
  Globe, 
  Shield, 
  AlertCircle,
  Check,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'
import { WidgetConfig, TenantSettings, PLANS } from '@/config/widget-config'
import { validateWidgetConfig, calculateWidgetSize, WIDGET_SIZE_LIMITS } from '@/widget/multi-tenant-config'

interface WidgetCustomizerProps {
  tenantSettings: TenantSettings
  onSave: (config: WidgetConfig) => Promise<void>
  initialConfig?: WidgetConfig
}

export function WidgetCustomizer({ tenantSettings, onSave, initialConfig }: WidgetCustomizerProps) {
  const [config, setConfig] = useState<WidgetConfig>(initialConfig || {
    apiKey: '',
    containerId: 'timebid-widget',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#60A5FA',
      fontFamily: 'Noto Sans JP, sans-serif',
      borderRadius: 'md',
      darkMode: false
    },
    features: {
      showBidHistory: true,
      enableAutoRefresh: true,
      refreshInterval: 30,
      showCountdown: true,
      enableNotifications: true
    },
    layout: {
      style: 'card',
      columns: 2
    },
    locale: 'ja'
  })

  const [customCSS, setCustomCSS] = useState('')
  const [customJS, setCustomJS] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // プランによる機能制限のチェック
  const plan = PLANS[tenantSettings.plan]
  const canUseCustomTheme = plan.features.customTheme
  const canUseCustomCode = plan.features.whiteLabel

  // 設定の検証
  useEffect(() => {
    const { errors } = validateWidgetConfig(config)
    setValidationErrors(errors)
  }, [config])

  // ウィジェットサイズの計算
  const widgetSize = calculateWidgetSize({
    tenantId: tenantSettings.id,
    domain: window.location.origin,
    apiKey: config.apiKey,
    widgetConfig: config,
    security: null as any,
    analytics: { enabled: false },
    customization: {
      allowCustomCSS: canUseCustomTheme,
      allowCustomJS: canUseCustomCode,
      customCSS,
      customJS
    }
  })

  const handleSave = async () => {
    if (validationErrors.length > 0) {
      return
    }

    setIsSaving(true)
    try {
      await onSave(config)
    } finally {
      setIsSaving(false)
    }
  }

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode()
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateEmbedCode = () => {
    return `<!-- TimeBid ウィジェット -->
<div id="${config.containerId}"></div>
<script>
  (function(w,d,s,o,f,js,fjs){
    w['TimeBid']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','tb','https://widget.timebid.jp/v1/widget.js'));
  
  tb('init', ${JSON.stringify(config, null, 2)});
</script>`
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            外観
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="mr-2 h-4 w-4" />
            レイアウト
          </TabsTrigger>
          <TabsTrigger value="features">
            <Globe className="mr-2 h-4 w-4" />
            機能
          </TabsTrigger>
          <TabsTrigger value="code" disabled={!canUseCustomCode}>
            <Code className="mr-2 h-4 w-4" />
            カスタムコード
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            セキュリティ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>テーマ設定</CardTitle>
              <CardDescription>
                ウィジェットの色やフォントをカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">プライマリカラー</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.theme?.primaryColor}
                      onChange={(e) => setConfig({
                        ...config,
                        theme: { ...config.theme, primaryColor: e.target.value }
                      })}
                      disabled={!canUseCustomTheme}
                      className="w-12"
                    />
                    <Input
                      value={config.theme?.primaryColor}
                      onChange={(e) => setConfig({
                        ...config,
                        theme: { ...config.theme, primaryColor: e.target.value }
                      })}
                      disabled={!canUseCustomTheme}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">セカンダリカラー</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={config.theme?.secondaryColor}
                      onChange={(e) => setConfig({
                        ...config,
                        theme: { ...config.theme, secondaryColor: e.target.value }
                      })}
                      disabled={!canUseCustomTheme}
                      className="w-12"
                    />
                    <Input
                      value={config.theme?.secondaryColor}
                      onChange={(e) => setConfig({
                        ...config,
                        theme: { ...config.theme, secondaryColor: e.target.value }
                      })}
                      disabled={!canUseCustomTheme}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">フォントファミリー</Label>
                <Input
                  id="font-family"
                  value={config.theme?.fontFamily}
                  onChange={(e) => setConfig({
                    ...config,
                    theme: { ...config.theme, fontFamily: e.target.value }
                  })}
                  disabled={!canUseCustomTheme}
                  placeholder="Noto Sans JP, sans-serif"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-radius">角丸の半径</Label>
                <Select
                  value={config.theme?.borderRadius}
                  onValueChange={(value) => setConfig({
                    ...config,
                    theme: { ...config.theme, borderRadius: value as any }
                  })}
                  disabled={!canUseCustomTheme}
                >
                  <SelectTrigger id="border-radius">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    <SelectItem value="sm">小</SelectItem>
                    <SelectItem value="md">中</SelectItem>
                    <SelectItem value="lg">大</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={config.theme?.darkMode}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    theme: { ...config.theme, darkMode: checked }
                  })}
                  disabled={!canUseCustomTheme}
                />
                <Label htmlFor="dark-mode">ダークモード</Label>
              </div>

              {!canUseCustomTheme && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    カスタムテーマは{plan.name}プランでは利用できません。
                    <a href="/pricing" className="text-primary hover:underline ml-1">
                      プランをアップグレード
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>レイアウト設定</CardTitle>
              <CardDescription>
                ウィジェットの表示方法を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout-style">表示スタイル</Label>
                <Select
                  value={config.layout?.style}
                  onValueChange={(value) => setConfig({
                    ...config,
                    layout: { ...config.layout, style: value as any }
                  })}
                >
                  <SelectTrigger id="layout-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">カード</SelectItem>
                    <SelectItem value="list">リスト</SelectItem>
                    <SelectItem value="compact">コンパクト</SelectItem>
                    <SelectItem value="detailed">詳細</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="columns">カラム数</Label>
                <Select
                  value={config.layout?.columns?.toString()}
                  onValueChange={(value) => setConfig({
                    ...config,
                    layout: { ...config.layout, columns: parseInt(value) as any }
                  })}
                >
                  <SelectTrigger id="columns">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1カラム</SelectItem>
                    <SelectItem value="2">2カラム</SelectItem>
                    <SelectItem value="3">3カラム</SelectItem>
                    <SelectItem value="4">4カラム</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-height">最大高さ</Label>
                <Input
                  id="max-height"
                  value={config.layout?.maxHeight || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    layout: { ...config.layout, maxHeight: e.target.value }
                  })}
                  placeholder="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>機能設定</CardTitle>
              <CardDescription>
                ウィジェットの動作を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-bid-history"
                    checked={config.features?.showBidHistory}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      features: { ...config.features, showBidHistory: checked }
                    })}
                  />
                  <Label htmlFor="show-bid-history">入札履歴を表示</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-auto-refresh"
                    checked={config.features?.enableAutoRefresh}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      features: { ...config.features, enableAutoRefresh: checked }
                    })}
                  />
                  <Label htmlFor="enable-auto-refresh">自動更新を有効化</Label>
                </div>

                {config.features?.enableAutoRefresh && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="refresh-interval">更新間隔（秒）</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      min="10"
                      max="300"
                      value={config.features?.refreshInterval}
                      onChange={(e) => setConfig({
                        ...config,
                        features: { ...config.features, refreshInterval: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-countdown"
                    checked={config.features?.showCountdown}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      features: { ...config.features, showCountdown: checked }
                    })}
                  />
                  <Label htmlFor="show-countdown">カウントダウンを表示</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-notifications"
                    checked={config.features?.enableNotifications}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      features: { ...config.features, enableNotifications: checked }
                    })}
                  />
                  <Label htmlFor="enable-notifications">通知を有効化</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>言語設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="locale">表示言語</Label>
                <Select
                  value={config.locale}
                  onValueChange={(value) => setConfig({ ...config, locale: value as any })}
                >
                  <SelectTrigger id="locale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          {canUseCustomCode ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>カスタムCSS</CardTitle>
                  <CardDescription>
                    ウィジェットに適用する追加のCSSを記述します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    placeholder=".timebid-widget { /* カスタムスタイル */ }"
                    className="font-mono h-40"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    最大 {WIDGET_SIZE_LIMITS.maxCustomCSSKB}KB
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>カスタムJavaScript</CardTitle>
                  <CardDescription>
                    ウィジェットのカスタム動作を記述します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customJS}
                    onChange={(e) => setCustomJS(e.target.value)}
                    placeholder="// カスタムスクリプト"
                    className="font-mono h-40"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    最大 {WIDGET_SIZE_LIMITS.maxCustomJSKB}KB
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                カスタムコードは{plan.name}プランでは利用できません。
                <a href="/pricing" className="text-primary hover:underline ml-1">
                  プランをアップグレード
                </a>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                ウィジェットのセキュリティ設定を確認します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">XSS保護が有効</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">CSPヘッダーが設定済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">iframe sandboxingが有効</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">HTTPS通信のみ許可</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>APIキー</Label>
                <div className="flex gap-2">
                  <Input
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    type="password"
                    placeholder="tb_xxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.querySelector('input[type="password"]') as HTMLInputElement
                      input.type = input.type === 'password' ? 'text' : 'password'
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  APIキーは安全に保管してください
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 検証エラー */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* ウィジェットサイズ */}
      <Card>
        <CardHeader>
          <CardTitle>ウィジェット情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">ウィジェットサイズ</span>
            <Badge variant={widgetSize > WIDGET_SIZE_LIMITS.maxSizeKB ? 'destructive' : 'secondary'}>
              {widgetSize}KB / {WIDGET_SIZE_LIMITS.maxSizeKB}KB
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">プラン</span>
            <Badge>{plan.name}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 埋め込みコード */}
      <Card>
        <CardHeader>
          <CardTitle>埋め込みコード</CardTitle>
          <CardDescription>
            このコードをウェブサイトに貼り付けてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              <code>{generateEmbedCode()}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={copyEmbedCode}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              プレビューを隠す
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              プレビューを表示
            </>
          )}
        </Button>

        <Button
          onClick={handleSave}
          disabled={validationErrors.length > 0 || isSaving}
        >
          {isSaving ? '保存中...' : '設定を保存'}
        </Button>
      </div>
    </div>
  )
}