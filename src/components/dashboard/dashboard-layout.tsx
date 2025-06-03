'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Key, 
  Clock, 
  Settings, 
  CreditCard, 
  BarChart
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
    { name: 'オークション管理', href: '/dashboard/auctions', icon: Clock },
    { name: 'APIキー', href: '/dashboard/api-keys', icon: Key },
    { name: '取引履歴', href: '/dashboard/transactions', icon: CreditCard },
    { name: 'ユーザー設定', href: '/dashboard/settings', icon: Settings },
    { name: '統計・分析', href: '/dashboard/analytics', icon: BarChart },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドナビゲーション */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="text-xl font-bold text-blue-600">TimeBid</Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </div>
      </div>
    </div>
  )
}
