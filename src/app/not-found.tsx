"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-blue-100 p-4">
        <Search className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold">ページが見つかりません</h2>
      <p className="max-w-md text-gray-600">
        お探しのページは存在しないか、移動された可能性があります。URLが正しいかご確認ください。
      </p>
      <div className="mt-4 flex gap-4">
        <Button asChild variant="default">
          <Link href="/">ホームに戻る</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auctions">オークション一覧を見る</Link>
        </Button>
      </div>
    </div>
  );
}
