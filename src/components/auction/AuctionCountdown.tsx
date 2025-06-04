'use client'

import { useState, useEffect, useCallback } from 'react'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { ja } from 'date-fns/locale'

interface AuctionCountdownProps {
  endTime: string | Date
  onComplete?: () => void
  className?: string
}

export function AuctionCountdown({ 
  endTime, 
  onComplete, 
  className = '' 
}: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isEnding, setIsEnding] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // 残り時間を計算する関数
  const calculateTimeLeft = useCallback(() => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = differenceInSeconds(end, now)
    
    if (diff <= 0) {
      setTimeLeft(0)
      setIsComplete(true)
      onComplete?.()
      return 0
    }
    
    setIsEnding(diff < 300) // 残り5分以内
    return diff
  }, [endTime, onComplete])

  // 残り時間をフォーマットする関数
  const formatTimeLeft = useCallback((seconds: number) => {
    if (seconds <= 0) return '終了しました'
    
    const duration = intervalToDuration({ 
      start: new Date(), 
      end: new Date(Date.now() + seconds * 1000) 
    })
    
    // 残り時間が1時間未満の場合は分と秒のみ表示
    if (duration.hours === 0 && duration.days === 0) {
      return formatDuration(
        { minutes: duration.minutes, seconds: duration.seconds },
        { locale: ja, format: ['minutes', 'seconds'], zero: true }
      )
    }
    
    // 残り時間が1日未満の場合は時、分、秒を表示
    if (duration.days === 0) {
      return formatDuration(
        { hours: duration.hours, minutes: duration.minutes, seconds: duration.seconds },
        { locale: ja, format: ['hours', 'minutes', 'seconds'], zero: true }
      )
    }
    
    // 残り時間が1日以上の場合は日、時、分を表示
    return formatDuration(
      { days: duration.days, hours: duration.hours, minutes: duration.minutes },
      { locale: ja, format: ['days', 'hours', 'minutes'], zero: true }
    )
  }, [])

  useEffect(() => {
    // 初期計算
    const initialTimeLeft = calculateTimeLeft()
    setTimeLeft(initialTimeLeft)
    
    // タイマーの更新間隔を残り時間に応じて調整
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      // 終了したらタイマーをクリア
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000) // 1秒ごとに更新
    
    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  // 残り時間に応じたスタイルを適用
  const getCountdownStyle = () => {
    if (isComplete) {
      return 'text-gray-500'
    }
    if (isEnding) {
      return 'text-red-600 animate-pulse'
    }
    return 'text-green-600'
  }

  return (
    <div className={`font-mono text-center ${className}`}>
      <div className="text-sm text-muted-foreground mb-1">
        {isComplete ? '終了しました' : '残り時間'}
      </div>
      <div className={`text-xl font-bold ${getCountdownStyle()}`}>
        {formatTimeLeft(timeLeft)}
      </div>
    </div>
  )
}
