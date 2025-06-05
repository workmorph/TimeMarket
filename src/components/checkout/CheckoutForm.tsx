'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, AlertCircle } from 'lucide-react'

interface CheckoutFormProps {
  amount: number
  currency?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function CheckoutForm({
  amount,
  currency = 'JPY',
  onSuccess,
  onError
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 決済処理（モック）
      await new Promise(resolve => setTimeout(resolve, 3000))

      console.log('Payment processed:', { amount, currency })
      onSuccess?.()
    } catch (error) {
      const errorMessage = '決済処理に失敗しました'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <CardTitle>決済</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">お支払い金額</p>
          <p className="text-2xl font-bold">{formatAmount(amount, currency)}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '処理中...' : `${formatAmount(amount, currency)} を支払う`}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>このデモでは実際の決済は行われません</p>
        </div>
      </CardContent>
    </Card>
  )
}
