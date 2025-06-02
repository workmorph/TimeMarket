import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 終了時刻までの残り時間を計算する
 */
export const getTimeRemaining = (endTime: string) => {
  const end = new Date(endTime).getTime()
  const now = new Date().getTime()
  const timeLeft = end - now

  if (timeLeft <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, total: timeLeft }
}

/**
 * 金額を日本円形式でフォーマットする
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount)
}

/**
 * 日時を日本語形式でフォーマットする
 */
export const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}
