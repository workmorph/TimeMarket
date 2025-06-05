'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Copy,
  Download,
  ExternalLink,
  Save,
  Settings,
} from 'lucide-react'

export default function WidgetAdminPage() {
  const [config, setConfig] = useState({
    theme: 'light',
    primaryColor: '#0066cc',
    borderRadius: '8px',
    showLogo: true,
    customCSS: '',
  })

  const [loadData] = useState(() => async () => {
    // データ読み込み処理（モック）
    console.log('Loading widget configuration...')
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async () => {
    try {
      // 保存処理
      console.log('Saving configuration:', config)
      alert('設定を保存しました')
    } catch (error) {
      console.error('Save error:', error)
      alert('保存に失敗しました')
    }
  }

  const handleConfigChange = (key: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const generateEmbedCode = () => {
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL}/widget/embed.js';
    script.async = true;
    script.onload = function() {
      TimeBidWidget.init(${JSON.stringify(config, null, 2)});
    };
    document.head.appendChild(script);
  })();
</script>`
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ウィジェット管理</h1>
        <p className="text-muted-foreground">
          TimeBidウィジェットの設定とカスタマイズ
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                基本設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">テーマ</Label>
                <select
                  id="theme"
                  value={config.theme}
                  onChange={(e) => handleConfigChange('theme', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="light">ライト</option>
                  <option value="dark">ダーク</option>
                </select>
              </div>

              <div>
                <Label htmlFor="primaryColor">プライマリカラー</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="borderRadius">角の丸み</Label>
                <Input
                  id="borderRadius"
                  value={config.borderRadius}
                  onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
                  placeholder="8px"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={config.showLogo}
                  onChange={(e) => handleConfigChange('showLogo', e.target.checked)}
                />
                <Label htmlFor="showLogo">ロゴを表示</Label>
              </div>

              <div>
                <Label htmlFor="customCSS">カスタムCSS</Label>
                <Textarea
                  id="customCSS"
                  value={config.customCSS}
                  onChange={(e) => handleConfigChange('customCSS', e.target.value)}
                  placeholder="/* カスタムスタイルを入力 */"
                  className="font-mono text-sm"
                  rows={6}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                設定を保存
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>埋め込みコード</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateEmbedCode()}
                readOnly
                className="font-mono text-sm"
                rows={12}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => navigator.clipboard.writeText(generateEmbedCode())}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  ダウンロード
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  プレビュー
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
