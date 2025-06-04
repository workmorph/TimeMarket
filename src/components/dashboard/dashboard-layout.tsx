'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, 
  Key, 
  Clock, 
  Settings, 
  CreditCard, 
  BarChart,
  Menu,
  Gavel,
  Receipt
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigationGroups = [
    {
      label: 'メイン',
      items: [
        { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
        { name: 'オークション管理', href: '/dashboard/auctions', icon: Gavel }
      ]
    },
    {
      label: '開発者向け',
      items: [
        { name: 'APIキー', href: '/dashboard/api-keys', icon: Key },
        { name: '統計・分析', href: '/dashboard/analytics', icon: BarChart }
      ]
    },
    {
      label: 'アカウント',
      items: [
        { name: '取引履歴', href: '/dashboard/transactions', icon: Receipt },
        { name: 'ユーザー設定', href: '/dashboard/settings', icon: Settings }
      ]
    }
  ]

  const NavigationContent = () => (
    <>
      {navigationGroups.map((group, groupIndex) => (
        <div key={group.label} className={groupIndex > 0 ? 'mt-6' : ''}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            {group.label}
          </h3>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
                    'group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-150 hover:scale-[1.02]'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          {groupIndex < navigationGroups.length - 1 && (
            <Separator className="mt-4" />
          )}
        </div>
      ))}
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* デスクトップサイドナビゲーション */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <Link href="/" className="text-xl font-bold text-blue-600">TimeBid</Link>
          </div>
          <div className="flex-grow flex flex-col px-2 pb-4">
            <NavigationContent />
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex flex-col flex-1">
        {/* モバイルヘッダー */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">TimeBid</Link>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-4 pb-0">
                  <SheetTitle className="text-xl font-bold text-blue-600">TimeBid</SheetTitle>
                </SheetHeader>
                <div className="px-2 py-4">
                  <NavigationContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </div>
      </div>
    </div>
  )
}