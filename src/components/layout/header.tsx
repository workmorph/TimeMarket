'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  AccessibleSheetContent,
} from '@/components/ui/accessible-sheet'
import { Menu, X, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navItems = [
  { label: 'オークション一覧', href: '/auctions' },
  { label: 'サービス紹介', href: '/about' },
  { label: 'ヘルプ', href: '/help' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-blue-600 font-bold text-xl flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 mr-2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>TimeBid</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="メインナビゲーション">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  その他
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/terms">利用規約</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy">プライバシーポリシー</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">お問い合わせ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* 認証ボタン */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" size="sm" className="font-medium">
              <Link href="/auth/login">ログイン</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium">
              <Link href="/auth/register">新規登録</Link>
            </Button>
          </div>

          {/* モバイルメニュー */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="メニュー">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <AccessibleSheetContent 
                title="メニュー"
                hideTitle={true}
                side="right" 
                className="w-[80vw] sm:w-[350px]"
              >
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="text-blue-600 font-bold text-xl flex items-center" onClick={() => setIsOpen(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 mr-2"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>TimeBid</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="閉じる">
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4" aria-label="モバイルナビゲーション">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/terms"
                    className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    利用規約
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    プライバシーポリシー
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    お問い合わせ
                  </Link>
                </nav>
                <div className="mt-8 flex flex-col space-y-3">
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>ログイン</Link>
                  </Button>
                  <Button asChild className="w-full justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>新規登録</Link>
                  </Button>
                </div>
              </AccessibleSheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}