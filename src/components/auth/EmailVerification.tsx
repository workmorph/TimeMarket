'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Mail, RefreshCw } from 'lucide-react'

interface EmailVerificationProps {
  email?: string
  onVerificationComplete?: () => void
}

export default function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkVerificationStatus()
  }, [])

  const checkVerificationStatus = async () => {
    try {
      // メール認証状態チェック（モック）
      console.log('Checking verification status...')
      setMessage('認証状態を確認中...')
    } catch (error) {
      console.error('Verification check error:', error)
      setError('認証状態の確認に失敗しました')
    }
  }

  const resendVerificationEmail = async () => {
    setIsLoading(true)
    setError('')

    try {
      // 認証メール再送信（モック）
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage('認証メールを再送信しました。メールボックスをご確認ください。')
    } catch (error) {
      console.error('Resend error:', error)
      setError('メールの再送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    setIsVerified(true)
    setMessage('メール認証が完了しました！')
    onVerificationComplete?.()
  }

  if (isVerified) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            認証完了
          </h2>
          <p className="text-muted-foreground">
            メールアドレスの認証が完了しました。
            TimeBidをご利用いただけます。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <CardTitle>メール認証</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {email ? (
              <>
                <span className="font-medium">{email}</span> に認証メールを送信しました。
              </>
            ) : (
              '認証メールを送信しました。'
            )}
            メール内のリンクをクリックして認証を完了してください。
          </p>
        </div>

        {message && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={resendVerificationEmail}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                認証メールを再送信
              </>
            )}
          </Button>

          <Button
            onClick={handleVerificationComplete}
            className="w-full"
          >
            認証完了（デモ用）
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>メールが届かない場合は、迷惑メールフォルダもご確認ください。</p>
        </div>
      </CardContent>
    </Card>
  )
}
