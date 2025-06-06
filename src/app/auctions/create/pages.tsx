'use client'

import { useState } from 'react'
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
    Clock, Info, Save, Eye, AlertCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock user data
const useAuth = () => ({
    profile: {
        display_name: '田中太郎',
        is_expert: true,
        verification_status: 'verified'
    }
})

interface FormData {
    title: string
    description: string
    duration_minutes: number
    service_type: string
    delivery_method: string
    starting_price: number
    reserve_price: string
    starts_at: string
    ends_at: string
}

export default function CreateAuctionPage() {
    const { profile } = useAuth()
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
        starts_at: '',
        ends_at: ''
    })

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
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('オークション作成:', formData)
            alert('オークションを作成しました！')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'オークションの作成に失敗しました'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">新しいオークションを作成</h1>
                    <p className="text-muted-foreground mt-2">
                        あなたの専門知識を価値ある時間として提供しましょう
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                            </div>
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
