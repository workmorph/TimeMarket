'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Key, Copy, Check, AlertTriangle, Shield } from 'lucide-react'

export default function ApiKeyCreatedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  
  const apiKey = searchParams.get('key')
  const keyName = searchParams.get('name')
  
  useEffect(() => {
    // セキュリティのため、APIキーがない場合はリダイレクト
    if (!apiKey) {
      router.replace('/dashboard/api-keys')
    }
  }, [apiKey, router])
  
  const copyToClipboard = async () => {
    if (!apiKey) return
    
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  if (!apiKey) {
    return null
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100">
              <Key className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">APIキーが作成されました</CardTitle>
          <CardDescription>
            {keyName ? `「${keyName}」のAPIキーが正常に作成されました` : 'APIキーが正常に作成されました'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* APIキー表示 */}
          <div>
            <label className="text-sm font-medium mb-2 block">あなたのAPIキー</label>
            <div className="relative">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 pr-12 font-mono text-sm break-all">
                {apiKey}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* セキュリティ警告 */}
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">重要なセキュリティ情報</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>このAPIキーは二度と表示されません。必ず安全な場所に保管してください。</li>
                  <li>APIキーを第三者と共有しないでください。</li>
                  <li>キーが漏洩した場合は、すぐに無効化して新しいキーを作成してください。</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          {/* ベストプラクティス */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-blue-900">セキュリティのベストプラクティス</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>環境変数にAPIキーを保存する</li>
                  <li>ソースコードに直接記述しない</li>
                  <li>Gitリポジトリにコミットしない</li>
                  <li>HTTPSを使用して通信を暗号化する</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => router.push('/dashboard/api-keys')}
              className="flex-1"
            >
              APIキー管理に戻る
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/api-keys?tab=docs')}
              className="flex-1"
            >
              実装ガイドを見る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}