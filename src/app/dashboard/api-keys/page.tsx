'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { AlertOctagon, AlertTriangle, Check, Clock, Copy, ExternalLink, Key, Trash2, Clipboard, Search, Filter } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  
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
  
  // フィルタリングされたAPIキー
  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && key.is_active) || 
      (statusFilter === 'inactive' && !key.is_active)
    return matchesSearch && matchesStatus
  })

  if (authLoading) {
    return (
      <div className="container mx-auto py-10">
        <LoadingState 
          variant="spinner" 
          size="lg" 
          message="認証を確認しています..."
          className="h-64"
        />
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center gap-3 mb-8">
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
              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="space-y-3">
                  <Label htmlFor="key-name" className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                    APIキー名 (必須)
                  </Label>
                  <Input
                    id="key-name"
                    placeholder="例: 会社ウェブサイト用"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md py-2 px-3 shadow-sm"
                  />
                  <p className="text-xs text-gray-500 pl-4">
                    このAPIキーの用途を記述してください。例: 会社ウェブサイト用、テスト環境用など
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="allowed-origins" className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                    許可するオリジン (オプション)
                  </Label>
                  <Input
                    id="allowed-origins"
                    placeholder="例: https://example.com, https://sub.example.com"
                    value={newKeyOrigins}
                    onChange={(e) => setNewKeyOrigins(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md py-2 px-3 shadow-sm"
                  />
                  <div className="flex items-start p-2 sm:p-3 sm:pl-4 bg-amber-50 rounded-md border border-amber-100">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs text-amber-700">
                        カンマ区切りで複数指定できます。空白の場合はすべてのオリジンからのアクセスを許可します。
                      </p>
                      <p className="text-xs text-amber-700">
                        セキュリティ上の理由から、本番環境では必ずオリジンを指定することを推奨します。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center text-center sm:text-left">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    作成したAPIキーは一度だけ表示されます
                  </p>
                  <Button 
                    onClick={handleCreateApiKey} 
                    disabled={isCreatingKey || !newKeyName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto font-medium shadow-sm transition-all duration-200 w-full sm:w-auto"
                  >
                    {isCreatingKey ? (
                      <>
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent rounded-full"></div>
                        作成中...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-5 w-5" />
                        APIキーを作成
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* エラーメッセージ */}
            {error && (
              <ErrorState 
                error={{ message: error }} 
                retry={() => {
                  setError(null)
                  window.location.reload()
                }}
                variant="inline"
                className="mb-4"
              />
            )}
            
            {/* APIキーリスト */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-1 bg-purple-600"></div>
              <CardHeader>
                <div className="space-y-4">
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
                  
                  {/* 検索・フィルター */}
                  {apiKeys.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="キー名で検索..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="ステータス" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべて</SelectItem>
                          <SelectItem value="active">有効</SelectItem>
                          <SelectItem value="inactive">無効</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingState 
                    variant="spinner" 
                    size="md" 
                    message="APIキーを読み込んでいます..."
                    className="py-8"
                  />
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
                ) : filteredKeys.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-gray-100 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-500 mb-1">
                      検索結果がありません
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      検索条件を変更してお試しください
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredKeys.map((key) => (
                      <div key={key.id} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-full ${key.is_active ? 'bg-green-50' : 'bg-gray-100'}`}>
                                <Key className={`h-5 w-5 ${key.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <div className="font-semibold text-base sm:text-lg">{key.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center mt-0.5">
                                  <span className="inline-flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                    作成日: {formatDate(key.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={key.is_active ? "default" : "outline"} 
                              className={`${key.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} px-3 py-1 text-xs font-medium rounded-full`}
                            >
                              {key.is_active ? "有効" : "無効"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="p-5 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 text-sm">
                            <div className="bg-white p-3 rounded-md border border-gray-100">
                              <div className="text-gray-600 font-medium mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                最終使用日
                              </div>
                              <div className="font-medium pl-6">
                                {key.last_used_at ? formatDate(key.last_used_at) : '未使用'}
                              </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded-md border border-gray-100">
                              <div className="text-gray-600 font-medium mb-2 flex items-center">
                                <ExternalLink className="h-4 w-4 mr-2 text-indigo-500" />
                                許可オリジン
                              </div>
                              <div className="font-medium pl-6 break-words">
                                {key.allowed_origins && key.allowed_origins.length > 0 
                                  ? key.allowed_origins.join(', ') 
                                  : 'すべて許可'}
                              </div>
                            </div>
                          </div>
                          
                          {key.is_active && (
                            <div className="mt-4 sm:mt-5 flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeactivateKey(key.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-medium"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                無効化
                              </Button>
                            </div>
                          )}
                        </div>
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
                <div className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200 font-mono text-xs sm:text-sm mb-4 sm:mb-6 relative overflow-x-auto">
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
        <DialogContent className="max-w-[90vw] sm:max-w-md border-0 shadow-xl">
          <div className="bg-green-50 p-4 rounded-t-lg border-b-4 border-green-500">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white shadow-sm border border-green-100">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-green-800">APIキーが作成されました</DialogTitle>
                  <DialogDescription className="text-green-700">
                    このAPIキーは一度だけ表示されます。安全に保管してください。
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {newKey && (
            <div className="px-6 py-5">
              <div className="mb-5">
                <Label htmlFor="api-key" className="font-semibold text-gray-800 mb-2 block flex items-center">
                  <Clipboard className="h-4 w-4 mr-2 text-blue-600" />
                  ウィジェット埋め込み用APIキー
                </Label>
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 sm:p-4 mb-4 relative font-mono text-sm">
                  <p className="break-all pr-10 select-all">{newKey}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2.5 right-2.5 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => copyToClipboard(newKey)}
                    aria-label="クリップボードにコピー"
                  >
                    {copied ? 
                      <div className="bg-green-100 text-green-700 rounded-full p-1.5 shadow-sm">
                        <Check className="h-4 w-4" />
                      </div> : 
                      <div className="text-gray-500 hover:text-gray-700">
                        <Copy className="h-4 w-4" />
                      </div>}
                  </Button>
                </div>
              </div>
              
              <div className="bg-amber-50 p-3 sm:p-4 rounded-md border-l-4 border-amber-500 border-t border-r border-b border-amber-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-800">重要なセキュリティ情報</h4>
                      <p className="text-sm text-amber-700">
                        このキーはセキュリティ上の理由から二度と表示されません。必ず今コピーして安全な場所に保管してください。
                      </p>
                      <p className="text-sm text-amber-700">
                        このキーが漏洩した場合は、すぐに無効化して新しいキーを作成してください。
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 h-auto shadow-sm transition-all duration-200"
                  >
                    理解しました、閉じる
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-100">
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 h-auto shadow-sm transition-all duration-200"
            >
              理解しました、閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
