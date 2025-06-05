'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { UserPlus, AlertCircle } from 'lucide-react'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
    acceptPrivacy: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return '必須項目を入力してください'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'パスワードが一致しません'
    }

    if (formData.password.length < 8) {
      return 'パスワードは8文字以上で入力してください'
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      return '利用規約とプライバシーポリシーに同意してください'
    }

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
      // ユーザー登録処理（モック）
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('User registration:', formData)
      alert('アカウントが作成されました！')
    } catch (error) {
      console.error('Registration error:', error)
      setError('アカウントの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <UserPlus className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <CardTitle>新規アカウント作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">名前</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="太郎"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">苗字</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="田中"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="8文字以上"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">パスワード確認</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="パスワードを再入力"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                <a href="/terms" className="text-blue-600 hover:underline">利用規約</a>に同意する
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
              />
              <Label htmlFor="acceptPrivacy" className="text-sm">
                <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意する
              </Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
