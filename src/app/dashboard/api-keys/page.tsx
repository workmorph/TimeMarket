'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Clipboard, Key, AlertTriangle, Check, Copy, ExternalLink, Trash2 } from 'lucide-react'
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
      
      const payload: any = {
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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">APIキー管理</h1>
      
      <Tabs defaultValue="keys">
        <TabsList className="mb-6">
          <TabsTrigger value="keys">APIキー</TabsTrigger>
          <TabsTrigger value="docs">ドキュメント</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys">
          <div className="grid gap-6">
            {/* 新しいAPIキーの作成 */}
            <Card>
              <CardHeader>
                <CardTitle>新しいAPIキーの作成</CardTitle>
                <CardDescription>
                  外部サイトにTimeBidウィジェットを埋め込むためのAPIキーを作成します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">APIキー名 (必須)</Label>
                  <Input
                    id="key-name"
                    placeholder="例: 会社ウェブサイト用"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowed-origins">許可するオリジン (オプション)</Label>
                  <Input
                    id="allowed-origins"
                    placeholder="例: https://example.com, https://sub.example.com"
                    value={newKeyOrigins}
                    onChange={(e) => setNewKeyOrigins(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    カンマ区切りで複数指定できます。空白の場合はすべてのオリジンからのアクセスを許可します。
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateApiKey} 
                  disabled={isCreatingKey || !newKeyName.trim()}
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
            <Card>
              <CardHeader>
                <CardTitle>APIキー一覧</CardTitle>
                <CardDescription>
                  作成したAPIキーの管理と無効化を行います
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    APIキーがありません。新しいAPIキーを作成してください。
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{key.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              作成日: {formatDate(key.created_at)}
                            </div>
                          </div>
                          <Badge variant={key.is_active ? "default" : "outline"}>
                            {key.is_active ? "有効" : "無効"}
                          </Badge>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-muted-foreground">最終使用日</div>
                            <div>{key.last_used_at ? formatDate(key.last_used_at) : '未使用'}</div>
                            
                            <div className="text-muted-foreground">許可オリジン</div>
                            <div>
                              {key.allowed_origins && key.allowed_origins.length > 0 
                                ? key.allowed_origins.join(', ') 
                                : 'すべて許可'}
                            </div>
                          </div>
                        </div>
                        
                        {key.is_active && (
                          <div className="mt-3 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeactivateKey(key.id)}
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
          <Card>
            <CardHeader>
              <CardTitle>ウィジェット埋め込みガイド</CardTitle>
              <CardDescription>
                TimeBidウィジェットを外部サイトに埋め込む方法を説明します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. スクリプトの追加</h3>
                <p className="text-sm text-muted-foreground">
                  以下のスクリプトをHTMLの<code>&lt;head&gt;</code>または<code>&lt;body&gt;</code>の終了タグの直前に追加します。
                </p>
                <div className="bg-muted p-3 rounded-md relative">
                  <pre className="text-xs overflow-x-auto"><code>{`<script src="https://cdn.timebid.jp/widget/latest/timebid-widget.js"></script>`}</code></pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('<script src="https://cdn.timebid.jp/widget/latest/timebid-widget.js"></script>')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. コンテナの準備</h3>
                <p className="text-sm text-muted-foreground">
                  ウィジェットを表示する場所にコンテナ要素を追加します。
                </p>
                <div className="bg-muted p-3 rounded-md relative">
                  <pre className="text-xs overflow-x-auto"><code>{`<div id="timebid-widget-container"></div>`}</code></pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('<div id="timebid-widget-container"></div>')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. ウィジェットの初期化</h3>
                <p className="text-sm text-muted-foreground">
                  以下のJavaScriptコードを使用してウィジェットを初期化します。
                </p>
                <div className="bg-muted p-3 rounded-md relative">
                  <pre className="text-xs overflow-x-auto"><code>{`<script>
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
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
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
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">4. カスタマイズオプション</h3>
                <p className="text-sm text-muted-foreground">
                  ウィジェットの外観や動作をカスタマイズするためのオプションです。
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <div className="space-y-2">
                    <p className="text-xs"><strong>theme</strong>: ウィジェットの外観をカスタマイズします</p>
                    <ul className="list-disc list-inside text-xs pl-2 text-muted-foreground">
                      <li>primaryColor: メインカラー</li>
                      <li>secondaryColor: 背景色</li>
                      <li>fontFamily: フォント</li>
                      <li>borderRadius: 角丸の半径</li>
                    </ul>
                  </div>
                  <div className="space-y-2 mt-3">
                    <p className="text-xs"><strong>イベントハンドラ</strong>: ウィジェットのイベントに対応するコールバック関数</p>
                    <ul className="list-disc list-inside text-xs pl-2 text-muted-foreground">
                      <li>onBidPlaced: 入札時に呼び出される関数</li>
                      <li>onAuctionEnd: オークション終了時に呼び出される関数</li>
                      <li>onWidgetLoad: ウィジェット読み込み完了時に呼び出される関数</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a href="https://docs.timebid.jp/widget" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    詳細なドキュメントを見る
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 新しいAPIキーの表示ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>APIキーが作成されました</DialogTitle>
            <DialogDescription>
              このAPIキーは一度だけ表示されます。安全な場所に保管してください。
            </DialogDescription>
          </DialogHeader>
          
          {newKey && (
            <div className="my-4">
              <Label htmlFor="api-key">APIキー</Label>
              <div className="flex mt-1.5">
                <Input
                  id="api-key"
                  value={newKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard(newKey)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                このキーはセキュリティ上の理由から二度と表示されません。
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
