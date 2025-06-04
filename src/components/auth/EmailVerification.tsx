'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EmailVerification() {
  const router = useRouter()
  const supabase = createClient()
  
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // 現在のユーザー情報を取得
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/register')
        return
      }
      
      // メール確認済みの場合はダッシュボードへ
      if (user.email_confirmed_at) {
        router.push('/dashboard')
        return
      }
      
      setUserEmail(user.email || null)
    }
    
    checkUser()
  }, [router, supabase.auth])

  // カウントダウンタイマー
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // メール再送信処理
  const handleResendEmail = async () => {
    if (!userEmail || countdown > 0) return
    
    setIsResending(true)
    setMessage(null)
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      })
      
      if (error) {
        setMessage({ type: 'error', text: 'メールの送信に失敗しました' })
      } else {
        setMessage({ type: 'success', text: '確認メールを再送信しました' })
        setCountdown(60) // 60秒のクールダウン
      }
    } catch (err) {
      setMessage({ type: 'error', text: '予期しないエラーが発生しました' })
    } finally {
      setIsResending(false)
    }
  }

  // 認証状態をチェック（ユーザーがメール内のリンクをクリックした場合）
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email_confirmed_at) {
        router.push('/dashboard')
      }
    }
    
    // 5秒ごとに確認
    const interval = setInterval(checkEmailConfirmation, 5000)
    
    return () => clearInterval(interval)
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-indigo-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            メールを確認してください
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            {userEmail ? (
              <>
                <span className="font-medium">{userEmail}</span> に確認メールを送信しました。
                <br />
                メール内のリンクをクリックして登録を完了してください。
              </>
            ) : (
              '確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。'
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

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isResending || countdown > 0}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              '送信中...'
            ) : countdown > 0 ? (
              `再送信まで ${countdown} 秒`
            ) : (
              '確認メールを再送信'
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              ログイン画面に戻る
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                メールが届かない場合
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>迷惑メールフォルダをご確認ください</li>
                  <li>登録したメールアドレスが正しいかご確認ください</li>
                  <li>しばらく待ってから再送信をお試しください</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}