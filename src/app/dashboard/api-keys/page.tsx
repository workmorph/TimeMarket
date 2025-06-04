'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, AccessibleDialogContent } from "@/components/ui/accessible-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertOctagon, AlertTriangle, Check, Copy, ExternalLink, Key, Clipboard, Plus, BookOpen } from "lucide-react"
import { ApiKey } from '@/models/ApiKey'
import { ApiKeyManagement } from '@/components/dashboard/ApiKeyManagement'
import { ApiKeyCreateForm, ApiKeyFormData } from '@/components/forms/ApiKeyCreateForm'

export default function ApiKeysPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
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
  const handleCreateApiKey = async (formData: ApiKeyFormData) => {
    try {
      setIsCreatingKey(true)
      setError(null)
      
      const payload = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        allowed_origins: formData.allowed_origins,
        rate_limit: formData.rate_limit,
        expires_at: formData.expires_at || null
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
      
      // フォームを閉じてダイアログを開く
      setShowCreateForm(false)
      setIsDialogOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setIsCreatingKey(false)
    }
  }
  
  // APIキーの無効化
  const handleDeactivateKey = async (keyId: string) => {
    try {
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
    }
  }
  
  // APIキーをクリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // APIキーの更新（将来の実装用）
  const handleUpdateKey = async (keyId: string, updates: Partial<ApiKey>) => {
    // TODO: APIエンドポイントが実装されたら有効化
    console.log('Update key:', keyId, updates)
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
      <div className="flex justify-between items-center gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold">APIキー管理</h1>
          <p className="text-gray-500 mt-1">ウィジェット埋め込み用のAPIキーを管理します</p>
        </div>
        {!showCreateForm && activeTab === 'overview' && (
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            新しいAPIキーを作成
          </Button>
        )}
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 border-t border-r border-b border-red-100 text-red-700 p-3 sm:p-4 rounded-md mb-6 text-sm shadow-sm">
          <div className="flex items-start">
            <AlertOctagon className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">エラーが発生しました</h4>
              <p>{error}</p>
              <p className="text-xs text-red-600 mt-2">
                問題が解決しない場合は、サポートにお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="h-4 w-4 mr-2" />
            ドキュメント
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {showCreateForm ? (
            <ApiKeyCreateForm
              onSubmit={handleCreateApiKey}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isCreatingKey}
            />
          ) : (
            <ApiKeyManagement
              apiKeys={apiKeys}
              onCreateKey={() => setShowCreateForm(true)}
              onDeleteKey={handleDeactivateKey}
              onUpdateKey={handleUpdateKey}
              isLoading={isLoading}
            />
          )}
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
        <AccessibleDialogContent 
          title="APIキーが作成されました"
          description="このAPIキーは一度だけ表示されます。安全に保管してください。"
          className="max-w-[90vw] sm:max-w-md border-0 shadow-xl"
          footer={
            <div className="bg-gray-50 w-full px-4 sm:px-6 py-4 border-t border-gray-100">
              <Button 
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 h-auto shadow-sm transition-all duration-200"
              >
                理解しました、閉じる
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border-b-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white shadow-sm border border-green-100">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            {newKey && (
              <div className="px-4 py-3">
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
          </div>
        </AccessibleDialogContent>
      </Dialog>
    </div>
  )
}
