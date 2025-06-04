'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Bid } from '@/lib/supabase'

// 拡張したBid型の定義
type ExtendedBid = Bid & {
  is_optimistic?: boolean;
  payment_status?: 'pending' | 'completed' | 'failed';
}

interface RealtimeBidListProps {
  bids: ExtendedBid[]
  className?: string
  maxHeight?: string
  autoScroll?: boolean
}

export function RealtimeBidList({ 
  bids, 
  className = '', 
  maxHeight = '400px',
  autoScroll = true
}: RealtimeBidListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  // ユーザーIDは現在のところ使用しないため、コメントアウト
  // const currentUserId = session?.user?.id

  // 新しい入札が追加されたときに自動スクロール
  useEffect(() => {
    if (autoScroll && listRef.current && bids.length > 0) {
      listRef.current.scrollTop = 0
    }
  }, [bids.length, autoScroll])

  if (bids.length === 0) {
    return (
      <div className={`p-4 text-center text-muted-foreground ${className}`}>
        まだ入札がありません。最初の入札者になりましょう！
      </div>
    )
  }

  return (
    <div 
      ref={listRef}
      className={`overflow-auto ${className} ${maxHeight ? `max-h-[${maxHeight}]` : 'max-h-[400px]'}`}
    >
      <AnimatePresence>
        {bids.map((bid) => {
          // 現在のユーザーの入札かどうかの判定は一時的に無効化
          const isCurrentUser = false // currentUserId === bid.bidder_id
          const isOptimistic = bid.is_optimistic || false
          
          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 rounded-lg border p-3 ${
                isCurrentUser ? 'bg-blue-50 border-blue-200' : 'bg-background'
              } ${isOptimistic ? 'border-dashed animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">
                    {bid.bidder_name || '匿名ユーザー'}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        あなた
                      </span>
                    )}
                    {isOptimistic && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        処理中...
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(bid.created_at)}
                  </div>
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(bid.amount)}
                </div>
                {/* 支払いステータス */}
                {bid.payment_status && (
                  <div className="ml-auto">
                    {bid.payment_status === 'completed' ? (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                        支払い済み
                      </span>
                    ) : bid.payment_status === 'pending' ? (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                        支払い中
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
