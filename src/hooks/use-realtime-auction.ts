'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, Auction, Bid } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeAuctionOptions {
  enableNotifications?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useRealtimeAuction(auctionId: string, options: UseRealtimeAuctionOptions = {}) {
  const {
    enableNotifications = true,
    autoReconnect = true,
    reconnectInterval = 5000
  } = options
  
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)
  
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const channelsRef = useRef<{ auction: RealtimeChannel; bid: RealtimeChannel } | null>(null)
  const { toast } = useToast()
  
  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // チャンネル設定関数
  const setupChannels = useCallback(() => {
    if (channelsRef.current) {
      // 既存のチャンネルを削除
      supabase.removeChannel(channelsRef.current.auction)
      supabase.removeChannel(channelsRef.current.bid)
    }
    
    // オークション更新のチャンネル
    const auctionChannel = supabase
      .channel(`auction-changes-${auctionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${auctionId}`
      }, (payload) => {
        setAuction(payload.new as Auction)
      })
      .on('disconnect', (event) => {
        console.log('オークションチャンネル切断:', event)
        if (autoReconnect) attemptReconnect()
      })
      .subscribe()
      
    // 入札追加のチャンネル
    const bidChannel = supabase
      .channel(`bid-changes-${auctionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`
      }, (payload) => {
        const newBid = payload.new as Bid
        
        // 新しい入札を追加
        setBids(prev => [newBid, ...prev])
        
        // 通知を表示
        if (enableNotifications) {
          toast({
            title: '新しい入札がありました',
            description: `${newBid.bidder_name || '匿名ユーザー'}さんが${newBid.amount.toLocaleString()}円で入札しました`,
            variant: 'default'
          })
        }
        
        // オークション情報も更新（最新の入札額を反映）
        fetchAuction()
      })
      .on('disconnect', (event) => {
        console.log('入札チャンネル切断:', event)
        if (autoReconnect) attemptReconnect()
      })
      .subscribe()
    
    // チャンネル参照を保存
    channelsRef.current = {
      auction: auctionChannel,
      bid: bidChannel
    }
    
    return () => {
      if (channelsRef.current) {
        supabase.removeChannel(channelsRef.current.auction)
        supabase.removeChannel(channelsRef.current.bid)
        channelsRef.current = null
      }
    }
  }, [auctionId, enableNotifications, autoReconnect])
  
  // 再接続を試みる関数
  const attemptReconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
    }
    
    setIsReconnecting(true)
    
    reconnectTimerRef.current = setTimeout(() => {
      if (isOnline) {
        console.log('リアルタイム接続の再確立を試みています...')
        setupChannels()
        fetchAuction()
        fetchBids()
      }
      setIsReconnecting(false)
    }, reconnectInterval)
  }, [isOnline, reconnectInterval, setupChannels, fetchAuction, fetchBids, toast])
  
  // メインの効果
  useEffect(() => {
    // 初期データ取得
    fetchAuction()
    fetchBids()
    
    // チャンネル設定
    const cleanup = setupChannels()
    
    // クリーンアップ関数
    return () => {
      cleanup()
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
    }
  }, [auctionId, fetchAuction, fetchBids, setupChannels])
  
  // オークション情報を取得
  const fetchAuction = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*, expert:profiles(*)')
        .eq('id', auctionId)
        .single()
        
      if (error) throw error
      setAuction(data as Auction)
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー'
      console.error('オークション取得エラー:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [auctionId])
  
  // 入札履歴を取得
  const fetchBids = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*, bidder:profiles(display_name)')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false })
        
      if (error) throw error
      
      // bidder_nameを追加
      const bidsWithNames = data.map(bid => ({
        ...bid,
        bidder_name: bid.bidder?.display_name || '匿名ユーザー'
      }))
      
      setBids(bidsWithNames as Bid[])
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー'
      console.error('入札履歴取得エラー:', err)
      setError(errorMessage)
    }
  }, [auctionId])
  
  // 入札を行う関数（楽観的更新あり）
  async function placeBid(amount: number, bidderId: string, bidderName?: string) {
    if (!auction) {
      setError('オークション情報が取得できていません')
      return null
    }
    
    try {
      // 入札額のバリデーション
      if (amount <= (auction.current_price || 0)) {
        throw new Error(`入札額は現在の最高額（${auction.current_price?.toLocaleString() || 0}円）より高くなければなりません`)
      }
      
      // 楽観的更新のための一時データ
      const optimisticBid = {
        id: `temp-${Date.now()}`,
        auction_id: auctionId,
        user_id: bidderId,
        amount: amount,
        created_at: new Date().toISOString(),
        bidder_name: bidderName || '匿名ユーザー',
        payment_status: 'pending' as const,
        is_optimistic: true // フロントエンド用フラグ
      }
      
      // 楽観的に入札リストを更新
      setBids(prev => [optimisticBid as unknown as Bid, ...prev])
      
      // 楽観的にオークション情報を更新
      setAuction(prev => prev ? {
        ...prev,
        current_price: amount,
        highest_bidder_id: bidderId,
        bid_count: (prev.bid_count || 0) + 1
      } : null)
      
      // 入札を記録
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          user_id: bidderId,
          amount: amount,
          created_at: new Date().toISOString(),
          payment_status: 'pending'
        })
        .select()
        .single()
        
      if (bidError) {
        // 楽観的更新を元に戻す
        setBids(prev => prev.filter(bid => bid.id !== optimisticBid.id))
        setAuction(auction) // 元の状態に戻す
        throw bidError
      }
      
      // 楽観的更新を実際のデータで置き換え
      setBids(prev => prev.map(bid => 
        bid.id === optimisticBid.id ? { ...bidData, bidder_name: bidderName || '匿名ユーザー' } as Bid : bid
      ))
      
      return bidData as Bid
    } catch (err: any) {
      console.error('入札処理エラー:', err)
      setError(err.message)
      return null
    }
  }
  
  return {
    auction,
    bids,
    isLoading,
    error,
    isOnline,
    isReconnecting,
    placeBid,
    refreshAuction: fetchAuction,
    refreshBids: fetchBids,
    reconnect: attemptReconnect,
    refreshBids: fetchBids,
  }
}
