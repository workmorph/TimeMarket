'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Key, Trash2, AlertTriangle, Clipboard, Clock, ExternalLink, Copy, Check } from 'lucide-react'
import { ApiKey } from '@/models/ApiKey'

export default function ApiKeysPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyOrigins, setNewKeyOrigins] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])
  
  // APIキーの取得
  useEffect(() => {
    if (!user) return
    
    async function fetchApiKeys() {
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
    
    fetchApiKeys()
  }, [user])
  
  // 新しいAPIキーの作成
  const handleCreateApiKey = async () => {
    try {
      setIsCreatingKey(true)
      setError(null)
      
      if (!newKeyName.trim()) {
        setError('APIキー名を入力してください')
        return
      }
      
      const payload: {
        name: string;
        allowed_origins?: string[];
      } = {
        name: newKeyName.trim()
      }
      
      // オリジンの追加（カンマ区切りで複数指定可能）
      if (newKeyOrigins.trim()) {
        payload.allowed_origins = newKeyOrigins
          .split(',')
          .map(origin => origin.trim())
          .filter(origin => origin.length > 0)
      }
      
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'APIキーの作成に失敗しました')
      }
      
      const data = await response.json()
      
      // 新しいキーをUIに表示
      setNewKey(data.apiKey.key)
      
      // APIキーリストを更新
      setApiKeys(prev => [data.apiKey, ...prev])
      
      // 入力フィールドをリセット
      setNewKeyName('')
      setNewKeyOrigins('')
      
      // ダイアログを開く
      setIsDialogOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setIsCreatingKey(false)
    }
  }
  
  // APIキーの無効化
  const handleDeactivateKey = async (keyId: string) => {
    if (!confirm('このAPIキーを無効化しますか？この操作は元に戻せません。')) {
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'APIキーの無効化に失敗しました')
      }
      
      // APIキーリストを更新
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, is_active: false } : key
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }
  
  // APIキーをクリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未設定'
    return new Date(dateString).toLocaleString('ja-JP')
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">APIキー管理</h1>
          <p className="text-gray-500 mt-1">ウィジェット埋め込み用のAPIキーを管理します</p>
        </div>
      </div>
      
      <Tabs defaultValue="keys">
        <TabsList className="mb-6">
          <TabsTrigger value="keys">APIキー</TabsTrigger>
          <TabsTrigger value="docs">ドキュメント</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys">
          <div className="grid gap-6">
            {/* 新しいAPIキーの作成 */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-blue-600"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>新しいAPIキーの作成</CardTitle>
                    <CardDescription>
                      外部サイトにTimeBidウィジェットを埋め込むためのAPIキーを作成します
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name" className="font-medium">APIキー名 (必須)</Label>
                  <Input
                    id="key-name"
                    placeholder="例: 会社ウェブサイト用"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowed-origins" className="font-medium">許可するオリジン (オプション)</Label>
                  <Input
                    id="allowed-origins"
                    placeholder="例: https://example.com, https://sub.example.com"
                    value={newKeyOrigins}
                    onChange={(e) => setNewKeyOrigins(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-start mt-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      カンマ区切りで複数指定できます。空白の場合はすべてのオリジンからのアクセスを許可します。
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateApiKey} 
                  disabled={isCreatingKey || !newKeyName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCreatingKey ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      作成中...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      APIキーを作成
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* エラーメッセージ */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* APIキーリスト */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-purple-600"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-50">
                    <Clipboard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>APIキー一覧</CardTitle>
                    <CardDescription>
                      作成したAPIキーの管理と無効化を行います
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-gray-100 mb-4">
                      <Key className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-500 mb-1">
                      APIキーがありません
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      上記フォームから新しいAPIキーを作成してください。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${key.is_active ? 'bg-green-50' : 'bg-gray-100'}`}>
                              <Key className={`h-4 w-4 ${key.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <div className="font-medium text-lg">{key.name}</div>
                              <div className="text-sm text-muted-foreground">
                                作成日: {formatDate(key.created_at)}
                              </div>
                            </div>
                          </div>
                          <Badge variant={key.is_active ? "default" : "outline"} className={key.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                            {key.is_active ? "有効" : "無効"}
                          </Badge>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-muted-foreground font-medium">最終使用日</div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              {key.last_used_at ? formatDate(key.last_used_at) : '未使用'}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-muted-foreground font-medium">許可オリジン</div>
                            <div className="flex items-center">
                              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <span className="truncate">
                                {key.allowed_origins && key.allowed_origins.length > 0 
                                  ? key.allowed_origins.join(', ') 
                                  : 'すべて許可'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {key.is_active && (
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeactivateKey(key.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              無効化
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="docs">
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-1 bg-indigo-600"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-indigo-50">
                  <Clipboard className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>ウィジェット埋め込みガイド</CardTitle>
                  <CardDescription>
                    TimeBidウィジェットを外部サイトに埋め込む方法を説明します
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">1</div>
                  <h3 className="text-lg font-semibold">スクリプトの追加</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  以下のスクリプトをHTMLの<code>&lt;head&gt;</code>または<code>&lt;body&gt;</code>の終了タグの直前に追加します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto"><code>{`<script src="https://cdn.timebid.jp/widget/latest/timebid-widget.js"></script>`}</code></pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white hover:bg-gray-50"
                    onClick={() => copyToClipboard('<script src="https://cdn.timebid.jp/widget/latest/timebid-widget.js"></script>')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">2</div>
                  <h3 className="text-lg font-semibold">コンテナの準備</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  ウィジェットを表示する場所にコンテナ要素を追加します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto"><code>{`<div id="timebid-widget-container"></div>`}</code></pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white hover:bg-gray-50"
                    onClick={() => copyToClipboard('<div id="timebid-widget-container"></div>')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">3</div>
                  <h3 className="text-lg font-semibold">ウィジェットの初期化</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  以下のJavaScriptコードを使用してウィジェットを初期化します。
                </p>
                <div className="bg-gray-50 p-4 rounded-md relative border border-gray-100 ml-8">
                  <pre className="text-sm overflow-x-auto"><code>{`<script>
  document.addEventListener('DOMContentLoaded', function() {
    // ウィジェットの初期化
    const widget = TimeBid.createWidget({
      apiKey: 'YOUR_API_KEY', // ここにAPIキーを入力
      containerId: 'timebid-widget-container',
      theme: {
        primaryColor: '#3498db',
        secondaryColor: '#f0f9ff',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '0.5rem'
      },
      onBidPlaced: function(bid) {
        console.log('入札が行われました:', bid);
      },
      onAuctionEnd: function(auction) {
        console.log('オークションが終了しました:', auction);
      }
    });
  });
</script>`}</code></pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white hover:bg-gray-50"
                    onClick={() => copyToClipboard(`<script>
  document.addEventListener('DOMContentLoaded', function() {
    // ウィジェットの初期化
    const widget = TimeBid.createWidget({
      apiKey: 'YOUR_API_KEY', // ここにAPIキーを入力
      containerId: 'timebid-widget-container',
      theme: {
        primaryColor: '#3498db',
        secondaryColor: '#f0f9ff',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '0.5rem'
      },
      onBidPlaced: function(bid) {
        console.log('入札が行われました:', bid);
      },
      onAuctionEnd: function(auction) {
        console.log('オークションが終了しました:', auction);
      }
    });
  });
</script>`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">4</div>
                  <h3 className="text-lg font-semibold">カスタマイズオプション</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  ウィジェットの外観や動作をカスタマイズするためのオプションです。
                </p>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100 ml-8">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-indigo-700 mb-2">theme: ウィジェットの外観をカスタマイズ</p>
                      <div className="grid grid-cols-2 gap-2 pl-4">
                        <div className="text-sm text-gray-600">primaryColor:</div>
                        <div className="text-sm">メインカラー</div>
                        <div className="text-sm text-gray-600">secondaryColor:</div>
                        <div className="text-sm">背景色</div>
                        <div className="text-sm text-gray-600">fontFamily:</div>
                        <div className="text-sm">フォント</div>
                        <div className="text-sm text-gray-600">borderRadius:</div>
                        <div className="text-sm">角丸の半径</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-indigo-700 mb-2">イベントハンドラ: ウィジェットのイベントに対応するコールバック関数</p>
                      <div className="grid grid-cols-2 gap-2 pl-4">
                        <div className="text-sm text-gray-600">onBidPlaced:</div>
                        <div className="text-sm">入札時に呼び出される関数</div>
                        <div className="text-sm text-gray-600">onAuctionEnd:</div>
                        <div className="text-sm">オークション終了時に呼び出される関数</div>
                        <div className="text-sm text-gray-600">onWidgetLoad:</div>
                        <div className="text-sm">ウィジェット読み込み完了時に呼び出される関数</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="p-1.5 rounded-full bg-indigo-100 mr-2">
                    <ExternalLink className="h-4 w-4 text-indigo-600" />
                  </div>
                  サポートとリソース
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  ウィジェットの埋め込みに関する質問や問題があれば、以下のリソースをご利用ください。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="bg-white hover:bg-gray-50">
                    <ExternalLink className="mr-2 h-4 w-4 text-indigo-600" />
                    詳細ドキュメントを見る
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 新しいAPIキーの表示ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-50">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">APIキーが作成されました</DialogTitle>
                <DialogDescription>
                  このAPIキーは一度だけ表示されます。安全な場所に保管してください。
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {newKey && (
            <div className="my-6">
              <Label htmlFor="api-key" className="font-medium text-gray-700 mb-1.5 block">ウィジェット埋め込み用APIキー</Label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md relative">
                <p className="font-mono text-sm break-all pr-10">{newKey}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => copyToClipboard(newKey)}
                >
                  {copied ? 
                    <div className="bg-green-100 text-green-700 rounded-full p-1.5">
                      <Check className="h-4 w-4" />
                    </div> : 
                    <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-start mt-4 bg-amber-50 p-3 rounded-md border border-amber-100">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  このキーはセキュリティ上の理由から二度と表示されません。必ずコピーして安全な場所に保管してください。
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-2">
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
