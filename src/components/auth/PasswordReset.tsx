'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function PasswordReset() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // パスワードリセットメール送信（モック）
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage('パスワードリセットメールを送信しました。メールをご確認ください。')
      setStep('reset')
    } catch (error) {
      console.error('Password reset request error:', error)
      setError('メールの送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setIsLoading(true)

    try {
      // パスワードリセット実行（モック）
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage('パスワードが正常にリセットされました。')
    } catch (error) {
      console.error('Password reset error:', error)
      setError('パスワードのリセットに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'email') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <CardTitle>パスワードリセット</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? '送信中...' : 'リセットメールを送信'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <CardTitle>新しいパスワード</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <Label htmlFor="password">新しいパスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">パスワード確認</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '更新中...' : 'パスワードを更新'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
