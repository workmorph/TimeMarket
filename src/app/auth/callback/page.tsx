'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLからコードを取得してセッションを交換
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (error) {
          console.error('認証エラー:', error.message)
          router.push('/auth/login?error=callback_error')
          return
        }

        // セッション取得成功後、ダッシュボードへリダイレクト
        router.push('/dashboard')
      } catch (error) {
        console.error('予期しないエラー:', error)
        router.push('/auth/login?error=unexpected_error')
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">認証処理中...</p>
      </div>
    </div>
  )
}