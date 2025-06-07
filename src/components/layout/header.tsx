import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-blue-600 font-bold text-xl">
              TimeBid
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/auctions"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              オークション
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              サービス紹介
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">ログイン</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">新規登録</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
