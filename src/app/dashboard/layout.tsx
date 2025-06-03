'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // 認証チェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 認証済みの場合のみダッシュボードを表示
  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  // 認証チェック中は何も表示しない
  return null
}
