'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// フォームのバリデーションスキーマ
const auctionFormSchema = z.object({
  title: z.string().min(5, 'タイトルは5文字以上で入力してください').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().min(20, '説明は20文字以上で入力してください').max(1000, '説明は1000文字以内で入力してください'),
  starting_price: z.coerce.number().min(500, '開始価格は500円以上で設定してください').max(100000, '開始価格は10万円以内で設定してください'),
  duration_minutes: z.coerce.number().min(30, '時間は30分以上で設定してください').max(240, '時間は4時間以内で設定してください'),
  service_type: z.string().min(1, 'サービスタイプを選択してください'),
  delivery_method: z.string().min(1, '提供方法を選択してください')
})

type AuctionFormValues = z.infer<typeof auctionFormSchema>

export default function CreateAuctionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      starting_price: 1000,
      duration_minutes: 60,
      service_type: 'consultation',
      delivery_method: 'online'
    }
  })
  
  // ユーザーがログインしていない場合はリダイレクト
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>ログインが必要です</CardTitle>
            <CardDescription>オークションを作成するにはログインしてください</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/auth/login">
              <Button>ログインページへ</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  const onSubmit = async (data: AuctionFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const supabase = createClient()
      
      // 終了時間を計算
      const endsAt = new Date()
      endsAt.setMinutes(endsAt.getMinutes() + data.duration_minutes)
      
      // オークションデータを作成
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .insert({
          title: data.title,
          description: data.description,
          starting_price: data.starting_price,
          current_highest_bid: data.starting_price,
          expert_id: user.id,
          status: 'active',
          ends_at: endsAt.toISOString(),
          duration_minutes: data.duration_minutes,
          service_type: data.service_type,
          delivery_method: data.delivery_method
        })
        .select()
      
      if (auctionError) {
        throw auctionError
      }
      
      // 作成したオークションの詳細ページにリダイレクト
      router.push(`/auctions/${auctionData[0].id}`)
    } catch (err: Error | unknown) {
      console.error('オークション作成エラー:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'オークションの作成に失敗しました'
      )
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/auctions" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          オークション一覧に戻る
        </Link>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">新規オークション作成</CardTitle>
          <CardDescription>
            あなたの専門知識や時間をオークションにかけましょう。詳細情報を入力してください。
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="例: Reactアプリケーション最適化コンサルティング"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                placeholder="あなたが提供するサービスの詳細を記入してください"
                rows={5}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starting_price">開始価格（円）</Label>
                <Input
                  id="starting_price"
                  type="number"
                  {...form.register('starting_price')}
                />
                {form.formState.errors.starting_price && (
                  <p className="text-sm text-red-500">{form.formState.errors.starting_price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">時間（分）</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  {...form.register('duration_minutes')}
                />
                {form.formState.errors.duration_minutes && (
                  <p className="text-sm text-red-500">{form.formState.errors.duration_minutes.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_type">サービスタイプ</Label>
                <Select
                  defaultValue={form.getValues('service_type')}
                  onValueChange={(value) => form.setValue('service_type', value)}
                >
                  <SelectTrigger id="service_type">
                    <SelectValue placeholder="サービスタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">コンサルティング</SelectItem>
                    <SelectItem value="mentoring">メンタリング</SelectItem>
                    <SelectItem value="review">コードレビュー</SelectItem>
                    <SelectItem value="pair_programming">ペアプログラミング</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.service_type && (
                  <p className="text-sm text-red-500">{form.formState.errors.service_type.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery_method">提供方法</Label>
                <Select
                  defaultValue={form.getValues('delivery_method')}
                  onValueChange={(value) => form.setValue('delivery_method', value)}
                >
                  <SelectTrigger id="delivery_method">
                    <SelectValue placeholder="提供方法を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">オンライン</SelectItem>
                    <SelectItem value="in_person">対面</SelectItem>
                    <SelectItem value="hybrid">ハイブリッド</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.delivery_method && (
                  <p className="text-sm text-red-500">{form.formState.errors.delivery_method.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                'オークションを作成'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
