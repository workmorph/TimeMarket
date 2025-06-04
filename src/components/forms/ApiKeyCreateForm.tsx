'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { InfoIcon, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface ApiKeyFormData {
  key_name: string
  permissions: {
    read: boolean
    write: boolean
  }
  allowed_origins: string[]
  rate_limit: number
  expires_in: string // 日数
}

export function ApiKeyCreateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApiKeyFormData>({
    key_name: '',
    permissions: {
      read: true,
      write: false,
    },
    allowed_origins: [],
    rate_limit: 1000,
    expires_in: '365', // デフォルト1年
  })
  const [newOrigin, setNewOrigin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // バリデーション
    if (!formData.key_name.trim()) {
      setError('APIキー名を入力してください')
      return
    }

    if (!formData.permissions.read && !formData.permissions.write) {
      setError('少なくとも1つの権限を選択してください')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          expires_at: formData.expires_in === 'never' 
            ? null 
            : new Date(Date.now() + parseInt(formData.expires_in) * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'APIキーの作成に失敗しました')
      }

      const { key } = await response.json()
      
      // 作成成功時にキーを表示するページへ遷移
      router.push(`/dashboard/api-keys/created?key=${encodeURIComponent(key.key_value)}&name=${encodeURIComponent(key.key_name)}`)
      toast.success('APIキーを作成しました')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'APIキーの作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addOrigin = () => {
    if (newOrigin && !formData.allowed_origins.includes(newOrigin)) {
      setFormData(prev => ({
        ...prev,
        allowed_origins: [...prev.allowed_origins, newOrigin],
      }))
      setNewOrigin('')
    }
  }

  const removeOrigin = (origin: string) => {
    setFormData(prev => ({
      ...prev,
      allowed_origins: prev.allowed_origins.filter(o => o !== origin),
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>新しいAPIキーの作成</CardTitle>
          <CardDescription>
            外部サービスからTimeBidウィジェットを利用するためのAPIキーを作成します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="key_name">APIキー名 *</Label>
              <Input
                id="key_name"
                placeholder="例: Production Widget Key"
                value={formData.key_name}
                onChange={(e) => setFormData(prev => ({ ...prev, key_name: e.target.value }))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                このキーの用途を識別するための名前
              </p>
            </div>
          </div>

          <Separator />

          {/* 権限設定 */}
          <div className="space-y-4">
            <div>
              <Label>権限 *</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="read"
                    checked={formData.permissions.read}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, read: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="read" className="font-normal cursor-pointer">
                    読み取り権限（オークション情報の取得、入札状況の確認）
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="write"
                    checked={formData.permissions.write}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, write: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="write" className="font-normal cursor-pointer">
                    書き込み権限（入札の作成、オークションへの参加）
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* セキュリティ設定 */}
          <div className="space-y-4">
            <div>
              <Label>オリジン制限</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOrigin())}
                  />
                  <Button type="button" onClick={addOrigin} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.allowed_origins.length > 0 && (
                  <div className="space-y-1">
                    {formData.allowed_origins.map((origin) => (
                      <div key={origin} className="flex items-center justify-between bg-muted px-3 py-2 rounded">
                        <span className="text-sm">{origin}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeOrigin(origin)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  APIキーを使用できるドメインを制限します（空の場合は制限なし）
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="rate_limit">レート制限（1時間あたりのリクエスト数）</Label>
              <Input
                id="rate_limit"
                type="number"
                min="1"
                max="10000"
                value={formData.rate_limit}
                onChange={(e) => setFormData(prev => ({ ...prev, rate_limit: parseInt(e.target.value) || 1000 }))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                1時間あたりの最大リクエスト数
              </p>
            </div>

            <div>
              <Label htmlFor="expires_in">有効期限</Label>
              <Select
                value={formData.expires_in}
                onValueChange={(value) => setFormData(prev => ({ ...prev, expires_in: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30日</SelectItem>
                  <SelectItem value="90">90日</SelectItem>
                  <SelectItem value="180">180日</SelectItem>
                  <SelectItem value="365">1年</SelectItem>
                  <SelectItem value="730">2年</SelectItem>
                  <SelectItem value="never">無期限</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              APIキーは作成時に一度だけ表示されます。必ず安全な場所に保管してください。
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                作成中...
              </>
            ) : (
              'APIキーを作成'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}