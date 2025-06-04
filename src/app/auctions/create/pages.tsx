'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Clock, Calendar, MapPin, DollarSign,
    Info, Lightbulb, Save, Eye, AlertCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Dynamic import for heavy component
const AIPricingSuggestion = dynamic(
  () => import('@/components/pricing/AIPricingSuggestion').then(mod => mod.AIPricingSuggestion),
  { 
    loading: () => (
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }
)

// Mock user data
const useAuth = () => ({
    user: { id: '1', email: 'expert@example.com' },
    profile: {
        display_name: '田中太郎',
        is_expert: true,
        verification_status: 'verified'
    }
})

// formatCurrencyはlib/utils.tsから使用

interface FormData {
    title: string
    description: string
    duration_minutes: number
    service_type: string
    delivery_method: string
    starting_price: number
    reserve_price: string
    ai_suggested_reserve?: number
    ai_confidence_score?: number
    ai_reasoning?: string
    starts_at: string
    ends_at: string
}

export default function CreateAuctionPage() {
    const { user, profile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [previewMode, setPreviewMode] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        duration_minutes: 60,
        service_type: '',
        delivery_method: '',
        starting_price: 5000,
        reserve_price: '',
        ai_suggested_reserve: undefined,
        ai_confidence_score: undefined,
        ai_reasoning: undefined,
        starts_at: '',
        ends_at: ''
    })

    // バリデーション
    const validateForm = () => {
        if (!formData.title.trim()) return 'タイトルを入力してください'
        if (formData.title.length > 100) return 'タイトルは100文字以内で入力してください'
        if (!formData.description.trim()) return '説明を入力してください'
        if (formData.description.length < 50) return '説明は50文字以上で入力してください'
        if (!formData.service_type) return 'サービスタイプを選択してください'
        if (!formData.delivery_method) return '実施方法を選択してください'
        if (formData.starting_price < 1000) return '開始価格は1,000円以上で設定してください'
        if (!formData.starts_at) return '開始日時を設定してください'
        if (!formData.ends_at) return '終了日時を設定してください'

        const startTime = new Date(formData.starts_at).getTime()
        const endTime = new Date(formData.ends_at).getTime()
        const now = Date.now()

        if (startTime <= now) return '開始日時は現在時刻より後に設定してください'
        if (endTime <= startTime) return '終了日時は開始日時より後に設定してください'

        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsLoading(true)

        try {
            // オークション作成API呼び出し
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // 実際のAPIエンドポイントが実装されたら以下のようなコードになります
            // const response = await fetch('/api/auctions', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData),
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('オークションの作成に失敗しました');
            // }
            // 
            // const data = await response.json();
            
            console.log('オークション作成:', formData)
            alert('オークションを作成しました！')

            // TODO: リダイレクト

        } catch (error: any) {
            setError(error.message || 'オークションの作成に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // 現在時刻から1時間後をデフォルト開始時間に
    const getDefaultStartTime = () => {
        const now = new Date()
        now.setHours(now.getHours() + 1)
        now.setMinutes(0, 0, 0)
        return now.toISOString().slice(0, 16)
    }

    // 開始時間から3時間後をデフォルト終了時間に
    const getDefaultEndTime = (startTime: string) => {
        if (!startTime) return ''
        const start = new Date(startTime)
        start.setHours(start.getHours() + 3)
        return start.toISOString().slice(0, 16)
    }

    if (!profile?.is_expert) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">専門家認証が必要です</h2>
                        <p className="text-muted-foreground mb-4">
                            オークションを作成するには専門家としての認証が必要です。
                        </p>
                        <Button asChild>
                            <a href="/profile/expert-verification">専門家認証を申請</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* ヘッダー */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">新しいオークションを作成</h1>
                    <p className="text-muted-foreground mt-2">
                        あなたの専門知識を価値ある時間として提供しましょう
                    </p>
                </div>

                {/* エラー表示 */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* メインフォーム */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* 基本情報 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="w-5 h-5" />
                                        基本情報
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">タイトル *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="例: React最適化コンサルティング (60分)"
                                            maxLength={100}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.title.length}/100文字
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">詳細説明 *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="提供するサービスの内容、対象者、準備事項などを詳しく説明してください..."
                                            className="min-h-[150px]"
                                            maxLength={2000}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.description.length}/2000文字 (最低50文字)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* サービス設定 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        サービス設定
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="service_type">サービスタイプ *</Label>
                                            <Select
                                                value={formData.service_type}
                                                onValueChange={(value) => handleInputChange('service_type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="選択してください" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="consultation">コンサルティング</SelectItem>
                                                    <SelectItem value="coaching">コーチング</SelectItem>
                                                    <SelectItem value="review">レビュー・添削</SelectItem>
                                                    <SelectItem value="mentoring">メンタリング</SelectItem>
                                                    <SelectItem value="other">その他</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="delivery_method">実施方法 *</Label>
                                            <Select
                                                value={formData.delivery_method}
                                                onValueChange={(value) => handleInputChange('delivery_method', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="選択してください" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="online">オンライン</SelectItem>
                                                    <SelectItem value="offline">対面</SelectItem>
                                                    <SelectItem value="hybrid">オンライン・対面両対応</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="duration">セッション時間</Label>
                                        <Select
                                            value={formData.duration_minutes.toString()}
                                            onValueChange={(value) => handleInputChange('duration_minutes', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">30分</SelectItem>
                                                <SelectItem value="45">45分</SelectItem>
                                                <SelectItem value="60">60分</SelectItem>
                                                <SelectItem value="90">90分</SelectItem>
                                                <SelectItem value="120">120分</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 価格設定 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5" />
                                        価格設定
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="starting_price">開始価格 (円) *</Label>
                                            <Input
                                                id="starting_price"
                                                type="number"
                                                value={formData.starting_price}
                                                onChange={(e) => handleInputChange('starting_price', parseInt(e.target.value))}
                                                min={1000}
                                                step={1000}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                最低1,000円から設定可能
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="reserve_price">希望落札価格 (円)</Label>
                                            <Input
                                                id="reserve_price"
                                                type="number"
                                                value={formData.reserve_price}
                                                onChange={(e) => handleInputChange('reserve_price', e.target.value)}
                                                placeholder="未設定"
                                                min={formData.starting_price}
                                                step={1000}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                この価格に達すると即座に落札
                                            </p>
                                        </div>
                                    </div>

                                    {/* AI価格提案コンポーネント */}
                                    {formData.title && formData.starting_price > 0 && (
                                        <div className="mt-4">
                                            <AIPricingSuggestion 
                                                auctionData={{
                                                    title: formData.title,
                                                    description: formData.description,
                                                    startingPrice: formData.starting_price,
                                                    service_type: formData.service_type,
                                                    delivery_method: formData.delivery_method,
                                                    duration_minutes: formData.duration_minutes,
                                                    expert: {
                                                        id: '1',
                                                        display_name: '田中太郎'
                                                    }
                                                }}
                                                onAcceptSuggestion={(reservePrice) => {
                                                    handleInputChange('reserve_price', reservePrice.toString());
                                                }}
                                            />
                                        </div>
                                    )}

                                    <Alert>
                                        <Lightbulb className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            <strong>価格設定のコツ:</strong> 開始価格は低めに設定し、競争を促すことで最終的により高い価格での落札を期待できます。
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>

                            {/* 日時設定 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        オークション期間
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="starts_at">開始日時 *</Label>
                                            <Input
                                                id="starts_at"
                                                type="datetime-local"
                                                value={formData.starts_at || getDefaultStartTime()}
                                                onChange={(e) => {
                                                    handleInputChange('starts_at', e.target.value)
                                                    if (!formData.ends_at) {
                                                        handleInputChange('ends_at', getDefaultEndTime(e.target.value))
                                                    }
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="ends_at">終了日時 *</Label>
                                            <Input
                                                id="ends_at"
                                                type="datetime-local"
                                                value={formData.ends_at}
                                                onChange={(e) => handleInputChange('ends_at', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            オークション期間は最低1時間、最長7日間まで設定できます。期間が短いほど緊張感が高まり、活発な入札が期待できます。
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>

                            {/* 送信ボタン */}
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="flex-1"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    プレビュー
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            作成中...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            オークションを作成
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* サイドバー - プレビュー */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">プレビュー</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {formData.title ? (
                                        <>
                                            <div>
                                                <h3 className="font-semibold line-clamp-2">{formData.title}</h3>
                                                <div className="flex gap-2 mt-2">
                                                    {formData.service_type && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {formData.service_type === 'consultation' ? 'コンサル' : formData.service_type}
                                                        </Badge>
                                                    )}
                                                    {formData.delivery_method && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {formData.delivery_method === 'online' ? 'オンライン' : formData.delivery_method}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>開始価格:</span>
                                                    <span className="font-semibold text-blue-600">
                                                        {formatCurrency(formData.starting_price)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>セッション時間:</span>
                                                    <span>{formData.duration_minutes}分</span>
                                                </div>
                                                {formData.reserve_price && (
                                                    <div className="flex justify-between">
                                                        <span>希望落札価格:</span>
                                                        <span className="font-semibold text-green-600">
                                                            {formatCurrency(parseInt(formData.reserve_price))}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {formData.description && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground line-clamp-4">
                                                            {formData.description}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            フォームに入力すると<br />ここにプレビューが表示されます
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}