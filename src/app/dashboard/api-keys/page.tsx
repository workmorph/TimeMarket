'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { ApiKeyManagement } from '@/components/dashboard/ApiKeyManagement'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertOctagon, Copy, ExternalLink, Clipboard, InfoIcon } from "lucide-react"
import { ApiKey } from '@/models/ApiKey'
import { toast } from 'sonner'

export default function ApiKeysPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])
  
  // APIキーの取得
  const fetchApiKeys = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/api-keys')
      
      if (!response.ok) {
        throw new Error('APIキーの取得に失敗しました')
      }
      
      const data = await response.json()
      setApiKeys(data.apiKeys || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchApiKeys()
  }, [user])
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('クリップボードにコピーしました')
    } catch (error) {
      toast.error('コピーに失敗しました')
    }
  }
  
  if (authLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">APIキー管理</h1>
          <p className="text-gray-500 mt-1">ウィジェット埋め込み用のAPIキーを管理します</p>
        </div>
      </div>
      
      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">APIキー</TabsTrigger>
          <TabsTrigger value="docs">ドキュメント</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys" className="space-y-6">
          {/* エラーメッセージ */}
          {error && (
            <Alert variant="destructive">
              <AlertOctagon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* APIキー管理コンポーネント */}
          <ApiKeyManagement 
            apiKeys={apiKeys}
            onRefresh={fetchApiKeys}
          />
        </TabsContent>
        
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle>ウィジェット埋め込みガイド</CardTitle>
                  <CardDescription>
                    TimeBidウィジェットを外部サイトに埋め込む方法を説明します
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ステップ1: スクリプトの追加 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">1</div>
                  <h3 className="text-lg font-semibold">スクリプトの追加</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  以下のスクリプトをHTMLの<code>&lt;head&gt;</code>または<code>&lt;body&gt;</code>の終了タグの直前に追加します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<script src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://timebid.jp'}/widget/timebid-widget.js"></script>`}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`<script src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://timebid.jp'}/widget/timebid-widget.js"></script>`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* ステップ2: コンテナの準備 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">2</div>
                  <h3 className="text-lg font-semibold">コンテナの準備</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  ウィジェットを表示する場所にコンテナ要素を追加します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<div id="timebid-widget-container"></div>`}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('<div id="timebid-widget-container"></div>')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* ステップ3: ウィジェットの初期化 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">3</div>
                  <h3 className="text-lg font-semibold">ウィジェットの初期化</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  以下のJavaScriptコードを使用してウィジェットを初期化します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<script>
document.addEventListener('DOMContentLoaded', function() {
  const widget = new TimeBidWidget({
    apiKey: 'YOUR_API_KEY', // ここにAPIキーを入力
    container: '#timebid-widget-container',
    config: {
      theme: 'light', // 'light' または 'dark'
      locale: 'ja', // 'ja' または 'en'
      defaultAuctionId: null, // 特定のオークションを表示する場合
    },
    onReady: function() {
      console.log('ウィジェットの準備が完了しました');
    },
    onBid: function(data) {
      console.log('入札が行われました:', data);
    },
    onError: function(error) {
      console.error('エラーが発生しました:', error);
    }
  });
  
  widget.init();
});
</script>`}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`<script>
document.addEventListener('DOMContentLoaded', function() {
  const widget = new TimeBidWidget({
    apiKey: 'YOUR_API_KEY',
    container: '#timebid-widget-container',
    config: {
      theme: 'light',
      locale: 'ja',
      defaultAuctionId: null,
    },
    onReady: function() {
      console.log('ウィジェットの準備が完了しました');
    },
    onBid: function(data) {
      console.log('入札が行われました:', data);
    },
    onError: function(error) {
      console.error('エラーが発生しました:', error);
    }
  });
  
  widget.init();
});
</script>`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* カスタマイズオプション */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">4</div>
                  <h3 className="text-lg font-semibold">カスタマイズオプション</h3>
                </div>
                <div className="ml-8 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">設定オプション</h4>
                    <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <code className="text-indigo-600">theme</code>
                          <p className="text-muted-foreground mt-1">ウィジェットのテーマ（'light' または 'dark'）</p>
                        </div>
                        <div>
                          <code className="text-indigo-600">locale</code>
                          <p className="text-muted-foreground mt-1">表示言語（'ja' または 'en'）</p>
                        </div>
                        <div>
                          <code className="text-indigo-600">defaultAuctionId</code>
                          <p className="text-muted-foreground mt-1">初期表示するオークションID</p>
                        </div>
                        <div>
                          <code className="text-indigo-600">hideHeader</code>
                          <p className="text-muted-foreground mt-1">ヘッダーを非表示にする（true/false）</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">イベントハンドラ</h4>
                    <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                      <div className="space-y-3">
                        <div>
                          <code className="text-indigo-600">onReady()</code>
                          <p className="text-muted-foreground mt-1">ウィジェットの初期化完了時に呼ばれます</p>
                        </div>
                        <div>
                          <code className="text-indigo-600">onBid(data)</code>
                          <p className="text-muted-foreground mt-1">入札が行われた時に呼ばれます</p>
                        </div>
                        <div>
                          <code className="text-indigo-600">onError(error)</code>
                          <p className="text-muted-foreground mt-1">エラーが発生した時に呼ばれます</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* サポート情報 */}
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>ウィジェットの埋め込みに関してご不明な点がございましたら、サポートまでお問い合わせください。</p>
                    <div className="flex gap-4 mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/docs/widget" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          詳細ドキュメント
                        </a>
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}