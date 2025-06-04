'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validatePassword, validateEmail } from '@/lib/auth/validation'

interface PasswordResetProps {
  mode?: 'request' | 'reset'
}

export default function PasswordReset({ mode = 'request' }: PasswordResetProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    message: string
  }>({ score: 0, message: '' })

  // パスワード強度チェック
  const checkPasswordStrength = (password: string) => {
    const result = validatePassword(password)
    setPasswordStrength(result)
  }

  // パスワードリセットリクエスト（メール送信）
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: '有効なメールアドレスを入力してください' })
      return
    }
    
    setIsLoading(true)
    setMessage(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        setMessage({ type: 'error', text: 'パスワードリセットメールの送信に失敗しました' })
      } else {
        setMessage({
          type: 'success',
          text: 'パスワードリセットメールを送信しました。メールをご確認ください。'
        })
      }
    } catch (err) {
      setMessage({ type: 'error', text: '予期しないエラーが発生しました' })
    } finally {
      setIsLoading(false)
    }
  }

  // 新しいパスワードの設定
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'パスワードが一致しません' })
      return
    }
    
    if (passwordStrength.score < 3) {
      setMessage({ type: 'error', text: 'より強力なパスワードを設定してください' })
      return
    }
    
    setIsLoading(true)
    setMessage(null)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      
      if (error) {
        setMessage({ type: 'error', text: 'パスワードの更新に失敗しました' })
      } else {
        setMessage({ type: 'success', text: 'パスワードが正常に更新されました' })
        // 3秒後にログイン画面へリダイレクト
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err) {
      setMessage({ type: 'error', text: '予期しないエラーが発生しました' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'request' ? 'パスワードをリセット' : '新しいパスワードを設定'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'request' ? (
              <>
                登録済みのメールアドレスを入力してください。
                <br />
                パスワードリセット用のリンクをお送りします。
              </>
            ) : (
              '新しいパスワードを入力してください。'
            )}
          </p>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <p
              className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {mode === 'request' ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '送信中...' : 'リセットメールを送信'}
              </button>
            </div>

            <div className="text-center">
              <a
                href="/auth/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ログイン画面に戻る
              </a>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    checkPasswordStrength(e.target.value)
                  }}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="新しいパスワード"
                  disabled={isLoading}
                />
              </div>

              {/* パスワード強度インジケーター */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1 mr-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.score === 1
                              ? 'bg-red-500 w-1/4'
                              : passwordStrength.score === 2
                              ? 'bg-yellow-500 w-1/2'
                              : passwordStrength.score === 3
                              ? 'bg-green-500 w-3/4'
                              : passwordStrength.score === 4
                              ? 'bg-green-600 w-full'
                              : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{passwordStrength.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  パスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード（確認）"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '更新中...' : 'パスワードを更新'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}