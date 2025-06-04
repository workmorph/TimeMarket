"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function ToastTest() {
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Toast テスト</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            toast({
              title: "デフォルトトースト",
              description: "これはデフォルトのトースト通知です。",
            })
          }}
        >
          デフォルト
        </Button>
        
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "エラー",
              description: "エラーが発生しました。",
            })
          }}
        >
          エラー
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            toast({
              variant: "success",
              title: "成功",
              description: "操作が成功しました。",
            })
          }}
        >
          成功
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => {
            toast({
              title: "アクション付き",
              description: "このトーストにはアクションボタンがあります。",
              action: (
                <Button variant="outline" size="sm" onClick={() => alert("アクションが実行されました！")}>
                  実行
                </Button>
              ),
            })
          }}
        >
          アクション付き
        </Button>
      </div>
    </div>
  )
}
