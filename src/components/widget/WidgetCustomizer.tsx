'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface WidgetConfig {
  theme: string
  primaryColor: string
  borderRadius: string
  showLogo: boolean
  customCSS: string
}

interface WidgetCustomizerProps {
  onConfigChange: (config: WidgetConfig) => void
}

export default function WidgetCustomizer({ onConfigChange }: WidgetCustomizerProps) {
  const [config, setConfig] = useState<WidgetConfig>({
    theme: 'light',
    primaryColor: '#0066cc',
    borderRadius: '8px',
    showLogo: true,
    customCSS: '',
  })

  const handleConfigChange = (key: keyof WidgetConfig, value: string | boolean) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleConfigChange('theme', event.target.value)
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('primaryColor', event.target.value)
  }

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('borderRadius', event.target.value)
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('showLogo', event.target.checked)
  }

  const handleCSSChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleConfigChange('customCSS', event.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ウィジェット設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="theme">テーマ</Label>
          <select
            id="theme"
            value={config.theme}
            onChange={handleThemeChange}
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
            onChange={handleColorChange}
          />
        </div>

        <div>
          <Label htmlFor="borderRadius">角の丸み</Label>
          <Input
            id="borderRadius"
            value={config.borderRadius}
            onChange={handleRadiusChange}
            placeholder="8px"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showLogo"
            checked={config.showLogo}
            onChange={handleLogoChange}
          />
          <Label htmlFor="showLogo">ロゴを表示</Label>
        </div>

        <div>
          <Label htmlFor="customCSS">カスタムCSS</Label>
          <Textarea
            id="customCSS"
            value={config.customCSS}
            onChange={handleCSSChange}
            placeholder="/* カスタムスタイルを入力 */"
            className="font-mono text-sm"
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  )
}
