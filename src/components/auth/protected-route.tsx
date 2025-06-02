'use client'

import { useAuth } from '@/hooks/use-auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

// ローディングスピナーコンポーネント
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return <>{children}</>
}
