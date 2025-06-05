import { PriceABTestDashboard } from '@/components/dashboard/PriceABTestDashboard'

export default function ABTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">A/Bテスト管理</h1>
      <PriceABTestDashboard />
    </div>
  )
}