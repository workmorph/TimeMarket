import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorStateProps {
  error: Error | { message: string }
  retry?: () => void
  variant?: 'inline' | 'page' | 'toast'
  className?: string
}

function getErrorMessage(error: Error | { message: string }): string {
  // 特定のエラータイプに応じたメッセージをマッピング
  const errorMessage = error.message.toLowerCase()
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
  }
  
  if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
    return 'アクセス権限がありません。ログインし直してください。'
  }
  
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'リソースが見つかりませんでした。'
  }
  
  if (errorMessage.includes('server') || errorMessage.includes('500')) {
    return 'サーバーエラーが発生しました。しばらくしてからもう一度お試しください。'
  }
  
  // デフォルトメッセージ
  return error.message || '予期しないエラーが発生しました。'
}

export function ErrorState({ 
  error, 
  retry, 
  variant = 'inline',
  className 
}: ErrorStateProps) {
  const errorMessage = getErrorMessage(error)

  if (variant === 'inline') {
    return (
      <Alert variant="destructive" className={cn("", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>
          {errorMessage}
          {retry && (
            <Button
              onClick={retry}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              再試行
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (variant === 'page') {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8 text-center", className)}>
        <div className="rounded-full bg-red-100 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">エラーが発生しました</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          {errorMessage}
        </p>
        <div className="flex gap-4">
          {retry && (
            <Button onClick={retry} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              再試行
            </Button>
          )}
          <Link href="/dashboard">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              ダッシュボードに戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Toast variant (シンプルなテキストのみ)
  return (
    <div className={cn("text-sm text-red-600", className)}>
      {errorMessage}
    </div>
  )
}