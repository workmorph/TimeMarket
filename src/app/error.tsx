"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ログ記録サービスにエラーを送信
    console.error("アプリケーションエラー:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold">エラーが発生しました</h2>
      <p className="max-w-md text-gray-600">
        申し訳ありませんが、ページの読み込み中に問題が発生しました。もう一度お試しいただくか、問題が解決しない場合はサポートにお問い合わせください。
      </p>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => reset()} variant="default">
          もう一度試す
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          ホームに戻る
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 max-w-lg overflow-auto rounded border border-red-200 bg-red-50 p-4 text-left text-sm">
          <p className="font-mono font-bold">エラー詳細 (開発環境のみ表示):</p>
          <p className="mt-2 font-mono">{error.message}</p>
          <p className="mt-2 font-mono">{error.stack}</p>
        </div>
      )}
    </div>
  );
}
