import { ToastTest } from "@/components/toast-test"

export default function ToastTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Toast通知テストページ</h1>
      <p className="mb-6">
        このページでは、TimeBidプロジェクトのトースト通知システムをテストできます。
        各ボタンをクリックして、異なるタイプのトースト通知を表示してみてください。
      </p>
      <ToastTest />
    </div>
  )
}
